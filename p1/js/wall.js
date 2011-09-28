/**
 * Wall that sheeps break over time.
 */

function Wall(width, height) {
  this.width = width;
  this.height = height;
  this.health = 1000;

  this.init();

  this.draw = function() {
    ctx.fillStyle="#A6792A";
	var drawHeight = this.height * this.health / 1000;
	if(drawHeight > 0) {
      ctx.fillRect(0, display.height - drawHeight, this.width, drawHeight);
	}
  };
}
Wall.prototype = new GameObject;

var wall = new Wall(display.width, g_player_size/2);
