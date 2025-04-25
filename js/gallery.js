// File: js/gallery.js

window.onload = () => {
  // 1) Your image reel
  const reel = [
    { src: 'images/one.jpg',      caption: 'Portrait 1: [Your caption]' },
    { src: 'images/two.jpg',      caption: 'Portrait 2: [Your caption]' },
    { src: 'images/three.jpg',    caption: 'Portrait 3: [Your caption]' },
    { src: 'images/four.jpg',     caption: 'Portrait 4: [Your caption]' },
    { src: 'images/five.jpg',     caption: 'Portrait 5: [Your caption]' },
    { src: 'images/six.jpg',      caption: 'Portrait 6: [Your caption]' },
    { src: 'images/seven.jpg',    caption: 'Portrait 7: [Your caption]' },
    { src: 'images/eight.jpg',    caption: 'Portrait 8: [Your caption]' },
    { src: 'images/nine.jpg',     caption: 'Portrait 9: [Your caption]' },
    { src: 'images/ten.jpg',      caption: 'Portrait 10: [Your caption]' },
    { src: 'images/eleven.jpg',   caption: 'Portrait 11: [Your caption]' },
    { src: 'images/twelve.jpg',   caption: 'Portrait 12: [Your caption]' },
    { src: 'images/thirteen.jpg', caption: 'Portrait 13: [Your caption]' },
    { src: 'images/fourteen.jpg', caption: 'Portrait 14: [Your caption]' },
    { src: 'images/fifteen.jpg',  caption: 'Portrait 15: [Your caption]' },
    { src: 'images/sixteen.jpg',  caption: 'Portrait 16: [Your caption]' },
    { src: 'images/seventeen.jpg',caption: 'Portrait 17: [Your caption]' },
    { src: 'images/eighteen.jpg', caption: 'Portrait 18: [Your caption]' },
    { src: 'images/nineteen.jpg', caption: 'Portrait 19: [Your caption]' },
  ];
  let current = 0;

  // 2) Select DOM elements
  const imgEl     = document.querySelector('.viewer img');
  const captionEl = document.querySelector('.viewer figcaption');
  const prevBtn   = document.querySelector('.viewer .prev');
  const nextBtn   = document.querySelector('.viewer .next');

  // 3) Set up the fade transition in JS (remove any CSS transition)
  imgEl.style.transition = 'opacity 1s ease';  // adjust duration as needed

  // 4) Helper: load & fade in an image immediately
  function showInitial() {
    const { src, caption } = reel[current];
    imgEl.src = src;
    imgEl.alt = caption;
    captionEl.textContent = caption;
    // wait one frame so the browser registers opacity:0 → opacity:1
    requestAnimationFrame(() => {
      imgEl.style.opacity = '1';
    });
  }

  // 5) Core render sequence for navigation
  function render() {
    const { src, caption } = reel[current];
    // fade out current
    imgEl.style.opacity = '0';

    // after fade-out, swap and fade in
    imgEl.addEventListener('transitionend', function onFade(e) {
      if (e.propertyName !== 'opacity') return;
      imgEl.removeEventListener('transitionend', onFade);

      imgEl.src = src;
      imgEl.alt = caption;
      captionEl.textContent = caption;

      // once new image is loaded, fade in
      imgEl.onload = () => {
        imgEl.style.opacity = '1';
      };
    });
  }

  // 6) Navigation handlers
  prevBtn.addEventListener('click', () => {
    current = (current - 1 + reel.length) % reel.length;
    render();
  });
  nextBtn.addEventListener('click', () => {
    current = (current + 1) % reel.length;
    render();
  });

  // 7) Keyboard navigation
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });

  // 8) Touch-swipe support
  let startX = null;
  imgEl.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
  imgEl.addEventListener('touchend',   e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (dx > 50)      prevBtn.click();
    else if (dx < -50) nextBtn.click();
    startX = null;
  });

  // 9) Kick off initial display
  showInitial();
};
