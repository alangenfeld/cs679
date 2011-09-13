function Ball() {

  this.x = 10;
  this.y = 10;
  this.Vx = 4;
  this.Vy = 4;
  this.init();

  this.update = function() {
    this.x += this.Vx;
    this.y += this.Vy;
    
    if (this.x > display.width) {
      this.Vx = -4;
    }
    if (this.x < 0) {
      this.Vx = 4;
    }
    if (this.y > display.height) {
      this.Vy = -4;
    }
    if (this.y < 0) {
      this.Vy = 4;
    }
    
  }

  this.draw = function() {
    ctx.fillRect(this.x, this.y, 10, 10);
  }

}
Ball.prototype = new GameObject;


ball = new Ball();

GameLoop();
