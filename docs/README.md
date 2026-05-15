# Cat Ilacad — Shopify Theme

A warm, editorial Shopify theme built on Online Store 2.0. Section-driven, accessible, fast, and merchant-customizable through the theme editor.

## Overview

- **Type:** Online Store 2.0 (JSON templates + section groups + app blocks)
- **Default palette:** Cream `#FDF8F9` background, charcoal `#3D1F2E` text, terracotta `#C4748A` accent
- **Default fonts:** Fraunces (display/headings), DM Sans (body)
- **Color schemes shipped:** Cream, Wine, Sand, Charcoal (plus an Editorial preset)
- **JS architecture:** Vanilla ES + class-based custom elements. Core in `assets/theme.js`, heavier modules (`theme-cart-drawer.js`, `theme-predictive-search.js`) lazy-loaded on demand.
- **CSS:** Hand-written, token-driven (`--color-*`, `--font-*`, `--radius-*`, `--shadow-*`, `--transition-*`). One file: `assets/style.css`. Critical CSS inlined in `<head>`.

## Features

### Storefront
- Section-group header (with announcement bar) and footer
- Hero, image banner, image-with-text, featured-collection, featured-product, collection-list, rich-text, newsletter, testimonials, logo-list, multi-column, video, custom-liquid sections
- Predictive search with ARIA combobox
- Slide-out cart drawer with focus trap, ESC, and live updates
- Free-shipping progress bar (drawer + cart page)
- Cart upsell — page section and drawer mini-card
- Recently viewed products (localStorage-backed)
- Product recommendations (`/recommendations/products`)
- Product reviews scaffolding (Judge.me / Yotpo integration points)
- Mobile sticky add-to-cart bar
- Three button variants, refined form inputs, polished empty/error states

### Templates
- Home (`index.json` — merchant landing) + `index.theme-store.json` (generic submission build)
- Product (`product.json` with `main-product` + `product-recommendations` + `recently-viewed`)
- Collection (`collection.json` with `main-collection-banner` + `main-collection-product-grid`)
- Cart (`cart.json` with `main-cart` + `cart-upsell`)
- Blog (`blog.json` → `main-blog`)
- Article (`article.json` → `main-article`)
- Customers (login / register / reset / activate / account / addresses / order)
- 404 and search

### Accessibility
- WCAG 2.0 AA targeted. Skip link, ARIA on every custom element, focus trapping in modals, `aria-live` for variant changes and form errors, visible `:focus-visible` rings, `prefers-reduced-motion` honoured. See `docs/accessibility.md` for the full notes.

### Performance
- Vanilla JS only; no jQuery, no framework, no bundler
- `defer` on all scripts; lazy modules for cart drawer and predictive search
- `font-display: swap`
- LCP image preloaded per template
- Critical CSS inlined
- Responsive `<img>` with srcset (widths 165 → 2000) and explicit width/height to prevent CLS

### SEO
- JSON-LD: Organization (sitewide), Product (with offers, brand, image array), CollectionPage, Article, BreadcrumbList (product + collection)
- Open Graph + Twitter cards with intelligent image fallback chain
- Canonical URL on every page
- Per-locale `hreflang` link tags

### Markets / i18n
- Currency + locale selectors in footer (auto-shown when shop has multiples)
- English, French, Spanish locale files (FR and ES are machine-translated drafts pending professional review)

## Installation

1. Upload the theme `.zip` to your Shopify admin (Online Store → Themes → Upload).
2. Customize from the theme editor.
3. Configure key settings (see below).

## Key settings to configure first

1. **Logo & favicon** — Theme settings → Logo
2. **Colors & color schemes** — Theme settings → Colors / Color schemes (4 schemes shipped)
3. **Typography** — Theme settings → Typography (Fraunces + DM Sans by default)
4. **Free-shipping threshold** — Theme settings → Cart (set to 0 to hide the bar)
5. **Reviews provider** — Theme settings → Reviews (after installing Judge.me or Yotpo)
6. **Social links** — Theme settings → Social media (feeds the footer + `Organization` JSON-LD `sameAs`)
7. **Header menu + footer menu** — Online Store → Navigation, then assign to the corresponding section in the editor

## Theme Store submission

If submitting to the Theme Store, swap the home template:
- Set Home page → Template: `index.theme-store` (the generic version using only standard sections)
- Replace `config/settings_data.json` with the contents of `config/settings_data.theme-store.json` for demo content

The merchant-specific landing (`templates/index.json` → `sections/cat-ilacad-landing.liquid`) is preserved untouched so production isn't disrupted.

## Project layout

```
layout/         theme.liquid, password.liquid, gift_card.liquid, checkout.liquid
templates/      JSON templates (.json) + minimal stubs (.liquid) + backups (.bak)
sections/       reusable sections + section-group definitions (.json)
snippets/       icon-* dispatchers, responsive-image, price, product-card,
                breadcrumbs, meta-tags, structured-data, shipping-bar, cart-drawer,
                recently-viewed, stylesheets, pagination
assets/         theme.js, theme-cart-drawer.js, theme-predictive-search.js,
                style.css, normalize.css, logo.svg, logo-light.svg
config/         settings_schema.json, settings_data.json (+ .theme-store.json variant)
locales/        en.default.json, fr.json (draft), es.json (draft)
docs/           README.md, release-notes.md, accessibility.md
```

## Support

- **Documentation:** This `docs/` folder.
- **Issues:** Open a ticket against the repository.
- **Contact:** Replace with the support email or form URL before submission.

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge — last two versions). Graceful degradation on older browsers: features dependent on `IntersectionObserver`, `customElements`, and `aspect-ratio` will fall back to a usable but less polished experience.
