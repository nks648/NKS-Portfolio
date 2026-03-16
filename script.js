// ================================
// NAV: scroll state + mobile menu
// ================================
const navbar = document.getElementById('navbar');
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ================================
// SCROLL ANIMATIONS
// ================================
const animatedEls = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

animatedEls.forEach(el => observer.observe(el));

// ================================
// ACTIVE NAV LINK ON SCROLL
// ================================
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// ================================
// SMOOTH COUNTER ANIMATION
// ================================
function animateCounter(el, target, suffix = '') {
  const duration = 1400;
  const start = performance.now();
  const isFloat = String(target).includes('.');

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = isFloat
      ? (eased * target).toFixed(1)
      : Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const raw = el.textContent.trim();

    if (raw === '8+') animateCounter(el, 8, '+');
    else if (raw === '€200K') { el.textContent = '€200K'; }
    else if (raw === '98%') animateCounter(el, 98, '%');
    else if (raw === '4') animateCounter(el, 4, '');

    statsObserver.unobserve(el);
  });
}, { threshold: 0.5 });

statNums.forEach(el => statsObserver.observe(el));

// ================================
// SAP PROGRESS BARS
// ================================
const progressFills = document.querySelectorAll('.sap-progress-fill');

const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const fill = entry.target;
    const targetWidth = fill.getAttribute('data-width');
    setTimeout(() => { fill.style.width = targetWidth + '%'; }, 200);
    progressObserver.unobserve(fill);
  });
}, { threshold: 0.4 });

progressFills.forEach(el => progressObserver.observe(el));
document.querySelectorAll('.lang-bar-fill').forEach(el => progressObserver.observe(el));
