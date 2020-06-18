function Spear(){

	// this function creates an instance of the spear model 

	var geomspear = new THREE.CylinderGeometry(50,50,700);
	this.mesh = new THREE.Mesh(geomspear,materialSpear);
	var geomCap = new THREE.CylinderGeometry(0,80,100);
	var cap = new THREE.Mesh(geomCap,materialTower);
	cap.position.y+=350+25;
	this.mesh.add(cap);
	this.visible = false;
	this.destroyed = false;
	this.mesh.castShadow = true;

	this.collides = function(minX, maxX, minY, maxY, minZ, maxZ) {

		// this function implements the AABB algorithm to compute collision between the spera and other world object

    	var spearMinX = this.mesh.position.x - 500;
    	var spearMaxX = this.mesh.position.x + 500;
    	var spearMinY = this.mesh.position.y - 500;
    	var spearMaxY = this.mesh.position.y + 500;
    	var spearMinZ = this.mesh.position.z - 400;
    	var spearMaxZ = this.mesh.position.z + 400;
    	return spearMinX <= maxX && spearMaxX >= minX
    		&& spearMinY <= maxY && spearMaxY >= minY
    		&& spearMinZ <= maxZ && spearMaxZ >= minZ;
    }
}

function Tower(mat,w,h,d){

	// this function creates an instance of the tower model

	var towergeom = new THREE.CylinderGeometry(w,h,d);
	this.tower = new THREE.Mesh(towergeom,mat);
	this.h = d;
	this.r = w;
	this.destroyed = false;
	var geomspier = new THREE.CylinderGeometry(this.r/5,this.r/5,this.r/3);
	var spier1 = new THREE.Mesh(geomspier,mat);
	spier1.position.y = this.h/2+(this.r/3)/2;
	var spier2 = spier1.clone();
	var spier3 = spier1.clone();
	var spier4 = spier1.clone();
	var spier5 = spier1.clone();
	var spier6 = spier1.clone();
	var spier7 = spier1.clone();
	var spier8 = spier1.clone();
	spier1.position.x = this.r-this.r/5;
	spier2.position.x = -this.r+this.r/5;
	spier3.position.z = spier1.position.x;
	spier4.position.z = spier2.position.x;
	spier5.position.x = (this.r-this.r/5)*Math.cos(Math.PI/4);
	spier5.position.z = (this.r-this.r/5)*Math.sin(Math.PI/4);
	spier6.position.x = -(this.r-this.r/5)*Math.cos(Math.PI/4);
	spier6.position.z = -(this.r-this.r/5)*Math.sin(Math.PI/4);
	spier7.position.x = -(this.r-this.r/5)*Math.cos(Math.PI/4);
	spier7.position.z = (this.r-this.r/5)*Math.sin(Math.PI/4);
	spier8.position.x = (this.r-this.r/5)*Math.cos(Math.PI/4);
	spier8.position.z = -(this.r-this.r/5)*Math.sin(Math.PI/4);
	this.tower.add(spier1);
	this.tower.add(spier2);
	this.tower.add(spier3);
	this.tower.add(spier4);
	this.tower.add(spier5);
	this.tower.add(spier6);
	this.tower.add(spier7);
	this.tower.add(spier8);
	this.tower.traverse(function(object) {
	    if (object instanceof THREE.Mesh) {
	      object.castShadow = true;
	    }
	  });


	this.collides = function(minX, maxX, minY, maxY, minZ, maxZ) {

		// this function implements the AABB algorithm to compute collision between the spera and other world object

    	var towerMinX = this.tower.position.x - this.r;
    	var towerMaxX = this.tower.position.x + this.r;
    	var towerMinY = this.tower.position.y - this.h;
    	var towerMaxY = this.tower.position.y + this.h;
    	var towerMinZ = this.tower.position.z - this.r;
    	var towerMaxZ = this.tower.position.z + this.r;
    	return towerMinX <= maxX && towerMaxX >= minX
    		&& towerMinY <= maxY && towerMaxY >= minY
    		&& towerMinZ <= maxZ && towerMaxZ >= minZ;
    }
}

function createRowOfTowers(mat,position, probability,sizes) {

	// this function creates a row of towers and the spears that need to be inserted on the lane in the game
	/*
	  param mat: is the material to apply to the tower instances
	  param position: is the position along the z axis of the lsane of the tower row
	  param probability: the probability of creating a tower in a certain horizontal sublane
	  param sizes: the possibile sizes of the tower to choose from. It is an array of array, each innermost array containing
	  			   3 values which are the radius top and dow and the height of the tower
	*/


	// for each of the horizontal sub lane i compute a random number and test if in thta sublane I need to craete the tower or not
	for (var lane = -1; lane < 2; lane++) {
		var randomNumber = Math.random();
		if (randomNumber < probability) {
			s = Math.floor(Math.random()*3);
			var tower = new Tower(mat,sizes[s][0],sizes[s][1],sizes[s][2]);
			tower.tower.position.x = -lane*(1250+420);
			tower.tower.position.y = -400+20+sizes[s][2]/2;
			tower.tower.position.z = position + 30000;
			tower.tower.castShadow = true;
			// Once I created the tower with probability 0.7 I also create a spear associated to that tower
			// The spear vertical position needs to coincide with the vertical sub lane its tower height represents
			if(Math.random() > 0.3){
				spear = new Spear();
				if(tower.h == 1000){
					spear.mesh.position.y = -1*1000+1400;
				}
				if(tower.h == 2000){
					spear.mesh.position.y = 0*1000+1400;
				}
				if(tower.h == 3000){
					spear.mesh.position.y = 1*1000+1400;
				}
				spear.mesh.rotation.x = Math.PI/2;
				spear.mesh.position.z = position;
				spear.mesh.position.x = tower.tower.position.x;
				spears.push([spear,tower]);
			}
			objects.push(tower);
			scene.add(tower.tower);
		}
	}
}

function createMountains(mat,lane_w,lane_d,sizes) {
	// this function creates the mountains that are present alongside the lane
	/*
		param mat: the material of the mountains.
		param lane_w: the width of the lane.
		param lane_d: the depth of the lane.
		param sizes: the possible heights of the moutains 
	*/
	i = 0;
	mountains = [];
	for(i;i<Math.floor(lane_d/sizes[0][0]);i++){
		s = Math.floor(Math.random()*3);
		geometry = new THREE.CylinderGeometry(0.0, 1 / Math.sqrt( 2 ) , 1, 4, 1 );
		geometry.rotateY( Math.PI / 4 );
	  	geometry.scale(sizes[s][0],sizes[s][1],sizes[s][2]);
	  	mesh = new THREE.Mesh(geometry,mat);
	  	mesh.position.x = -lane_w/2 - sizes[s][0]/2;
	  	mesh.position.y = sizes[s][1]/2-400;
	  	mesh.position.z = -5000 - sizes[s][0]*i;
	  	mountains.push(mesh);
	  	scene.add(mesh);
	  	s = Math.floor(Math.random()*3);
		geometry = new THREE.CylinderGeometry(0.0, 1 / Math.sqrt( 2 ) , 1, 4, 1 );
		geometry.rotateY( Math.PI / 4 );
	  	geometry.scale(sizes[s][0],sizes[s][1],sizes[s][2]);
	  	mesh = new THREE.Mesh(geometry,mat);
	  	mesh.position.x = lane_w/2  + sizes[s][0]/2;
	  	mesh.position.y = sizes[s][1]/2-400;
	  	mesh.position.z = -5000 - sizes[s][0]*i;
	  	mountains.push(mesh);
	  	scene.add(mesh);
	}
	return mountains;
}