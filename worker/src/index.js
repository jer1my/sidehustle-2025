/**
 * Side Hustle Checkout Worker
 *
 * Creates Stripe Checkout Sessions from cart data.
 * Validates prices server-side against known purchase options.
 */

// Server-side price map (source of truth — must match shared-config.json)
const PRICE_MAP = {
	'digital': 5000,
	'print': 7500,
	'framed-square': 17500,
	'framed-rect': 22500,
};

// Stripe API base URL
const STRIPE_API = 'https://api.stripe.com/v1';

/**
 * Build a description string for a cart item
 */
function buildItemDescription(item) {
	const parts = [];
	if (item.subOption) parts.push(item.subOption);
	if (item.frameColor) parts.push(`${item.frameColor} frame`);
	return parts.join(', ');
}

/**
 * Create a Stripe Checkout Session via the REST API
 */
async function createCheckoutSession(cartItems, env) {
	const lineItems = cartItems.map((item, i) => {
		const description = buildItemDescription(item);
		const params = {};
		params[`line_items[${i}][price_data][currency]`] = 'usd';
		params[`line_items[${i}][price_data][unit_amount]`] = PRICE_MAP[item.optionId];
		params[`line_items[${i}][price_data][product_data][name]`] = `${item.title} — ${item.optionLabel}`;
		if (description) {
			params[`line_items[${i}][price_data][product_data][description]`] = description;
		}
		if (item.image) {
			params[`line_items[${i}][price_data][product_data][images][0]`] = item.image;
		}
		// Tax behavior for Stripe Tax
		params[`line_items[${i}][price_data][tax_behavior]`] = 'exclusive';
		params[`line_items[${i}][quantity]`] = item.quantity;
		return params;
	});

	// Flatten all line item params into one object
	const body = Object.assign({}, ...lineItems);

	// Session config
	body['mode'] = 'payment';
	body['success_url'] = 'https://www.sidehustle.llc/checkout-success.html?paid=true';
	body['cancel_url'] = 'https://www.sidehustle.llc/cart.html';

	// Shipping address collection
	body['shipping_address_collection[allowed_countries][0]'] = 'US';

	// Shipping options
	// Standard shipping
	body['shipping_options[0][shipping_rate_data][type]'] = 'fixed_amount';
	body['shipping_options[0][shipping_rate_data][fixed_amount][amount]'] = '800';
	body['shipping_options[0][shipping_rate_data][fixed_amount][currency]'] = 'usd';
	body['shipping_options[0][shipping_rate_data][display_name]'] = 'Standard Shipping';
	body['shipping_options[0][shipping_rate_data][delivery_estimate][minimum][unit]'] = 'business_day';
	body['shipping_options[0][shipping_rate_data][delivery_estimate][minimum][value]'] = '5';
	body['shipping_options[0][shipping_rate_data][delivery_estimate][maximum][unit]'] = 'business_day';
	body['shipping_options[0][shipping_rate_data][delivery_estimate][maximum][value]'] = '10';

	// Express shipping
	body['shipping_options[1][shipping_rate_data][type]'] = 'fixed_amount';
	body['shipping_options[1][shipping_rate_data][fixed_amount][amount]'] = '1500';
	body['shipping_options[1][shipping_rate_data][fixed_amount][currency]'] = 'usd';
	body['shipping_options[1][shipping_rate_data][display_name]'] = 'Express Shipping';
	body['shipping_options[1][shipping_rate_data][delivery_estimate][minimum][unit]'] = 'business_day';
	body['shipping_options[1][shipping_rate_data][delivery_estimate][minimum][value]'] = '2';
	body['shipping_options[1][shipping_rate_data][delivery_estimate][maximum][unit]'] = 'business_day';
	body['shipping_options[1][shipping_rate_data][delivery_estimate][maximum][value]'] = '3';

	// Tax: disabled until Stripe Tax registration is complete
	// To enable later: body['automatic_tax[enabled]'] = 'true';

	// Payment methods — card + wallets, but exclude Link
	body['payment_method_types[0]'] = 'card';
	body['payment_method_types[1]'] = 'amazon_pay';

	const response = await fetch(`${STRIPE_API}/checkout/sessions`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams(body).toString(),
	});

	const session = await response.json();

	if (!response.ok) {
		throw new Error(session.error?.message || 'Failed to create checkout session');
	}

	return session;
}

/**
 * Build CORS headers
 */
function corsHeaders(env) {
	return {
		'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN,
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
	};
}

/**
 * JSON error response
 */
function errorResponse(message, status, env) {
	return new Response(
		JSON.stringify({ error: message }),
		{
			status,
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders(env),
			},
		}
	);
}

export default {
	async fetch(request, env) {
		// Handle CORS preflight
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: corsHeaders(env),
			});
		}

		// Only accept POST
		if (request.method !== 'POST') {
			return errorResponse('Method not allowed', 405, env);
		}

		// Parse request body
		let cartItems;
		try {
			const body = await request.json();
			cartItems = body.items;
		} catch {
			return errorResponse('Invalid request body', 400, env);
		}

		// Validate cart
		if (!Array.isArray(cartItems) || cartItems.length === 0) {
			return errorResponse('Cart is empty', 400, env);
		}

		if (cartItems.length > 50) {
			return errorResponse('Too many items', 400, env);
		}

		// Validate each item
		for (const item of cartItems) {
			if (!item.optionId || !item.title || !item.slug) {
				return errorResponse('Invalid cart item: missing required fields', 400, env);
			}

			if (!PRICE_MAP[item.optionId]) {
				return errorResponse(`Unknown purchase option: ${item.optionId}`, 400, env);
			}

			if (!Number.isInteger(item.quantity) || item.quantity < 1) {
				return errorResponse('Invalid quantity', 400, env);
			}

			// Server-side price validation
			if (item.price !== PRICE_MAP[item.optionId]) {
				return errorResponse('Price mismatch — please refresh and try again', 400, env);
			}
		}

		// Create Stripe Checkout Session
		try {
			const session = await createCheckoutSession(cartItems, env);
			return new Response(
				JSON.stringify({ url: session.url }),
				{
					status: 200,
					headers: {
						'Content-Type': 'application/json',
						...corsHeaders(env),
					},
				}
			);
		} catch (err) {
			console.error('Stripe error:', err.message);
			return errorResponse(err.message || 'Unable to create checkout session. Please try again.', 500, env);
		}
	},
};
