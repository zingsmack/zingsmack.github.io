// File: js/gallery.js

// At the top of js/gallery.js
document.addEventListener('DOMContentLoaded', () => {
  // ... all your existing code here, indented one level ...







// 1) Define your image reel
const reel = [
  { src: 'images/one.jpg',   caption: 'Portrait 1: [Your captiones here]' },
  { src: 'images/two.jpg',   caption: 'Portrait 2: [Your captional here]' },
  { src: 'images/three.jpg', caption: 'Portrait 3: [Your captionole here]' },
];

let current = 0;

// 2) Grab DOM elements
const imgEl      = document.querySelector('.viewer img');
const captionEl  = document.querySelector('.viewer figcaption');
const prevBtn    = document.querySelector('.viewer .prev');
const nextBtn    = document.querySelector('.viewer .next');

// 3) Render function
function render() {
  const { src, caption } = reel[current];
  imgEl.src = src;
  imgEl.alt = caption;
  captionEl.textContent = caption;
}

// 4) Navigation handlers
prevBtn.addEventListener('click', () => {
  current = (current - 1 + reel.length) % reel.length;
  render();
});
nextBtn.addEventListener('click', () => {
  current = (current + 1) % reel.length;
  render();
});

// 5) Keyboard support ← / →
window.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  prevBtn.click();
  if (e.key === 'ArrowRight') nextBtn.click();
});

// 6) Touch‐swipe support
let startX = null;
imgEl.addEventListener('touchstart', e => startX = e.touches[0].clientX);
imgEl.addEventListener('touchend', e => {
  if (startX === null) return;
  const dx = e.changedTouches[0].clientX - startX;
  if (dx > 50)      prevBtn.click();
  else if (dx < -50) nextBtn.click();
  startX = null;
});

// 7) Initial render
render();

                          });

