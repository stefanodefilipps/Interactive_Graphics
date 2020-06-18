var fireRate = 0,
  maxFireRate = 10,
  FireDelay = 500,
  awaitingSmokeParticles = [],
  timeSmoke = 0,
  timeFire = 0,
  globalSpeedRate = 1,
  FireTimeout,
  powerField,
  firing = false;

Dragon = function(color) {
  this.tailAmplitude = Math.PI / 8;
  this.tailAngle = 0;
  this.tailSpeed = .06;
  this.color = color;

  this.wingAmplitude = Math.PI / 6;
  this.wingAngle = 0;
  this.wingAngle2 = 0;
  this.wingSpeed = 0.1;
  this.isFire = false;
  this.bodyAmplitude = 3;

  this.threegroup = new THREE.Group(); // this is a sort of container that will hold all the meshes and will be added to the scene;

  // Materials
  var darkGrey = new THREE.MeshLambertMaterial({
    color : this.color[0],
    shading: THREE.FlatShading
  });
  var darkRed = new THREE.MeshLambertMaterial({
    color: this.color[1],
    shading: THREE.FlatShading
  });
  var lightdarkGrey = new THREE.MeshLambertMaterial({
    color: 0x95c088,
    shading: THREE.FlatShading
  });

  var redMat = new THREE.MeshLambertMaterial({
    color: 0xcb3e4c,
    shading: THREE.FlatShading
  });

  var whiteMat = new THREE.MeshLambertMaterial({
    color: 0xfaf3d7,
    shading: THREE.FlatShading
  });

  var brownMat = new THREE.MeshLambertMaterial({
    color: 0x874a5c,
    shading: THREE.FlatShading
  });

  var blackMat = new THREE.MeshLambertMaterial({
    color: 0x403133,
    shading: THREE.FlatShading
  });
  var pinkMat = new THREE.MeshLambertMaterial({
    color: 0xd0838e,
    shading: THREE.FlatShading
  });

  // body
  this.body = new THREE.Group();
  this.belly = makeCube(darkGrey, 70, 70, 160, 0, 0, 0, 0, 0, Math.PI / 4);

  //wings bottom part and upper part

  this.wingL = makeWing(darkGrey, 5, 90, 76, 10, 60, 0, -Math.PI / 4, 0, -Math.PI / 4);
  this.wingR = this.wingL.clone();
  this.wingR.position.x = -this.wingL.position.x;
  this.wingR.rotation.z = -this.wingL.rotation.z;

  this.wingLT = makeWingTop(darkGrey,5, 90, 60, 0, 135, 0, -Math.PI / 4, 0, -Math.PI / 4);
  this.wingRT = this.wingLT.clone();
  this.wingRT.position.x = -this.wingLT.position.x;
  this.wingRT.rotation.z = -this.wingLT.rotation.z;

  this.wingL.add(this.wingLT);
  this.wingR.add(this.wingRT);

  // pike body
  var pikeBodyGeom = new THREE.CylinderGeometry(0, 10, 10, 4, 1);
  this.pikeBody1 = new THREE.Mesh(pikeBodyGeom, darkRed);
  this.pikeBody1.scale.set(.2, 1, 1);
  this.pikeBody1.position.z = 70;
  this.pikeBody1.position.y = 54;
  this.pikeBody2 = this.pikeBody1.clone();
  this.pikeBody2.position.z = 60;
  this.pikeBody3 = this.pikeBody1.clone();
  this.pikeBody3.position.z = 50;
  this.pikeBody4 = this.pikeBody1.clone();
  this.pikeBody4.position.z = 40;
  this.pikeBody5 = this.pikeBody1.clone();
  this.pikeBody5.position.z = 30;
  this.pikeBody6 = this.pikeBody1.clone();
  this.pikeBody6.position.z = 20;
  this.pikeBody7 = this.pikeBody1.clone();
  this.pikeBody7.position.z = 10;
  this.pikeBody8 = this.pikeBody1.clone();
  this.pikeBody8.position.z = 0;
  this.pikeBody9 = this.pikeBody1.clone();
  this.pikeBody9.position.z = -10;
  this.pikeBody10= this.pikeBody1.clone();
  this.pikeBody10.position.z = -20;
  this.pikeBody11 = this.pikeBody1.clone();
  this.pikeBody11.position.z = -30;
  this.pikeBody12 = this.pikeBody1.clone();
  this.pikeBody12.position.z = -40;
  this.pikeBody13 = this.pikeBody1.clone();
  this.pikeBody13.position.z = -50;
  this.pikeBody14 = this.pikeBody1.clone();
  this.pikeBody14.position.z = -60;
  this.pikeBody15 = this.pikeBody1.clone();
  this.pikeBody15.position.z = -70;


  //tail parts

  this.tail1 = makeTailPart(darkGrey,10,20,90,0,10,-80,-Math.PI/2,0,0);
  this.tail2 = makeTailPart(darkGrey,5,10,60,0,90*0.7,0,0,0,0);
  this.tail1.add(this.tail2);
  this.tail3 = makeTailPart(darkGrey,2.5,5,30,0,60*0.7,0,0,0,0);
  this.tail2.add(this.tail3);
  // pike tail
  var pikeGeom = new THREE.CylinderGeometry(0, 10, 10, 4, 1);
  this.tailPike = new THREE.Mesh(pikeGeom, darkRed);
  this.tailPike.scale.set(.2, 1, 1);
  this.tailPike.position.y = 30*0.7+10;
  this.tail3.add(this.tailPike);

  this.body.add(this.belly);
  this.body.add(this.wingL);
  this.body.add(this.wingR);
  this.body.add(this.tail1);
  this.body.add(this.pikeBody1);
  this.body.add(this.pikeBody2);
  this.body.add(this.pikeBody3);
  this.body.add(this.pikeBody4);
  this.body.add(this.pikeBody5);
  this.body.add(this.pikeBody6);
  this.body.add(this.pikeBody7);
  this.body.add(this.pikeBody8);
  this.body.add(this.pikeBody9);
  this.body.add(this.pikeBody10);
  this.body.add(this.pikeBody11);
  this.body.add(this.pikeBody12);
  this.body.add(this.pikeBody13);
  this.body.add(this.pikeBody14);
  this.body.add(this.pikeBody15);

  // head
  this.head = new THREE.Group();

  // head face
  this.face = makeCube(darkGrey, 80, 70, 100, 0, 25, 60, 0, 0, 0);
  
  
  // head horn
  var hornGeom = new THREE.CylinderGeometry(0, 6, 10, 4, 1);
  this.hornL = new THREE.Mesh(hornGeom, darkRed);
  this.hornL.position.y = 65;
  this.hornL.position.z = 20;
  this.hornL.position.x = 20;

  this.hornR = this.hornL.clone();
  this.hornR.position.x = -20;

  // head ears
  this.earL = makeCube(darkGrey, 5, 10, 20, 42, 52, 22, 0, 0, 0);
  this.earL.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 5, -10));
  this.earL.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 4));
  this.earL.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(-Math.PI / 4));

  this.earR = makeCube(darkGrey, 5, 10, 20, -42, 52, 22, 0, 0, 0);
  this.earR.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 5, -10));
  this.earR.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 4));
  this.earR.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI / 4));

  // head mouth
  this.mouth = new THREE.Group();
  this.mouth.position.z = 60;
  this.mouth.position.y = 3;
  this.mouth.rotation.x = 0//Math.PI / 8;

  // head mouth jaw
  this.jaw = makeCube(darkGrey, 30, 10, 30, 0, -15, 35, 0, 0, 0);
  this.mouth.add(this.jaw);

  // head mouth tongue
  this.tongue = makeCube(redMat, 20, 10, 20, 0, -13, 35, 0, 0, 0);
  this.mouth.add(this.tongue);
  
  // head smile
  var smileGeom = new THREE.TorusGeometry( 6, 2, 2, 10, Math.PI );
  this.smile = new THREE.Mesh(smileGeom, blackMat);
  this.smile.position.z = 112;  
  this.smile.position.y = -5;
  this.smile.rotation.z = -Math.PI;
  

  // head cheek
  this.cheekL = makeCube(darkRed, 4, 20, 20, 40, 28, 75, 0, 0, 0);
  this.cheekR = this.cheekL.clone();
  this.cheekR.position.x = -this.cheekL.position.x;
  
  
  // head eye
  this.eyeL = makeCube(whiteMat, 10, 22, 22, 37, 44, 38, 0, 0, 0);
  this.eyeR = this.eyeL.clone();
  this.eyeR.position.x = -37;

  // head iris
  this.irisL = makeCube(brownMat, 10, 12, 12, 38, 40, 44, 0, 0, 0);
  this.irisR = this.irisL.clone();
  this.irisR.position.x = -this.irisL.position.x;

  // head nose
  this.noseL = makeCube(blackMat, 5, 5, 8, 5, 40, 107, 0, 0, 0);
  this.noseR = this.noseL.clone();
  this.noseR.position.x = -this.noseL.position.x;

  this.head.position.z = 80;
  this.head.position.y = 20;
  this.head.add(this.face);
  this.head.add(this.hornL);
  this.head.add(this.hornR);
  this.head.add(this.earL);
  this.head.add(this.earR);
  this.head.add(this.mouth);
  this.head.add(this.eyeL);
  this.head.add(this.eyeR);
  this.head.add(this.irisL);
  this.head.add(this.irisR);
  this.head.add(this.noseL);
  this.head.add(this.noseR);
  this.head.add(this.cheekL);
  this.head.add(this.cheekR);
  this.head.add(this.smile);
  
  // legs with 3 part each and the talons of attached to the last part which is the foot

  this.legBRT = makeLeg(darkGrey,20,10,50,-35,-35,-40,0,0,-Math.PI / 5);
  this.legBRB = makeLeg(darkGrey,10,20,40,0,0,0,0,0,0);
  this.legBRB.rotateZ(Math.PI/5);
  this.legBRB.translateY(-15);
  this.legBRB.translateX(-10);
  this.legBRT.add(this.legBRB);
  this.footBR = makeCube(darkGrey,45,10,60,0,-25,10,0,0,0);
  this.legBRB.add(this.footBR);
  var talonGeom = new THREE.CylinderGeometry(0, 5, 10, 4, 1);
  this.talon1 = new THREE.Mesh(talonGeom, darkRed);
  this.talon1.rotateX(Math.PI/2);
  this.talon1.rotateY(Math.PI/4);
  this.talon1.position.z = 35;
  this.talon1.position.x = -22.5+5+2.5;
  this.talon2 = this.talon1.clone();
  this.talon2.position.x = this.talon1.position.x+15;
  this.talon3 = this.talon1.clone();
  this.talon3.position.x = this.talon2.position.x+15;
  this.footBR.add(this.talon1);
  this.footBR.add(this.talon2);
  this.footBR.add(this.talon3);
  this.legBLT = this.legBRT.clone();
  this.legBLT.position.x = -this.legBRT.position.x;
  this.legBLT.rotateZ(2*Math.PI/5);
  this.legBLT.children[0].rotateZ(-2*Math.PI/5);
  this.legFRT = this.legBRT.clone();
  this.legFRT.position.z = 40;
  this.legFLT = this.legBLT.clone();
  this.legFLT.position.z = 40;


  this.legFL = makeCube(darkGrey, 20, 10, 40, 40, -70, 35, 0, 0, 0);
  this.legFR = this.legFL.clone();
  this.legFR.position.x = -40;
  this.legBL = this.legFL.clone();
  this.legBL.position.z = -35;
  this.legBR = this.legBL.clone();
  this.legBR.position.x = -40;

  this.legBRB.rotateX(Math.PI/8);
  this.legFRT.children[0].rotateX(Math.PI/8);
  this.legFLT.children[0].rotateX(Math.PI/8);
  this.legBLT.children[0].rotateX(Math.PI/8);

  this.body.add(this.legBRT);
  this.body.add(this.legBLT);
  this.body.add(this.legFRT);
  this.body.add(this.legFLT);

  this.threegroup.add(this.body);
  this.threegroup.add(this.head);
}

Dragon.prototype.update = function() {

  // this is the function that update the normal animation of the dragon and it needs to update the y coordinate
  // of the body and the rottaion of the wings parts and the talil's parts

  this.tailAngle += this.tailSpeed/globalSpeedRate;
  this.wingAngle += this.wingSpeed/globalSpeedRate;
  this.wingAngle2 += this.wingSpeed/globalSpeedRate;
  this.tail1.rotation.x = -Math.PI/2+ Math.cos(this.tailAngle) * this.tailAmplitude ;
  this.tail1.rotation.z = (Math.sin(this.tailAngle) * this.tailAmplitude)/4 ;
  this.tail2.rotation.x = Math.cos(this.tailAngle) * this.tailAmplitude/2 ;
  this.tail2.rotation.z = (Math.sin(this.tailAngle) * this.tailAmplitude/2)/4 ;
  this.tail3.rotation.x = Math.cos(this.tailAngle) * this.tailAmplitude/4 ;
  this.tail3.rotation.z = (Math.sin(this.tailAngle) * this.tailAmplitude/4)/4 ;
  this.wingL.rotation.z = -Math.PI / 3 + Math.cos(this.wingAngle) * this.wingAmplitude;
  this.wingR.rotation.z = Math.PI / 3 - Math.cos(this.wingAngle) * this.wingAmplitude;
  this.wingLT.rotation.z = -Math.sin(this.wingAngle) * this.wingAmplitude;
  this.wingRT.rotation.z = Math.sin(this.wingAngle2) * this.wingAmplitude;
  this.threegroup.position.y += Math.sin(this.wingAngle-2) * this.bodyAmplitude;
}

Dragon.prototype.prepareToFire = function(s) {

  // This is the function that implements the first part of the dragon animation when it needs to throw the fire
  // all the values of the final rotation or position are conditioned on the fire power value passed as s

  var _this = this;
  var speed = .7*globalSpeedRate;
  TweenLite.to(this.head.rotation, speed, {
    x: -s * .12,
    ease: Back.easeOut
  });
  TweenLite.to(this.head.position, speed, {
    z: 80 - s * 2.2,
    y: s * 2.2,
    ease: Back.easeOut
  });
  TweenLite.to(this.mouth.rotation, speed, {
    x: s * .18,
    ease: Back.easeOut
  });
  
  TweenLite.to(this.smile.position, speed/2, {
    z:75,
    y:10,
    ease: Back.easeOut
  });
  TweenLite.to(this.smile.scale, speed/2, {
    x:0, y:0,
    ease: Back.easeOut
  });
  
  TweenMax.to(this.noseL.scale, speed, {
    x: 1 + s * .1,
    y: 1 + s * .1,
    ease: Back.easeOut
  });
  TweenMax.to(this.noseR.scale, speed, {
    x: 1 + s * .1,
    y: 1 + s * .1,
    ease: Back.easeOut
  });
  TweenMax.to(this.eyeL.scale, speed, {
    y: 1 + s * .01,
    ease: Back.easeOut
  });
  TweenMax.to(this.eyeR.scale, speed, {
    y: 1 + s * .01,
    ease: Back.easeOut
  });
  TweenMax.to(this.irisL.scale, speed, {
    y: 1 + s * .05,
    z: 1 + s * .05,
    ease: Back.easeOut
  });
  TweenMax.to(this.irisR.scale, speed, {
    y: 1 + s * .05,
    z: 1 + s * .05,
    ease: Back.easeOut
  });
  TweenMax.to(this.irisL.position, speed, {
    y: 40 + s * .8,
    z: 44 - s * .4,
    ease: Back.easeOut
  });
  TweenMax.to(this.irisR.position, speed, {
    y: 40 + s * .8,
    z: 44 - s * .4,
    ease: Back.easeOut
  });
  TweenMax.to(this.earL.rotation, speed, {
    x: -s * .1,
    y: -s * .1,
    ease: Back.easeOut
  });
  TweenMax.to(this.earR.rotation, speed, {
    x: -s * .1,
    y: s * .1,
    ease: Back.easeOut
  });
  TweenMax.to(this.wingL.rotation, speed, {
    z:- s * .1,
    ease: Back.easeOut
  });
  TweenMax.to(this.wingR.rotation, speed, {
    z: + s * .1,
    ease: Back.easeOut
  });
  TweenMax.to(this.body.rotation, speed, {
    x: -s * .05,
    ease: Back.easeOut
  });
  TweenMax.to(this.body.scale, speed, {
    y: 1 + s * .01,
    ease: Back.easeOut
  });
  TweenMax.to(this.body.position, speed, {
    z: -s * 6,
    ease: Back.easeOut
  });

  TweenMax.to(this.tail1.rotation, speed, {
    x:  -Math.PI/2 * this.tailAmplitude,
    ease: Back.easeOut
  });

}

Dragon.prototype.Fire = function(s) {

  // This is the function that implements the animation of the dragon when it is actually throwing fire 

  var _this = this;
  var FireEffect = 1 - (s / maxFireRate);
  var speed = .1*globalSpeedRate;
  timeFire = Math.round(s * 10);

  TweenLite.to(this.head.rotation, speed, {
    x: s * -.05,
    ease: Back.easeOut
  });
  TweenLite.to(this.head.position, speed, {
    z: 80 + s * 2.4,
    y: -s * .4,
    ease: Back.easeOut
  });
  
  TweenLite.to(this.smile.position, speed*2, {
    z:82,
    y:5,
    ease: Strong.easeIn
  });
  
  TweenLite.to(this.smile.scale, speed*2, {
    x:1,
    y:1,
    ease: Strong.easeIn
  });
  

  TweenMax.to(this.noseL.scale, speed, {
    y: FireEffect,
    ease: Strong.easeOut
  });
  TweenMax.to(this.noseR.scale, speed, {
    y: FireEffect,
    ease: Strong.easeOut
  });
  TweenMax.to(this.noseL.position, speed, {
    y: 40, // - (FireEffect * 5),
    ease: Strong.easeOut
  });
  TweenMax.to(this.noseR.position, speed, {
    y: 40, // - (FireEffect * 5),
    ease: Strong.easeOut
  });
  TweenMax.to(this.irisL.scale, speed, {
    y: FireEffect/2,
    z: 1,
    ease: Strong.easeOut
  });
  TweenMax.to(this.irisR.scale, speed, {
    y: FireEffect/2,
    z: 1,
    ease: Strong.easeOut
  });
  TweenMax.to(this.eyeL.scale, speed, {
    y: FireEffect/2,
    ease: Back.easeOut
  });
  TweenMax.to(this.eyeR.scale, speed, {
    y: FireEffect/2,
    ease: Back.easeOut
  });

  TweenMax.to(this.wingL.rotation, speed, {
    z: -Math.PI / 2 + s * .15,
    ease: Back.easeOut
  });
  TweenMax.to(this.wingR.rotation, speed, {
    z: Math.PI / 2 - s * .15,
    ease: Back.easeOut
  });

  TweenMax.to(this.body.rotation, speed, {
    x: s * 0.02,
    ease: Back.easeOut
  });
  TweenMax.to(this.body.scale, speed, {
    y: 1 - s * .03,
    ease: Back.easeOut
  });
  TweenMax.to(this.body.position, speed, {
    z: s * 2,
    ease: Back.easeOut
  });

  TweenMax.to(this.irisL.position, speed*7, {
    y: 40,
    ease: Back.easeOut
  });
  TweenMax.to(this.irisR.position, speed*7, {
    y: 40,
    ease: Back.easeOut
  });
  TweenMax.to(this.earR.rotation, speed*3, {
    x: s * .20,
    y: s * .20,
    ease: Back.easeOut
  });
  TweenMax.to(this.earL.rotation, speed*3, {
    x: s * .20,
    y: -s * .20,
    ease: Back.easeOut,
    onComplete: setTimeout(function() {
      _this.backToNormal(s);
      fireRate = s;
      console.log(fireRate);
    },2000)
  });
}

Dragon.prototype.backToNormal = function(s) {

  // this is the function that implements the animation of the dragon when it has finished throwing the fire 
  // and all the parts of the model needs to go back to their original pose.

  var _this = this;
  var speed = 1*globalSpeedRate;
  TweenLite.to(this.head.rotation, speed, {
    x: 0,
    ease: Strong.easeInOut
  });
  TweenLite.to(this.head.position, speed, {
    z: 80,
    y: 0,
    ease: Back.easeOut
  });
  TweenLite.to(this.mouth.rotation, speed, {
    x: 0,
    ease: Strong.easeOut
  });
  TweenMax.to(this.noseL.scale, speed, {
    x: 1,
    y: 1,
    ease: Strong.easeInOut
  });
  TweenMax.to(this.noseR.scale, speed, {
    x: 1,
    y: 1,
    ease: Strong.easeInOut
  });
  TweenMax.to(this.noseL.position, speed, {
    y: 40,
    ease: Strong.easeInOut
  });
  TweenMax.to(this.noseR.position, speed, {
    y: 40,
    ease: Strong.easeInOut
  });
  TweenMax.to(this.irisL.scale, speed, {
    y: 1,
    z: 1,
    ease: Back.easeOut
  });
  TweenMax.to(this.irisR.scale, speed, {
    y: 1,
    z: 1,
    ease: Back.easeOut
  });
  TweenMax.to(this.irisL.position, speed*.7, {
    y: 40,
    z:44,
    ease: Back.easeOut
  });
  TweenMax.to(this.irisR.position, speed*.7, {
    y: 40,
    z: 44,
    ease: Back.easeOut
  });
  TweenMax.to(this.eyeL.scale, speed, {
    y: 1,
    ease: Strong.easeOut
  });
  TweenMax.to(this.eyeR.scale, speed, {
    y: 1,
    ease: Strong.easeOut
  });
  TweenMax.to(this.body.rotation, speed, {
    x: 0,
    ease: Back.easeOut
  });
  TweenMax.to(this.body.scale, speed, {
    y: 1,
    ease: Back.easeOut
  });
  TweenMax.to(this.body.position, speed, {
    z: 0,
    ease: Back.easeOut
  });

  TweenMax.to(this.wingL.rotation, speed*1.3, {
    z: -Math.PI / 2,
    ease: Back.easeInOut
  });
  TweenMax.to(this.wingR.rotation, speed*1.3, {
    z: Math.PI / 2,
    ease: Back.easeInOut
  });

  TweenMax.to(this.earL.rotation, speed*1.3, {
    x: 0,
    y: 0,
    ease: Back.easeInOut
  });
  TweenMax.to(this.earR.rotation, speed*1.3, {
    x: 0,
    y: 0,
    ease: Back.easeInOut,
    onComplete: function() {
      _this.isFire = false;
      timeSmoke = Math.round(s * 5);
      firing = false;
      if(background_playing) background.fade(0.3,1,1000);
    }
  });

  TweenMax.to(this.tail1.rotation, speed*1.3, {
    x: -Math.PI/2,
    ease: Back.easeOut
  });

}

function makeCube(mat, w, h, d, posX, posY, posZ, rotX, rotY, rotZ) {
  var geom = new THREE.BoxGeometry(w, h, d);
  var mesh = new THREE.Mesh(geom, mat);
  mesh.position.x = posX;
  mesh.position.y = posY;
  mesh.position.z = posZ;
  mesh.rotation.x = rotX;
  mesh.rotation.y = rotY;
  mesh.rotation.z = rotZ;
  return mesh;
}

function makeWing(mat, w, h, d, posX, posY, posZ, rotX, rotY, rotZ) {

  // this is the function that actually creates the mesh for the lower part of the wing and it is shaped as a
  // paralleleipiped but with a trapezoid base and so i first create the cylinder with a square base and then 
  // I scale the geometry to the correct proportions.

  var group = new THREE.Group();
  group.position.set(posX, posY-h/2, posZ);
  
  var geometry = new THREE.CylinderGeometry( 0.8 / Math.sqrt( 2 ), 1 / Math.sqrt( 2 ), 1, 4, 1 );
  geometry.rotateY( Math.PI / 4 );
  geometry.scale(w,h,d);

  var mesh = new THREE.Mesh(geometry,mat);
  mesh.position.y = h/2;
  group.add(mesh);
  return group;
}

function makeWingTop(mat, w, h, d, posX, posY, posZ, rotX, rotY, rotZ) {

  // this is the function that actually creates the mesh for the upper part of the wing 

  var group = new THREE.Group();
  group.position.set(posX, posY-h/2, posZ);
  
  var geometry = new THREE.CylinderGeometry(0.0, 1 / Math.sqrt( 2 ) , 1, 4, 1 );
  geometry.rotateY( Math.PI / 4 );
  geometry.scale(w,h,d);

  var mesh = new THREE.Mesh(geometry,mat);
  mesh.position.y = h/2;
  group.add(mesh);
  return group;
}

function makeTailPart(mat, w, h, d, posX, posY, posZ, rotX, rotY, rotZ){

  // this is the function that creates the mesh for each part of the tail

  var group = new THREE.Group();
  group.position.set(posX, posY, posZ);
  group.rotation.x = rotX;
  group.rotation.y = rotY;
  group.rotation.z = rotZ;
  
  var geometry = new THREE.CylinderGeometry( w,h,d);

  var mesh = new THREE.Mesh(geometry,mat);
  mesh.position.y = d/2*0.7;
  group.add(mesh);
  return group;
}

function makeLeg(mat, w, h, d, posX, posY, posZ, rotX, rotY, rotZ){

  // this is the function that creates the mesh for each part of the leg
  
  var geometry = new THREE.CylinderGeometry( w,h,d);

  var mesh = new THREE.Mesh(geometry,mat);
  mesh.position.x = posX;
  mesh.position.y = posY;
  mesh.position.z = posZ;
  mesh.rotation.x = rotX;
  mesh.rotation.y = rotY;
  mesh.rotation.z = rotZ;
  return mesh;
}

function createDragon(color) {
  dragon = new Dragon(color);
  scene.add(dragon.threegroup);
}

Dragon.prototype.onLeftKeyPressed = function(){

  // this is the function that needs to be called when the player has clicked the left key in order to execute the
  // correct animation of the dragon and change its position and orientation during the animation.

  TweenMax.to(this.threegroup.position, 1, {
    x: this.lane*1700,
    ease: Back.easeOut,
  });
  var bezier = {
    type: "cubic",
    values: [{
      z: 0
    }, {
      z: -Math.PI/4
    }, {
      z: -Math.PI/6
    }, {
      z: 0
    }]
  };
  TweenMax.to(this.threegroup.rotation, 1, {
    bezier: bezier,
    ease: Back.easeOut
  });
}

Dragon.prototype.onRightKeyPressed = function(){

  // this is the function that needs to be called when the player has clicked the right key in order to execute the
  // correct animation of the dragon and change its position and orientation during the animation.

  TweenMax.to(this.threegroup.position, 1, {
    x: this.lane*1700,
    ease: Back.easeOut
  });
  var bezier = {
    type: "cubic",
    values: [{
      z: 0
    }, {
      z: Math.PI/4
    }, {
      z: Math.PI/6
    }, {
      z: 0
    }]
  };
  TweenMax.to(this.threegroup.rotation, 1, {
    bezier: bezier,
    ease: Back.easeOut
  });
}

Dragon.prototype.onUpKeyPressed = function(){

  // this is the function that needs to be called when the player has clicked the up key in order to execute the
  // correct animation of the dragon and change its position.

  TweenMax.to(this.threegroup.position, 1, {
    y: this.vertical_lane*1000 + 1400,
    ease: Back.easeOut,
  });
}

Dragon.prototype.onDownKeyPressed = function(){

  // this is the function that needs to be called when the player has clicked the up key in order to execute the
  // correct animation of the dragon and change its position.

  TweenMax.to(this.threegroup.position, 1, {
    y: this.vertical_lane*1000 +1400,
    ease: Back.easeOut,
  });
}