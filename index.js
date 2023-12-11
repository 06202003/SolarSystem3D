import * as THREE from 'three';
import { OrbitControls } from 'orbitcontrols';

// Textures
const saturn = new THREE.TextureLoader().load('texture/earth.jpg');
const ring = new THREE.TextureLoader().load('texture/torus.jpg');
const sun = new THREE.TextureLoader().load('texture/sun.jpg');

// Scene & Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 100);
camera.position.z = 10;

var viewport = document.getElementById('viewport');
var canvas = document.getElementById('canvas');

// Mengambil tinggi dan lebar dari elemen canvas
var canvasHeight = viewport.height * 3;
var canvasWidth = viewport.width * 3;

// Menampilkan nilai tinggi dan lebar di console (opsional)
console.log('Tinggi Canvas: ' + canvasHeight);
console.log('Lebar Canvas: ' + canvasWidth);

// Renderer
var renderer = new THREE.WebGLRenderer({ canvas: viewport, antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setSize(canvasWidth, canvasHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// GUI Controls
const gui = new dat.GUI();
const suncontrol = {
  x: 2,
  y: 0,
  z: 1,
};
const torusControl = {
  x: 2,
  y: 0,
};

// GUI FOLDER
const sphereFolder = gui.addFolder('Sun Controls');
sphereFolder.add(suncontrol, 'x', -10, 10, 0.1);
sphereFolder.add(suncontrol, 'y', -10, 10);
sphereFolder.add(suncontrol, 'z', -10, 10);
sphereFolder.open();

const torusFolder = gui.addFolder('Earth & Ring Controls');

torusFolder.add(torusControl, 'x', -10, 10, 0.1).onChange(() => {
  torus.rotation.x = torusControl.x;
});
torusFolder.add(torusControl, 'y', -10, 10).onChange(() => {
  torus.position.y = torusControl.y;
});
torusFolder.open();

// Sun (sphere)
const geometrySphere = new THREE.SphereGeometry(2, 32, 16);
const materialSphere = new THREE.MeshPhongMaterial({ map: sun, shininess: 100 });
const sphere = new THREE.Mesh(geometrySphere, materialSphere);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);

// Earth (sphere)
const earthGeometry = new THREE.SphereGeometry(1, 32, 16);
const earthMaterial = new THREE.MeshPhongMaterial({ map: saturn, shininess: 50 });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.set(0, 0, 1);
earth.rotation.x = torusControl.x;
earth.castShadow = true;
scene.add(earth);

// Ring (torus)
const torusGeometry = new THREE.TorusGeometry(1.5, 0.1, 30, 100);
const torusMaterial = new THREE.MeshPhongMaterial({
  map: ring,
  ambient: 0x0000ff,
  shininess: 50,
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.rotation.x = torusControl.x;
torus.castShadow = true;
torus.receiveShadow = true;
scene.add(torus);

const earthearthAndTorus = new THREE.Object3D();
earthearthAndTorus.add(sphere);
earthearthAndTorus.add(earth);
earthearthAndTorus.add(torus);
scene.add(earthearthAndTorus);

// Lights
const ambient_light = new THREE.AmbientLight(0xffffcc);
scene.add(ambient_light);

const directional_light = new THREE.DirectionalLight(0xffffff, 10, 10);
directional_light.position.set(1, 1, 1);
scene.add(directional_light);

const spotlight = new THREE.SpotLight(0xffffff, 0.1);
spotlight.position.set(1, 1, 0);
spotlight.target.position.set(1.2, 1, 0);
scene.add(spotlight);

directional_light.castShadow = true;
spotlight.castShadow = true;

let angle = 0;

function animate() {
  requestAnimationFrame(animate);

  sphere.rotation.y += 0.001;

  sphere.scale.z = suncontrol.z;
  sphere.rotation.x = suncontrol.x;
  sphere.position.y = suncontrol.y;

  angle += 0.05;

  const earthOrbitRadius = 4;
  const earthOrbitSpeed = 0.3;
  earth.position.x = Math.cos(angle * earthOrbitSpeed) * earthOrbitRadius;
  earth.position.z = Math.sin(angle * earthOrbitSpeed) * earthOrbitRadius;

  earthearthAndTorus.rotation.y += 0.005;

  torus.position.copy(earth.position);

  torus.rotation.z += 0.05;

  torus.rotation.x = torusControl.x;
  torus.position.y = torusControl.y;
  earth.rotation.x = torusControl.x;
  earth.position.y = torusControl.y;

  renderer.render(scene, camera);
}

animate();
