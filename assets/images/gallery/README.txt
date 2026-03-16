GALLERY ITEM SETUP GUIDE
========================

Copy the _template folder, rename it to your slug, and follow the
conventions below.


FOLDER STRUCTURE
----------------

  assets/images/gallery/
    your-slug/
      item.json              <-- required: all metadata lives here
      main.png               <-- required: primary display image
      alt-1.png              <-- optional: carousel slides 2-12
      alt-2.png
      ...
      alt-11.png


IMAGE NAMING CONVENTION
-----------------------

All images are .png and must follow these exact naming patterns.


  DISPLAY IMAGES (carousel)

    main.png                 Required. Primary image (hero, grid, carousel slide 1)
    alt-1.png                Carousel slide 2
    alt-2.png                Carousel slide 3
    ...
    alt-11.png               Carousel slide 12 (max)


  LIGHT MODE VARIANTS

    Add "-light" before the extension. Optional — if not provided, the
    base image is used for both themes.

    Dark (default)           Light variant
    -------------------      ----------------------
    main.png                 main-light.png
    alt-1.png                alt-1-light.png
    alt-2.png                alt-2-light.png
    ...                      ...


  ASPECT RATIO IMAGES

    Add a ratio suffix to "main". These control which options appear in
    the purchase section. If none are provided, all three show by default.

    main-square.png          Enables "Square" option
    main-portrait.png        Enables "Portrait" option
    main-landscape.png       Enables "Landscape" option

    Only include the ratios you actually offer for that piece.


EXAMPLES
--------

  Fully loaded folder (all variants):

    sunset-mountains/
      item.json
      main.png                   primary (dark mode)
      main-light.png             primary (light mode)
      main-square.png            square ratio preview
      main-portrait.png          portrait ratio preview
      main-landscape.png         landscape ratio preview
      alt-1.png                  carousel slide 2 (dark)
      alt-1-light.png            carousel slide 2 (light)
      alt-2.png                  carousel slide 3 (dark only, used for both)
      alt-3.png                  carousel slide 4

  Minimal folder (only required files):

    ocean-waves/
      item.json
      main.png


ITEM.JSON
---------

  {
    "id": "gal-011",
    "title": "Your Title",
    "slug": "your-slug",
    "type": "photography",
    "subCategory": "landscape",
    "dateCreated": "2025-03-15",
    "description": "Short description for cards and grid.",
    "longDescription": "Longer description for the product detail page.",
    "featured": false
  }

  Field             Required   Notes
  -----             --------   -----
  id                Yes        Unique, increment from last (e.g., gal-011)
  title             Yes        Display title
  slug              Yes        Must match the folder name exactly
  type              Yes        "photography" or "art"
  subCategory       Yes        See options below
  dateCreated       Yes        YYYY-MM-DD format
  description       Yes        Short text for cards/grid
  longDescription   No         Detail page text (falls back to description)
  featured          No         Not currently used (default: false)


  HOW THE HOMEPAGE HERO WORKS

    The hero gallery shows the 6 most recent items sorted by dateCreated
    (newest first). Adding a new item with today's date will push it to
    the front and bump the oldest one off the back. The "featured" field
    is not currently used for this — it's purely date-driven.


  SUBCATEGORIES

    photography:  wildlife, macro, landscape, nature
    art:          digital, traditional


IMAGE SPECS
-----------

  Aspect ratio:    3:4 (portrait) for all display images
  Main image:      1200 x 1600px recommended
  Alt images:      600 x 800px recommended
  Format:          PNG


AFTER ADDING A NEW ITEM
-----------------------

  npm run build

  This generates the data file and product page automatically. That's it.
