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
    { src: 'images/twenty.jpg', caption: 'Portrait 20: [Your caption]' },
  ];
  let current = 0;

  // 2) Select DOM elements
  const imgEl     = document.querySelector('.viewer img');
  const captionEl = document.querySelector('.viewer figcaption');
  const prevBtn   = document.querySelector('.viewer .prev');
  const nextBtn   = document.querySelector('.viewer .next');

  // 3) Configure a single 3s opacity transition
  imgEl.style.transition = 'opacity 2s ease';

  // 4) Helper to load & fade in
  function fadeIn() {
    imgEl.onload = () => {
      // after image loads, fade in
      requestAnimationFrame(() => { 
        imgEl.style.opacity = '1'; 
      });
    };
  }

  // 5) Show the very first image
  function showInitial() {
    const { src, caption } = reel[current];
    imgEl.style.opacity = '0';
    imgEl.src = src;
    captionEl.textContent = caption;
    fadeIn();
  }

  // 6) Swap logic for nav
  function showNext(delta) {
    current = (current + delta + reel.length) % reel.length;
    const { src, caption } = reel[current];

    // 6a) Fade out
    imgEl.style.opacity = '0';

    // 6b) Once fade-out ends, swap src & caption, then fade in
    imgEl.ontransitionend = (e) => {
      if (e.propertyName !== 'opacity') return;
      imgEl.ontransitionend = null;  // clear handler

      imgEl.src = src;
      captionEl.textContent = caption;
      fadeIn();
    };
  }

  // 7) Wire up buttons
  prevBtn.onclick = () => showNext(-1);
  nextBtn.onclick = () => showNext(+1);

  // 8) Keyboard nav
  window.onkeydown = (e) => {
    if (e.key === 'ArrowLeft')  showNext(-1);
    if (e.key === 'ArrowRight') showNext(+1);
  };

  // 9) Kick it off
  showInitial();
};
