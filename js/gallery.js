// File: js/gallery.js

import * as THREE from './libs/three.module.js';

// 1. Scene + simple background
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// 2. Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 1.6, 5);

// 3. Renderer
const canvas = document.getElementById('webgl-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 4. Light
scene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 0.5));

// 5. Corridor
const corridor = new THREE.Group();
{
  const mat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const floorGeo = new THREE.PlaneGeometry(5, 50);
  const floor = new THREE.Mesh(floorGeo, mat);
  floor.rotation.x = -Math.PI/2;
  corridor.add(floor);

  const ceil = floor.clone();
  ceil.rotation.x = Math.PI/2;
  ceil.position.y = 3;
  corridor.add(ceil);

  const wallGeo = new THREE.PlaneGeometry(50,3);
  const left  = new THREE.Mesh(wallGeo, mat);
  left.position.set(-2.5,1.5,-25);
  left.rotation.y = Math.PI/2;
  corridor.add(left);

  const right = left.clone();
  right.position.x = 2.5;
  right.rotation.y = -Math.PI/2;
  corridor.add(right);
}
scene.add(corridor);

// 6. Portrait frames
const loader   = new THREE.TextureLoader();
const frameGeo = new THREE.PlaneGeometry(1.5,2);
for (let i=0; i<5; i++){
  const tex  = loader.load('images/one.jpg');
  const mat  = new THREE.MeshBasicMaterial({ map: tex });
  const mesh = new THREE.Mesh(frameGeo, mat);
  mesh.position.set(
    (i%2===0 ? -1.8 : 1.8),
    1.6,
    -5 - i*8
  );
  scene.add(mesh);
}

// 7. Manual scroll → camera Z
window.addEventListener('scroll', ()=>{
  const max = document.body.scrollHeight - window.innerHeight;
  const t   = window.scrollY / max;
  camera.position.z = THREE.MathUtils.lerp(5, -40, t);
});

// 8. Drag-to-yaw
let dragging=false, startX=0;
canvas.addEventListener('pointerdown', e=>{ dragging=true; startX=e.clientX; });
canvas.addEventListener('pointermove', e=>{
  if (!dragging) return;
  camera.rotation.y -= (e.clientX - startX)*0.002;
  startX = e.clientX;
});
canvas.addEventListener('pointerup', ()=>dragging=false);

// 9. Handle resize
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 10. Render loop
function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
