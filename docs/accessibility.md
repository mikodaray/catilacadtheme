# Accessibility

This theme targets **WCAG 2.0 Level AA**. Best-effort against WCAG 2.1 AA additions where they make sense for an e-commerce experience.

## Implemented

### Perceivable
- All informative `<img>` elements have meaningful `alt` attributes from Liquid (`image.alt`, `product.title`, `shop.name`). Decorative thumbnails inside `aria-hidden` link wrappers use `alt=""`.
- Color contrast: the default Cream scheme passes AAA on body text (14.6:1). All four shipped schemes (Cream, Wine, Sand, Charcoal) pass AA on body text. The accent color is used only for buttons, badges, hover states, and decorative pseudo-elements — never as body text.
- `prefers-reduced-motion` honoured globally: animations, transitions, and scroll-behavior collapse to near-zero duration for users who request it.
- Critical typography is inlined in the `<head>` so initial paint isn't blocked.

### Operable
- A skip-to-content link is the first focusable element on every page.
- Every interactive control receives a visible `:focus-visible` outline using the accent color.
- All buttons, links, and form controls are reachable with the keyboard alone.
- The cart drawer is a `role="dialog"` with `aria-modal="true"`; opens with focus moved to the close button, traps Tab focus inside, returns focus to the opener on close.
- ESC closes the cart drawer and the mobile menu.
- The mobile menu sets `aria-expanded` on its toggle and `aria-controls` to the panel, and moves focus to the first menu item on open.
- The predictive search input is a `role="combobox"` with `aria-expanded`, `aria-controls`, `aria-autocomplete="list"`. Results are `role="listbox"` with `role="option"` children. Arrow-up/down navigates; Enter follows; Escape clears.
- Form inputs all have associated `<label>` elements (visible or `visually-hidden`). Placeholders are never used as the only label.
- On product pages, the variant picker announces variant changes via a polite `aria-live` region (e.g. "Blue, $24.99" / "Medium, sold out").
- Form errors render with `role="alert"` and `aria-live="assertive"`; successes use `role="status"` and `aria-live="polite"`.

### Understandable
- `<html lang="{{ request.locale.iso_code }}">` reflects the active storefront locale.
- Heading order is sequential in every template (h1 → h2 → h3 — never skipping levels in the shipped sections).
- Buttons have meaningful labels, not just icons. Icon-only buttons (cart toggle, search, menu, close) carry `aria-label` text.

### Robust
- All custom elements (`cart-form`, `cart-drawer`, `variant-picker`, `mobile-menu`, `predictive-search`, `recently-viewed`, `share-button`) use standard ARIA patterns that screen readers understand.
- JSON-LD structured data is valid (verified against schema.org).

## Tested with

- Keyboard-only navigation through every template type
- Tested in Chrome, Firefox, Safari (last two stable versions)
- Reduced-motion enabled (system + browser)
- 200% zoom — layout reflows without horizontal scrolling on mobile breakpoint

## Known limitations

1. **Embedded merchant content** — Article body, product description, page content, and blog comments come from merchant input. The theme can't guarantee headings, link text, or image alt within those sources are accessible. Merchants are responsible for the content they author.
2. **Third-party apps** — When the reviews provider is enabled (Judge.me or Yotpo), the third-party JS injected by those apps is outside theme control. Verify their widgets meet AA before launch.
3. **Sand scheme accent contrast** — The Sand scheme's accent color (`#A88B5C`) on its background (`#F4EDE2`) yields a 2.8:1 ratio. This is intentional — the accent is used only for non-text decorative elements (border accents, hover transitions). Body text uses the dark `--color-text` (`#2F2A22` on `#F4EDE2` = 12.3:1, AAA). Merchants who customize the accent should run their own contrast check.
4. **Predictive search keyboard interaction** — Arrow-key navigation, Enter to follow, Escape to clear are implemented. Home/End and PageUp/PageDown are not bound; for very long result lists, users can Tab through.
5. **Dark-mode color contrast** — The `prefers-color-scheme: dark` override has been spot-checked but not exhaustively audited across every section variant. Brand colors stay recognizable; the wine-charcoal background `#251420` with cream text `#F4E5E9` is high-contrast.

## Reporting

If you find an accessibility issue, please file it against the repository with:
- The page URL or template name
- The assistive technology you're using (screen reader name + version, or keyboard-only)
- What you expected vs. what happened

We treat accessibility regressions as bugs and prioritize fixes accordingly.
