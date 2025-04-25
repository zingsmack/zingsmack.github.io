// File: js/gallery.js
document.addEventListener('DOMContentLoaded', () => {
  const reel = [
    { src: 'images/one.jpg',   caption: 'Portrait 1: [Your caption]' },
    { src: 'images/two.jpg',   caption: 'Portrait 2: [Your caption]' },
    { src: 'images/three.jpg', caption: 'Portrait 3: [Your caption]' },
    { src: 'images/four.jpg',  caption: 'Portrait 4: [Your caption]' },
    { src: 'images/five.jpg',   caption: 'Portrait 5: [Your caption]' },
    { src: 'images/six.jpg',   caption: 'Portrait 6: [Your caption]' },
    { src: 'images/seven.jpg', caption: 'Portrait 7: [Your caption]' },
    { src: 'images/eight.jpg',  caption: 'Portrait 8: [Your caption]' },   
    { src: 'images/nine.jpg',   caption: 'Portrait 9: [Your caption]' },
    { src: 'images/ten.jpg',   caption: 'Portrait 10: [Your caption]' },
    { src: 'images/eleven.jpg', caption: 'Portrait 11: [Your caption]' },
    { src: 'images/twelve.jpg',  caption: 'Portrait 12: [Your caption]' },
    { src: 'images/thirteen.jpg',   caption: 'Portrait 13: [Your caption]' },
    { src: 'images/fourteen.jpg',   caption: 'Portrait 14: [Your caption]' },
    { src: 'images/fifteen.jpg', caption: 'Portrait 15: [Your caption]' },
    { src: 'images/sixteen.jpg',  caption: 'Portrait 16: [Your caption]' },
    { src: 'images/seventeen.jpg',   caption: 'Portrait 17: [Your caption]' },
    { src: 'images/eighteen.jpg',   caption: 'Portrait 18: [Your caption]' },
    { src: 'images/nineteen.jpg', caption: 'Portrait 19: [Your caption]' },


    
  ];
  let current = 0;

  // 2) Grab DOM elements
  const imgEl     = document.querySelector('.viewer img');
  const captionEl = document.querySelector('.viewer figcaption');
  const prevBtn   = document.querySelector('.viewer .prev');
  const nextBtn   = document.querySelector('.viewer .next');

  // 3) Render with fade sequence
  function render() {
    const { src, caption } = reel[current];

    // Start fade-out
    imgEl.style.opacity = '0';

    // Once opacity transition ends, swap src & caption, then fade-in
    function onFadeOut(e) {
      if (e.propertyName !== 'opacity') return;
      imgEl.removeEventListener('transitionend', onFadeOut);

      imgEl.src = src;
      imgEl.alt = caption;
      captionEl.textContent = caption;

      // When new image has loaded, fade back in
      imgEl.onload = () => {
        imgEl.style.opacity = '1';
      };
    }

    imgEl.addEventListener('transitionend', onFadeOut);
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

  // 5) Keyboard support
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });

  // 6) Touch-swipe support
  let startX = null;
  imgEl.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
  imgEl.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (dx > 50)      prevBtn.click();
    else if (dx < -50) nextBtn.click();
    startX = null;
  });

  // 7) Initial render
  // Set initial opacity to 1 for the first image
  imgEl.style.transition = 'opacity 3s ease';
  imgEl.onload = () => { imgEl.style.opacity = '1'; };
  render();
});
