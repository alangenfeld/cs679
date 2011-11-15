/**
 * Utilities
 */

$("lightsOn").onclick = function() {
  light.ambient = [.4, .4, .4];  
};
$("lightsOff").onclick = function() {
  light.ambient = [.01, .01, .01];
};


var light = new Light([0,0,3]);
var room = new Room();

var box = new Box([0, 0, 1], [1, 1, 1]);

game.start();
