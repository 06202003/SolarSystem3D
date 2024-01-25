import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import data from "../planet.json" assert { type: "json" };

export class Zoom {
  constructor(planet) {
    this.planet = planet;
  }

  // Zoom Using Tween
  zoomOnly() {
    const planetPosition = this.planet.mesh.position;
    const distance = this.planet.mesh.geometry.parameters.radius * 4;
    const newCameraPosition = new THREE.Vector3()
      .copy(planetPosition)
      .add(new THREE.Vector3(distance, distance, distance));

    new TWEEN.Tween(this.planet.SolarSystem.camera.position)
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

    this.planet.SolarSystem.orbit.target = planetPosition.clone();
  }
  displayPopup() {
    const planetInfo = data[this.planet.name] || {
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
      self.planet.SolarSystem.state = true;
      self.planet.orbitPath.material.color.set(0xffffff);
      // this.planet.SolarSystem.orbit.target.set(0, 0, 0);
      // const initialCameraPosition = (50, 200, 250);
      // const initialOrbitTarget = (0, 0, 0);
      new TWEEN.Tween(self.planet.SolarSystem.camera.position)
        .to(
          {
            x: 50,
            y: 200,
            z: 250,
          },
          1000
        )
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();

      new TWEEN.Tween(self.planet.SolarSystem.orbit.target)
        .to(
          {
            x: 0,
            y: 0,
            z: 0,
          },
          1000
        )
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
    });
  }
  zoomAndShow() {
    this.planet.SolarSystem.state = false;
    this.displayPopup();
    this.planet.SolarSystem.zoom = this.planet.obj;
    this.zoomOnly();
    this.planet.orbitPath.material.color.set(0x00ff00);
  }
}
