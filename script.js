// ================================
// NAV: scroll + mobile
// ================================
const navbar = document.getElementById('navbar');
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

burger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  mobileMenu.setAttribute('aria-hidden', !open);
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// ================================
// SCROLL ANIMATIONS
// ================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-animate], .tl-item, .skill-apple-card, .edu-apple-card').forEach(el => {
  observer.observe(el);
});

// Stagger children of sap-cards
document.querySelectorAll('.sap-apple-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.1}s`;
  observer.observe(card);
});

// ================================
// SAP PROGRESS BARS (triggered on visibility)
// ================================
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const fill = entry.target;
    const target = fill.getAttribute('data-width');
    setTimeout(() => { fill.style.width = target + '%'; }, 300);
    progressObserver.unobserve(fill);
  });
}, { threshold: 0.4 });

document.querySelectorAll('.sap-progress-fill').forEach(el => progressObserver.observe(el));

// ================================
// COUNTER ANIMATION
// ================================
function countUp(el, target, suffix) {
  const dur = 1600;
  const start = performance.now();
  const step = (now) => {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const raw = el.textContent.trim();
    if (raw === '8+') countUp(el, 8, '+');
    else if (raw === '98%') countUp(el, 98, '%');
    else if (raw === '4') countUp(el, 4, '');
    statObserver.unobserve(el);
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat-big').forEach(el => statObserver.observe(el));

// ================================
// ACTIVE NAV HIGHLIGHT
// ================================
const navAnchors = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + entry.target.id
          ? 'var(--text)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));
