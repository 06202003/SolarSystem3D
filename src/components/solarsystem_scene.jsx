import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import earthtex from '../assets/textures/earth.jpg';
import saturnRingtex from '../assets/textures/torus.jpg';
import suntex from '../assets/textures/sun.jpg';
import mercurytex from '../assets/textures/mercury.jpg';
import venustex from '../assets/textures/venus.jpg';
import marstex from '../assets/textures/mars.jpg';
import jupitertex from '../assets/textures/jupiter.jpg';
import neptunetex from '../assets/textures/neptunus.jpg';
import saturntex from '../assets/textures/saturnus.jpg';
import uranustex from '../assets/textures/uranus.jpg';
import uranusRingtex from '../assets/textures/uranusring.jpg';

const ThreeScene = () => {
  const canvasRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    const orbit = new OrbitControls(camera, renderer.domElement);

    camera.position.set(0, 140, 140);
    orbit.update();

    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const sunGeo = new THREE.SphereGeometry(16, 30, 30);
    const sunMat = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(suntex),
    });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sun);

    function createPlanet(size, texture, position, ring) {
      const geo = new THREE.SphereGeometry(size, 30, 30);
      const mat = new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load(texture),
      });
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, mat);
      const obj = new THREE.Object3D();
      obj.add(mesh);
      if (ring) {
        const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader().load(ring.texture),
          side: THREE.DoubleSide,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotation.x = -0.5 * Math.PI;
      }
      scene.add(obj);
      mesh.position.x = position;
      return { mesh, obj };
    }

    const mercury = createPlanet(3.2, mercurytex, 28);
    const venus = createPlanet(5.8, venustex, 44);
    const earth = createPlanet(6, earthtex, 62);
    const mars = createPlanet(4, marstex, 78);
    const jupiter = createPlanet(12, jupitertex, 100);
    const saturn = createPlanet(10, saturntex, 138, {
      innerRadius: 10,
      outerRadius: 20,
      texture: saturnRingtex,
    });
    const uranus = createPlanet(7, uranustex, 176, {
      innerRadius: 7,
      outerRadius: 12,
      texture: uranusRingtex,
    });
    const neptune = createPlanet(7, neptunetex, 200);

    const pointLight = new THREE.PointLight(0xffffff, 2000, 1000);
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

      mercury.obj.rotateY(0.04);
      venus.obj.rotateY(0.015);
      earth.obj.rotateY(0.01);
      mars.obj.rotateY(0.008);
      jupiter.obj.rotateY(0.002);
      saturn.obj.rotateY(0.0009);
      uranus.obj.rotateY(0.0004);
      neptune.obj.rotateY(0.0001);

      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.setAnimationLoop(null);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default ThreeScene;
