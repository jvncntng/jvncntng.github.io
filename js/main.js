// Cursor
const cur = document.getElementById('cur');
const ring = document.getElementById('ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = (mx-4)+'px'; cur.style.top = (my-4)+'px';
});
(function tick(){
  rx += (mx-rx-18)*.14; ry += (my-ry-18)*.14;
  ring.style.left = rx+'px'; ring.style.top = ry+'px';
  requestAnimationFrame(tick);
})();
document.querySelectorAll('a, button, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cur.style.transform='scale(3)'; ring.style.transform='scale(1.4)'; ring.style.borderColor='rgba(200,184,154,.9)'; });
  el.addEventListener('mouseleave', () => { cur.style.transform=''; ring.style.transform=''; ring.style.borderColor=''; });
});

// Scroll reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
