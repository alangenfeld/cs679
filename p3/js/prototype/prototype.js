/**
 * Utilities
 */

$("lightsOn").onclick = function() {
  light.ambient = [.4, .4, .4];  
};
$("lightsOff").onclick = function() {
  light.ambient = [.01, .01, .01];
};

shadows = true;
camera.pos = [0, -18,25];
var light = new Light([0,0,5], true);
light.manualControl = true;
var room = new Room(15);
var boxes = Array();
var enemies = Array();

var boss = new ModelMan([0, 0, 3], "bugEyed");


boxes.push( new ColorBox([3, 0, 2], [1, 1, 1], [0,0,1]));
boxes.push( new ColorBox([0, 3, 3], [1, 1, 1]), [0,1,0]);
boxes.push( new ColorBox([-3, 0, 4], [1, 1, 1], [1,0,0]));
boxes.push( new ColorBox([0, -3, 1], [1, 1, 1], [1,1,0]));
boxes.push( new ColorBox([0, 0, 1], [1, 1, 1], [0,1,0]));

/*
for (var i in boxes) {
  boxes[i].rotating = true;
}

for (var i in enemies){
  enemies[i].rotating = true;
}
*/
game.start();
