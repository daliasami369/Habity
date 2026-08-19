/* ==========================================================================
   Habitly — Router
   Owner: Core / Infra Lead — Ahmed Ibrahim Shaaban
   -----------------------------------------------------------------------
   Habitly is a plain multi-page app (each screen is its own .html file).
   This file's job is small and shared: mark the current nav link active,
   fade each page in on load, and expose a `navigate()` helper so a page's
   own script can move to another page consistently instead of writing
   `window.location.href = ...` inline everywhere.
   ========================================================================== */

(function () {
  'use strict';

  function currentPage() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    return path === '' ? 'index.html' : path;
  }

  function markActiveNavLink() {
    const page = currentPage();
    document.querySelectorAll('.nav__link').forEach((link) => {
      const href = link.getAttribute('href');
      const isActive = href === page || (page === 'index.html' && href === './');
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function fadeInPage() {
    document.documentElement.classList.add('is-page-ready');
  }

  function navigate(page) {
    window.location.href = page;
  }

  document.addEventListener('DOMContentLoaded', () => {
    markActiveNavLink();
    fadeInPage();
  });

  window.HabitlyRouter = { navigate, currentPage };
})();
