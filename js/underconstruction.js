// File: js/underconstruction.js

const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');
let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

let time = 0;
function draw() {
  const img = ctx.createImageData(w, h);
  const data = img.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      // combine several sine waves for a fractal-like plasma effect
      const v = (
        128 + 128 * Math.sin(x / 16 + time) +
        128 + 128 * Math.sin(y / 8 + time) +
        128 + 128 * Math.sin((x + y) / 16 + time) +
        128 + 128 * Math.sin(Math.hypot(x, y) / 8 + time)
      ) / 4;

      data[i    ] = (v * 0.6) | 0;    // red
      data[i + 1] = (v * 0.8) | 0;    // green
      data[i + 2] = (255 - v) | 0;    // blue
      data[i + 3] = 255;              // alpha
    }
  }
  ctx.putImageData(img, 0, 0);
  time += 0.02;
  requestAnimationFrame(draw);
}
draw();
