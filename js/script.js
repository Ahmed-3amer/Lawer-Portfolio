/**
 * script.js
 * Lawyer Landing Page — Main JavaScript
 * Clean, modular, production-level interactions
 */

'use strict';

/* === CONSTANTS === */
const NAVBAR_SCROLL_THRESHOLD = 60;
const NAV_OFFSET             = 80;   // fixed navbar height compensation
// const COUNTER_DURATION       = 2000; // ms

/* === UTILITY HELPERS === */

/** Throttle a callback to fire at most once per animation frame */
function throttleRAF(fn) {
  let ticking = false;
  return function (...args) {
    if (!ticking) {
      requestAnimationFrame(() => {
        fn.apply(this, args);
        ticking = false;
      });
      ticking = true;
    }
  };
}

/** Ease-out quad for counter animation */
// function easeOutQuad(t) {
//   return t * (2 - t);
// }

/* === 1. AOS — SCROLL ANIMATIONS === */
function initAOS() {
  if (typeof AOS === 'undefined') return;
  AOS.init({
    duration: 750,
    easing:   'ease-out-cubic',
    once:     true,
    offset:   60,
    delay:    0,
  });
}

/* === 2. NAVBAR — SCROLL BEHAVIOR & ACTIVE LINKS === */
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('#navMenu .nav-link');
  const sections = document.querySelectorAll('main section[id]');

  if (!navbar) return;

  /* -- 2a. Scroll class toggle -------------------------------- */
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > NAVBAR_SCROLL_THRESHOLD);
    updateActiveLink();
  }

  /* -- 2b. Active nav link on scroll ------------------------- */
  function updateActiveLink() {
    const scrollMid = window.scrollY + window.innerHeight * 0.4;

    let currentId = '';
    sections.forEach(section => {
      if (section.offsetTop <= scrollMid) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${currentId}`);
    });
  }

  window.addEventListener('scroll', throttleRAF(onScroll), { passive: true });

  // Run once on load to set initial state
  onScroll();
}

/* === 3. SMOOTH SCROLLING === */
function initSmoothScroll() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;

    window.scrollTo({ top, behavior: 'smooth' });

    // Close mobile menu if open
    closeMobileMenu();
  });
}

/* === 4. MOBILE NAVBAR — CLOSE ON OUTSIDE CLICK === */
function initMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  if (!navMenu) return;

  document.addEventListener('click', e => {
    const toggler = document.querySelector('.navbar-toggler');
    if (!navMenu.classList.contains('show')) return;
    if (navMenu.contains(e.target) || (toggler && toggler.contains(e.target))) return;
    closeMobileMenu();
  });
}

function closeMobileMenu() {
  const navMenu  = document.getElementById('navMenu');
  const toggler  = document.querySelector('.navbar-toggler');
  if (!navMenu || !navMenu.classList.contains('show')) return;

  // Use Bootstrap's Collapse API if available
  if (typeof bootstrap !== 'undefined') {
    const bsCollapse = bootstrap.Collapse.getInstance(navMenu);
    if (bsCollapse) bsCollapse.hide();
  }

  toggler?.setAttribute('aria-expanded', 'false');
}

/* === 5. ANIMATED COUNTERS === */
// function initCounters() {
//   const counters = document.querySelectorAll('.stat-number[data-target]');
//   if (!counters.length) return;

//   const observer = new IntersectionObserver(entries => {
//     entries.forEach(entry => {
//       if (!entry.isIntersecting) return;
//       animateCounter(entry.target);
//       observer.unobserve(entry.target);
//     });
//   }, { threshold: 0.6 });

//   counters.forEach(counter => observer.observe(counter));
// }

// function animateCounter(el) {
//   const target    = parseInt(el.dataset.target, 10);
//   const startTime = performance.now();

//   function step(now) {
//     const elapsed  = now - startTime;
//     const progress = Math.min(elapsed / COUNTER_DURATION, 1);
//     const value    = Math.floor(easeOutQuad(progress) * target);

//     el.textContent = value.toLocaleString('ar-EG');

//     if (progress < 1) requestAnimationFrame(step);
//     else el.textContent = target.toLocaleString('ar-EG');
//   }

//   requestAnimationFrame(step);
// }


/* === 7. FOOTER — DYNAMIC YEAR === */
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* === INIT — Run after DOM + deferred scripts are ready === */
function init() {
  initAOS();
  initNavbar();
  initSmoothScroll();
  initMobileMenu();
  // initCounters();
  initFooterYear();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}