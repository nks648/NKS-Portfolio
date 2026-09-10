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
}, { threshold: 0.1 });

progressFills.forEach(el => progressObserver.observe(el));
document.querySelectorAll('.lang-bar-fill').forEach(el => progressObserver.observe(el));

// ================================
// BACK TO TOP
// ================================
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  const heroEl = document.getElementById('hero');
  const heroVisibility = new IntersectionObserver((entries) => {
    backToTop.classList.toggle('visible', !entries[0].isIntersecting);
  }, { threshold: 0 });
  heroVisibility.observe(heroEl);

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ================================
// PHOTO GALLERY — COVER FLOW
// ================================
// Add photos to the /photos/ folder and list them here:
const GALLERY_PHOTOS = [
  { src: 'photos/IMG_3500.jpeg',                              caption: 'SAP EWM Project Closure · Isar Aerospace',          alt: 'SAP EWM project closure milestone at Isar Aerospace' },
  { src: 'photos/ea046619-db3c-4e4d-a93d-3ae1c9ff8cb0.jpeg', caption: 'SAP Hypergrowth Catalyst Program · For Startups',   alt: 'SAP for Startups Hypergrowth Catalyst Program event' },
  { src: 'photos/LV01 in flight.jpeg',                        caption: 'LV01 in Flight · Isar Aerospace',                   alt: 'Isar Aerospace LV01 launch vehicle in flight' },
  { src: 'photos/Mission patch.jpeg',                         caption: 'Mission Patch · Isar Aerospace',                    alt: 'Isar Aerospace mission patch' },
  { src: 'photos/With S2 of LV01.jpeg',                      caption: 'With S2 of LV01 · Isar Aerospace',                  alt: 'With the second stage of Isar Aerospace LV01' },
  { src: 'photos/Early days with model.jpeg',                 caption: 'Early Days at Isar Aerospace',                      alt: 'Early days at Isar Aerospace with a rocket model' },
];

// Placeholder cards shown until real photos are added
const CF_PLACEHOLDERS = [
  { gradient: 'linear-gradient(145deg,#0f2447,#1a3a6e)', icon: '📸', label: 'ADD PHOTOS' },
  { gradient: 'linear-gradient(145deg,#1a3a20,#0d2010)', icon: '🌄', label: 'DROP IN /photos/' },
  { gradient: 'linear-gradient(145deg,#3a1a2f,#200d1e)', icon: '🌌', label: 'YOUR MOMENTS' },
  { gradient: 'linear-gradient(145deg,#3a2a0a,#1e1500)', icon: '🌅', label: 'GALLERY' },
  { gradient: 'linear-gradient(145deg,#0f2a3a,#0a1520)', icon: '✨', label: 'COMING SOON' },
];

(function initCoverFlow() {
  const stage = document.getElementById('cfStage');
  const dotsWrap = document.getElementById('cfDots');
  const captionEl = document.getElementById('cfCaption');
  if (!stage) return;

  const photos = GALLERY_PHOTOS.length > 0 ? GALLERY_PHOTOS : null;
  const count = photos ? photos.length : CF_PLACEHOLDERS.length;
  let active = 0;

  // Build cards
  for (let i = 0; i < count; i++) {
    const card = document.createElement('div');
    card.className = 'cf-card';
    card.dataset.index = i;

    if (photos) {
      const img = document.createElement('img');
      img.src = photos[i].src;
      img.alt = photos[i].alt || photos[i].caption || 'Gallery photo ' + (i + 1);
      img.loading = i === 0 ? 'eager' : 'lazy';
      img.draggable = false;
      card.appendChild(img);
    } else {
      const ph = CF_PLACEHOLDERS[i % CF_PLACEHOLDERS.length];
      const div = document.createElement('div');
      div.className = 'cf-placeholder';
      div.style.background = ph.gradient;
      div.innerHTML = `<span class="cf-placeholder-icon">${ph.icon}</span><span class="cf-placeholder-label">${ph.label}</span>`;
      card.appendChild(div);
    }

    card.addEventListener('click', () => {
      if (parseInt(card.dataset.index) !== active) goTo(parseInt(card.dataset.index));
    });
    stage.appendChild(card);
  }

  // Build dots
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    dot.className = 'cf-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  }

  function positionCards() {
    stage.querySelectorAll('.cf-card').forEach(card => {
      const offset = parseInt(card.dataset.index) - active;
      const abs = Math.abs(offset);
      const dir = Math.sign(offset);

      if (abs > 3) {
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
        card.style.zIndex = '0';
        return;
      }

      let tx, ry, scale, opacity, shadow;

      if (offset === 0) {
        tx = 0; ry = 0; scale = 1.1; opacity = 1;
        shadow = '0 28px 70px rgba(0,0,0,0.75), 0 0 48px rgba(79,158,255,0.18)';
      } else {
        tx = dir * (220 + (abs - 1) * 150);
        ry = dir * -54;
        scale = Math.max(0.6, 0.82 - (abs - 1) * 0.1);
        opacity = Math.max(0.18, 0.58 - (abs - 1) * 0.18);
        shadow = 'none';
      }

      card.style.transform = `translateX(${tx}px) rotateY(${ry}deg) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.zIndex = 10 - abs;
      card.style.boxShadow = shadow;
      card.style.pointerEvents = abs === 0 ? 'none' : 'auto';
    });

    dotsWrap.querySelectorAll('.cf-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === active);
    });

    if (photos && photos[active] && photos[active].caption) {
      captionEl.textContent = photos[active].caption;
      captionEl.style.opacity = '1';
    } else {
      captionEl.style.opacity = '0';
    }
  }

  function goTo(idx) {
    active = Math.max(0, Math.min(count - 1, idx));
    positionCards();
  }

  const cfPrev = document.getElementById('cfPrev');
  const cfNext = document.getElementById('cfNext');
  if (cfPrev) cfPrev.addEventListener('click', () => goTo(active - 1));
  if (cfNext) cfNext.addEventListener('click', () => goTo(active + 1));

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!document.getElementById('gallery')) return;
    if (e.key === 'ArrowLeft') goTo(active - 1);
    if (e.key === 'ArrowRight') goTo(active + 1);
  });

  // Velocity tracking — Apple HIG: project momentum, don't just threshold
  let pointerHistory = [];
  function trackPointer(x) {
    const now = performance.now();
    pointerHistory.push({ x, t: now });
    // Keep only the last 80 ms of history
    pointerHistory = pointerHistory.filter(p => now - p.t < 80);
  }
  function releaseVelocity() {
    if (pointerHistory.length < 2) return 0;
    const a = pointerHistory[0], b = pointerHistory[pointerHistory.length - 1];
    const dt = b.t - a.t;
    return dt > 0 ? (b.x - a.x) / dt : 0; // px/ms
  }
  // Project momentum (Apple's exponential-decay formula, d ≈ 0.998)
  function projectMomentum(v_pxPerMs) {
    const v = v_pxPerMs * 1000; // px/s
    const d = 0.998;
    return (v / 1000) * d / (1 - d);
  }
  function flickGoTo(dragDelta) {
    const v = releaseVelocity(); // px/ms (positive = rightward)
    const projection = projectMomentum(v); // px
    const effective = dragDelta + projection * 0.25;
    const CARD_WIDTH = 220;
    // How many cards to advance: use momentum for multi-card flicks, cap at 2
    const cards = Math.round(-effective / CARD_WIDTH);
    const delta = Math.sign(-effective) * Math.max(1, Math.min(2, Math.abs(cards)));
    // Flick threshold: commit if displacement > 40px OR velocity > 0.4 px/ms
    if (Math.abs(effective) > 40 || Math.abs(v) > 0.4) goTo(active + delta);
    pointerHistory = [];
  }

  // Mouse drag
  let dragStartX = null, dragDelta = 0;

  stage.addEventListener('mousedown', e => {
    dragStartX = e.clientX; dragDelta = 0;
    pointerHistory = []; trackPointer(e.clientX);
    stage.classList.add('dragging');
  });
  document.addEventListener('mousemove', e => {
    if (dragStartX === null) return;
    dragDelta = e.clientX - dragStartX;
    trackPointer(e.clientX);
  });
  document.addEventListener('mouseup', () => {
    if (dragStartX === null) return;
    stage.classList.remove('dragging');
    flickGoTo(dragDelta);
    dragStartX = null; dragDelta = 0;
  });

  // Touch swipe — same velocity-aware logic
  let touchStartX = null, touchDelta = 0;
  stage.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchDelta = 0; pointerHistory = [];
    trackPointer(touchStartX);
  }, { passive: true });
  stage.addEventListener('touchmove', e => {
    if (touchStartX === null) return;
    touchDelta = e.touches[0].clientX - touchStartX;
    trackPointer(e.touches[0].clientX);
  }, { passive: true });
  stage.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    flickGoTo(delta);
    touchStartX = null; touchDelta = 0;
  }, { passive: true });

  positionCards();
})();
