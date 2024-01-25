import * as THREE from "three";
import { GLTFLoader } from "gltfloader";

export class Astronaut {
  constructor(solarSystem, path) {
    this.solarSystem = solarSystem;
    this.path = path;
    this.loader = new GLTFLoader();

    // Add onChange to CheckBox
    this.toggleCamera = document.getElementById("toggleCamera");
    this.toggleCamera.addEventListener("change", () => this.toggleCameraMode());

    // Load Astronaut
    this.loader.load(
      this.path,
      (gltf) => {
        this.mixer = new THREE.AnimationMixer(gltf.scene); // Control Animation
        this.action = this.mixer.clipAction(gltf.animations[3]);
        this.action.play(); // Play Animation
        this.model = gltf.scene.children[0];
        this.model.scale.set(1, 1, 1);
        this.model.position.set(18, 0, 0);
        this.solarSystem.scene.add(this.model);
      },
      (xhr) => {
        // XMLHttpRequest
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.error("Error loading GLB", error);
      }
    );

    // Control Astronaut
    window.addEventListener("keydown", (event) => {
      const moveDistance = 0.2;

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
        case "q":
          this.model.position.y -= moveDistance;
          break;
        case "e":
          this.model.position.y += moveDistance;
          break;
      }
    });
  }

  // Switch Mode
  toggleCameraMode() {
    this.solarSystem.mode = !this.solarSystem.mode;

    if (this.solarSystem.mode) {
      // this.updateCameraPosition();
      this.solarSystem.orbit.enabled = false;
    } else {
      this.solarSystem.orbit.enabled = true;
    }
  }

  // Set Camera
  updateCameraPosition() {
    const modelPosition = this.model.position.clone();
    const offset = new THREE.Vector3(0, 2, -10);
    const cameraPosition = modelPosition.clone().add(offset);
    this.solarSystem.camera.position.copy(cameraPosition);
    this.solarSystem.camera.lookAt(modelPosition);
  }
}
