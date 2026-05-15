/**
 * theme-predictive-search.js — <predictive-search> custom element (lazy-loaded).
 *
 * Wraps a search <input>, debounces input events, queries /search/suggest.json,
 * renders results, and gives a basic combobox-style ARIA experience:
 *   - input has role="combobox", aria-expanded, aria-controls, aria-autocomplete
 *   - results panel has role="listbox" with role="option" children
 *   - aria-live="polite" announcement of result count
 *   - ESC clears + closes; Up/Down arrow keys move highlight; Enter opens
 */

class PredictiveSearch extends HTMLElement {
  connectedCallback() {
    this.input = this.querySelector('[data-search-input]');
    this.results = this.querySelector('[data-search-results]');
    this.debounce = null;
    this.activeIndex = -1;

    if (this.input && this.results) {
      // Wire ARIA on the input.
      if (!this.results.id) this.results.id = `predictive-search-${Math.random().toString(36).slice(2, 8)}`;
      this.input.setAttribute('role', 'combobox');
      this.input.setAttribute('aria-autocomplete', 'list');
      this.input.setAttribute('aria-expanded', 'false');
      this.input.setAttribute('aria-controls', this.results.id);
      this.results.setAttribute('role', 'listbox');
      this.results.setAttribute('aria-live', 'polite');

      this.input.addEventListener('input', this.onInput.bind(this));
      this.input.addEventListener('keydown', this.onKeydown.bind(this));
      document.addEventListener('click', (e) => {
        if (!this.contains(e.target)) this.collapse();
      });
    }
  }

  onInput() {
    clearTimeout(this.debounce);
    const q = this.input.value.trim();
    if (q.length < 2) {
      this.results.innerHTML = '';
      this.input.setAttribute('aria-expanded', 'false');
      return;
    }
    this.debounce = setTimeout(() => this.fetch(q), 200);
  }

  onKeydown(e) {
    const items = this.results.querySelectorAll('[role="option"]');
    if (e.key === 'Escape') {
      this.input.value = '';
      this.collapse();
    } else if (e.key === 'ArrowDown') {
      if (!items.length) return;
      e.preventDefault();
      this.activeIndex = Math.min(this.activeIndex + 1, items.length - 1);
      this.highlight(items);
    } else if (e.key === 'ArrowUp') {
      if (!items.length) return;
      e.preventDefault();
      this.activeIndex = Math.max(this.activeIndex - 1, 0);
      this.highlight(items);
    } else if (e.key === 'Enter') {
      const active = items[this.activeIndex];
      if (active) {
        e.preventDefault();
        const link = active.querySelector('a');
        if (link) window.location.href = link.href;
      }
    }
  }

  highlight(items) {
    items.forEach((el, i) => {
      el.setAttribute('aria-selected', String(i === this.activeIndex));
      if (i === this.activeIndex) el.scrollIntoView({ block: 'nearest' });
    });
    if (items[this.activeIndex]) {
      this.input.setAttribute('aria-activedescendant', items[this.activeIndex].id);
    }
  }

  collapse() {
    this.results.innerHTML = '';
    this.input.setAttribute('aria-expanded', 'false');
    this.activeIndex = -1;
  }

  async fetch(q) {
    try {
      const url = `/search/suggest.json?q=${encodeURIComponent(q)}&resources[type]=product&resources[limit]=6`;
      const data = await window.Theme.getJSON(url);
      this.render(data.resources?.results?.products ?? []);
    } catch (err) {
      console.error('[predictive-search]', err);
    }
  }

  render(products) {
    if (!this.results) return;
    this.activeIndex = -1;

    if (!products.length) {
      this.results.innerHTML = `<p class="predictive-search__empty" role="status">${window.themeStrings?.no_results || 'No results.'}</p>`;
      this.input.setAttribute('aria-expanded', 'true');
      return;
    }

    this.results.innerHTML = `
      <ul class="predictive-search__list">
        ${products
          .map(
            (p, i) => `
              <li id="psr-${i}" role="option" aria-selected="false">
                <a href="${p.url}" class="predictive-search__item">
                  ${p.image ? `<img src="${p.image}" alt="" loading="lazy" width="48" height="48">` : ''}
                  <span>${p.title}</span>
                </a>
              </li>
            `
          )
          .join('')}
      </ul>
      <div class="visually-hidden" aria-live="polite">${products.length} result${products.length === 1 ? '' : 's'} available.</div>
    `;
    this.input.setAttribute('aria-expanded', 'true');
  }
}

customElements.define('predictive-search', PredictiveSearch);
