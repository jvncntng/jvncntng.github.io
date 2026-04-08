// ── CURSOR ──────────────────────────────────────────────────────────────────
const cur = document.getElementById('cur');
const ring = document.getElementById('ring');
let mx=0, my=0, rx=0, ry=0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = (mx - 4) + 'px';
  cur.style.top  = (my - 4) + 'px';
});

(function tick() {
  rx += (mx - rx - 18) * .14;
  ry += (my - ry - 18) * .14;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(tick);
})();

function cursorEnlarge() {
  cur.style.transform = 'scale(2.5)';
  cur.style.background = '#fff';
  cur.style.borderColor = '#c8b89a';
  ring.style.transform = 'scale(1.4)';
  ring.style.borderColor = '#fff';
}
function cursorReset() {
  cur.style.transform = '';
  cur.style.background = '#c8b89a';
  cur.style.borderColor = '#fff';
  ring.style.transform = '';
  ring.style.borderColor = '#c8b89a';
}

document.querySelectorAll('a, button, .project-card, .skill-chip').forEach(el => {
  el.addEventListener('mouseenter', cursorEnlarge);
  el.addEventListener('mouseleave', cursorReset);
});

// ── SCROLL REVEAL ────────────────────────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── LIGHTBOX ─────────────────────────────────────────────────────────────────
(function initLightbox() {
  // Only run on project pages that have .photo-cell elements
  const cells = document.querySelectorAll('.photo-cell');
  if (!cells.length) return;

  // Collect all images inside photo cells
  let images = [];
  let current = 0;

  cells.forEach((cell, i) => {
    const img = cell.querySelector('img');
    if (!img) return;

    images.push({ src: img.src, alt: img.alt || '' });

    cell.addEventListener('click', () => openLightbox(images.indexOf({ src: img.src, alt: img.alt || '' })));

    // Find index by matching src
    cell.addEventListener('click', () => {
      const idx = images.findIndex(im => im.src === img.src);
      openLightbox(idx >= 0 ? idx : 0);
    });
  });

  if (!images.length) return;

  // Build lightbox DOM
  const overlay = document.createElement('div');
  overlay.className = 'lb-overlay';
  overlay.innerHTML = `
    <button class="lb-close" id="lbClose">Close ✕</button>
    <button class="lb-prev" id="lbPrev">←</button>
    <div class="lb-img-wrap">
      <img class="lb-img" id="lbImg" src="" alt="">
    </div>
    <button class="lb-next" id="lbNext">→</button>
    <div class="lb-caption" id="lbCaption"></div>
    <div class="lb-counter" id="lbCounter"></div>
  `;
  document.body.appendChild(overlay);

  const lbImg     = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbCounter = document.getElementById('lbCounter');
  const lbPrev    = document.getElementById('lbPrev');
  const lbNext    = document.getElementById('lbNext');
  const lbClose   = document.getElementById('lbClose');

  // Cursor enlargement for lightbox buttons
  [lbClose, lbPrev, lbNext].forEach(btn => {
    btn.addEventListener('mouseenter', cursorEnlarge);
    btn.addEventListener('mouseleave', cursorReset);
  });

  function show(idx) {
    current = idx;
    const im = images[current];
    lbImg.src = im.src;
    lbImg.alt = im.alt;
    lbCaption.textContent = im.alt;
    lbCounter.textContent = `${current + 1} / ${images.length}`;
    lbPrev.classList.toggle('hidden', current === 0);
    lbNext.classList.toggle('hidden', current === images.length - 1);

    // Animate image in
    lbImg.style.transform = 'scale(.94)';
    requestAnimationFrame(() => {
      lbImg.style.transform = '';
    });
  }

  function openLightbox(idx) {
    show(idx);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => { if (current > 0) show(current - 1); });
  lbNext.addEventListener('click', () => { if (current < images.length - 1) show(current + 1); });

  // Click outside image to close
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft'  && current > 0) show(current - 1);
    if (e.key === 'ArrowRight' && current < images.length - 1) show(current + 1);
  });

  // Swipe support (mobile)
  let touchStartX = 0;
  overlay.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  overlay.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 50) return;
    if (diff > 0 && current < images.length - 1) show(current + 1);
    if (diff < 0 && current > 0) show(current - 1);
  });
})();