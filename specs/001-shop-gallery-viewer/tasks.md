# Tasks: Shop Gallery Viewer

**Input**: Design documents from `/specs/001-shop-gallery-viewer/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/, research.md, quickstart.md

**Tests**: No automated tests requested. Manual browser testing per quickstart.md.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Exact file paths included in all descriptions

## Path Conventions

Static website structure per plan.md:
- CSS: `assets/css/`
- JavaScript: `assets/js/gallery/`
- Images: `assets/images/gallery/`
- Pages: root and `product/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create directory structure and placeholder assets

- [x] T001 [P] Create gallery JavaScript module directory at `assets/js/gallery/`
- [x] T002 [P] Create gallery image directories at `assets/images/gallery/thumbnails/` and `assets/images/gallery/full/`
- [x] T003 [P] Create product detail pages directory at `product/`
- [x] T004 [P] Create frame preview images directory at `assets/images/frames/`
- [x] T005 [P] Add placeholder thumbnail image at `assets/images/gallery/placeholder.svg` (600x800px, 3:4 ratio)
- [x] T006 [P] Add sample gallery images (5 images) to `assets/images/gallery/thumbnails/` and `assets/images/gallery/full/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data and CSS infrastructure required by ALL user stories

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Create gallery data module with categories, subcategories, and sample items in `assets/js/gallery/gallery-data.js`
- [x] T008 [P] Add gallery-specific CSS variables to `assets/css/_variables.css` (grid gaps, card sizing, filter bar height)
- [x] T009 [P] Add gallery grid base styles to `assets/css/_components.css` (`.gallery-grid`, `.gallery-card`, `.gallery-thumbnail`)
- [x] T010 [P] Add gallery filter bar styles to `assets/css/_components.css` (`.gallery-filter-bar`, `.gallery-controls`)
- [x] T011 Add dark mode overrides for gallery components in `assets/css/_variables.css` `[data-theme="dark"]` section

**Checkpoint**: Foundation ready - gallery data structure and base CSS complete

---

## Phase 3: User Story 1 - Browse Gallery (Priority: P1)

**Goal**: Users can view a responsive grid of gallery thumbnails with 3:4 aspect ratio, centered below navigation

**Independent Test**: Navigate to shop page, verify thumbnails display in responsive grid (4 cols desktop, 3 tablet, 2 mobile) with consistent 3:4 aspect ratios

### Implementation for User Story 1

- [x] T012 [US1] Create gallery grid rendering module in `assets/js/gallery/gallery-grid.js` with `renderGallery()` function
- [x] T013 [US1] Implement responsive grid layout in `assets/css/_components.css` (mobile-first: 2→3→4 columns)
- [x] T014 [US1] Add gallery card hover states and transitions in `assets/css/_components.css`
- [x] T015 [US1] Replace placeholder content in `shop-all.html` with gallery grid container and script imports
- [x] T016 [US1] Add keyboard navigation support (focusable cards, visible focus states) in `assets/js/gallery/gallery-grid.js`
- [x] T017 [US1] Implement image lazy loading with `loading="lazy"` attribute in gallery card template
- [x] T018 [US1] Add empty state handling (when no items) with "No items found" message in `assets/js/gallery/gallery-grid.js`
- [x] T019 [US1] Add title truncation CSS for long titles in `assets/css/_components.css` (`.gallery-card-title`)

**Checkpoint**: User Story 1 complete - gallery displays and is responsive across all breakpoints

---

## Phase 4: User Story 2 - Filter by Type (Priority: P2)

**Goal**: Users can filter gallery by main type (Art/Photography) and sub-categories

**Independent Test**: Select type filter, verify only matching items display; select sub-category, verify results narrow; refresh page, verify filter state persists

### Implementation for User Story 2

- [x] T020 [US2] Add filter controls HTML to `shop-all.html` (type select, sub-category select, clear button)
- [x] T021 [US2] Implement type filter logic in `assets/js/gallery/gallery-grid.js` with `filterByType()` function
- [x] T022 [US2] Implement sub-category filter logic in `assets/js/gallery/gallery-grid.js` with `filterBySubCategory()` function
- [x] T023 [US2] Add dynamic sub-category population based on selected type in `assets/js/gallery/gallery-grid.js`
- [x] T024 [US2] Implement sessionStorage persistence for filter state in `assets/js/gallery/gallery-grid.js`
- [x] T025 [US2] Restore filter state on page load in `assets/js/gallery/gallery-grid.js` `init()` function
- [x] T026 [US2] Add clear filters button functionality in `assets/js/gallery/gallery-grid.js`
- [x] T027 [US2] Style active filter state with accent color in `assets/css/_components.css`

**Checkpoint**: User Story 2 complete - filtering works with session persistence

---

## Phase 5: User Story 3 - Sort Items (Priority: P3)

**Goal**: Users can sort gallery by newest, oldest, title A-Z, title Z-A

**Independent Test**: Select each sort option, verify items reorder correctly; apply filter then sort, verify filtered results reorder without losing filter

### Implementation for User Story 3

- [x] T028 [US3] Add sort select control to filter bar in `shop-all.html`
- [x] T029 [US3] Implement sort logic in `assets/js/gallery/gallery-grid.js` with `sortGallery()` function
- [x] T030 [US3] Add sort options: newest (date desc), oldest (date asc), title A-Z, title Z-A in `assets/js/gallery/gallery-grid.js`
- [x] T031 [US3] Integrate sort with existing filter logic (sort after filter) in `assets/js/gallery/gallery-grid.js`
- [x] T032 [US3] Add sessionStorage persistence for sort state in `assets/js/gallery/gallery-grid.js`
- [x] T033 [US3] Restore sort state on page load in `assets/js/gallery/gallery-grid.js` `init()` function

**Checkpoint**: User Story 3 complete - sorting works in combination with filtering

---

## Phase 6: User Story 4 - View Product Details (Priority: P4)

**Goal**: Users can click thumbnail to view detail page with larger image, description, print sizes/pricing, and frame options

**Independent Test**: Click gallery thumbnail, verify detail page loads with image, description, print options table, and frame option previews; click back, verify return to gallery with filter/sort state preserved

### Implementation for User Story 4

- [x] T034 [P] [US4] Add print and frame options data to `assets/js/gallery/gallery-data.js`
- [x] T035 [P] [US4] Add product detail data (long descriptions, per-item options) to `assets/js/gallery/gallery-data.js`
- [x] T036 [US4] Create product detail page template at `product/_template.html` with all sections
- [x] T037 [US4] Add detail page CSS styles to `assets/css/_components.css` (`.product-detail`, `.print-options`, `.frame-options`)
- [x] T038 [US4] Create gallery detail module in `assets/js/gallery/gallery-detail.js` for detail page functionality
- [x] T039 [US4] Implement print options display with size/price table in `assets/js/gallery/gallery-detail.js`
- [x] T040 [US4] Implement frame options preview grid in `assets/js/gallery/gallery-detail.js`
- [x] T041 [US4] Add "Print options coming soon" fallback for items without options in `assets/js/gallery/gallery-detail.js`
- [x] T042 [US4] Create sample product detail pages from template at `product/sunset-over-mountains.html` (and 2-3 more)
- [x] T043 [US4] Add back button/link that preserves gallery filter/sort state in product detail pages
- [x] T044 [US4] Add frame preview placeholder images to `assets/images/frames/` (4 images per frame options)

**Checkpoint**: User Story 4 complete - detail pages display all product information

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, accessibility, documentation, and final testing

- [x] T045 [P] Add missing image placeholder handling in `assets/js/gallery/gallery-grid.js`
- [x] T046 [P] Add ARIA labels and roles for accessibility in `shop-all.html` and `assets/js/gallery/gallery-grid.js`
- [x] T047 [P] Test and verify light/dark mode compatibility for all gallery components
- [x] T048 [P] Test responsive behavior at 320px, 768px, and 1024px breakpoints
- [x] T049 Update `docs/design-system.md` with new gallery component documentation
- [x] T050 Verify all keyboard interactions work (tab navigation, enter to select)
- [x] T051 Performance check: verify page load under 3 seconds, filter/sort under 500ms
- [x] T052 Run through quickstart.md testing checklist

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ─────────────────────────────────┐
                                                 │
Phase 2 (Foundational) ──────────────────────────┤
     │                                           │
     ▼                                           │
┌────────────────────────────────────────────────┤
│                                                │
│  Phase 3 (US1: Browse) ────────┐               │
│       │                        │               │
│       ▼                        │               │
│  Phase 4 (US2: Filter) ────────┤               │
│       │                        │               │
│       ▼                        │               │
│  Phase 5 (US3: Sort) ──────────┤               │
│       │                        │               │
│       ▼                        │               │
│  Phase 6 (US4: Details) ───────┘               │
│                                                │
└────────────────────────────────────────────────┘
                    │
                    ▼
           Phase 7 (Polish)
```

### User Story Dependencies

| Story | Depends On | Can Start After |
|-------|------------|-----------------|
| US1 (Browse) | Foundational | Phase 2 complete |
| US2 (Filter) | US1 | Phase 3 complete |
| US3 (Sort) | US1 | Phase 3 complete (can parallel with US2) |
| US4 (Details) | US1 | Phase 3 complete (can parallel with US2/US3) |

**Note**: US2, US3, US4 all depend on US1's gallery grid being functional. However, US2/US3/US4 are independent of each other and can be developed in parallel after US1.

### Within Each User Story

1. HTML structure first
2. CSS styles second
3. JavaScript functionality third
4. Integration and edge cases last

### Parallel Opportunities

**Phase 1** (all tasks can run in parallel):
```
T001 + T002 + T003 + T004 + T005 + T006
```

**Phase 2** (T008, T009, T010 can run in parallel after T007):
```
T007 → T008 + T009 + T010 → T011
```

**After US1 complete** (US2, US3, US4 can start in parallel):
```
Developer A: US2 (T020-T027)
Developer B: US3 (T028-T033)
Developer C: US4 (T034-T044)
```

**Phase 7** (most tasks can run in parallel):
```
T045 + T046 + T047 + T048 → T049 → T050 + T051 + T052
```

---

## Parallel Example: Phase 1 Setup

```bash
# All setup tasks can run in parallel:
mkdir -p assets/js/gallery
mkdir -p assets/images/gallery/thumbnails assets/images/gallery/full
mkdir -p product
mkdir -p assets/images/frames
# Add placeholder images simultaneously
```

## Parallel Example: After US1 Complete

```bash
# Three developers can work simultaneously:

# Developer A (US2 - Filtering):
Task: "Add filter controls HTML to shop-all.html"
Task: "Implement type filter logic in assets/js/gallery/gallery-grid.js"

# Developer B (US3 - Sorting):
Task: "Add sort select control to filter bar in shop-all.html"
Task: "Implement sort logic in assets/js/gallery/gallery-grid.js"

# Developer C (US4 - Details):
Task: "Add print and frame options data to assets/js/gallery/gallery-data.js"
Task: "Create product detail page template at product/_template.html"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T011)
3. Complete Phase 3: User Story 1 (T012-T019)
4. **STOP and VALIDATE**: Test browsing functionality independently
5. Deploy/demo basic gallery - **MVP COMPLETE**

### Incremental Delivery

| Increment | Stories | Value Delivered |
|-----------|---------|-----------------|
| MVP | US1 | Browsable gallery with responsive grid |
| +1 | US1 + US2 | Add filtering by type/sub-category |
| +2 | US1 + US2 + US3 | Add sorting options |
| Complete | All | Full detail pages with print/frame info |

### Recommended Order (Single Developer)

1. **Week 1**: Setup + Foundational + US1 → MVP deployed
2. **Week 2**: US2 (Filter) + US3 (Sort)
3. **Week 3**: US4 (Details) + Polish

---

## Notes

- [P] tasks = different files, no dependencies on other tasks in same phase
- [USn] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Manual testing per quickstart.md after each phase
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All CSS must use variables from `_variables.css` (constitution requirement)
- Test in both light and dark modes (constitution requirement)
