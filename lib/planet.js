import * as THREE from "three";
import { FontLoader } from "fontloader";
import { TextGeometry } from "textgeometry";
import { OrbitControls } from "orbitcontrols";
import { GLTFLoader } from "gltfloader";
import TWEEN from "@tweenjs/tween.js";
import data from "../planet.json" assert { type: "json" };

export class SolarSystem {
  constructor(viewport) {
    this.state = true;
    this.zoom;
    this.viewport = viewport;
    const canvasHeight = this.viewport.height * 5;

    const canvasWidth = this.viewport.width * 5;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.viewport,
      antialias: true,
      alpha: true,
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(canvasWidth, canvasHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.model;
    this.modelStatus;

    const loader = new GLTFLoader();
    this.scene = new THREE.Scene();
    let self = this;
    const glbPath = "./assets/employee.glb";
    loader.load(
      glbPath,
      (gltf) => {
        this.model = gltf.scene;

        this.model.scale.set(10, 10, 10);

        this.scene.add(this.model);
        this.modelStatus = true;
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.error("Error loading GLB", error);
      }
    );
    window.addEventListener("keydown", (event) => {
      const moveDistance = 1; // Jarak pergerakan objek

      switch (event.key) {
        case "w":
          this.model.position.z -= moveDistance;
          break;
        case "s":
          this.model.position.z += moveDistance;
          break;
        case "a":
          this.model.position.x -= moveDistance;
          break;
        case "d":
          this.model.position.x += moveDistance;
          break;
        // Tambahan kontrol sesuai kebutuhan
      }
    });

    // Besarnya gaya gravitasi

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / innerHeight,
      0.1,
      1000
    );

    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);

    this.camera.position.set(50, 200, 250);
    this.orbit.update();

    this.viewport.addEventListener("click", function (event) {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      mouse.x = (event.clientX / canvasWidth) * 2 - 1;
      mouse.y = -(event.clientY / canvasHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, self.camera);
      const intersects = raycaster.intersectObjects(self.scene.children, true);

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;

        if (clickedObject.onClick) {
          clickedObject.onClick();
        }
      }
    });
  }
}

export class Sun {
  constructor(SolarSystem, size, texture) {
    this.SolarSystem = SolarSystem;
    this.parameters = {
      size: size,
      texture: texture,
    };
    const sunGeo = new THREE.SphereGeometry(size, 30, 30);
    const sunMat = new THREE.MeshBasicMaterial({
      map: texture,
    });
    this.name = "Sun";
    this.mesh = new THREE.Mesh(sunGeo, sunMat);
    this.SolarSystem.scene.add(this.mesh);
    const self = this;
    this.mesh.onClick = function () {
      self.displayPopup();
    };
  }

  displayPopup() {
    const planetInfo = data[this.name] || {
      description: "No information available.",
    };
    const modal = document.createElement("div");
    modal.classList.add("modal", "fade", "planet-modal");
    modal.id = "planetModal";
    modal.innerHTML = `
    <div class="modal-dialog  modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${planetInfo.name}</h5>
          </div>
          <div class="modal-body">
            <p><strong>Mass:</strong> ${planetInfo.mass}</p>
            <p><strong>Satellites:</strong> ${planetInfo.satellites}</p>
            <p><strong>Diameter:</strong> ${planetInfo.diameter}</p>
            <p><strong>Atmosphere Composition:</strong> ${planetInfo.atmosphereComposition}</p>
            <p><strong>Gravity:</strong> ${planetInfo.gravity}</p>
            <p><strong>Surface Temperature:</strong> ${planetInfo.surfaceTemperature}</p>
            <p><strong>Rotation Period:</strong> ${planetInfo.rotationPeriod}</p>
            <p><strong>Revolution Period:</strong> ${planetInfo.revolutionPeriod}</p>
            <p><strong>Distance From Sun:</strong> ${planetInfo.distanceFromSun}</p>
          </div>
        </div>
      </div>
  `;

    document.body.appendChild(modal);

    $(`#${modal.id}`).modal("show");

    $(`#${modal.id}`).on("hidden.bs.modal", function () {
      $(this).data("bs.modal", null);
      modal.remove();

      $(".modal-backdrop").remove();
      $("body").removeClass("modal-open");
    });
  }
}

export class Planet {
  constructor(SolarSystem, size, texture, position, name, speed) {
    this.SolarSystem = SolarSystem;
    this.parameters = {
      size: size,
      texture: texture,
      position: position,
      name: name,
      speed: speed,
    };
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
      map: texture,
    });
    geo.computeVertexNormals();
    this.mesh = new THREE.Mesh(geo, mat);
    this.obj = new THREE.Object3D();

    this.obj.add(this.mesh);
    this.SolarSystem.scene.add(this.obj);
    const self = this;
    this.mesh.onClick = function () {
      self.displayPopup();
      self.SolarSystem.zoom = self.obj;
      self.zoom();
      self.SolarSystem.state = false;
    };

    this.mesh.position.x = position;
    this.createPlanetLabel();
  }
  createRing(ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: ring.texture,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    this.obj.add(ringMesh);
    ringMesh.position.x = this.parameters.position;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  createOrbit() {
    const orbitCurve = new THREE.EllipseCurve(
      0,
      0,
      this.parameters.position,
      this.parameters.position,
      0,
      2 * Math.PI,
      false,
      0
    );
    const points = orbitCurve.getPoints(100);
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const orbitPath = new THREE.Line(orbitGeometry, orbitMaterial);
    orbitPath.rotation.x = -0.5 * Math.PI;
    this.SolarSystem.scene.add(orbitPath);
  }
  createPlanetLabel() {
    const fontLoader = new FontLoader();
    const text = this.parameters.name;
    const mesh = this.mesh.position;
    const obj = this.obj;
    fontLoader.load(
      "./node_modules/three/examples/fonts/helvetiker_regular.typeface.json",
      function (font) {
        const textGeometry = new TextGeometry(text, {
          font: font,
          size: 3,
          height: 0.1,
        });

        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        textMesh.position.copy(mesh);
        textMesh.position.y += 15;
        obj.add(textMesh);
      }
    );
  }

  addPlanetControls(gui) {
    const folder = gui.addFolder(this.parameters.name);

    folder
      .add({ speed: this.parameters.speed }, "speed", 0.0001, 0.03)
      .name("Rotation Speed")
      .onChange((value) => {
        this.parameters.speed = value;
      });

    folder
      .add({ scaleXY: 1 }, "scaleXY", 1, 3)
      .name("Scale X & Y")
      .onChange((value) => {
        this.mesh.scale.x = value;
        this.mesh.scale.y = value;
        this.mesh.scale.z = value;
      });

    folder
      .add(
        {
          popup: () => {
            this.displayPopup();
            this.zoom();
            this.SolarSystem.zoom = this.obj;
            this.SolarSystem.state = false;
          },
        },
        "popup"
      )
      .name("Show Info & Zoom");

    folder.close();
  }
  displayPopup() {
    const planetInfo = data[this.parameters.name] || {
      description: "No information available.",
    };
    const modal = document.createElement("div");
    modal.classList.add("modal", "fade", "planet-modal");
    modal.id = "planetModal";
    modal.innerHTML = `
    <div class="modal-dialog  modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${planetInfo.name}</h5>
          </div>
          <div class="modal-body">
            <p><strong>Mass:</strong> ${planetInfo.mass}</p>
            <p><strong>Satellites:</strong> ${planetInfo.satellites}</p>
            <p><strong>Diameter:</strong> ${planetInfo.diameter}</p>
            <p><strong>Atmosphere Composition:</strong> ${planetInfo.atmosphereComposition}</p>
            <p><strong>Gravity:</strong> ${planetInfo.gravity}</p>
            <p><strong>Surface Temperature:</strong> ${planetInfo.surfaceTemperature}</p>
            <p><strong>Rotation Period:</strong> ${planetInfo.rotationPeriod}</p>
            <p><strong>Revolution Period:</strong> ${planetInfo.revolutionPeriod}</p>
            <p><strong>Distance From Sun:</strong> ${planetInfo.distanceFromSun}</p>
          </div>
        </div>
      </div>
  `;

    document.body.appendChild(modal);

    $(`#${modal.id}`).modal("show");
    const self = this;
    $(`#${modal.id}`).on("hidden.bs.modal", function () {
      $(this).data("bs.modal", null);
      modal.remove();

      $(".modal-backdrop").remove();
      $("body").removeClass("modal-open");
      self.SolarSystem.state = true;
    });
  }

  createMoon(size, texture, orbitRadius, orbitSpeed, orbitInclination) {
    const moonGeo = new THREE.SphereGeometry(size, 30, 30);
    const moonMat = new THREE.MeshStandardMaterial({
      map: texture,
    });
    moonGeo.computeVertexNormals();
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);

    const pivotPosition = this.mesh.position;
    const relativePosition = new THREE.Vector3(orbitRadius, 0, 0);

    moonMesh.position.copy(pivotPosition.clone().add(relativePosition));

    this.obj.add(moonMesh);

    return {
      mesh: moonMesh,
      radius: orbitRadius,
      speed: orbitSpeed,
      inclination: orbitInclination,
      angle: Math.random() * Math.PI * 2,
      pivot: pivotPosition,
    };
  }
  hide() {
    this.obj.visible = false;
  }
  show() {
    this.obj.visible = true;
  }
  zoom() {
    const planetPosition = this.mesh.position;
    const distance = this.mesh.geometry.parameters.radius * 4;
    const newCameraPosition = new THREE.Vector3()
      .copy(planetPosition)
      .add(new THREE.Vector3(distance, distance, distance));

    new TWEEN.Tween(this.SolarSystem.camera.position)
      .to(
        {
          x: newCameraPosition.x - 30,
          y: newCameraPosition.y,
          z: newCameraPosition.z,
        },
        1000
      )
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();

    this.SolarSystem.orbit.target = planetPosition.clone();
  }
}
