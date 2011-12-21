function Room(size, doors, floorMaterial) {
  this.walls = new Array();
  if (doors) {
    this.doors = doors;
  } else {
    this.doors = [false, false, false, false];
  }
  
  this.size = size;

  // floor  
  this.walls.push(new Plane([0,0,0], size, size, 0, [0,0,0], floorMaterial));

  // north
  if (this.doors[0]) {
    this.walls.push(new Wall(
		      [0,size/2,size/4], size/2, size,
		      90, [-1,0,0],
		      0
		    ));
  } else {
    this.walls.push(new Plane([0,size/2,size/4], size/2, size, -90, [1,0,0], "wall.png"));
  }

  // east
  if (this.doors[1]) {
    this.walls.push(new Wall(
		      [size/2,0,size/4], size, size/2, 
		      90, [0,1,0],
		      90
		    ));
  } else {
    this.walls.push(new Plane([size/2,0,size/4], size, size/2, 90, [0,1,0], "wall.png"));
  }  
  
  
  // west
  if (this.doors[2]) {
    this.walls.push(new Wall(
		      [-size/2,0,size/4], size, size/2, 
			-90, [0,1,0],
		      -90
		    ));
  } else {
    this.walls.push(new Plane([-size/2,0,size/4], size, size/2, -90, [0,1,0], "wall.png"));
  }

  // south
  if (this.doors[3]) {
    this.walls.push(new Plane([0, -size/2, .01], size/5, size/5, 0, [0,0,0], "floor.png"));
  }

  this.shutdown = function() {
    for(var i in this.walls) {
      this.walls[i].shutdown();
    }
  };
  
}
Room.prototype = new GameObject;
