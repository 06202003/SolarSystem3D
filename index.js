import * as THREE from 'three';
import { OrbitControls } from 'orbitcontrols';
import TWEEN from '@tweenjs/tween.js';
import { FontLoader } from 'fontloader';
import { TextGeometry } from 'textgeometry';


//Mengambil JSON dan Texture pada assets
fetch('planet.json')
  .then((response) => response.json())
  .then((data) => {
    const planetData = data;
    const earthtex = new THREE.TextureLoader().load('texture/earth.jpg');
    const saturnRingtex = new THREE.TextureLoader().load('texture/torus.jpg');
    const suntex = new THREE.TextureLoader().load('texture/sun.jpg');
    const mercurytex = new THREE.TextureLoader().load('texture/mercury.jpg');
    const venustex = new THREE.TextureLoader().load('texture/venus.jpg');
    const marstex = new THREE.TextureLoader().load('texture/mars.jpg');
    const jupitertex = new THREE.TextureLoader().load('texture/jupiter.jpg');
    const neptunetex = new THREE.TextureLoader().load('texture/neptunus.jpg');
    const saturntex = new THREE.TextureLoader().load('texture/saturnus.jpg');
    const uranustex = new THREE.TextureLoader().load('texture/uranus.jpg');
    const uranusRingtex = new THREE.TextureLoader().load('texture/uranusring.jpg');
    const moonTexture = new THREE.TextureLoader().load('texture/moon.jpeg');

    var viewport = document.getElementById('viewport');

    var canvasHeight = viewport.height * 5;
    var canvasWidth = viewport.width * 5;
    var renderer = new THREE.WebGLRenderer({ canvas: viewport, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / innerHeight, 0.1, 1000);

    const orbit = new OrbitControls(camera, renderer.domElement);

    camera.position.set(0, 140, 140);
    orbit.update();

    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const textureLoader = new THREE.TextureLoader();

    const sunGeo = new THREE.SphereGeometry(16, 30, 30);
    const sunMat = new THREE.MeshBasicMaterial({
      map: suntex,
    });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.onClick = function () {
      displayPopup('Sun');
    };
    scene.add(sun);


    //Fungsi untuk membuat planet dan ringnya
    function createPlanet(size, texture, position, ring, name) {
      const geo = new THREE.SphereGeometry(size, 30, 30);
      const mat = new THREE.MeshStandardMaterial({
        map: texture,
      });
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, mat);
      const obj = new THREE.Object3D();
      obj.add(mesh);
      mesh.onClick = function () {
        displayPopup(name);
        stopRotationAndFocus(obj);
      };

      const orbitCurve = new THREE.EllipseCurve(0, 0, position, position, 0, 2 * Math.PI, false, 0);

      const points = orbitCurve.getPoints(100);

      const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
      const orbitPath = new THREE.Line(orbitGeometry, orbitMaterial);
      orbitPath.rotation.x = -0.5 * Math.PI;
      scene.add(orbitPath);

      if (ring) {
        const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          map: ring.texture,
          side: THREE.DoubleSide,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotation.x = -0.5 * Math.PI;
      }

      scene.add(obj);
      mesh.position.x = position;
      let text = createPlanetLabel(name, mesh.position, obj);
      return { mesh, obj, name };
    }


    //Fungsi untuk menambahkan label pada planet
    function createPlanetLabel(text, position, object) {
      const fontLoader = new FontLoader();

      fontLoader.load('./node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const textGeometry = new TextGeometry(text, {
          font: font,
          size: 3,
          height: 0.1,
        });

        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        textMesh.position.copy(position);
        textMesh.position.y += 15;
        object.add(textMesh);
      });
    }

    // Fungi untuk menghentikan pergerakan planet ketika satu planet diklik
    let state = true;
    function stopRotationAndFocus(planet) {
      state = false;

      const planetsToHide = [mercury.obj, venus.obj, earth.obj, mars.obj, jupiter.obj, saturn.obj, uranus.obj, neptune.obj];
      console.log(planet);
      planetsToHide.forEach((otherPlanet) => {
        if (otherPlanet !== planet) {
          otherPlanet.visible = false;
        }
      });

      const planetPosition = planet.children[0].position;
      const distance = planet.children[0].geometry.parameters.radius * 4;
      const newCameraPosition = new THREE.Vector3().copy(planetPosition).add(new THREE.Vector3(distance, distance, distance));

      new TWEEN.Tween(camera.position)
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

      orbit.target = planetPosition.clone();
      console.log(planetPosition);
    }


    //Fungsi untuk menampilkan detail planet ketika diklik
    function displayPopup(planetName) {
      const planetInfo = planetData[planetName] || { description: 'No information available.' };
      const modal = document.createElement('div');
      modal.classList.add('modal', 'fade', 'planet-modal');
      modal.id = 'planetModal';
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

      $(`#${modal.id}`).modal('show');

      $(`#${modal.id}`).on('hidden.bs.modal', function () {
        $(this).data('bs.modal', null);
        modal.remove();

        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open');

        showAllPlanets();
        state = true;
      });
    }

    //Fungsi membuat satelit
    function createMoon(size, texture, orbitRadius, orbitSpeed, orbitInclination, parentPlanet) {
      const moonGeo = new THREE.SphereGeometry(size, 30, 30);
      const moonMat = new THREE.MeshStandardMaterial({
        map: texture,
      });
      moonGeo.computeVertexNormals();
      const moonMesh = new THREE.Mesh(moonGeo, moonMat);

      const pivotPosition = parentPlanet.mesh.position; // Mengambil posisi pivot
      const relativePosition = new THREE.Vector3(orbitRadius, 0, 0); // Menghitung posisi relatif
    
      // Atur posisi awal berdasarkan posisi pivot dan posisi relatif
      moonMesh.position.copy(pivotPosition.clone().add(relativePosition));


      // moonMesh.position.copy(parentPlanet.mesh.position);
      // textMesh.position.y += 15;
    
      // Add moon to the parent planet
      parentPlanet.obj.add(moonMesh);
    
      return {
        mesh: moonMesh,
        radius: orbitRadius,
        speed: orbitSpeed,
        inclination: orbitInclination,
        angle: Math.random() * Math.PI * 2,
        pivot: pivotPosition, 
      };
    }
    

    //Fungsi untuk menampilkan kembali semua planet ketika selesai melihat detail planet
    function showAllPlanets() {
      const allPlanets = [mercury.obj, venus.obj, earth.obj, mars.obj, jupiter.obj, saturn.obj, uranus.obj, neptune.obj];

      allPlanets.forEach((planet) => {
        planet.visible = true;
      });
    }

    //Membuat raycaster
    viewport.addEventListener('click', function (event) {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      mouse.x = (event.clientX / canvasWidth) * 2 - 1;
      mouse.y = -(event.clientY / canvasHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;

        if (clickedObject.onClick) {
          clickedObject.onClick();
        }
      }
    });


    //Membuat planet dari fungsi yang sudah ada sebelumnya
    const mercury = createPlanet(3.2, mercurytex, 28, null, 'Mercury');
    const venus = createPlanet(5.8, venustex, 44, null, 'Venus');
    const earth = createPlanet(6, earthtex, 62, null, 'Earth');
    const mars = createPlanet(4, marstex, 78, null, 'Mars');
    const jupiter = createPlanet(12, jupitertex, 100, null, 'Jupyter');
    const saturn = createPlanet(
      10,
      saturntex,
      138,
      {
        innerRadius: 10,
        outerRadius: 20,
        texture: saturnRingtex,
      },
      'Saturn'
    );
    const uranus = createPlanet(
      7,
      uranustex,
      176,
      {
        innerRadius: 7,
        outerRadius: 12,
        texture: uranusRingtex,
      },
      'Uranus'
    );
    const neptune = createPlanet(7, neptunetex, 200, null, 'Neptune');


    const mercuryMoon = createMoon(1, moonTexture, 8, 0.05, 0.2, mercury);
    const venusMoon = createMoon(1, moonTexture, 12, 0.03, 0.1, venus);
    const earthMoon = createMoon(3, moonTexture, 18, 0.02, 0.3, earth);

    //Menambahkan cahaya sebagai representasi sinar matahari
    const pointLight = new THREE.PointLight(0xffffff, 10000, 1000);
    scene.add(pointLight);
    scene.add(new THREE.PointLightHelper(pointLight, 0.2, 0x00ff00));


    function animateMoon(moon){
      moon.angle += moon.speed;
      const x = Math.cos(moon.angle) * moon.radius;
      const z = Math.sin(moon.angle) * moon.radius;
      moon.mesh.position.set(x + moon.pivot.x, moon.pivot.y, z + moon.pivot.z);
    }


    //Animasi agar planer berotasi dan berevolusi
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

      if (state == true) {
        mercury.obj.rotateY(0.02);
        venus.obj.rotateY(0.015);
        earth.obj.rotateY(0.01);
        mars.obj.rotateY(0.008);
        jupiter.obj.rotateY(0.002);
        saturn.obj.rotateY(0.0009);
        uranus.obj.rotateY(0.0004);
        neptune.obj.rotateY(0.0001);
      
      } else {
        mercury.obj.rotation.y = 0;
        venus.obj.rotation.y = 0;
        earth.obj.rotation.y = 0;
        mars.obj.rotation.y = 0;
        jupiter.obj.rotation.y = 0;
        saturn.obj.rotation.y = 0;
        uranus.obj.rotation.y = 0;
        neptune.obj.rotation.y = 0;

      }
      
      animateMoon(earthMoon);
      animateMoon(mercuryMoon);
      animateMoon(venusMoon);
      orbit.update();
      TWEEN.update();

      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(() => {
      animate();
      renderer.render(scene, camera);
    });

    window.addEventListener('resize', function () {
      camera.aspect = this.window.innerWidth / this.window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  })
  .catch((error) => console.error('Error loading planet information:', error));
