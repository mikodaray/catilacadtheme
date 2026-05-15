/**
 * theme.js — Cat Ilacad theme (core)
 *
 * Phase 2 split:
 *   - This file (core): utilities + always-on custom elements (cart-form,
 *     variant-picker, mobile-menu) + lazy loader for the heavier modules.
 *   - theme-cart-drawer.js: cart-drawer custom element. Loaded only if a
 *     <cart-drawer> exists on the page.
 *   - theme-predictive-search.js: predictive-search element. Loaded only if a
 *     <predictive-search> exists on the page.
 *
 * No jQuery. Native ES + custom-elements.
 */

/* =========================================================================
 * Shared utilities (window.Theme)
 * ========================================================================= */

const Theme = {
  bus: new EventTarget(),

  async postJSON(url, body) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`POST ${url} failed: ${res.status} ${text}`);
    }
    return res.json();
  },

  async getJSON(url) {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
    return res.json();
  },

  formatMoney(cents) {
    if (typeof window.Shopify?.formatMoney === 'function') {
      return window.Shopify.formatMoney(cents);
    }
    const value = (cents / 100).toFixed(2);
    return `$${value}`;
  },

  /**
   * Inject a <script src> for one of the optional modules. Idempotent.
   */
  loadModule(name) {
    const existing = document.querySelector(`script[data-module="${name}"]`);
    if (existing) return;
    const base = document.querySelector('script[src*="/theme.js"]')?.src;
    if (!base) return;
    const url = base.replace(/\/theme\.js(\?.*)?$/, `/theme-${name}.js$1`);
    const s = document.createElement('script');
    s.src = url;
    s.defer = true;
    s.dataset.module = name;
    document.head.appendChild(s);
  },

  /**
   * Constrain Tab keypresses inside `container` so the focused element stays
   * within it. Returns a teardown function.
   */
  trapFocus(container) {
    const SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const onKeydown = (e) => {
      if (e.key !== 'Tab') return;
      const focusables = Array.from(container.querySelectorAll(SELECTOR)).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    };
    container.addEventListener('keydown', onKeydown);
    return () => container.removeEventListener('keydown', onKeydown);
  },
};

window.Theme = Theme;

/* =========================================================================
 * <cart-form is="cart-form"> — AJAX add to cart
 * ========================================================================= */

class CartForm extends HTMLFormElement {
  connectedCallback() {
    this.addEventListener('submit', this.onSubmit.bind(this));
  }

  async onSubmit(event) {
    event.preventDefault();
    const button = this.querySelector('[data-add-button]');
    const errorEl = this.querySelector('[data-form-error]');
    if (button) {
      button.setAttribute('aria-busy', 'true');
      button.disabled = true;
    }
    if (errorEl) errorEl.textContent = '';

    try {
      const formData = new FormData(this);
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.description || 'Add to cart failed');

      Theme.bus.dispatchEvent(new CustomEvent('cart:added', { detail: data }));

      const drawer = document.querySelector('cart-drawer');
      if (drawer) {
        Theme.loadModule('cart-drawer');
        // open() may not be defined yet on first add — wait one tick.
        Promise.resolve().then(() => drawer.open && drawer.open());
      }
    } catch (err) {
      console.error('[cart-form]', err);
      if (errorEl) errorEl.textContent = err.message;
      this.dispatchEvent(new CustomEvent('cart:error', { detail: err.message, bubbles: true }));
    } finally {
      if (button) {
        button.removeAttribute('aria-busy');
        button.disabled = false;
      }
    }
  }
}
customElements.define('cart-form', CartForm, { extends: 'form' });

/* =========================================================================
 * <variant-picker> — option-to-variant matcher with aria-live announcement
 * ========================================================================= */

class VariantPicker extends HTMLElement {
  connectedCallback() {
    const data = this.querySelector('[data-variant-data]');
    this.variants = data ? JSON.parse(data.textContent) : [];
    this.idInput = this.querySelector('[data-variant-id]');
    this.button = this.querySelector('[data-add-button]');
    this.priceWrap = this.closest('section')?.querySelector('[data-price-wrap]');
    this.live = this.ensureLiveRegion();
    this.addEventListener('change', this.onChange.bind(this));
  }

  /** Create / find an aria-live region for variant change announcements. */
  ensureLiveRegion() {
    let live = this.querySelector('[data-variant-live]');
    if (!live) {
      live = document.createElement('div');
      live.setAttribute('data-variant-live', '');
      live.setAttribute('aria-live', 'polite');
      live.setAttribute('aria-atomic', 'true');
      live.className = 'visually-hidden';
      this.appendChild(live);
    }
    return live;
  }

  onChange(event) {
    if (!event.target.matches('input[type="radio"]')) return;

    const selected = this.getSelectedOptions();
    const variant = this.variants.find((v) =>
      v.options.every((opt, i) => opt === selected[i])
    );
    if (!variant) return;

    if (this.idInput) this.idInput.value = variant.id;
    this.updateURL(variant.id);
    this.updateAvailability(variant.available);
    this.updatePrice(variant);
    this.announce(variant);
  }

  getSelectedOptions() {
    const fieldsets = this.querySelectorAll('fieldset');
    return Array.from(fieldsets).map((fs) => {
      const checked = fs.querySelector('input[type="radio"]:checked');
      return checked ? checked.value : null;
    });
  }

  updateURL(variantId) {
    const url = new URL(window.location.href);
    url.searchParams.set('variant', variantId);
    window.history.replaceState({}, '', url);
  }

  updateAvailability(available) {
    if (!this.button) return;
    this.button.disabled = !available;
    this.button.textContent = available
      ? (window.themeStrings?.add_to_cart || 'Add to cart')
      : (window.themeStrings?.sold_out || 'Sold out');
  }

  updatePrice(variant) {
    if (!this.priceWrap) return;
    const onSale = variant.compare_at_price && variant.compare_at_price > variant.price;
    this.priceWrap.innerHTML = `
      <div class="price ${onSale ? 'price--on-sale' : ''}">
        <span class="price__current">${Theme.formatMoney(variant.price)}</span>
        ${onSale ? `<s class="price__compare">${Theme.formatMoney(variant.compare_at_price)}</s>` : ''}
      </div>
    `;
  }

  announce(variant) {
    if (!this.live) return;
    const status = variant.available
      ? `${variant.title}, ${Theme.formatMoney(variant.price)}`
      : `${variant.title}, sold out`;
    // Clear then set so duplicate announcements still fire.
    this.live.textContent = '';
    setTimeout(() => { this.live.textContent = status; }, 30);
  }
}
customElements.define('variant-picker', VariantPicker);

/* =========================================================================
 * <mobile-menu> — toggle nav with ESC + ARIA
 * ========================================================================= */

class MobileMenu extends HTMLElement {
  connectedCallback() {
    this.toggle = this.querySelector('[data-mobile-menu-toggle]');
    this.panel = this.querySelector('[data-mobile-menu-panel]');

    if (this.toggle && this.panel) {
      // Wire ARIA relationships.
      if (!this.panel.id) this.panel.id = `mobile-menu-panel-${Math.random().toString(36).slice(2, 8)}`;
      this.toggle.setAttribute('aria-controls', this.panel.id);
      this.toggle.setAttribute('aria-expanded', 'false');
      this.toggle.addEventListener('click', () => this.toggleOpen());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.classList.contains('is-open')) this.close();
    });
  }

  toggleOpen() {
    if (this.classList.contains('is-open')) this.close();
    else this.open();
  }

  open() {
    this.classList.add('is-open');
    if (this.toggle) this.toggle.setAttribute('aria-expanded', 'true');
    if (this.panel) {
      this.panel.hidden = false;
      const firstLink = this.panel.querySelector('a, button');
      if (firstLink) firstLink.focus({ preventScroll: true });
    }
  }

  close() {
    this.classList.remove('is-open');
    if (this.toggle) {
      this.toggle.setAttribute('aria-expanded', 'false');
      this.toggle.focus({ preventScroll: true });
    }
    if (this.panel) this.panel.hidden = true;
  }
}
customElements.define('mobile-menu', MobileMenu);

/* =========================================================================
 * Sticky header — pin on scroll up, hide on scroll down (rAF-throttled).
 * Always visible at the top of the page.
 * ========================================================================= */

(function setupStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastY = window.scrollY;
  let pending = false;
  const threshold = 80;

  function update() {
    const y = window.scrollY;
    if (y < threshold) {
      header.classList.remove('is-pinned', 'is-hidden');
    } else if (y > lastY) {
      header.classList.add('is-pinned', 'is-hidden');
    } else {
      header.classList.add('is-pinned');
      header.classList.remove('is-hidden');
    }
    lastY = y;
    pending = false;
  }

  window.addEventListener('scroll', () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(update);
  }, { passive: true });
})();

/* =========================================================================
 * Section fade-in — respects prefers-reduced-motion.
 * ========================================================================= */

(function setupFadeIn() {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  const targets = document.querySelectorAll('main > .shopify-section, main > section');
  targets.forEach((el) => el.classList.add('fade-in-on-scroll'));

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    }
  }, { rootMargin: '0px 0px -10% 0px' });

  targets.forEach((el) => io.observe(el));
})();

/* =========================================================================
 * Mobile sticky add-to-cart bar — appears when the main buy button leaves view.
 * Driven entirely from the existing main-product DOM; no markup changes needed
 * beyond the bar element itself (rendered by main-product.liquid).
 * ========================================================================= */

(function setupStickyATC() {
  const bar = document.querySelector('[data-sticky-atc]');
  if (!bar) return;
  const trigger = document.querySelector('[data-add-button]');
  if (!trigger) { bar.remove(); return; }

  const io = new IntersectionObserver((entries) => {
    bar.classList.toggle('is-visible', !entries[0].isIntersecting);
  }, { threshold: 0 });
  io.observe(trigger);

  // Bar's own button forwards click to the real submit button.
  bar.querySelector('[data-sticky-atc-submit]')?.addEventListener('click', () => {
    trigger.click();
  });
})();

/* =========================================================================
 * Recently-viewed: push current product handle to localStorage on PDP load.
 * The <recently-viewed> snippet reads this back to render the strip.
 * ========================================================================= */

(function pushRecentlyViewed() {
  const KEY = 'recently-viewed-handles';
  const meta = document.querySelector('meta[name="theme:current-product-handle"]');
  const handle = meta?.content;
  if (!handle) return;
  let list;
  try { list = JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch (_) { list = []; }
  list = [handle, ...list.filter((h) => h !== handle)].slice(0, 24);
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (_) { /* quota exceeded — ignore */ }
})();

/* =========================================================================
 * Lazy module loading — pull in heavy components only when used.
 * ========================================================================= */

if (document.querySelector('cart-drawer')) Theme.loadModule('cart-drawer');
if (document.querySelector('predictive-search')) Theme.loadModule('predictive-search');
