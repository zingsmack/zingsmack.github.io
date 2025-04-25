// File: js/gallery.js
document.addEventListener('DOMContentLoaded', () => {
  const reel = [
    { src: 'images/one.jpg',   caption: 'Portrait 1: [Your caption]' },
    { src: 'images/two.jpg',   caption: 'Portrait 2: [Your caption]' },
    { src: 'images/three.jpg', caption: 'Portrait 3: [Your caption]' },
    { src: 'images/four.jpg',  caption: 'Portrait 4: [Your caption]' },
  ];
  let current = 0;

  const imgEl     = document.querySelector('.viewer img');
  const captionEl = document.querySelector('.viewer figcaption');
  const prevBtn   = document.querySelector('.viewer .prev');
  const nextBtn   = document.querySelector('.viewer .next');

  function render() {
    const { src, caption } = reel[current];

    // fade-out
    imgEl.style.opacity = '0';

    // once faded, swap image & caption
    imgEl.addEventListener('transitionend', function swap() {
      imgEl.removeEventListener('transitionend', swap);
      imgEl.src = src;
      imgEl.alt = caption;
      captionEl.textContent = caption;

      // on load, fade in
      imgEl.onload = () => {
        imgEl.style.opacity = '1';
      };
    });
  }

  prevBtn.addEventListener('click', () => {
    current = (current - 1 + reel.length) % reel.length;
    render();
  });
  nextBtn.addEventListener('click', () => {
    current = (current + 1) % reel.length;
    render();
  });

  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });

  // initial display
  render();
});
