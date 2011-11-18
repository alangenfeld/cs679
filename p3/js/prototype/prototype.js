/**
 * Utilities
 */

$("lightsOn").onclick = function() {
  light.ambient = [.4, .4, .4];  
};
$("lightsOff").onclick = function() {
  light.ambient = [.01, .01, .01];
};


var light = new Light([0,0,4]);
var room = new Room();
var boxes = Array();
boxes.push( new Box([3, 0, 2], [1, 1, 1]));
boxes.push( new Box([0, 3, 3], [1, 1, 1]));
boxes.push( new Box([-3, 0, 4], [1, 1, 1]));
boxes.push( new Box([0, -3, 1], [1, 1, 1]));
boxes.push( new Box([0, 0, 1], [1, 1, 1]));

game.start();
