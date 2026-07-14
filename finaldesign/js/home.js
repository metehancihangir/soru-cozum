/**
 * Soru Çözüm — Ana sayfa
 * Kilitli kategori toast
 */
(function () {
  'use strict';

  var toastEl = document.getElementById('toast');
  var locked = document.getElementById('locked-category');
  var timer = null;

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(timer);
    timer = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 2200);
  }

  if (locked) {
    locked.addEventListener('click', function (e) {
      e.preventDefault();
      showToast('Arapça-4 yakında geliyor 🔒');
    });
  }
})();
