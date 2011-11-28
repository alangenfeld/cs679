
function Room() {
  this.walls = new Array();
  
  this.walls.push(new Plane([0,0,0], 10, 10, 0, [0,0,0]));
  this.walls.push(new Plane([0,5,2.5], 5, 10, -90, [1,0,0]));
  this.walls.push(new Plane([5,0,2.5], 10, 5, 90, [0,1,0]));
  this.walls.push(new Plane([-5,0,2.5], 10, 5, -90, [0,1,0]));
  
}
Room.prototype = new GameObject;
