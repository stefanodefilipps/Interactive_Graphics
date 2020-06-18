var element, scene, camera, character, renderer, light,
		objects, paused, keysAllowed, score, difficulty,
		treePresenceProb, maxTreeSize, fogDistance, gameOver,plane,plane_,
		wallLeft,wallLeft_,wallRight,wallRight_,dragon,towers1,towers,mountains,dragon,moving,fires,explosionAnimations,spears,
		distance,fire_power,delta,FireRate,speedDifficulty;

// code of key arrows
var left = 37;
var up = 38;
var down = 40;
var right = 39;
var space= 32;
var pause = 80;
var sound = 83;

// set of possible colors of the dragon and passed in the url the color index
var dragon_colors = [[0x202020,0x990000],[0x042C02,0xcd7f32],[0x9f5919,0xFFD700]];


// defiintion of the material for the pavement
var texturePavement = new THREE.TextureLoader().load("pavement2.jpg");
texturePavement.wrapS = THREE.MirroredRepeatWrapping;
texturePavement.wrapT = THREE.MirroredRepeatWrapping;
texturePavement.repeat.set( 4,60);

var materialPavement = new THREE.MeshLambertMaterial({
	map: texturePavement,
	shading: THREE.FlatShading
});

// defintion of the material for the tower
var textureTower = new THREE.TextureLoader().load("wall.jpg");
textureTower.wrapS = THREE.MirroredRepeatWrapping;
textureTower.wrapT = THREE.MirroredRepeatWrapping;
textureTower.repeat.set( 5,5);
var materialTower = new THREE.MeshLambertMaterial({
   	map:textureTower,
   	shading: THREE.FlatShading
});

// defiintion of the material for the explopsion
var materialExplosion = new THREE.MeshLambertMaterial({
	size: 0.2,
	color: 0x696969,
	shading: THREE.FlatShading
});
// defiintion of the material for the mountain
var materialMountain = new THREE.MeshLambertMaterial({
	color: 0x0F541D,
	shading: THREE.FlatShading
});

// defiintion of the material for the spear
var materialSpear = new THREE.MeshLambertMaterial({
	color: 0x59332e,
	shading: THREE.FlatShading
})


function World() {

	// Explicit binding of this even in changing contexts.
	var self = this;

	// Scoped variables in this world.

	// Initialize the world.
	init();
	
	/**
	  * Builds the renderer, scene, lights, camera, and the character,
	  * then begins the rendering loop.
	  */
	function init() {

		// Locate where the world is to be located on the screen.
		element = document.getElementById('world');
		console.log(element);

		// Initialize the renderer.
		renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true
		});
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMap.enabled = true;
		element.appendChild(renderer.domElement);


		// Initialize the scene.
		scene = new THREE.Scene();
		fogDistance = 45000;
		scene.fog = new THREE.Fog(0xbadbe4, 1, fogDistance);
		var url = window.location.href;
		// get the dragon's color from the url
		color = parseInt(url.split("=")[1][0]);
		dragon = new Dragon(dragon_colors[color]);
		dragon.threegroup.position.set(0,-400+1500,-4000.0);
		dragon.threegroup.rotation.y = Math.PI;
		dragon.threegroup.scale.set(3,3,3);
		dragon.lane = 0;
		dragon.vertical_lane = 0;
		// Initialize the camera with field of view, aspect ratio,
		// near plane, and far plane.
		camera = new THREE.PerspectiveCamera(
			60, element.clientWidth / element.clientHeight, 1, 120000);
		camera.position.set(0, -400+1800, -2000);
		camera.lookAt(new THREE.Vector3(0, 600, -5000));
		window.camera = camera;

		// Set up resizing capabilities.
		window.addEventListener('resize', handleWindowResize, false);
		document.getElementById("back").addEventListener("click",Back);
		document.getElementById("again").addEventListener("click",PlayAgain);

		// Initialize the lights.
		createLights()

		// Initialize the character and add it to the scene.
		scene.add(dragon.threegroup);
		// Initialize the pavement and add it to the scene
		plane = createBox(5100,20,160000,materialPavement,0,-400,-60000);
		plane_ = createBox(5100,20,160000,materialPavement,0,-400,-160000-60000);
		scene.add(plane);
		scene.add(plane_);

		// initialize the set of towers, fire particle, explosions and spears
		objects = [];
		fires = [];
		explosionAnimations = [];
		spears = [];
		// possible tower sizes
		towerSizes = [[600,600,1000],[600,600,2000],[600,600,3000]];
		// possible delta of translation of the world objects based on level of difficulty chosen by the player
		speedDifficulty = [100,200,300];
		// get the difficulty chosen by the player from the url 
		diff = parseInt(url.split("=")[2]);
		// probbaility of the presence of a tower in a sub lane of a row
		towerPresenceProb = 0.45 ;
		// Now I create all the towers and spera in the game
		for (var i = 10; i < 40; i++) {
			createRowOfTowers(materialTower,i * -5000, towerPresenceProb, towerSizes);
		}

		mountainSizes = [[13000,4000,13000],[13000,5000,13000],[13000,6000,13000]];
		mountains = createMountains(materialMountain,5100,160000,mountainSizes);

		// The game is not paused to begin with and the game is not over.
		gameOver = false;
		paused = false;
		distance = 0.0;
		fire_power = 0.0;
		delta = 0.0;
		FireRate = 0.0;

		// Start receiving feedback from the player.

		document.addEventListener('keydown', function(e){OnKeyDown(e);});
		// Begin the rendering loop.
		loop();

	}
	
	/**
	  * The main animation loop.
	  */


	function loop() {

		// Update the game.
		if (!paused && !gameOver) {
			// the complete loop is explained in the report

			dragon.update();

			fireCollisionLogic();

			CollisionLogic();

		  	FireLogic();

			towersLogic();

			spearsLogic();

			explosionAnimations.forEach(function(obj){
				obj.update(scene);
			})

			pavementsLogic();

			mountainsLogic();

			updatePoint();
		}

		// Render the page and repeat.
		renderer.render(scene, camera);
		requestAnimationFrame(loop);
	}

	/**
	  * A method called when window is resized.
	  */
	function handleWindowResize() {
		renderer.setSize(element.clientWidth, element.clientHeight);
		camera.aspect = element.clientWidth / element.clientHeight;
		camera.updateProjectionMatrix();
	}

	function PlayAgain(){
		// function executed by the event handler when the button again is clicked after the end of a game
		if(document.getElementById("again").style.visibility == "visible"){
			window.location.replace(window.location.href);
		}
	}

	function Back(){
		// function executed by the event handler when the button back is clicked after the end of a game or when it is on pause
		if(document.getElementById("back").style.visibility == "visible"){
			window.location.replace("index.html");
		}
	}

	
}

function createBox(dx, dy, dz, mat, x, y, z, notFlatShading) {
    var geom = new THREE.BoxGeometry(dx, dy, dz);
    var box = new THREE.Mesh(geom, mat);
    box.castShadow = true;
    box.receiveShadow = true;
    box.position.set(x, y, z);
    return box;
}

function createPlane(dx,dy,mat,x,y,z){
	var geom = new THREE.PlaneGeometry(dx,dy);
	var plane = new THREE.Mesh(geom,mat);
	plane.rotation.x = Math.PI/2;
	plane.position.set(x,y,z);
	return plane;
}

function OnKeyDown(e){

	// function executed by the event handler when a button on the keyboard is pressed.

	var key = e.keyCode;
	console.log(key);
	if(key == pause && !firing && !gameOver){
		// if the player put the game on pause and the dragon is not firing and game not over, then change the value
		// of the flag pause and make the button back visible
		paused = !paused;

		if(paused){ 
			document.getElementById("back").style.visibility = "visible";
			document.getElementById("controls").style.visibility = "visible";
			document.getElementById("f_p").style.visibility = "visible";
		}
		else{ 
			document.getElementById("back").style.visibility = "hidden";
			document.getElementById("controls").style.visibility = "hidden";
			document.getElementById("f_p").style.visibility = "hidden";
		}
	}
	if (key == left && !paused && !gameOver && dragon.lane != -1) {
		// if the game is going on and the player clicked the left arrow and the dragon is not in the last lane on the left
		// the ncall the animation to change correctly the pose of the dragon.
		dragon.lane -= 1;
		dragon.onLeftKeyPressed();
	}
	if (key == right && !paused && !gameOver && dragon.lane != 1) {
		// if the game is going on and the player clicked the left arrow and the dragon is not in the last lane on the right
		// then call the animation to change correctly the pose of the dragon.
		dragon.lane+=1;
		console.log(dragon.threegroup.position.x);
		dragon.onRightKeyPressed();
		console.log(dragon.threegroup.position.x);
	}
	if (key == up && !paused && !gameOver && dragon.vertical_lane != 1 ) {
		// if the game is going on and the player clicked the left arrow and the dragon is not in highest vertical lane
		// then call the animation to change correctly the pose of the dragon.
		dragon.vertical_lane+=1;
		TweenMax.to(camera.position, 1, {
		    y: dragon.vertical_lane*1000 + 2000,
		    ease: Back.easeOut,
		  });
		dragon.onUpKeyPressed();
	}
	if (key == down && !paused && !gameOver && dragon.vertical_lane != -1) {
		// if the game is going on and the player clicked the left arrow and the dragon is not in the lowest vertical lane
		// then call the animation to change correctly the pose of the dragon.
		dragon.vertical_lane -= 1;
		TweenMax.to(camera.position, 1, {
		    y: dragon.vertical_lane*1000 + 2000,
		    ease: Back.easeOut,
		  });
		dragon.onDownKeyPressed();
	}

	if (key == space && !paused && !gameOver && !firing) {
		// if the game is still going on and the dragon is not already throwing fire, then starts the sound clip, wait until the right
		// time has come and then starts the firing animiation
		if (FireTimeout) clearTimeout(FireTimeout);
		var dracarys = new Howl({
		  src: ['20190609_170211.m4a']
		}).play();
		setTimeout(function f(){dragon.prepareToFire(fire_power)},1336);
		FireTimeout = setTimeout(Fire, FireDelay*globalSpeedRate+1336);
		dragon.isFire = true;
		delta = 0.0;
		firing = true;
	}

}

function createLights(){

	// this function creates the light in the world

	light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
	shadowLight = new THREE.DirectionalLight(0xffffff, .1);
  	shadowLight.position.set(0,10000,-30000);
  	shadowLight.castShadow = true;
  	shadowLight.shadowDarkness = 10;
  	shadowLight.shadow.camera.top = 8000;
  	shadowLight.shadow.camera.bottom = -8000;
  	shadowLight.shadow.camera.right = 5000;
  	shadowLight.shadow.camera.near = 1000;
  	shadowLight.shadow.camera.far = 30000;
  	shadowLight.shadow.camera.left = -5000;
  	shadowLight.shadow.mapSize.width = 1024;  
	shadowLight.shadow.mapSize.height = 1024; 
  	point = new THREE.Object3D();
  	point.position.set(0,-10000,2000);
  	scene.add(point);
  	shadowLight.target = point;

  	backLight = new THREE.DirectionalLight(0xffffff, .4);
  	backLight.position.set(200, 100, 100);

  	scene.add(backLight);
  	scene.add(light);
  	scene.add(shadowLight);
}

function Fire() {
  dragon.Fire(fire_power);
  FireRate = 0;
}

function fireCollisionLogic(){
	// this function checks if for any fire particles there is an object colliding with it and update the points with the
	// ones gained.
	if(fires.length > 0){
		fires.forEach(function(f){
			p = f.collides(objects,spears,scene,explosionAnimations,fire_power);
			if(p != 0) {
				distance+=p;
				document.getElementById("distance").innerHTML = "Distance: "+distance;
			}
		})
	}
}

function FireLogic(){
	// this function handles the animation of the fire particles during the firing and smoke phase
	if (timeSmoke > 0) {
		//timeSmoke is a value set by dragon.backToNormal and inidicates how many smoke particles need to be created and rendered
	    // I choose randomly the starting nostril for the particle
	    var noseTarget = (Math.random() > .5) ? dragon.noseL : dragon.noseR;
	    var p = getSmokeParticle();
	    var pos = noseTarget.localToWorld(new THREE.Vector3(0, 0, 2));

	    p.mesh.position.x = pos.x;
	    p.mesh.position.y = pos.y;
	    p.mesh.position.z = pos.z;
	    p.mesh.material.color.setHex(0x555555);
	    p.mesh.material.opacity = .2;
	    // add the particle to the scene and strat its own animation
	    scene.add(p.mesh);
	    p.fly();
	    //}
	    timeSmoke--;
	}

  	if (timeFire > 0) {
  		// timeFire is a value set by dragon.Fire() and indicates how many fire particles need to be created.
	    var f = getSmokeParticle();
	    // the initial position is close to the open mouth of the dragon
	    var posF = dragon.mouth.localToWorld(new THREE.Vector3(0, 0, 2));

	    f.mesh.position.x = posF.x;
	    f.mesh.position.y = posF.y-10;
	    f.mesh.position.z = posF.z;
	    f.mesh.material.opacity = 1;
	    // add the particle to the scene and strat its own animation
	    scene.add(f.mesh);
	    fires.push(f);
	    f.fire(fire_power,fires,color);
	    timeFire--;
  	}
}

function CollisionLogic(){
	// check if a collision between the dragon and some object in the world has occured. If the response is positive, then
	// set gameover flag and siplay the button back and again
	if (collisionsDetected()) {
		gameOver = true;
		document.getElementById("go").style.visibility = "visible";
		document.getElementById("back").style.visibility = "visible";
		document.getElementById("again").style.visibility = "visible";
		document.getElementById("controls").style.visibility = "visible";
		document.getElementById("f_p").style.visibility = "visible";
	}
}

function towersLogic(){
	// implements the logic for moving the towers in the world.
	// for each tower in the game I translate along the z positive direction and if completely out of view
	// take them bac to the start at the end of the lane and if it has been destroyed make it visible again.
	objects.forEach(function(object) {
		object.tower.position.z += speedDifficulty[diff];
		if(object.tower.position.z >= 0){
			object.tower.position.z = -160000;
			if(object.destroyed){
				scene.add(object.tower);
				object.destroyed = false;
			}
		}
	});
}

function spearsLogic(){
	// implements the logic for the animation of the spears in the world.
	spears.forEach(function(object) {
		if(object[1].destroyed){
			// if the tower associated to the spear has been destroyed then remove it from the scene
			scene.remove(object[0]);
		}
		if(object[0].visible){
			// if the spear object is visible then update its position
			object[0].mesh.position.z += speedDifficulty[diff]+100;
		}
		if(object[0].mesh.position.z >= 0){
			// if the spear completely out of view then mke it invsiible nd remove it from the scene
			object[0].visible = false;
			scene.remove(object[0].mesh);
		}
		if(object[1].tower.position.z <= -15000){
			// if the tower associated to the spear is at distance -15000 then make the spear visible nd add it to the scene.
			// with initial position equal to the tower it is associated to 
			object[0].mesh.position.z = object[1].tower.position.z;
			object[0].visible = true;
			object[0].destroyed = false;
			scene.add(object[0].mesh);
		}
	})
}

function pavementsLogic(){
	// this function implements the animation of the pavement
	plane.position.z+=speedDifficulty[diff];
	plane_.position.z+=speedDifficulty[diff];

	// i update both the planes and if the closest one is completely out of view then i have to switch between the two and
	// put the former one at the end of the new closest plane
	if(plane.position.z >= 80000){
		var p = plane.clone();
		p.position.z = -240000;
		scene.remove(plane);
		plane = plane_;
		plane_ = p;
		scene.add(p);
	}

}

function mountainsLogic(){
	// this function implements the logic for the animation of the mountains
	mountains.forEach(function(object) {
		object.position.z += speedDifficulty[diff];
		if(object.position.z >= 7000){
			object.position.z = -160000+12000;
		}
	});
}

function updatePoint(){
	// this function update the points and the fire power in every frame
	distance+=100;
	document.getElementById("distance").innerHTML = "Distance: "+distance;
	// the fire power is computed using the delta parametr that goes from 0 to 100000. So every 100000 meters the fire power
	// is at the maximum. Then from the delta value we get the actual fire power in range (0,10).
	if(delta <= 100000 && !firing){
		if(delta == 100000){
			fire_power = 10.0;
		}
		else fire_power =(delta%100000)/10000;
		var fire_string = (fire_power*10).toString();
		if(fire_string.indexOf(".") == -1){
			fire_string = fire_string+".0"
		}
		fire_string = fire_string.split(".")[0]+"."+fire_string.split(".")[1][0];
		document.getElementById("fire_power").innerHTML = "Fire Power: "+fire_string+"%";
		delta += 100;
		var elem = document.getElementById("myBar"); 
	    width = fire_power; 
	    elem.style.width = width + '%'; 
	}
}

/**
 * Returns true if and only if the character is currently colliding with
 * an object on the map.
 */
	function collisionsDetected() {
		var charMinX = dragon.threegroup.position.x - 570;
		var charMaxX = dragon.threegroup.position.x + 570;
		var charMinY = dragon.threegroup.position.y - -393;
		var charMaxY = dragon.threegroup.position.y + 432;
		var charMinZ = dragon.threegroup.position.z - -675;
		var charMaxZ = dragon.threegroup.position.z + 440;
		for (var i = 0; i < objects.length; i++) {
			if (!objects[i].destroyed && objects[i].collides(charMinX, charMaxX, charMinY, 
					charMaxY, charMinZ, charMaxZ)) {
				return true;
			}
		}
		for (var i = 0;i < spears.length; i++){
			if (!spears[i][0].destroyed && spears[i][0].collides(charMinX, charMaxX, charMinY, 
					charMaxY, charMinZ, charMaxZ)) {
				return true;
			}
		}
		return false;
	}

window.onload = function(){
	World();
}
