// File: js/film.js

document.addEventListener('DOMContentLoaded', () => {
  // 1) Define your video reel (replace VIDEO_IDx with real IDs)
  const reel = [
    { embedId: 'VIDEO_ID1', caption: 'Video 1: [Your title here]' },
    { embedId: 'VIDEO_ID2', caption: 'Video 2: [Your title here]' },
    { embedId: 'VIDEO_ID3', caption: 'Video 3: [Your title here]' },
    // add more videos as needed
  ];
  let current = 0;

  // 2) Grab DOM elements
  const container = document.querySelector('.viewer .video-container');
  const iframe    = document.getElementById('video-frame');
  const captionEl = document.getElementById('video-caption');
  const prevBtn   = document.querySelector('.viewer .prev');
  const nextBtn   = document.querySelector('.viewer .next');

  // ensure fade transition
  container.style.transition = 'opacity 0.4s ease';
  container.style.opacity    = '1';

  // 3) Render function
  function render() {
    const { embedId, caption } = reel[current];

    // fade out
    container.style.opacity = '0';

    // after fade completes, swap src and caption
    container.addEventListener('transitionend', function swap() {
      container.removeEventListener('transitionend', swap);
      iframe.src = `https://www.youtube.com/embed/${embedId}?rel=0&showinfo=0`;
      captionEl.textContent = caption;
      // fade in when iframe ready
      iframe.onload = () => {
        container.style.opacity = '1';
      };
    });
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

  // 6) Initial render
  render();
});

