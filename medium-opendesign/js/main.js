/**
 * Medium Design System — Styleguide JS
 * Provides: copy-to-clipboard, section highlighting, toast feedback
 */

(function () {
  'use strict';

  /* ── Toast ──────────────────────────────────────────────── */
  const toast = document.getElementById('sg-toast');

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('visible'), 1800);
  }

  /* ── Copy token / hex value on click ───────────────────── */
  document.querySelectorAll('[data-copy]').forEach(el => {
    el.style.cursor = 'pointer';
    el.title = 'Kopyalamak için tıkla';
    el.addEventListener('click', () => {
      const val = el.dataset.copy;
      navigator.clipboard.writeText(val)
        .then(() => showToast(`Kopyalandı: ${val}`))
        .catch(() => showToast('Kopyalanamadı'));
    });
  });

  /* ── Active nav highlight on scroll ────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.sg-nav__links a[href^="#"]');

  if (sections.length && navLinks.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(a => {
            a.style.color = a.getAttribute('href') === '#' + e.target.id
              ? 'var(--color-neutral-dark)'
              : '';
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => obs.observe(s));
  }
})();
