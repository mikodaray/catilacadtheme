# Final Checklist — Cat Ilacad Theme

A working list of items remaining before this theme can be submitted to the Shopify Theme Store. Tick each box as you complete it.

---

## 1. Run `shopify theme check` locally

- [ ] Install the Shopify CLI and theme tools if not already installed
- [ ] Run the check from the repo root
- [ ] Resolve all errors and warnings

```bash
# Install (one-time)
npm install -g @shopify/cli @shopify/theme

# From the theme root
cd C:\Code\catilacadtheme
shopify theme check
```

Look out for: `MissingTemplate` (unused template files), `UnusedAssign` and `UnusedSnippet` warnings, schema validation errors on the JSON templates, and any `AssetSizeJavaScript` / `AssetSizeCSS` flags. Errors block submission; warnings should be triaged and either fixed or explained.

---

## 2. Run Lighthouse on a real Shopify development store

- [ ] Push this branch to a Shopify development store via `shopify theme push --development`
- [ ] Run Lighthouse (Chrome DevTools or PageSpeed Insights) on the home, product, and collection pages, mobile profile
- [ ] Confirm performance scores hit 60+ on each (Theme Store requirement)
- [ ] Address any failing pages

```bash
shopify theme push --development
# CLI prints the dev preview URL — open it, then run Lighthouse in Chrome DevTools (Mobile, Performance).
```

Most likely flags worth pre-empting:
- **Google Fonts render-blocking** — the `<link>` to `fonts.googleapis.com` in `layout/theme.liquid` is a known cost. Once you've selected fonts via theme editor → Typography, you can delete the hardcoded link since `{{ settings.font_heading | font_face: font_display: 'swap' }}` takes over.
- **Oversize hero image** — if you upload a >1MB hero, Lighthouse will flag LCP. Compress to ~200–400KB JPEG (or use WebP) before uploading; Shopify will auto-derive the srcset variants.
- **Third-party reviews script** — Judge.me / Yotpo JS only loads once you enable a provider in theme settings. After enabling, re-test; the app may add significant TBT/LCP weight.
- **Unused CSS** — `style.css` includes legacy classes for the protected `cat-ilacad-landing.liquid` page. Lighthouse will see them as unused on every page except the landing. Acceptable; flag and move on.

---

## 3. Replace placeholder support contact in `docs/README.md`

- [ ] Decide on a real support email or contact URL
- [ ] Update `docs/README.md` (grep for "support contact" or similar placeholder text)

The current text reads "Replace with the support email or form URL before submission." under the **Support** heading. Also update `theme_support_url` in `config/settings_schema.json` if you want it pointing somewhere real instead of the Shopify CLI repo.

---

## 4. Professional review of `fr.json` and `es.json`

- [ ] Choose a translation service or translator (Fiverr, Upwork, Gengo, or Shopify Translate & Adapt with human review)
- [ ] Send both files for review
- [ ] Apply corrections
- [ ] Remove the `_translator_note` from the top of each file once reviewed

Both files currently start with:

```json
"_translator_note": "MACHINE-TRANSLATED DRAFT — needs professional review before going live..."
```

The translator only needs to read this file's structure — keys stay identical, values get reviewed. Shopify Translate & Adapt (free, in admin → Apps → Translate & Adapt) is the cheapest path if you have a fluent reviewer on hand; otherwise a paid service is faster.

---

## 5. Capture theme preview screenshots

- [ ] Set up a demo store with realistic content (products, collections, blog posts)
- [ ] Push the theme to that store
- [ ] Capture screenshots required by the Theme Store submission UI (typically: home, product, collection, cart, and a couple of "marketing" lifestyle shots)
- [ ] Save to a `screenshots/` folder at repo root or upload directly via the Shopify Partners dashboard

For the demo store, use `config/settings_data.theme-store.json` and `templates/index.theme-store.json` so the storefront shows the generic version, not the Cat Ilacad landing. Shopify's Theme Store has specific dimension requirements for preview images — check the partner docs before exporting.

---

## Stretch items (not blocking, but worth doing)

- [ ] Remove redundant Google Fonts `<link>` from `layout/theme.liquid` once fonts are picked via the theme editor's Typography settings (the `font_face` filter handles it)
- [ ] Verify color contrast on the "Sand" preset — accent is currently ~2.8:1 against bg, OK for non-text accents but document if used elsewhere
- [ ] Run a manual CSS-coverage sweep in Chrome DevTools to identify any genuinely unused styles
- [ ] Commit phases 2–5 to git locally on a new `phase5` branch (sandbox was down at commit time)

---

_Last updated: 2026-05-13_
