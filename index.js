var scene,
  camera,
  controls,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  shadowLight,
  backLight,
  light,
  renderer,
  container;

var env, floor, dragon, pepperBottle,
  sneezingRate = 0,
  fireRate = 0,
  maxSneezingRate = 10,
  sneezeDelay = 500,
  awaitingSmokeParticles = [],
  timeSmoke = 0,
  timeFire = 0,
  globalSpeedRate = 1,
  sneezeTimeout,
  powerField,
  firing = false,
  color = 0;
  difficulty = 0;

var HEIGHT,
  WIDTH,
  windowHalfX,
  windowHalfY,
  mousePos = {
    x: 0,
    y: 0
  };

var dragon_colors = [[0x202020,0x990000],[0x042C02,0xcd7f32],[0x9f5919,0xFFD700]];


function init() {
  
  scene = new THREE.Scene();

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 2000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane);
  camera.position.x = -300;
  camera.position.z = 300;
  camera.position.y = 100;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMapEnabled = true;
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  //*
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.minPolarAngle = -Math.PI / 2; 
  controls.maxPolarAngle = Math.PI / 2;
  controls.noZoom = true;
  controls.noPan = true;
  //*/
}

function createLights() {
  light = new THREE.HemisphereLight(0xffffff, 0xb3858c, .8);

  shadowLight = new THREE.DirectionalLight(0xffffff, .8);
  shadowLight.position.set(10000, 10000, 5000);
  shadowLight.castShadow = true;
  shadowLight.shadowDarkness = .15;

  backLight = new THREE.DirectionalLight(0xffffff, .4);
  backLight.position.set(200, 100, 100);
  backLight.shadowDarkness = .1;
  backLight.castShadow = true;

  //scene.add(backLight);
  scene.add(light);
  scene.add(shadowLight);
}

function loop() {
  render();
  dragon.update()
  requestAnimationFrame(loop);
}

function render() {
  if (controls) controls.update();
  renderer.render(scene, camera);
}
window.onload = function(){
  init();
  createLights();
  dragon = new Dragon(dragon_colors[0]);
  dragon.threegroup.scale.set(0.7,0.7,0.7);
  scene.add(dragon.threegroup);
  document.getElementById("right").addEventListener("click", function(){
    color = (color + 1)%3;
    scene.remove(dragon.threegroup);
    dragon = new Dragon(dragon_colors[color]);
    dragon.threegroup.scale.set(0.7,0.7,0.7);
    scene.add(dragon.threegroup);
  });
  document.getElementById("left").addEventListener("click", function(){
    if(color == 0){
      color = 2;
    }
    else{
      color = (color - 1)%3;
    }
    scene.remove(dragon.threegroup);
    dragon = new Dragon(dragon_colors[color]);
    dragon.threegroup.scale.set(0.7,0.7,0.7);
    scene.add(dragon.threegroup);
  });
  document.getElementById("start").addEventListener("click", function(){
    if (document.getElementById('easy').checked) {
      difficulty = 0;
    }
    if (document.getElementById('medium').checked) {
      difficulty = 1;
    }
    if (document.getElementById('hard').checked) {
      difficulty = 2;
    }
    window.location.replace("game.html?color="+color+"&difficulty="+difficulty);
  });
  loop();
}