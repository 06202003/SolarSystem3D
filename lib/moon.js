import * as THREE from "three";

export class Moon {
  constructor(planet, size, texture, orbitRadius, orbitSpeed) {
    this.planet = planet;
    this.size = size;
    this.texture = texture;
    this.orbitRadius = orbitRadius;
    this.orbitSpeed = orbitSpeed;
    this.angle = Math.PI * 2;

    const moonGeo = new THREE.SphereGeometry(size, 30, 30);
    const moonMat = new THREE.MeshStandardMaterial({
      map: this.texture,
    });
    moonGeo.computeVertexNormals();
    this.moonMesh = new THREE.Mesh(moonGeo, moonMat);

    this.pivotPosition = this.planet.mesh.position;
    const relativePosition = new THREE.Vector3(orbitRadius, 0, 0);

    this.moonMesh.position.copy(
      this.pivotPosition.clone().add(relativePosition)
    );

    this.planet.obj.add(this.moonMesh);
  }
  animate() {
    this.angle += this.orbitSpeed;
    const x = Math.cos(this.angle) * this.orbitRadius;
    const z = Math.sin(this.angle) * this.orbitRadius;
    this.moonMesh.position.set(
      x + this.pivotPosition.x,
      this.pivotPosition.y,
      z + this.pivotPosition.z
    );
  }
}
