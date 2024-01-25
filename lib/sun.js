import * as THREE from "three";
import { Zoom } from "zoom";

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
      const zoom = new Zoom(self);
      zoom.displayPopup();
    };
  }
}
