import * as THREE from "three";
import { FontLoader } from "fontloader";
import { TextGeometry } from "textgeometry";
import { Zoom } from "zoom";

export class Planet {
  constructor(SolarSystem, size, texture, position, name, speed) {
    this.SolarSystem = SolarSystem;
    this.parameters = {
      size: size,
      texture: texture,
      position: position,
      speed: speed,
    };
    this.name = name;
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
    // this.mesh.onClick = function () {
    //   const zoom = new Zoom(this);
    //   zoom.zoomAndShow();
    // };

    this.mesh.position.x = position;
    this.createPlanetLabel();
  }

  //
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

  //
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
    this.orbitPath = new THREE.Line(orbitGeometry, orbitMaterial);
    this.orbitPath.rotation.x = -0.5 * Math.PI;
    this.SolarSystem.scene.add(this.orbitPath);
  }
  createPlanetLabel() {
    const fontLoader = new FontLoader();
    const text = this.name;
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
    const folder = gui.addFolder(this.name);

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
            const zoom = new Zoom(this);
            zoom.zoomAndShow();
          },
        },
        "popup"
      )
      .name("Show Info & Zoom");

    folder.close();
  }

  hide() {
    this.obj.visible = false;
  }
  show() {
    this.obj.visible = true;
  }
}
