// File: js/gallery.js
// ——————————————————————————————
// all in ES-modules, loaded by <script type="module">

import * as THREE from 'https://unpkg.com/three@0.152.0/build/three.module.js';
import { DeviceOrientationControls } from 'https://unpkg.com/three@0.152.0/examples/jsm/controls/DeviceOrientationControls.js';
import gsap from 'https://unpkg.com/gsap@3/dist/gsap.min.js';
import { ScrollTrigger } from 'https://unpkg.com/gsap@3/dist/ScrollTrigger.min.js';

gsap.registerPlugin(ScrollTrigger);

// 1) Scene + fog
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 5, 20);

// 2) Camera
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 1.6, 0);

// 3) Renderer
const canvas = document.getElementById('webgl-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);

// 4) Light
scene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 0.5));

// 5) Corridor (floor, ceiling, walls)
const corridor = new THREE.Group();
(() => {
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const floorGeo = new THREE.PlaneGeometry(5, 50);

  const floor = new THREE.Mesh(floorGeo, wallMat);
  floor.rotation.x = -Math.PI / 2;
  corridor.add(floor);

  const ceil = floor.clone();
  ceil.rotation.x = Math.PI / 2;
  ceil.position.y = 3;
  corridor.add(ceil);

  const wallGeo = new THREE.PlaneGeometry(50, 3);
  const left = new THREE.Mesh(wallGeo, wallMat);
  left.position.set(-2.5, 1.5, -25);
  left.rotation.y = Math.PI / 2;
  corridor.add(left);

  const right = left.clone();
  right.position.x = 2.5;
  right.rotation.y = -Math.PI / 2;
  corridor.add(right);
})();
scene.add(corridor);

// 6) Frames
const loader = new THREE.TextureLoader();
const frames = [];
const frameGeo = new THREE.PlaneGeometry(1.5, 2);

for (let i = 0; i < 5; i++) {
  const tex = loader.load('images/one.jpg');
  const mat = new THREE.MeshBasicMaterial({ map: tex });
  const mesh = new THREE.Mesh(frameGeo, mat);
  mesh.position.set(i % 2 === 0 ? -1.8 : 1.8, 1.6, -5 - i * 8);
  mesh.name = `frame${i+1}`;
  scene.add(mesh);
  frames.push(mesh);
}

// 7) ScrollTrigger for camera z
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

// 8) On-scroll fog lerp
window.addEventListener('scroll', () => {
  const z = camera.position.z;
  let nearest = frames[0], minDist = Infinity;
  frames.forEach(f => {
    const d = Math.abs(f.position.z - z);
    if (d < minDist) [minDist, nearest] = [d, f];
  });
  const idx = +nearest.name.replace('frame','') - 1;
  const t = idx / (frames.length - 1);
  scene.fog.color.lerpColors(
    new THREE.Color(0x000000),
    new THREE.Color(0x444444),
    t
  );
});

// 9) Drag to yaw
let dragging = false, sx = 0;
canvas.addEventListener('pointerdown', e => (dragging = true, sx = e.clientX));
canvas.addEventListener('pointermove', e => {
  if (!dragging) return;
  camera.rotation.y -= (e.clientX - sx) * 0.002;
  sx = e.clientX;
});
canvas.addEventListener('pointerup', () => dragging = false);

// 10) Device orientation on mobile
let deviceControls;
if (typeof DeviceOrientationEvent !== 'undefined') {
  deviceControls = new DeviceOrientationControls(camera);
}

// 11) Menu toggle
const menuToggle = document.getElementById('menu-toggle');
const menuOverlay = document.getElementById('menu-overlay');
const closeMenu  = document.getElementById('close-menu');
menuToggle.addEventListener('click', () => menuOverlay.classList.toggle('hidden'));
closeMenu.addEventListener('click', () => menuOverlay.classList.add('hidden'));

// 12) Resize
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// 13) Render loop
function animate() {
  requestAnimationFrame(animate);
  if (deviceControls) deviceControls.update();
  renderer.render(scene, camera);
}
animate();
