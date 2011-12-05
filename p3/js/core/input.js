
/**
 * Mouse singleton
 */
function Mouse( display ) {
  this.x = 0;
  this.y = 0;
  this.leftPressed = false;
  this.display = display;
  this.rightPressed = false;


  function press(e) {
    if(e.which == 1) {
      this.leftPressed = true;
    } else if(e.which == 3) {
      this.rightPressed = true;
    }
  };
  this.display.onmousedown = press.bind(this);
  
  function unpress(e) {
    if(e.which == 1) {
      this.leftPressed = false;
    } else if(e.which == 3) {
      this.rightPressed = false;
    }
  };
  this.display.onmouseup = unpress.bind(this);

  function move(e) {
    this.x = e.offsetX? e.offsetX: e.layerX;
    this.y = e.offsetY? e.offsetY: e.layerY;
  };
  this.display.onmousemove = move.bind(this);

  // disable context menu
  function disableContextMenu(e) {
    return false;
  };
  this.display.oncontextmenu = disableContextMenu.bind(this);

  // prevent double click from highlighting text 
  this.display.onselectstart = function () {
    return false;
  };
}
var mouse = new Mouse( display );
  
/**
 * Keyboard singleton
 */
function Keyboard() {
  this.left = false;
  this.right = false;
  this.up = false;
  this.down = false;
  this.space = false;
  this.z = false;
  this.enter = false;

  function handleKeyDown(e) {
    if (e.keyCode == 37 || e.keyCode == 65) {
      this.left = true;
    } else if (e.keyCode == 39 || e.keyCode == 68) {
      this.right = true;
    } else if (e.keyCode == 87 || e.keyCode == 38) {
      this.up = true;
    } else if (e.keyCode == 83 || e.keyCode == 40) {
      this.down = true;
    } else if(e.keyCode == 32) {
      this.space = true;
    } else if(e.keyCode == 90) {
      this.z = true;
    } else if(e.keyCode == 13) {
      this.enter = true;
    }
  };
  window.onkeydown = handleKeyDown.bind(this);
  
  function handleKeyUp(e) {
    if (e.keyCode == 37 || e.keyCode == 65) {
      this.left = false;
    } else if (e.keyCode == 39 || e.keyCode == 68) {
      this.right = false;
    } else if (e.keyCode == 87 || e.keyCode == 38) {
      this.up = false;
    } else if (e.keyCode == 83 || e.keyCode == 40) {
      this.down = false;
    } else if(e.keyCode == 32) {
      this.space = false;
    } else if(e.keyCode == 90) {
      this.z = false;
    } else if(e.keyCode == 13) {
      this.enter = false;
    }
  };
  window.onkeyup = handleKeyUp.bind(this);
}
var keyboard = new Keyboard;



