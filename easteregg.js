import * as THREE from 'three';
import WindowManager from './WindowManager.js';

const t = THREE;
let camera, scene, renderer, world;
let near, far;
let pixR = window.devicePixelRatio ? window.devicePixelRatio : 1;
let asteroids = [];
let sceneOffsetTarget = { x: 0, y: 0 };
let sceneOffset = { x: 0, y: 0 };

let today = new Date();
today.setHours(0);
today.setMinutes(0);
today.setSeconds(0);
today.setMilliseconds(0);
today = today.getTime();
var colors = [new THREE.Color(0xac1122), new THREE.Color(0x96789f), new THREE.Color(0x535353)];

let internalTime = getTime();
let windowManager;
let initialized = false;

// get time in seconds since the beginning of the day (so that all windows use the same time)
function getTime() {
  return (new Date().getTime() - today) / 1000.0;
}

if (new URLSearchParams(window.location.search).get('clear')) {
  localStorage.clear();
} else {
  // this code is essential to circumvent that some browsers preload the content of some pages before you actually hit the url
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState != 'hidden' && !initialized) {
      init();
    }
  });

  window.onload = () => {
    if (document.visibilityState != 'hidden') {
      init();
    }
  };

  function init() {
    initialized = true;

    // add a short timeout because window.offsetX reports wrong values before a short period
    setTimeout(() => {
      setupScene();
      setupWindowManager();
      resize();
      updateWindowShape(false);
      render();
      window.addEventListener('resize', resize);
    }, 500);
  }

  function setupScene() {
    camera = new t.OrthographicCamera(0, 0, window.innerWidth, window.innerHeight, -10000, 10000);

    camera.position.z = 300; // Increased initial camera distance
    near = camera.position.z - 0.5;
    far = camera.position.z + 0.5;

    scene = new t.Scene();
    // Set space-themed background
    scene.add(camera);

    // Create a starfield
    const starGeometry = new t.BufferGeometry();
    const starMaterial = new t.PointsMaterial({ color: 0xffffff, size: 2, sizeAttenuation: false });

    const stars = [];
    for (let i = 0; i < 1000; i++) {
      const star = new t.Vector3();
      star.x = (Math.random() - 0.3) * 4000; // Adjusted the range to cover the entire screen
      star.y = (Math.random() - 0.5) * 4000;
      star.z = (Math.random() - 0.5) * 4000;
      stars.push(star);
    }

    starGeometry.setFromPoints(stars);
    const starfield = new t.Points(starGeometry, starMaterial);
    scene.add(starfield);

    renderer = new t.WebGLRenderer({ antialias: true, depthBuffer: true });
    renderer.setPixelRatio(pixR);

    world = new t.Object3D();
    scene.add(world);

    renderer.domElement.setAttribute('id', 'scene');
    document.body.appendChild(renderer.domElement);
  }

  function setupWindowManager() {
    windowManager = new WindowManager();
    windowManager.setWinShapeChangeCallback(updateWindowShape);
    windowManager.setWinChangeCallback(windowsUpdated);

    // here you can add your custom metadata to each windows instance
    let metaData = { foo: 'bar' };

    // this will init the window manager and add this window to the centralised pool of windows
    windowManager.init(metaData);

    // call update windows initially (it will later be called by the win change callback)
    windowsUpdated();
  }

  function windowsUpdated() {
    updateNumberOfAsteroids();
  }

  function updateNumberOfAsteroids() {
    let wins = windowManager.getWindows();

    // remove all asteroid objects
    asteroids.forEach((object) => {
      world.remove(object);
    });

    asteroids = [];

    // add new asteroid objects based on the current window setup
    for (let i = 0; i < wins.length; i++) {
      let win = wins[i];

      // Create irregularly shaped asteroid-like objects
      let geometry = new t.DodecahedronGeometry(win.shape.w / 20, 8); // Adjust the size and detail parameters
      let texture = new t.TextureLoader().load('/texture/dark.jpg'); // Set asteroid texture
      let material = new t.MeshBasicMaterial({ map: texture });

      let asteroid = new t.Mesh(geometry, material);
      asteroid.position.x = win.shape.x + win.shape.w * 0.5;
      asteroid.position.y = win.shape.y + win.shape.h * 0.5;

      world.add(asteroid);
      asteroids.push(asteroid);
    }
  }

  function updateWindowShape(easing = true) {
    // storing the actual offset in a proxy that we update against in the render function
    sceneOffsetTarget = { x: -window.screenX, y: -window.screenY };
    if (!easing) sceneOffset = sceneOffsetTarget;
  }

  function render() {
    let t = getTime();

    windowManager.update();

    // calculate the new position based on the delta between current offset and new offset times a falloff value (to create the nice smoothing effect)
    let falloff = 0.05;
    sceneOffset.x = sceneOffset.x + (sceneOffsetTarget.x - sceneOffset.x) * falloff;
    sceneOffset.y = sceneOffset.y + (sceneOffsetTarget.y - sceneOffset.y) * falloff;

    // set the world position to the offset
    world.position.x = sceneOffset.x;
    world.position.y = sceneOffset.y;

    let wins = windowManager.getWindows();

    // loop through all our asteroid objects and update their positions and rotations based on current window positions
    for (let i = 0; i < asteroids.length; i++) {
      let object = asteroids[i];
      let win = wins[i];

      let posTarget = { x: win.shape.x + win.shape.w * 0.5, y: win.shape.y + win.shape.h * 0.5 };

      object.position.x = object.position.x + (posTarget.x - object.position.x) * falloff;
      object.position.y = object.position.y + (posTarget.y - object.position.y) * falloff;

      // Rotate asteroids
      object.rotation.x = t * 0.1;
      object.rotation.y = t * 0.1;
    }

    // Zoom in the camera
    camera.position.z -= 0.1;

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  // resize the renderer to fit the window size
  function resize() {
    let width = window.innerWidth;
    let height = window.innerHeight;

    camera = new t.OrthographicCamera(0, width, 0, height, -10000, 10000);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
}
