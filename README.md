# Cat Ilacad — Custom Shopify Theme

> *"A business becomes easier not when there is less to do, but when everything is structured."*  
> — Cat Ilacad

---

## What This Is

This is a fully custom Shopify theme built from the ground up for **Cat Ilacad** — CEO, Founder of Posh Nails, and the creator of *The 30-Day Business Reset*. Cat has spent 24 years building a real business the hard way, and this theme is the digital home that reflects exactly that: structured, intentional, and built to convert.

This isn't a generic store template. Every section, every animation, every color choice was made specifically for Cat's brand and her mission — helping business owners stop surviving their business and start building something that actually works.

---

## What It Does For Cat

Cat offers three ways to work with her:

1. **Free content** — daily insights on social media (@catilacad)
2. **The 30-Day Business Reset** — a two-book system (The Playbook + The Workbook) for building the 4 core systems every business needs
3. **1-on-1 Mentorship** — from a single 60-minute clarity session all the way up to a premium 5-month engagement

This theme presents all three clearly, guides visitors down the funnel naturally, and makes it easy to take the next step — whether that's enrolling in the course, booking a session, or reaching out directly.

The theme is designed to feel premium without being cold, feminine without being soft, and structured without being rigid. Just like Cat's approach to business.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Platform | Shopify (Liquid templating) |
| Styles | Vanilla CSS with CSS custom properties |
| Scripts | Vanilla JavaScript (no frameworks, no dependencies) |
| Fonts | [Fraunces](https://fonts.google.com/specimen/Fraunces) (serif) · [DM Sans](https://fonts.google.com/specimen/DM+Sans) (body) · [Dancing Script](https://fonts.google.com/specimen/Dancing+Script) (script accent) |
| Icons | Inline SVG (no icon library — zero extra requests) |
| Animations | CSS keyframes + IntersectionObserver (scroll-triggered) |

---

## Project Structure

```
catilacadtheme/
│
├── assets/
│   ├── style.css           # All theme styles — single file, fully organized
│   ├── normalize.css       # CSS reset
│   ├── logo.svg            # Primary logo (dark backgrounds)
│   └── logo-light.svg      # Light logo variant (footer)
│
├── layout/
│   ├── theme.liquid        # Root HTML shell — fonts, meta, scroll observer JS
│   ├── checkout.liquid     # Shopify checkout layout
│   ├── gift_card.liquid    # Gift card layout
│   └── password.liquid     # Store password page layout
│
├── sections/
│   ├── header.liquid       # Sticky nav with logo + links + CTA button
│   └── footer.liquid       # Footer with brand, nav columns, copyright
│
├── templates/
│   ├── index.liquid        # 🏠 Main landing page — the whole funnel lives here
│   ├── page.liquid         # Generic page template
│   ├── page.contact.liquid # Contact page with email CTA
│   ├── page.about.liquid   # About page
│   ├── page.refund-policy.liquid  # Refund policy page
│   ├── product.liquid      # Product detail page
│   ├── collection.liquid   # Collection listing
│   ├── cart.liquid         # Cart page
│   ├── blog.liquid         # Blog listing
│   ├── article.liquid      # Blog post
│   ├── search.liquid       # Search results
│   ├── 404.liquid          # Not found page
│   ├── gift_card.liquid    # Gift card template
│   ├── list-collections.liquid    # Collections overview
│   ├── product-list.liquid        # Product list view
│   └── customers/          # Account, login, register, orders, addresses
│
└── snippets/
    └── stylesheets.liquid  # Renders CSS asset links
```

---

## Landing Page — Section by Section

The entire sales funnel lives in `templates/index.liquid`. Here's what each section does and why it's there:

### 1. Hero (`funnel-hero`)
Full viewport height on load — the first thing every visitor sees is Cat's headline and nothing else. A scroll-snap behaviour kicks in: scrolling down snaps cleanly to the next section; scrolling back up snaps to the top. No awkward half-visible sections.

**Content:** Badge → Headline → Subtext → "X years building Posh Nails" byline (dynamically calculated from 2002)

---

### 2. About Cat (`intro-section`)
A split layout: Cat's photo on the left, warm personal copy on the right. Built to match the "Hey I'm [Name]" style of high-converting personal brand pages. Uses Dancing Script for the cursive subtitle, giving it that elegant feminine signature feel.

**Photo used:** `cat-photo.jpg` (uploaded to Shopify Files)

---

### 3. How to Work with Cat (`funnel-flow`)
A 5-step visual journey showing the full product ladder — from free social content all the way to premium mentorship. Each step has an elegant SVG icon (no emojis). On desktop, Cat's photo sits to the right of the steps. On mobile, the photo becomes a full-section background image with a cream overlay so the text stays readable.

**Steps:**
- Step 1 · Free — Daily Founder Insights (@catilacad)
- Step 2 · Course — The Playbook & The Workbook
- Step 3 · Mentorship Entry — Quick Clarity (₱14,500)
- Step 4 · Mentorship Package — The Business Sprint
- Step 5 · Premium — Business Growth Mentorship

---

### 4. The 30-Day Business Reset (`course-section`)
The course detail section. Two products are presented side by side:

- **The Playbook (80 pages)** — all 30 days of lessons, frameworks, The Truth, The System, Key Insights, What Most Get Wrong, and Today's Action
- **The Workbook (30 pages)** — one page per day with fill-in prompts, writing lines, and CEO Shift cards

The right column shows the 4 core systems built over 30 days:
- Week 1 · Sales System™ (Days 1–7)
- Week 2 · No-Think System™ (Days 8–14)
- Week 3 · The Spend System™ (Days 15–21)
- Week 4 · CEO Shift™ (Days 22–30)

---

### 5. Mentorship (`mentorship-section`)
Three mentorship cards presented side by side:

| Card | Price | Format |
|------|-------|--------|
| Quick Clarity Mentorship | ₱14,500 | 60-min Zoom |
| The Business Sprint ⭐ | Custom | 4 × 90-min weekly |
| Business Growth Mentorship | Custom | 5 × 120-min over 5 months |

"Schedule a Discovery Call" buttons on the Sprint and Growth cards link to `/pages/contact`.

---

### 6. Before / After Transformation Block
A dark charcoal section that contrasts the "before" state (reactive, chaotic, inconsistent) against the "after" state (structured, clear, delegated). Ends with Cat's signature quote.

---

### 7. FAQ (`faq-section`)
Five accordion questions covering the course, mentorship, and fit. The section uses Cat's photo as a full background with a cream overlay — text stays perfectly readable, but the photo gives warmth.

---

### 8. Final CTA (`final-cta`)
Clean close. "Your business deserves to work without you." Button scrolls back to the course section.

---

## Features

### Scroll Animations
Every major element animates in on scroll using the native `IntersectionObserver` API — no library needed. Four animation types:

| Type | Used For |
|------|----------|
| `fade-up` | Headings, labels, body text |
| `slide-left` | Funnel steps (from the left), photo panels |
| `slide-right` | System pills, before/after columns |
| `scale-up` | Mentorship cards, CTA button |

Stagger delays (0.1s–0.6s) are applied via `data-delay` attributes. Fully respects `prefers-reduced-motion`.

---

### Promo Popup (`?promo=true`)
A full-screen overlay popup only activates when `?promo=true` is in the URL — perfect for paid ads, email campaigns, or QR codes. Features:

- **Two-column layout** — offer copy on the left, portrait video on the right
- **Auto-play video** with audio (falls back to muted if browser blocks it)
- **Close button** (×) and clicking outside the card both dismiss it
- **Floating "Get your teaser!" banner** — after closing the popup, a terracotta tab slides in from the right edge of the screen. Clicking it reopens the popup
- **Mobile responsive** — stacks to single column, card fills 88% of viewport height

To trigger: visit `https://yourstore.com/?promo=true`

---

### Scroll Snap (Hero → About)
The hero-to-about transition is snapped: any scroll down from the hero glides smoothly to the About section. Any scroll up from the About section glides back to the very top. No partial views, no messy transitions. Only applies between the first two sections — the rest of the page scrolls freely.

---

## Color Palette

```css
--cream:            #FDF8F9   /* Page background */
--warm-white:       #FAF4F6   /* Alternate section background */
--sand:             #F2DDE4   /* Borders, dividers */
--terracotta:       #C4748A   /* Primary accent — CTAs, labels, highlights */
--terracotta-deep:  #9B5070   /* Hover states */
--terracotta-light: #F2DDE4   /* Badge backgrounds */
--charcoal:         #3D1F2E   /* Dark sections, hero, text headings */
--warm-gray:        #7A6670   /* Body text, secondary text */
--sage:             #7A8C78   /* Step 1 (free) accent */
--gold:             #C9A84C   /* Step 5 (premium) accent */
```

---

## Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Shopify CLI](https://shopify.dev/docs/storefronts/themes/tools/cli)

### Setup

```bash
# Install Shopify CLI globally
npm install -g @shopify/cli @shopify/theme

# Navigate to the theme directory
cd catilacadtheme

# Authenticate with your Shopify store
shopify auth login

# Start the local development server
shopify theme dev --store your-store.myshopify.com
```

### Deploy to Shopify

```bash
# Push theme to Shopify (creates a new theme or updates existing)
shopify theme push

# Push to a specific theme ID
shopify theme push --theme THEME_ID
```

---

## Shopify Admin Checklist

Before the store goes live, make sure these are set up in Shopify Admin:

- [ ] **Pages** — Create pages with these handles:
  - `contact` (Contact page)
  - `about` (About Cat)
  - `refund-policy` (Refund Policy — add content here)
- [ ] **Products** — Ensure these product handles exist:
  - `catilacadplaybook` (The 30-Day Business Reset)
  - `catilacadplaybookteaser` (Free Teaser download)
  - `quick-clarity-mentorship` (Quick Clarity session)
- [ ] **Files** — Upload these images to Shopify Admin → Content → Files:
  - `cat-photo.jpg` (portrait photo used in hero + FAQ background)
- [ ] **Navigation** — Update the main menu links if needed
- [ ] **Policies** — Add Refund Policy content under Settings → Policies

---

## Placeholder Links to Update

| Location | Current Value | What to Replace With |
|----------|--------------|---------------------|
| `sections/footer.liquid` line 11 | `/#course` | Keep or update |
| Discovery Call links | `/pages/contact` | Keep or replace with a booking tool URL (e.g. Calendly) |

---

## Branch Structure

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `changesafter5152026` | Active development branch |
| `initialpage` | Original baseline |

---

## About Cat Ilacad

Cat Ilacad is the founder of **Posh Nails** and the creator of *The 30-Day Business Reset* — a practical two-book system built from 24 years of running a real business, not from a textbook.

She teaches business owners how to build four core systems (Sales, Operations, Finance, and Leadership) so their business can run without depending on them for everything. Her approach is direct, experience-backed, and built for the business owner who is done guessing.

This theme is one of the systems she uses herself. It's not just a store — it's the front door to everything Cat offers, designed to meet visitors exactly where they are and guide them toward the level of support that fits them.

> *"I built this for the business owner I used to be. The one who needed structure, not more motivation."*

---

## License

Private. All rights reserved — Cat Ilacad © 2026.
