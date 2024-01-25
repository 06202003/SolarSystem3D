import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { Planet } from "planet";
import { Sun } from "sun";
import { SolarSystem } from "solarSystem";
import { Moon } from "moon";
import { Astronaut } from "astronaut";
import { Zoom } from "zoom";

//texture
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

//Make SolarSystem
let viewport = document.getElementById("viewport");
let solarSystem = new SolarSystem(viewport);

//light
const ambientLight = new THREE.AmbientLight(0x333333);
solarSystem.scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 10000, 1000);
solarSystem.scene.add(pointLight);
solarSystem.scene.add(new THREE.PointLightHelper(pointLight, 0.2, 0x00ff00));

//sun
const sun = new Sun(solarSystem, 16, suntex);

//planet
const gui = new dat.GUI();

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
const earthMoon = new Moon(earth, 3, moonTexture, 18, 0.02);

//Astronaut(Model)
const astronaut = new Astronaut(solarSystem, "./assets/employee.glb");

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

// Add List Planet to Dropdown
const selectElement = document.getElementById("actionDropdown");
for (let i = 0; i < allPlanets.length; i++) {
  const planetName = allPlanets[i];

  const optionElement = document.createElement("option");
  optionElement.value = planetName.name;
  optionElement.textContent = planetName.name;
  selectElement.appendChild(optionElement);
}

// Animate All
let clock = new THREE.Clock();
function animate() {
  //rotation
  sun.mesh.rotateY(0.004);
  mercury.mesh.rotateY(0.004);
  venus.mesh.rotateY(0.002);
  earth.mesh.rotateY(0.02);
  mars.mesh.rotateY(0.018);
  jupiter.mesh.rotateY(0.04);
  saturn.mesh.rotateY(0.038);
  uranus.mesh.rotateY(0.03);
  neptune.mesh.rotateY(0.032);

  // If not in Zoom Mode
  if (solarSystem.state == true) {
    allPlanets.forEach((planet) => {
      planet.show();
    });

    // Revolution
    mercury.obj.rotateY(mercury.parameters.speed);
    venus.obj.rotateY(venus.parameters.speed);
    earth.obj.rotateY(earth.parameters.speed);
    mars.obj.rotateY(mars.parameters.speed);
    jupiter.obj.rotateY(jupiter.parameters.speed);
    saturn.obj.rotateY(saturn.parameters.speed);
    uranus.obj.rotateY(uranus.parameters.speed);
    neptune.obj.rotateY(neptune.parameters.speed);
    let selected = selectElement.value;

    // If Dropdown Selected
    allPlanets.forEach((planet) => {
      if (planet.name == selected) {
        const zoomPlanet = new Zoom(planet);
        zoomPlanet.zoomAndShow();
        selectElement.value = "default";
      }
    });

    // Focus Mode Astronaut
    if (astronaut.model && solarSystem.mode) {
      astronaut.updateCameraPosition();
    }

    // Highlight Orbit
    if (astronaut.model) {
      let startrange = 0;
      let endrange = 0;
      for (let i = 0; i < allPlanets.length; i++) {
        endrange = allPlanets[i].parameters.position;
        const range = Math.sqrt(
          Math.pow(astronaut.model.position.x, 2) +
            Math.pow(astronaut.model.position.z, 2)
        );
        if (startrange < range && range < endrange) {
          allPlanets[i].orbitPath.material.color.set(0x00ff00);
        } else if (solarSystem.state == true) {
          allPlanets[i].orbitPath.material.color.set(0xffffff);
        }
        startrange = allPlanets[i].parameters.position;
      }
    }
  }
  // Stop and Hide
  else {
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

  // Astronaut Animation
  if (astronaut.mixer) {
    astronaut.mixer.update(clock.getDelta()); //
  }
  earthMoon.animate();
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
