/**
 * theme-cart-drawer.js — <cart-drawer> custom element (lazy-loaded).
 *
 * Behavior:
 *   - role="dialog" with aria-modal when open
 *   - Focus trap + ESC to close + click-outside (backdrop) to close
 *   - Returns focus to the element that triggered open()
 *   - Re-renders contents from /cart.js, mutates lines via /cart/change.js
 */

class CartDrawer extends HTMLElement {
  connectedCallback() {
    this.body = this.querySelector('[data-cart-body]');
    this.setAttribute('role', 'dialog');
    this.setAttribute('aria-modal', 'true');
    this.setAttribute('aria-label', 'Shopping cart');
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '-1');

    this.addEventListener('click', this.onClick.bind(this));
    this.addEventListener('keydown', this.onKeydown.bind(this));
    document.addEventListener('keydown', this.onDocKeydown.bind(this));

    if (window.Theme?.bus) {
      window.Theme.bus.addEventListener('cart:added', () => this.refresh());
    }
  }

  onDocKeydown(e) {
    if (e.key === 'Escape' && this.classList.contains('is-open')) {
      this.close();
    }
  }

  onKeydown(_e) {
    // Per-element keydown reserved for future shortcuts (focus trap is set up via Theme.trapFocus on open).
  }

  open() {
    this._opener = document.activeElement;
    this.classList.add('is-open');
    this.renderSkeleton();
    this.refresh();

    if (window.Theme?.trapFocus) {
      this._teardownTrap = window.Theme.trapFocus(this);
    }

    // Move focus into the drawer.
    requestAnimationFrame(() => {
      const closeBtn = this.querySelector('[data-cart-close]');
      (closeBtn || this).focus({ preventScroll: true });
    });
  }

  close() {
    this.classList.remove('is-open');
    if (this._teardownTrap) this._teardownTrap();
    if (this._opener && typeof this._opener.focus === 'function') {
      this._opener.focus({ preventScroll: true });
    }
  }

  onClick(event) {
    const t = event.target.closest('[data-cart-toggle], [data-cart-close], [data-line-change], [data-line-remove]');
    if (!t) return;

    if (t.matches('[data-cart-toggle]')) this.classList.contains('is-open') ? this.close() : this.open();
    if (t.matches('[data-cart-close]')) this.close();

    if (t.matches('[data-line-change]')) {
      const line = parseInt(t.dataset.line, 10);
      const delta = parseInt(t.dataset.delta, 10);
      this.changeLine(line, delta);
    }

    if (t.matches('[data-line-remove]')) {
      const line = parseInt(t.dataset.line, 10);
      this.changeLine(line, 0, true);
    }
  }

  async refresh() {
    try {
      const cart = await window.Theme.getJSON('/cart.js');
      this.render(cart);
      this.updateCount(cart.item_count);
      this.updateShippingBar(cart);
      this.updateUpsell(cart);
    } catch (err) {
      console.error('[cart-drawer] refresh', err);
    }
  }

  /**
   * Update every [data-shipping-bar] element on the page (drawer + cart page)
   * with the latest cart total. Pulls config from the bar's own data-attrs.
   */
  updateShippingBar(cart) {
    const bars = document.querySelectorAll('[data-shipping-bar]');
    bars.forEach((bar) => {
      const threshold = parseInt(bar.dataset.threshold, 10) || 0;
      if (!threshold) return;
      const remaining = Math.max(0, threshold - cart.total_price);
      const pct = Math.min(100, Math.round((cart.total_price * 100) / threshold));
      const message = bar.querySelector('[data-shipping-bar-message]');
      const fill = bar.querySelector('[data-shipping-bar-fill]');
      if (fill) fill.style.width = pct + '%';
      if (message) {
        if (remaining === 0) {
          message.textContent = bar.dataset.celebration || 'You qualify for free shipping!';
          bar.classList.add('shipping-bar--met');
        } else {
          const formatted = window.Theme.formatMoney(remaining);
          message.textContent = `Add ${formatted} more for free shipping.`;
          bar.classList.remove('shipping-bar--met');
        }
      }
    });
  }

  /**
   * Pick one product from the drawer-upsell collection that's not already in
   * the cart, fetch it, and render a tiny horizontal card with an add-to-cart
   * form. Hides if no eligible product exists.
   */
  async updateUpsell(cart) {
    const wrap = this.querySelector('[data-cart-drawer-upsell]');
    if (!wrap) return;
    const collection = wrap.dataset.collection;
    if (!collection) return;

    const inCart = new Set(cart.items.map((i) => i.product_id));

    try {
      const data = await window.Theme.getJSON(`/collections/${encodeURIComponent(collection)}/products.json?limit=20`);
      const candidate = (data.products || []).find((p) => !inCart.has(p.id) && p.available);
      const body = wrap.querySelector('[data-cart-drawer-upsell-body]');
      if (!candidate || !body) { wrap.hidden = true; return; }

      const variantId = candidate.variants?.[0]?.id;
      const image = candidate.images?.[0];
      body.innerHTML = `
        <article class="cart-drawer__upsell-card">
          <a href="/products/${candidate.handle}" class="cart-drawer__upsell-image" tabindex="-1" aria-hidden="true">
            ${image ? `<img src="${image.replace(/\.([a-z]+)$/i, '_240x.$1')}" alt="" loading="lazy" width="80" height="80">` : ''}
          </a>
          <div class="cart-drawer__upsell-info">
            <a href="/products/${candidate.handle}" class="cart-drawer__upsell-title">${candidate.title}</a>
            <div class="cart-drawer__upsell-price">${window.Theme.formatMoney(candidate.variants[0].price * 100)}</div>
          </div>
          <form is="cart-form" method="post" action="/cart/add" class="cart-drawer__upsell-form">
            <input type="hidden" name="id" value="${variantId}">
            <input type="hidden" name="quantity" value="1">
            <button type="submit" class="button button--secondary" data-add-button aria-label="Add ${candidate.title} to cart">+</button>
          </form>
        </article>
      `;
      wrap.hidden = false;
    } catch (_err) {
      wrap.hidden = true;
    }
  }

  async changeLine(line, delta, remove = false) {
    try {
      const cart = await window.Theme.getJSON('/cart.js');
      const item = cart.items[line - 1];
      if (!item) return;
      const quantity = remove ? 0 : Math.max(0, item.quantity + delta);
      const updated = await window.Theme.postJSON('/cart/change.js', { line, quantity });
      this.render(updated);
      this.updateCount(updated.item_count);
    } catch (err) {
      console.error('[cart-drawer] changeLine', err);
    }
  }

  renderSkeleton() {
    if (!this.body) return;
    const lines = Array.from({ length: 3 }).map(() => `
      <li class="cart-drawer__skeleton-line">
        <div class="skeleton skeleton-img"></div>
        <div>
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line"></div>
        </div>
        <div class="skeleton skeleton-line" style="width:50px;height:14px;"></div>
      </li>
    `).join('');
    this.body.innerHTML = `<ul class="cart-drawer__lines">${lines}</ul>`;
  }

  updateCount(n) {
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      el.textContent = n;
      el.classList.toggle('is-hidden', n === 0);
    });
  }

  render(cart) {
    if (!this.body) return;
    if (!cart.items.length) {
      this.body.innerHTML = `
        <p class="cart-drawer__empty" role="status">${window.themeStrings?.cart_empty || 'Your cart is empty.'}</p>
      `;
      return;
    }

    const lines = cart.items
      .map((item, i) => {
        const idx = i + 1;
        return `
          <li class="cart-drawer__line">
            <a href="${item.url}" class="cart-drawer__line-image" tabindex="-1" aria-hidden="true">
              <img src="${item.image}" alt="" loading="lazy" width="80" height="80">
            </a>
            <div class="cart-drawer__line-info">
              <a href="${item.url}" class="cart-drawer__line-title">${item.product_title}</a>
              ${item.variant_title ? `<div class="cart-drawer__line-variant">${item.variant_title}</div>` : ''}
              <div class="cart-drawer__line-controls" role="group" aria-label="Quantity for ${item.product_title}">
                <button type="button" data-line-change data-line="${idx}" data-delta="-1" aria-label="Decrease quantity">−</button>
                <span aria-live="polite">${item.quantity}</span>
                <button type="button" data-line-change data-line="${idx}" data-delta="1" aria-label="Increase quantity">+</button>
                <button type="button" data-line-remove data-line="${idx}" class="cart-drawer__remove" aria-label="Remove ${item.product_title}">${window.themeStrings?.remove || 'Remove'}</button>
              </div>
            </div>
            <div class="cart-drawer__line-price">${window.Theme.formatMoney(item.final_line_price)}</div>
          </li>
        `;
      })
      .join('');

    this.body.innerHTML = `
      <ul class="cart-drawer__lines">${lines}</ul>
      <div class="cart-drawer__footer">
        <div class="cart-drawer__subtotal">
          <span>${window.themeStrings?.subtotal || 'Subtotal'}</span>
          <span>${window.Theme.formatMoney(cart.total_price)}</span>
        </div>
        <a href="/checkout" class="button button--primary cart-drawer__checkout">${window.themeStrings?.checkout || 'Checkout'}</a>
      </div>
    `;
  }
}

customElements.define('cart-drawer', CartDrawer);
