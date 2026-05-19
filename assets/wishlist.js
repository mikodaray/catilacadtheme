(function () {
  'use strict';

  var STORAGE_KEY = 'cat_wishlist';

  /* ── Storage helpers ─────────────────────────────────── */
  function getWishlist() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveWishlist(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  /* ── Visual state ────────────────────────────────────── */
  function applyState(button, isActive) {
    if (isActive) {
      button.classList.add('active');
      button.innerHTML = '♥';
      button.setAttribute('title', 'Remove from Wishlist');
    } else {
      button.classList.remove('active');
      button.innerHTML = '♡';
      button.setAttribute('title', 'Add to Wishlist');
    }
  }

  /* ── Public toggle — called by onclick in templates ─── */
  window.toggleWishlist = function (button, productId) {
    var id = String(productId || button.getAttribute('data-product-id') || '');
    if (!id) return;

    var list = getWishlist();
    var idx  = list.indexOf(id);

    if (idx === -1) {
      list.push(id);
      applyState(button, true);
    } else {
      list.splice(idx, 1);
      applyState(button, false);
    }

    saveWishlist(list);
  };

  /* ── Restore saved state on every page load ──────────── */
  document.addEventListener('DOMContentLoaded', function () {
    var list = getWishlist();
    document.querySelectorAll('button[data-product-id]').forEach(function (btn) {
      var id = String(btn.getAttribute('data-product-id'));
      applyState(btn, list.indexOf(id) !== -1);
    });
  });

})();
