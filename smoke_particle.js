// this are possible shades for the fire color. The color are green, red and gold each associated to a dragon

var fire_color = [[[255,205,74],[247,34,50]],[[13,119,27],[29,219,55]],[[255,229,112],[243,250,44]]]

SmokeParticle = function() {

  // this function creates an instance of the fire particle

  this.color = {
    r: 0,
    g: 0,
    b: 0
  };
  var particleMat = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity: .5,
    shading: THREE.FlatShading
  });
  this.mesh = makeCube(particleMat, 4, 4, 4, 0, 0, 0, 0, 0, 0);
  awaitingSmokeParticles.push(this);
  this.collided = false;
}

SmokeParticle.prototype.initialize = function() {
  this.mesh.rotation.x = 0;
  this.mesh.rotation.y = 0;
  this.mesh.rotation.z = 0;

  this.mesh.position.x = 0;
  this.mesh.position.y = 0;
  this.mesh.position.z = 0;

  this.mesh.scale.x = 1;
  this.mesh.scale.y = 1;
  this.mesh.scale.z = 1;

  this.mesh.material.opacity = .5;
  awaitingSmokeParticles.push(this);
}

SmokeParticle.prototype.updateColor = function() { 
  this.mesh.material.color.setRGB(this.color.r, this.color.g, this.color.b);
}

SmokeParticle.prototype.fly = function() {

  // this is the function that needs to create the animation of the smoke particles after throwing fire

  var _this = this;
  var speed = 10*globalSpeedRate;
  var ease = Strong.easeOut;
  var initX = this.mesh.position.x;
  var initY = this.mesh.position.y;
  var initZ = this.mesh.position.z;
  var bezier = {
    type: "cubic",
    values: [{
      x: initX,
      y: initY,
      z: initZ
    }, {
      x: initX + 30 - Math.random() * 10,
      y: initY + 20 + Math.random() * 2,
      z: -(initZ + 20)
    }, {
      x: initX + 10 + Math.random() * 20,
      y: initY + 40 + Math.random() * 5,
      z: -(initZ - 30)
    }, {
      x: initX + 50 - Math.random() * 20,
      y: initY + 70 + Math.random() * 10,
      z: -(initZ + 20)
    }]
  };
  TweenMax.to(this.mesh.position, speed, {
    bezier: bezier,
    ease: ease
  });
  TweenMax.to(this.mesh.rotation, speed, {
    x: Math.random() * Math.PI * 3,
    y: Math.random() * Math.PI * 3,
    ease: ease
  });
  TweenMax.to(this.mesh.scale, speed, {
    x: 5 + Math.random() * 5,
    y: 5 + Math.random() * 5,
    z: 5 + Math.random() * 5,
    ease: ease
  });
  //*
  TweenMax.to(this.mesh.material, speed, {
    opacity: 0,
    ease: ease,
    onComplete: function() {
      _this.initialize();
    }
  });
  //*/
}

SmokeParticle.prototype.collides = function(obj,sp,scene,exp,fp){

  // this is the funcion that check if a fire article has collided with some object
  /*
    param obj: is the array of towers present in the game.
    param sp: is the array of spears present in the game.
    param scene: is the scene object where everything is being rendered.
    param exp: is the array containing all the explosion animations that needs to be displayed.
    param fp: is the fire power accumulated up to the point when the fire particle has been created.
    return points: the points gained if a destruction has occured
  */

  var points = 0;
  var fireMinX = this.mesh.position.x - 125;
  var fireMaxX = this.mesh.position.x + 125;
  var fireMinY = this.mesh.position.y - 125;
  var fireMaxY = this.mesh.position.y + 125;
  var fireMinZ = this.mesh.position.z - 125;
  var fireMaxZ = this.mesh.position.z + 125;

  /*
    for every tower in the game I check if the current fire particle collides with it. If the response is positive 
    and the fire power is enough to destroy that particular tower, then I create a new explosion animation of the tower,
    I remove the tower from the scene and remember that the tower is destroyed and finally compute the points gained 
    based on the heght of the tower demolished.
  */

  for (var i = 0; i < obj.length; i++) {
    if (obj[i].collides(fireMinX, fireMaxX, fireMinY, 
        fireMaxY, fireMinZ, fireMaxZ)) {
      if (fp >= 7.5 && !obj[i].destroyed){
        exp.push(new ExplodeAnimation(obj[i].tower.position.x,obj[i].tower.position.y,obj[i].tower.position.z,scene));
        scene.remove(obj[i].tower);
        obj[i].destroyed = true;
        points += 5*obj[i].h; 
      }
      if (obj[i].h == 2000 && fp >= 5.0 && !obj[i].destroyed){
       exp.push(new ExplodeAnimation(obj[i].tower.position.x,obj[i].tower.position.y,obj[i].tower.position.z,scene));
       scene.remove(obj[i].tower);
       obj[i].destroyed = true;
       points += 5*obj[i].h;
      }
      if (obj[i].h == 1000 && fp >= 2.5 && !obj[i].destroyed) {
       exp.push(new ExplodeAnimation(obj[i].tower.position.x,obj[i].tower.position.y,obj[i].tower.position.z,scene));
       scene.remove(obj[i].tower);
       obj[i].destroyed = true;
       points += 5*obj[i].h;
      }
    }
  }

  /*
    Same thing happens for the spear object in the world, but now no additional points are gained
  */
  for (var i = 0; i < sp.length; i++) {
    if (!sp[i][0].destroyed && sp[i][0].collides(fireMinX, fireMaxX, fireMinY, 
        fireMaxY, fireMinZ, fireMaxZ)) {
      exp.push(new ExplodeAnimation(sp[i][0].mesh.position.x,sp[i][0].mesh.position.y,sp[i][0].mesh.position.z,scene));
      scene.remove(sp[i][0].mesh);
      sp[i][0].destroyed = true;
    }
  }
  return points;
}

SmokeParticle.prototype.fire = function(f,fs,color) {

  // this is the function that implements the firing animation of the fire particle.
  /*
    param f: is the fire power
    param fs: is an array containing the fire particles
    param color: is an index indicating what color the fire needs to be
  */

  var _this = this;
  var speed = 1*globalSpeedRate;
  var ease = Strong.easeOut;
  var initX = this.mesh.position.x;
  var initY = this.mesh.position.y;
  var initZ = this.mesh.position.z;

  TweenMax.to(this.mesh.position, speed, {
    x: this.mesh.position.x,
    y: initY-2*f,
    z: Math.min(initZ-300*f, initZ-400),
    ease: ease
  });
  TweenMax.to(this.mesh.rotation, speed, {
    x: Math.random() * Math.PI * 3,
    y: Math.random() * Math.PI * 3,
    ease: ease
  });

    var bezierScale = [{
      x:1,
      y:1,
      z:1
    },{
      x:f/maxFireRate+Math.random()*.3,
      y:f/maxFireRate+Math.random()*.3,
      z:f*15/maxFireRate+Math.random()*.3
    }, {
      x:f/maxFireRate+Math.random()*.5,
      y:f/maxFireRate+Math.random()*.5,
      z:f*15/maxFireRate+Math.random()*.5
    },{
      x:f*15/maxFireRate+Math.random()*.5,
      y:f*15/maxFireRate+Math.random()*.5,
      z:f*30/maxFireRate+Math.random()*.5
    },{
      x:f*15+Math.random()*5,
      y:f*15+Math.random()*5,
      z:f*15+Math.random()*5
    }];
  
  TweenMax.to(this.mesh.scale, speed * 2, {
    bezier:bezierScale,
    ease: ease,
    onComplete: function() {
      _this.initialize();
      fs.pop(_this);
    }
  });

  TweenMax.to(this.mesh.material, speed, {
    opacity: 0,
    ease: ease
  });
  //*
  c = fire_color[color];
  var bezierColor = [{
      r: c[0][0] / 255,
      g: c[0][1] / 255,
      b: c[0][2] / 255
    },{
      r: c[0][0] / 255,
      g: c[0][1] / 255,
      b: c[0][2] / 255
    },{
      r: c[0][0] / 255,
      g: c[0][1] / 255,
      b: c[0][2] / 255
    }, {
      r: c[1][0] / 255,
      g: c[1][1] / 255,
      b: c[1][2] / 255
    }, {
      r: 0 / 255,
      g: 0 / 255,
      b: 0 / 255
    }];
  
  
  TweenMax.to(this.color, speed, {
    bezier: bezierColor,
    ease: Strong.easeOut,
    onUpdate: function() {
      _this.updateColor();
    }
  });
  //*/
}

function getSmokeParticle() {
  var p;
  if (!awaitingSmokeParticles.length) {
    p = new SmokeParticle();
  }
  p = awaitingSmokeParticles.pop();
  return p;
}