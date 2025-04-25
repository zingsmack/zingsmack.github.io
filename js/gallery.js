// File: js/gallery.js

import * as THREE        from './libs/three.module.js';
// Removed DeviceOrientationControls import since it's deprecated
import gsap             from './libs/gsap.min.js';
import { ScrollTrigger } from './plugins/ScrollTrigger.min.js';

gsap.registerPlugin(ScrollTrigger);

// 1. Scene + fog
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 5, 20);

// 2. Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 1.6, 0);

// 3. Renderer
const canvas = document.getElementById('webgl-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

// 4. Lights
scene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 0.5));

// 5. Build corridor (floor, ceiling, walls)
const corridor = new THREE.Group();
(() => {
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const floorGeo = new THREE.PlaneGeometry(5, 50);

  // Floor
  const floor = new THREE.Mesh(floorGeo, wallMat);
  floor.rotation.x = -Math.PI / 2;
  corridor.add(floor);

  // Ceiling
  const ceil = floor.clone();
  ceil.rotation.x = Math.PI / 2;
  ceil.position.y = 3;
  corridor.add(ceil);

  // Walls
  const wallGeo = new THREE.PlaneGeometry(50, 3);
  const leftWall = new THREE.Mesh(wallGeo, wallMat);
  leftWall.position.set(-2.5, 1.5, -25);
  leftWall.rotation.y = Math.PI / 2;
  corridor.add(leftWall);

  const rightWall = leftWall.clone();
  rightWall.position.x = 2.5;
  rightWall.rotation.y = -Math.PI / 2;
  corridor.add(rightWall);
})();
scene.add(corridor);

// 6. Portrait frames
const loader = new THREE.TextureLoader();
const frames = [];
const frameGeo = new THREE.PlaneGeometry(1.5, 2);

for (let i = 0; i < 5; i++) {
  const texture = loader.load('images/one.jpg');
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const mesh = new THREE.Mesh(frameGeo, material);
  mesh.position.set(
    i % 2 === 0 ? -1.8 : 1.8,
    1.6,
    -5 - i * 8
  );
  mesh.name = `frame${i + 1}`;
  scene.add(mesh);
  frames.push(mesh);
}

// 7. ScrollTrigger: move camera along z-axis
gsap.to(camera.position, {
  z: -40,
  ease: 'none',
  scrollTrigger: {
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true
  }
});

// 8. On-scroll environment fade (fog color)
window.addEventListener('scroll', () => {
  const z = camera.position.z;
  let nearest = frames[0];
  let minDist = Infinity;
  frames.forEach((f) => {
    const d = Math.abs(f.position.z - z);
    if (d < minDist) {
      minDist = d;
      nearest = f;
    }
  });
  const idx = parseInt(nearest.name.replace('frame', ''), 10) - 1;
  const t = idx / (frames.length - 1);
  scene.fog.color.lerpColors(
    new THREE.Color(0x000000),
    new THREE.Color(0x444444),
    t
  );
});

// 9. Drag-to-rotate (yaw) on desktop
let isDragging = false;
let startX = 0;
canvas.addEventListener('pointerdown', (e) => {
  isDragging = true;
  startX = e.clientX;
});
canvas.addEventListener('pointermove', (e) => {
  if (!isDragging) return;
  const dx = (e.clientX - startX) * 0.002;
  camera.rotation.y -= dx;
  startX = e.clientX;
});
canvas.addEventListener('pointerup', () => {
  isDragging = false;
});

// 10. Device orientation on mobile (manual)
if ('DeviceOrientationEvent' in window) {
  window.addEventListener('deviceorientation', (event) => {
    // gamma is left-to-right tilt in degrees
    const gamma = event.gamma || 0;
    camera.rotation.y = THREE.MathUtils.degToRad(gamma);
  });
}

// 11. Menu toggle
const menuToggle = document.getElementById('menu-toggle');
const menuOverlay = document.getElementById('menu-overlay');
const closeMenu = document.getElementById('close-menu');
menuToggle.addEventListener('click', () => {
  menuOverlay.classList.toggle('hidden');
});
closeMenu.addEventListener('click', () => {
  menuOverlay.classList.add('hidden');
});

// 12. Responsive resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 13. Render loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
