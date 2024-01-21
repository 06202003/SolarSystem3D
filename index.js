import * as THREE from "three";
import { OrbitControls } from "orbitcontrols";
import TWEEN from "@tweenjs/tween.js";
import { Planet, Sun, SolarSystem } from "planet";

const earthtex = new THREE.TextureLoader().load("texture/earth.jpg");
const saturnRingtex = new THREE.TextureLoader().load("texture/torus.jpg");
const suntex = new THREE.TextureLoader().load("texture/sun.jpg");
const mercurytex = new THREE.TextureLoader().load("texture/mercury.jpg");
const venustex = new THREE.TextureLoader().load("texture/venus.jpg");
const marstex = new THREE.TextureLoader().load("texture/mars.jpg");
const jupitertex = new THREE.TextureLoader().load("texture/jupiter.jpg");
const neptunetex = new THREE.TextureLoader().load("texture/neptunus.jpg");
const saturntex = new THREE.TextureLoader().load("texture/saturnus.jpg");
const saturnRingtex2 = new THREE.TextureLoader().load("texture/saturnring.jpg");
const uranustex = new THREE.TextureLoader().load("texture/uranus.jpg");
const uranusRingtex = new THREE.TextureLoader().load("texture/uranusring.jpg");
const moonTexture = new THREE.TextureLoader().load("texture/moon.jpeg");

let viewport = document.getElementById("viewport");
let solarSystem = new SolarSystem(viewport);

const gui = new dat.GUI();

//light
const ambientLight = new THREE.AmbientLight(0x333333);
solarSystem.scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 10000, 1000);
solarSystem.scene.add(pointLight);
solarSystem.scene.add(new THREE.PointLightHelper(pointLight, 0.2, 0x00ff00));

//sun
const sun = new Sun(solarSystem, 16, suntex);

//planet
const mercury = new Planet(solarSystem, 3.2, mercurytex, 28, "Mercury", 0.02);
mercury.addPlanetControls(gui);
mercury.createOrbit();

const venus = new Planet(solarSystem, 5.8, venustex, 44, "Venus", 0.015);
venus.addPlanetControls(gui);
venus.createOrbit();

const earth = new Planet(solarSystem, 6, earthtex, 62, "Earth", 0.01);
earth.addPlanetControls(gui);
earth.createOrbit();

const mars = new Planet(solarSystem, 4, marstex, 78, "Mars", 0.008);
mars.addPlanetControls(gui);
mars.createOrbit();

const jupiter = new Planet(solarSystem, 12, jupitertex, 100, "Jupyter", 0.002);
jupiter.addPlanetControls(gui);
jupiter.createOrbit();

const saturn = new Planet(solarSystem, 10, saturntex, 138, "Saturn", 0.0009);
saturn.addPlanetControls(gui);
saturn.createOrbit();
saturn.createRing({
  innerRadius: 14,
  outerRadius: 19,
  texture: saturnRingtex,
});
saturn.createRing({
  innerRadius: 19,
  outerRadius: 25,
  texture: saturnRingtex2,
});

const uranus = new Planet(solarSystem, 7, uranustex, 176, "Uranus", 0.0004);
uranus.addPlanetControls(gui);
uranus.createOrbit();
uranus.createRing({
  innerRadius: 9,
  outerRadius: 12,
  texture: uranusRingtex,
});

const neptune = new Planet(solarSystem, 7, neptunetex, 200, "Neptune", 0.0001);
neptune.addPlanetControls(gui);
neptune.createOrbit();

//Moons
// const mercuryMoon = createMoon(1, moonTexture, 8, 0.05, 0.2, mercury);
// const venusMoon = createMoon(1, moonTexture, 12, 0.03, 0.1, venus);
const earthMoon = earth.createMoon(3, moonTexture, 18, 0.02, 0.3);

function animateMoon(moon) {
  moon.angle += moon.speed;
  const x = Math.cos(moon.angle) * moon.radius;
  const z = Math.sin(moon.angle) * moon.radius;
  moon.mesh.position.set(x + moon.pivot.x, moon.pivot.y, z + moon.pivot.z);
}

const allPlanets = [
  mercury,
  venus,
  earth,
  mars,
  jupiter,
  saturn,
  uranus,
  neptune,
];

const gravitationalConstant = 0.25; // Konstanta gravitasi yang lebih lemah untuk simulasi gerakan di Bulan
const jumpForce = 2.5; // Gaya lompatan yang lebih lemah
// let objectPosition = solarSystem.model.position.y;
let objectVelocity = 2.5;
let isJumping = false;

//Animasi agar planer berotasi dan berevolusi
function animate() {
  sun.mesh.rotateY(0.004);
  mercury.mesh.rotateY(0.004);
  venus.mesh.rotateY(0.002);
  earth.mesh.rotateY(0.02);
  mars.mesh.rotateY(0.018);
  jupiter.mesh.rotateY(0.04);
  saturn.mesh.rotateY(0.038);
  uranus.mesh.rotateY(0.03);
  neptune.mesh.rotateY(0.032);

  if (solarSystem.state == true) {
    allPlanets.forEach((planet) => {
      planet.show();
    });
    mercury.obj.rotateY(mercury.parameters.speed);
    venus.obj.rotateY(venus.parameters.speed);
    earth.obj.rotateY(earth.parameters.speed);
    mars.obj.rotateY(mars.parameters.speed);
    jupiter.obj.rotateY(jupiter.parameters.speed);
    saturn.obj.rotateY(saturn.parameters.speed);
    uranus.obj.rotateY(uranus.parameters.speed);
    neptune.obj.rotateY(neptune.parameters.speed);
  } else {
    allPlanets.forEach((otherPlanet) => {
      if (otherPlanet.obj !== solarSystem.zoom) {
        otherPlanet.hide();
      }
    });
    mercury.obj.rotation.set(0, 0, 0);
    venus.obj.rotation.set(0, 0, 0);
    earth.obj.rotation.set(0, 0, 0);
    mars.obj.rotation.set(0, 0, 0);
    jupiter.obj.rotation.set(0, 0, 0);
    saturn.obj.rotation.set(0, 0, 0);
    uranus.obj.rotation.set(0, 0, 0);
    neptune.obj.rotation.set(0, 0, 0);
  }
  if (solarSystem.modelStatus == true) {
    let acceleration = gravitationalConstant;

    if (isJumping) {
      // Jika sedang melompat, kurangi gaya gravitasi saat model di udara
      acceleration *= 0.5;
    }

    objectVelocity -= acceleration;
    solarSystem.model.position.y += objectVelocity;

    if (solarSystem.model.position.y <= 0) {
      solarSystem.model.position.y = 0;
      objectVelocity = 0;
      isJumping = false;
    }
  }

  animateMoon(earthMoon);
  // animateMoon(mercuryMoon);
  // animateMoon(venusMoon);
  TWEEN.update();
  solarSystem.orbit.update();

  solarSystem.renderer.render(solarSystem.scene, solarSystem.camera);
}

solarSystem.renderer.setAnimationLoop(() => {
  animate();
  solarSystem.renderer.render(solarSystem.scene, solarSystem.camera);
});

window.addEventListener("resize", function () {
  solarSystem.camera.aspect = this.window.innerWidth / this.window.innerHeight;
  solarSystem.camera.updateProjectionMatrix();
  solarSystem.renderer.setSize(window.innerWidth, window.innerHeight);
});
