import * as THREE from "three";
import { OrbitControls } from "orbitcontrols";

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

    this.scene = new THREE.Scene();
    this.mode;

    let self = this;

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / innerHeight,
      0.1,
      1000
    );

    // Set OrbitControls
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbit.target.set(0, 0, 0);
    this.orbit.minDistance = 60;
    this.orbit.maxDistance = 500;
    this.orbit.enablePan = false;

    this.camera.position.set(50, 200, 250);
    this.orbit.update();

    //
    // this.viewport.addEventListener("click", function (event) {
    //   const raycaster = new THREE.Raycaster();
    //   const mouse = new THREE.Vector2();

    //   mouse.x = (event.clientX / canvasWidth) * 2 - 1;
    //   mouse.y = -(event.clientY / canvasHeight) * 2 + 1;

    //   raycaster.setFromCamera(mouse, self.camera);
    //   const intersects = raycaster.intersectObjects(self.scene.children, true);

    //   if (intersects.length > 0) {
    //     const clickedObject = intersects[0].object;

    //     if (clickedObject.onClick) {
    //       clickedObject.onClick();
    //     }
    //   }
    // });
  }
}
