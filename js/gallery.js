// File: js/gallery.js

// Grab the canvas
const canvas = document.getElementById('webgl-canvas');

// Scene & fog for environment shifts
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 5, 20);

// Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.6, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

// Lights
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x222222, 0.5);
scene.add(hemiLight);

// Build corridor (floor, ceiling, walls)
const corridor = new THREE.Group();
(() => {
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x333333 });

  // Floor
  const floorGeo = new THREE.PlaneGeometry(5, 50);
  const floor = new THREE.Mesh(floorGeo, wallMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  corridor.add(floor);

  // Ceiling
  const ceil = new THREE.Mesh(floorGeo, wallMat);
  ceil.rotation.x = Math.PI / 2;
  ceil.position.y = 3;
  corridor.add(ceil);

  // Left wall
  const wallGeo = new THREE.PlaneGeometry(50, 3);
  const left = new THREE.Mesh(wallGeo, wallMat);
  left.position.set(-2.5, 1.5, -25);
  left.rotation.y = Math.PI / 2;
  corridor.add(left);

  // Right wall
  const right = left.clone();
  right.position.x = 2.5;
  right.rotation.y = -Math.PI / 2;
  corridor.add(right);
})();
scene.add(corridor);

// Load and place portrait frames
const loader = new THREE.TextureLoader();
const frames = [];
const frameGeo = new THREE.PlaneGeometry(1.5, 2);

for (let i = 0; i < 5; i++) {
  const tex = loader.load('images/one.jpg');
  const mat = new THREE.MeshBasicMaterial({ map: tex });
  const mesh = new THREE.Mesh(frameGeo, mat);

  // Alternate sides, stagger depth
  mesh.position.set(
    i % 2 === 0 ? -1.8 : 1.8,
    1.6,
    -5 - i * 8
  );
  mesh.name = `frame${i+1}`;

  scene.add(mesh);
  frames.push(mesh);
}

// Animate camera forward on scroll
gsap.registerPlugin(ScrollTrigger);
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

// On scroll, lerp fog color based on nearest frame index
window.addEventListener('scroll', () => {
  const z = camera.position.z;
  let nearest = frames[0];
  let minDist = Infinity;

  frames.forEach(f => {
    const d = Math.abs(f.position.z - z);
    if (d < minDist) {
      minDist = d;
      nearest = f;
    }
  });

  const idx = parseInt(nearest.name.replace('frame',''), 10) - 1;
  const t = idx / (frames.length - 1);

  // Fade from black to dark gray
  scene.fog.color.lerpColors(
    new THREE.Color(0x000000),
    new THREE.Color(0x444444),
    t
  );
});

// Click-drag to rotate camera yaw
let isDragging = false, startX = 0;
canvas.addEventListener('pointerdown', e => {
  isDragging = true;
  startX = e.clientX;
});
canvas.addEventListener('pointermove', e => {
  if (!isDragging) return;
  const dx = (e.clientX - startX) * 0.002;
  camera.rotation.y -= dx;
  startX = e.clientX;
});
canvas.addEventListener('pointerup', () => { isDragging = false; });

// Device orientation controls on mobile
let deviceControls;
if (window.DeviceOrientationEvent) {
  deviceControls = new THREE.DeviceOrientationControls(camera);
}

// Menu toggle
const menuToggle = document.getElementById('menu-toggle');
const menuOverlay = document.getElementById('menu-overlay');
const closeMenu  = document.getElementById('close-menu');

menuToggle.addEventListener('click', () => {
  menuOverlay.classList.toggle('hidden');
});
closeMenu.addEventListener('click', () => {
  menuOverlay.classList.add('hidden');
});

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Render loop
function animate() {
  requestAnimationFrame(animate);
  if (deviceControls) deviceControls.update();
  renderer.render(scene, camera);
}
animate();
