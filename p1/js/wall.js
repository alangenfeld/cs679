/**
 * Wall that sheeps break over time.
 */

function Wall(width, height) {
  this.width = width;
  this.height = height;
  this.health = 1000;

  $("wallHp").innerHTML = this.health;
  this.init();

  this.draw = function() {
    ctx.fillStyle="#A6792A";
    var drawHeight = this.height * this.health / 1000;
	var srcHeight = 16 * this.health / 1000;
    if(drawHeight > 0) {
	  ctx.drawImage(resourceManager.getImage("fence"),
	      0, 16 - srcHeight,
		  480, srcHeight,
		  0, display.height - drawHeight,
		  this.width, drawHeight);
      //ctx.fillRect(0, display.height - drawHeight, this.width, drawHeight);
    }
  };

  this.add = function(health) {
    this.health += health;
    $("wallHp").innerHTML = this.health;
  }

  this.hit = function(dmg) {
    this.health -= dmg;
	if(this.health < 0) {
      this.health = 0;
      $("wallHp").innerHTML = "Destroyed";
	} else {
      $("wallHp").innerHTML = this.health;
	}
  };
}
Wall.prototype = new GameObject;


