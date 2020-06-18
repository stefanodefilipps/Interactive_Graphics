//////////////settings/////////
var movementSpeed = 150;
var totalObjects = 300;
var objectSize = 40;
var sizeRandomness = 4000;
var colors = [0xFF0FFF, 0xCCFF00, 0xFF000F, 0x996600, 0xFFFFFF];
/////////////////////////////////
var dirs = [];
var parts = [];

function ExplodeAnimation(x,y,z,scene)
{
  var geometry = new THREE.Geometry();
  
  for (i = 0; i < totalObjects; i ++) 
  { 
    var vertex = new THREE.Vector3();
    vertex.x = x;
    vertex.y = y;
    vertex.z = z;
  
    geometry.vertices.push( vertex );
    // the update deltas along the 3 axis direction of the current vertex when it will need to be updated
    dirs.push({x:(Math.random() * movementSpeed)-(movementSpeed/2),y:(Math.random() * movementSpeed)-(movementSpeed/2),z:(Math.random() * movementSpeed)-(movementSpeed/2)});
  }
  var material = new THREE.ParticleBasicMaterial( { size: objectSize,  color: 0x764848 });
  var particles = new THREE.ParticleSystem( geometry, material );
  
  this.object = particles;
  this.object.visible = true;
  // the life attribute indicates how many frame the animation will be rendered for
  this.life = 70;
  
  this.xDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  this.yDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  this.zDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  
  scene.add( this.object  ); 
  
  this.update = function(scene){
    // this is the function thath implements the animation of the actual explosion
    if (this.object.visible){
      var pCount = totalObjects;
      // for every vertex in the particle system we need to update their position along the 3 axis based on the deltas defined
      // during the creation of the system
      while(pCount--) {
        var particle =  this.object.geometry.vertices[pCount]
        particle.y += dirs[pCount].y;
        particle.x += dirs[pCount].x;
        particle.z += dirs[pCount].z;
      }
      this.object.geometry.verticesNeedUpdate = true;
      this.life-=1;
      if(this.life == 0){
        this.object.visible = false;
      }
    }
  }
  
}