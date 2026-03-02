// ── Animated grid canvas ──────────────────────────────────────────────────────
const canvas = document.getElementById('grid-canvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const SPACING = 48;
let offset = 0;

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cols = Math.ceil(canvas.width / SPACING) + 2;
  const rows = Math.ceil(canvas.height / SPACING) + 2;

  ctx.strokeStyle = 'rgba(0, 245, 160, 0.07)';
  ctx.lineWidth = 0.5;

  // Vertical lines
  for (let c = 0; c <= cols; c++) {
    const x = (c * SPACING - offset % SPACING);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let r = 0; r <= rows; r++) {
    const y = (r * SPACING - (offset * 0.4) % SPACING);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Occasional bright nodes at intersections
  ctx.fillStyle = 'rgba(0, 245, 160, 0.5)';
  for (let c = 0; c <= cols; c++) {
    for (let r = 0; r <= rows; r++) {
      // Use a stable pseudo-random to pick which nodes glow
      const seed = ((c * 7 + r * 13) % 41);
      if (seed === 3 || seed === 17 || seed === 29) {
        const x = c * SPACING - offset % SPACING;
        const y = r * SPACING - (offset * 0.4) % SPACING;
        const pulse = 0.3 + 0.7 * Math.abs(Math.sin((Date.now() / 1200) + seed));
        ctx.globalAlpha = pulse * 0.6;
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.globalAlpha = 1;

  offset += 0.3;
  requestAnimationFrame(drawGrid);
}
drawGrid();

// ── Smooth scroll for nav links ───────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Nav active state on scroll ────────────────────────────────────────────────
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.style.borderBottomColor = 'rgba(0, 245, 160, 0.15)';
  } else {
    nav.style.borderBottomColor = 'rgba(255,255,255,0.07)';
  }
});

// ── Intersection observer: fade-in sections ───────────────────────────────────
const observerStyle = document.createElement('style');
observerStyle.textContent = `
  .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(observerStyle);

const fadeEls = document.querySelectorAll('.pillar, .project-card, .about-text, .cta-box');
fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));

// ── Hex grid: random active pulses ───────────────────────────────────────────
const hexes = document.querySelectorAll('.hex:not(.active)');
function randomHexPulse() {
  if (hexes.length === 0) return;
  const hex = hexes[Math.floor(Math.random() * hexes.length)];
  hex.style.background = 'rgba(0,245,160,0.15)';
  hex.style.borderColor = 'rgba(0,245,160,0.4)';
  setTimeout(() => {
    hex.style.background = '';
    hex.style.borderColor = '';
  }, 600);
  setTimeout(randomHexPulse, 300 + Math.random() * 800);
}
randomHexPulse();
