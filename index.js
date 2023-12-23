import * as THREE from 'three';
import { OrbitControls } from 'orbitcontrols';
import TWEEN from '@tweenjs/tween.js';

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

var canvasHeight = viewport.height * 5;
var canvasWidth = viewport.width * 5;
var renderer = new THREE.WebGLRenderer({ canvas: viewport, antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setSize(canvasWidth, canvasHeight);
renderer.setPixelRatio(window.devicePixelRatio);



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
  const obj = new THREE.Object3D();
  obj.add(mesh);
  mesh.onClick = function () {
    displayPopup(name);
    stopRotationAndFocus(obj);
  }
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
  return { mesh, obj, name };
}



let state = true;
function stopRotationAndFocus(planet) {
  state=false;

  const planetsToHide = [
      mercury.obj,
      venus.obj,
      earth.obj,
      mars.obj,
      jupiter.obj,
      saturn.obj,
      uranus.obj,
      neptune.obj
  ];
  console.log(planet);
  // Sembunyikan planet-planet yang tidak difokuskan
  planetsToHide.forEach(otherPlanet => {
      if (otherPlanet !== planet) {
          otherPlanet.visible = false;
      }

  });


  const planetPosition = planet.children[0].position;
  const distance = planet.children[0].geometry.parameters.radius * 4; 
  const newCameraPosition = new THREE.Vector3().copy(planetPosition).add(new THREE.Vector3(distance, distance, distance));

  // Animasi perpindahan kamera
  new TWEEN.Tween(camera.position)
      .to({
          x: newCameraPosition.x,
          y: newCameraPosition.y,
          z: newCameraPosition.z
      }, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();
  
  // Perbarui kontrol orbit jika digunakan
  orbit.target = planetPosition.clone();
  console.log(planetPosition);
}


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
    showAllPlanets();
    state=true;
  });
}

function showAllPlanets() {
  const allPlanets = [
      mercury.obj,
      venus.obj,
      earth.obj,
      mars.obj,
      jupiter.obj,
      saturn.obj,
      uranus.obj,
      neptune.obj
  ];

  // Tampilkan kembali semua planet
  allPlanets.forEach(planet => {
      planet.visible = true;
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

const mercury = createPlanet(3.2, mercurytex, 28, null, 'mercury');
const venus = createPlanet(5.8, venustex, 44, null, 'venus');
const earth = createPlanet(6, earthtex, 62, null, 'earth');
const mars = createPlanet(4, marstex, 78, null, 'mars');
const jupiter = createPlanet(12, jupitertex, 100, null, 'jupiter');
const saturn = createPlanet(
  10,
  saturntex,
  138,
  {
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingtex,
  },
  'saturn'
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
  'uranus'
);
const neptune = createPlanet(7, neptunetex, 200, null, 'neptune');

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

  if(state==true){
    mercury.obj.rotateY(0.04);
    venus.obj.rotateY(0.015);
    earth.obj.rotateY(0.01);
    mars.obj.rotateY(0.008);
    jupiter.obj.rotateY(0.002);
    saturn.obj.rotateY(0.0009);
    uranus.obj.rotateY(0.0004);
    neptune.obj.rotateY(0.0001);
}

else{
    mercury.obj.rotation.y = 0;
    venus.obj.rotation.y = 0;
    earth.obj.rotation.y = 0;
    mars.obj.rotation.y = 0;
    jupiter.obj.rotation.y = 0;
    saturn.obj.rotation.y = 0;
    uranus.obj.rotation.y = 0;
    neptune.obj.rotation.y = 0;
}
orbit.update();
  TWEEN.update()

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = this.window.innerWidth / this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
