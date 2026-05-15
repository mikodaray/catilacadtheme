# Release notes

## v1.0.0 — Initial build

First public version. Five phases of work consolidated into a single submission-ready theme.

### Phase 1 — Scaffolding
- Section primitives: hero, image-banner, image-with-text, featured-collection, featured-product, collection-list, rich-text, newsletter, testimonials, logo-list, multi-column, video, custom-liquid
- Utility snippets: responsive-image, price, product-card, pagination, breadcrumbs, meta-tags, structured-data
- SVG icon system (cart, search, menu, close, chevrons) via `icon` snippet dispatcher
- Vanilla-JS custom elements: cart-form, cart-drawer, variant-picker, mobile-menu, predictive-search
- Layout updates, header + footer with brand structure
- CSS variables, expanded `settings_schema.json`, locale extraction

### Phase 2 — Accessibility, performance, full templates
- Skip-to-content link, ARIA on every custom element, focus trapping with ESC, `aria-live` for variant changes and form errors, `:focus-visible` rings, `prefers-reduced-motion` opt-out
- Responsive-image rewritten with Dawn-style widths `[165, 360, 533, 720, 940, 1066, 1500, 2000]`
- JS split into core + lazy `theme-cart-drawer.js` + lazy `theme-predictive-search.js`
- `font-display: swap`, conditional LCP image preload
- Product, collection, and cart templates converted to JSON with `main-product` (block-driven), `main-collection-banner`, `main-collection-product-grid` (sort + per-page), `main-cart` sections
- `product-recommendations` section using `/recommendations/products`
- i18n extraction; French and Spanish locale drafts added with translator-review note
- Color presets in `settings_data.json` (Default + Editorial)
- Structured-data and meta-tags audit for valid JSON-LD across Product, Collection, Article, Organization, BreadcrumbList

### Phase 3 — Brand polish
- Design tokens: extended `:root` variables for colors, type scale (clamp-based), shadows, radii, transitions
- Refined typography (Fraunces display + DM Sans body), three button variants (primary, secondary, tertiary with underline animation), branded form inputs with terracotta focus glow
- Polish pass across every phase-1 section
- Product-card hover treatment (lift + image scale)
- Customer login / register / reset / activate pages rewritten with `.customer__card`
- Polished 404 + search empty states
- Mobile UX: sticky-on-scroll-up header, slide-in mobile menu with backdrop, mobile sticky add-to-cart bar
- Micro-interactions: section fade-in on scroll, smooth-scroll, button micro-press
- Loading states: skeleton loaders for cart drawer and product recommendations
- Optional dark-mode via `prefers-color-scheme`

### Phase 4 — Store features
- Reviews scaffolding with provider dropdown (Judge.me / Yotpo) — block in `main-product`, badge in `product-card`, theme-level setting
- Recently-viewed products (localStorage handle list, `/products/{handle}.js` fetch, skeleton placeholders)
- Free-shipping progress bar (`settings.free_shipping_threshold_cents`) rendered in cart drawer + cart page; updates via JS on cart change
- Cart upsells: cart-page section + drawer mini-card pulling from a configured collection
- Customer account / addresses / order pages rewritten with branded card layout
- Blog and article converted to JSON templates with `main-blog` (featured-first + grid) and `main-article` (hero, eyebrow, drop-cap option, comments, related strip)
- Search resource-type tabs (All / Products / Articles / Pages) via `?type=` parameter
- Image alt + SEO sweep
- Critical CSS inlined in `<head>`

### Phase 5 — Theme Store readiness
- Section groups: `header-group.json` (with announcement bar) + `footer-group.json`; layout uses `{% sections %}`
- Theme-store-only home template (`index.theme-store.json`) with generic sections + matching demo `settings_data.theme-store.json`; merchant landing untouched
- `color_scheme_group` in settings with role mapping; 4 named schemes (Cream, Wine, Sand, Charcoal)
- 4 presets in `settings_data.json` (Default, Editorial, Wine, Sand)
- `@app` block slots in `main-product`, `main-cart`, `main-blog`, `main-article`
- Currency + locale selectors in footer; `hreflang` alternates in head
- Apple touch icon setting; scheme-aware theme-color meta
- Settings reorganized into Shopify-conventional order with merchant-friendly names and info help text
- Documentation: README, release notes, accessibility

### Known limitations
- French and Spanish locales are machine-translated drafts pending professional review.
- The Sand color scheme's accent (`#A88B5C`) on its background (`#F4EDE2`) is ~2.8:1 contrast — acceptable for decorative use but not for body text. The accent is intentionally never applied to body text in shipped sections.
- `account.liquid`, `addresses.liquid`, `order.liquid` are template-rendered rather than `@app`-block-supporting sections; merchants who want apps on these pages should request a Shopify-app developer extension instead.
- `shopify theme check` has not been run against this build in CI; recommended as a pre-submission step.
