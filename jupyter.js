import * as THREE from 'three';
import { OrbitControls } from 'orbitcontrols';

const jupitertex = new THREE.TextureLoader().load('../texture/jupiter.jpg');
const satelliteTexture = new THREE.TextureLoader().load('../texture/jupytersatelite.jpg');

var viewport = document.getElementById('viewport');

var canvasHeight = viewport.height * 5;
var canvasWidth = viewport.width * 5;
var renderer = new THREE.WebGLRenderer({ canvas: viewport, antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setSize(canvasWidth, canvasHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 0, 300); // Adjusted camera position to focus on Jupiter
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

function createPlanet(radius, texture, distance, speed, name) {
  const planetGeometry = new THREE.SphereGeometry(radius, 32, 32);
  const planetMaterial = new THREE.MeshBasicMaterial({ map: texture });
  const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);

  const planetPosition = getRandomPosition(distance); // Get a random position around Jupiter
  planetMesh.position.copy(planetPosition);

  const planetObject = new THREE.Object3D();
  planetObject.add(planetMesh);

  scene.add(planetObject);

  return { mesh: planetMesh, obj: planetObject, distance: distance, angle: Math.random() * Math.PI * 2 };
}

// Function to get a random position around Jupiter
function getRandomPosition(distance) {
  const phi = Math.random() * Math.PI; // Random polar angle
  const theta = Math.random() * 2 * Math.PI; // Random azimuthal angle

  const x = distance * Math.sin(phi) * Math.cos(theta);
  const y = distance * Math.sin(phi) * Math.sin(theta);
  const z = distance * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// Usage:
const jupiter = createPlanet(50, jupitertex, 0, 0.002, 'Jupiter'); // Change the radius to 25

// Create 79 satellites
const satellites = [];
for (let i = 0; i < 79; i++) {
  const satelliteRadius = Math.random() * 2 + 1; // Reduce the radius
  const satelliteDistance = Math.random() * 150 + 80; // Increase the distance from Jupiter for more scattering

  const satellite = createPlanet(satelliteRadius, satelliteTexture, satelliteDistance, 0.005, `Satellite${i + 1}`);
  satellites.push(satellite);
}

// In the animate function, update the position of each satellite
function animateSatellites() {
  for (const satellite of satellites) {
    const angleIncrement = 0.005; // Adjust the speed of orbit
    satellite.angle += angleIncrement;
    const x = Math.cos(satellite.angle) * satellite.distance;
    const z = Math.sin(satellite.angle) * satellite.distance;
    satellite.mesh.position.set(x, satellite.mesh.position.y, z);

    satellite.mesh.rotateY(0.005);
    satellite.obj.rotateY(0.002);
  }
}

// Add satellites to the scene
for (const satellite of satellites) {
  scene.add(satellite.obj);
}

// Add light as a representation of sunlight
const pointLight = new THREE.PointLight(0xffffff, 10000, 1000);
scene.add(pointLight);
scene.add(new THREE.PointLightHelper(pointLight, 0.2, 0x00ff00));

// Animation to make the planet rotate and revolve
function animate() {
  jupiter.mesh.rotateY(0.005);
  jupiter.obj.rotateY(0.002);

  animateSatellites();

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(() => {
  animate();
  renderer.render(scene, camera);
});

// Adjust the camera aspect ratio on window resize
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
