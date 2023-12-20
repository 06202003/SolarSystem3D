import * as THREE from 'z';
import { OrbitControls } from 'orbitcontrols';

// Textures
const earthtex = new THREE.TextureLoader().load('texture/earth.jpg');
const ring = new THREE.TextureLoader().load('texture/torus.jpg');
const sun = new THREE.TextureLoader().load('texture/sun.jpg');
const mercury = new THREE.TextureLoader().load('texture/mercury.jpg');
const venustex = new THREE.TextureLoader().load('texture/venus.jpg');
const marstex = new THREE.TextureLoader().load('texture/mars.jpg');
const jupyter = new THREE.TextureLoader().load('texture/jupiter.jpg');
const neptune = new THREE.TextureLoader().load('texture/neptunus.jpg');
const saturn = new THREE.TextureLoader().load('texture/saturnus.jpg');
const uranustex = new THREE.TextureLoader().load('texture/uranus.jpg');

// Scene & Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
camera.position.z = 25;

var viewport = document.getElementById('viewport');
// var canvas = document.getElementById('canvas');

// Mengambil tinggi dan lebar dari elemen canvas
var canvasHeight = viewport.height;
var canvasWidth = viewport.width;

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
// const torusFolder = gui.addFolder('Earth & Ring Controls');
// torusFolder.add(torusControl, 'x', -10, 10, 0.1).onChange(() => {
//   torus.rotation.x = torusControl.x;
// });
// torusFolder.add(torusControl, 'y', -10, 10).onChange(() => {
//   torus.position.y = torusControl.y;
// });
// torusFolder.open();

// Sun (sphere)
const geometrySphere = new THREE.SphereGeometry(2, 32, 16);
const materialSphere = new THREE.MeshPhongMaterial({ map: sun, shininess: 100 });
const sphere = new THREE.Mesh(geometrySphere, materialSphere);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);

// Merkurius(sphere)
const merkuriusGeometry = new THREE.SphereGeometry(1, 32, 16);
const merkuriusMaterial = new THREE.MeshPhongMaterial({ map: mercury, shininess: 50 });
const merkurius = new THREE.Mesh(merkuriusGeometry, merkuriusMaterial);
// merkurius.position.set(0, 3, 4);
merkurius.castShadow = true;
scene.add(merkurius);

// Venus(sphere)
const venusGeometry = new THREE.SphereGeometry(1, 32, 16);
const venusMaterial = new THREE.MeshPhongMaterial({ map: venustex, shininess: 50 });
const venus = new THREE.Mesh(venusGeometry, venusMaterial);
// venus.position.set(0, 3, 4);
venus.castShadow = true;
scene.add(venus);

// Earth (sphere)
const earthGeometry = new THREE.SphereGeometry(1, 32, 16);
const earthMaterial = new THREE.MeshPhongMaterial({ map: earthtex, shininess: 50 });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.set(0, 0, 1);
earth.rotation.x = torusControl.x;
earth.castShadow = true;
scene.add(earth);

// Mars (sphere)
const marsGeometry = new THREE.SphereGeometry(1, 32, 16);
const marsMaterial = new THREE.MeshPhongMaterial({ map: marstex, shininess: 50 });
const mars = new THREE.Mesh(marsGeometry, marsMaterial);
mars.castShadow = true;
scene.add(mars);

// Jupiter (sphere)
const jupiterGeometry = new THREE.SphereGeometry(1, 32, 16);
const jupiterMaterial = new THREE.MeshPhongMaterial({ map: jupyter, shininess: 50 });
const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
jupiter.castShadow = true;
scene.add(jupiter);

// Saturnus (sphere)
const saturnusGeometry = new THREE.SphereGeometry(1, 32, 16);
const saturnusMaterial = new THREE.MeshPhongMaterial({ map: saturn, shininess: 50 });
const saturnus = new THREE.Mesh(saturnusGeometry, saturnusMaterial);
saturnus.castShadow = true;
scene.add(saturnus);
// Ring (torus)
const torusGeometry = new THREE.TorusGeometry(1.5, 0.2, 2, 100);
const torusMaterial = new THREE.MeshPhongMaterial({
  map: ring,
  ambient: 0x0000ff,
  shininess: 50,
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.castShadow = true;
torus.receiveShadow = true;
torus.rotation.x += Math.PI / 2;
scene.add(torus);

// Neptunus (sphere)
const neptunusGeometry = new THREE.SphereGeometry(1, 32, 16);
const neptunusMaterial = new THREE.MeshPhongMaterial({ map: neptune, shininess: 50 });
const neptunus = new THREE.Mesh(neptunusGeometry, neptunusMaterial);
neptunus.castShadow = true;
scene.add(neptunus);

// Uranus (sphere)
const uranusGeometry = new THREE.SphereGeometry(1, 32, 16);
const uranusMaterial = new THREE.MeshPhongMaterial({ map: uranustex, shininess: 50 });
const uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);
uranus.castShadow = true;
scene.add(uranus);

// const earthearthAndTorus = new THREE.Object3D();
// earthearthAndTorus.add(sphere);
// earthearthAndTorus.add(earth);
// earthearthAndTorus.add(torus);
// scene.add(earthearthAndTorus);

// Lights
// const ambient_light = new THREE.AmbientLight(0xffffcc);
// scene.add(ambient_light);

// const directional_light = new THREE.DirectionalLight(0xffffff, 5);
// directional_light.position.set(0, 0, 2);
// scene.add(directional_light);
// const helper = new THREE.DirectionalLightHelper( directional_light, 1 );
// scene.add( helper );
// const spotlight = new THREE.SpotLight(0xffffff, 0.1);
// spotlight.position.set(1, 1, 0);
// spotlight.target.position.set(1.2, 1, 0);
// scene.add(spotlight);

// directional_light.castShadow = true;
// spotlight.castShadow = true;

let angle = 0;

function animate() {
  requestAnimationFrame(animate);

  sphere.rotation.y += 0.001;

  sphere.scale.z = suncontrol.z;
  sphere.rotation.x = suncontrol.x;
  sphere.position.y = suncontrol.y;

  angle += 0.05;

  const earthOrbitRadius = 8;
  const earthOrbitSpeed = 0.3;
  earth.position.x = Math.cos(angle * earthOrbitSpeed) * earthOrbitRadius;
  earth.position.z = Math.sin(angle * earthOrbitSpeed) * earthOrbitRadius;

  const merkuriusOrbitRadius = 4;
  const merkuriusOrbitSpeed = 0.3;
  merkurius.position.x = Math.cos(angle * merkuriusOrbitSpeed) * merkuriusOrbitRadius;
  merkurius.position.z = Math.sin(angle * merkuriusOrbitSpeed) * merkuriusOrbitRadius;

  const venusOrbitRadius = 6;
  const venusOrbitSpeed = 0.3;
  venus.position.x = Math.cos(angle * venusOrbitSpeed) * venusOrbitRadius;
  venus.position.z = Math.sin(angle * venusOrbitSpeed) * venusOrbitRadius;

  const marsOrbitRadius = 10;
  const marsOrbitSpeed = 0.3;
  mars.position.x = Math.cos(angle * marsOrbitSpeed) * marsOrbitRadius;
  mars.position.z = Math.sin(angle * marsOrbitSpeed) * marsOrbitRadius;

  const jupiterOrbitRadius = 12;
  const jupiterOrbitSpeed = 0.3;
  jupiter.position.x = Math.cos(angle * jupiterOrbitSpeed) * jupiterOrbitRadius;
  jupiter.position.z = Math.sin(angle * jupiterOrbitSpeed) * jupiterOrbitRadius;

  const saturnusOrbitRadius = 14;
  const saturnusOrbitSpeed = 0.3;
  saturnus.position.x = Math.cos(angle * saturnusOrbitSpeed) * saturnusOrbitRadius;
  saturnus.position.z = Math.sin(angle * saturnusOrbitSpeed) * saturnusOrbitRadius;
  torus.position.copy(saturnus.position);

  const neptunusOrbitRadius = 16;
  const neptunusOrbitSpeed = 0.3;
  neptunus.position.x = Math.cos(angle * neptunusOrbitSpeed) * neptunusOrbitRadius;
  neptunus.position.z = Math.sin(angle * neptunusOrbitSpeed) * neptunusOrbitRadius;

  const uranusOrbitRadius = 18;
  const uranusOrbitSpeed = 0.3;
  uranus.position.x = Math.cos(angle * uranusOrbitSpeed) * uranusOrbitRadius;
  uranus.position.z = Math.sin(angle * uranusOrbitSpeed) * uranusOrbitRadius;

  // earthearthAndTorus.rotation.y += 0.005;

  // torus.position.copy(earth.position);

  // torus.rotation.x = torusControl.x;
  // torus.position.y = torusControl.y;
  // earth.rotation.x = torusControl.x;
  // earth.position.y = torusControl.y;

  renderer.render(scene, camera);
}

animate();
