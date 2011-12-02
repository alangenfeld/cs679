
function Room(size) {
  this.walls = new Array();
  
  var size = size;
  
  this.walls.push(new Plane([0,0,0], size, size, 0, [0,0,0]));
  this.walls.push(new Plane([0,size/2,size/4], size/2, size, -90, [1,0,0]));
  this.walls.push(new Plane([size/2,0,size/4], size, size/2, 90, [0,1,0]));
  this.walls.push(new Plane([-size/2,0,size/4], size, size/2, -90, [0,1,0]));
  
}
Room.prototype = new GameObject;
