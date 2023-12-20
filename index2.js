import * as THREE from 'three';
import { OrbitControls } from 'orbitcontrols';

// Textures
const earthtex = new THREE.TextureLoader().load('texture/earth.jpg');
const saturnRingtex = new THREE.TextureLoader().load('texture/torus.jpg');
const suntex = new THREE.TextureLoader().load('texture/sun.jpg');
const mercurytex = new THREE.TextureLoader().load('texture/mercury.jpg');
const venustex = new THREE.TextureLoader().load('texture/venus.jpg');
const marstex = new THREE.TextureLoader().load('texture/mars.jpg');
const jupitertex = new THREE.TextureLoader().load('texture/jupiter.jpg');
const neptunetex = new THREE.TextureLoader().load('texture/neptunus.jpg');
const saturntex = new THREE.TextureLoader().load('texture/saturnus.jpg');
const uranustex = new THREE.TextureLoader().load('texture/uranus.jpg');
const uranusRingtex = new THREE.TextureLoader().load('texture/uranusring.jpg');

var viewport = document.getElementById('viewport');
// var canvas = document.getElementById('canvas');

// Mengambil tinggi dan lebar dari elemen canvas
var canvasHeight = viewport.height * 5;
var canvasWidth = viewport.width * 5;
var renderer = new THREE.WebGLRenderer({ canvas: viewport, antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setSize(canvasWidth, canvasHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// const renderer = new THREE.WebGLRenderer({antialias: true});

// renderer.setSize(window.innerWidth, window.innerHeight);

// document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / innerHeight, 0.1, 1000);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
  map: suntex,
});
const sun = new THREE.Mesh(sunGeo, sunMat);
sun.onClick = function () {
  // Handle the click event for this planet
  displayPopup('Sun');
};
scene.add(sun);

function createPlanet(size, texture, position, ring, name) {
  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: texture,
  });
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = name; // Assign a name to the mesh for identification
  mesh.onClick = function () {
    // Handle the click event for this planet
    displayPopup(name);
  };
  const obj = new THREE.Object3D();
  obj.add(mesh);
  if (ring) {
    const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      map: ring.texture,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    obj.add(ringMesh);
    ringMesh.position.x = position;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(obj);
  mesh.position.x = position;
  return { mesh, obj };
}

// function displayPopup(planetName) {
//   // You can replace this with your preferred way of displaying a popup, such as a modal or toaster
//   alert('You clicked on ' + planetName);
// }

function displayPopup(planetName) {
  // Create a modal element
  const modal = document.createElement('div');
  modal.classList.add('modal', 'fade');
  modal.id = 'planetModal';
  modal.innerHTML = `
    <div class="modal-dialog  modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${planetName}</h5>
        </div>
        <div class="modal-body">
          <!-- Add your content here -->
          <p>Planet details for ${planetName} go here.</p>
        </div>
      </div>
    </div>
  `;

  // Append the modal to the document
  document.body.appendChild(modal);

  // Show the modal using Bootstrap's modal function
  $(`#${modal.id}`).modal('show');

  // Remove the modal from the DOM when it is closed
  $(`#${modal.id}`).on('hidden.bs.modal', function () {
    // Ensure the modal is removed only once
    $(this).data('bs.modal', null);
    modal.remove();
  });
}

viewport.addEventListener('click', function (event) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / canvasWidth) * 2 - 1;
  mouse.y = -(event.clientY / canvasHeight) * 2 + 1;

  // Raycast from camera to intersect objects
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  // Check if any objects were intersected
  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;

    // Check if the clicked object has an onClick function
    if (clickedObject.onClick) {
      clickedObject.onClick();
    }
  }
});

const mercury = createPlanet(3.2, mercurytex, 28, null, 'Mercury');
const venus = createPlanet(5.8, venustex, 44, null, 'Venus');
const earth = createPlanet(6, earthtex, 62, null, 'Earth');
const mars = createPlanet(4, marstex, 78, null, 'Mars');
const jupiter = createPlanet(12, jupitertex, 100, null, 'Jupyter');
const saturn = createPlanet(
  10,
  saturntex,
  138,
  {
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingtex,
  },
  'Saturn'
);
const uranus = createPlanet(
  7,
  uranustex,
  176,
  {
    innerRadius: 7,
    outerRadius: 12,
    texture: uranusRingtex,
  },
  'Uranus'
);
const neptune = createPlanet(7, neptunetex, 200, null, 'Neptune');

const pointLight = new THREE.PointLight(0xffffff, 10000, 1000);
// pointLight.position.set(100,0,0);
scene.add(pointLight);
scene.add(new THREE.PointLightHelper(pointLight, 0.2, 0x00ff00));

function animate() {
  sun.rotateY(0.004);
  mercury.mesh.rotateY(0.004);
  venus.mesh.rotateY(0.002);
  earth.mesh.rotateY(0.02);
  mars.mesh.rotateY(0.018);
  jupiter.mesh.rotateY(0.04);
  saturn.mesh.rotateY(0.038);
  uranus.mesh.rotateY(0.03);
  neptune.mesh.rotateY(0.032);

  mercury.obj.rotateY(0.02);
  venus.obj.rotateY(0.015);
  earth.obj.rotateY(0.01);
  mars.obj.rotateY(0.008);
  jupiter.obj.rotateY(0.002);
  saturn.obj.rotateY(0.0009);
  uranus.obj.rotateY(0.0004);
  neptune.obj.rotateY(0.0001);

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = this.window.innerWidth / this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
