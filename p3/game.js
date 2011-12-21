/**
 * sets up the game. dont use var to make the variables global.
 */
function setup() {
  shadows = true;
  
  camera.pos = [0, -16, 22];

  emptyImg = new Image();   // Create new img element
  emptyImg.src = 'img/emptyImg.png';	
  roomImg = new Image();   // Create new img element
  roomImg.src = 'img/roomImg.png';
  keyImg = new Image();   // Create new img element
  keyImg.src = 'img/key.png';
  puzzleSplash = new Image();
  puzzleSplash.src = 'img/firstPuzzleSplash.jpg';
  keySplash = new Image();
  keySplash.src = 'img/firstPuzzleSplash.jpg';
  splashImage = new Image();
  
  showFlash = false;
  
  size = 17;
  
  //init level
  pxRoomSize = 15;
  level = new Dungeon(size,pxRoomSize);
  
  currentRoom = level.dungeon[level.spawnX][level.spawnY];
  currentRoom.enemyArray = new Array();
  currentRoom.enable();
  
  player = new Player([0, 0, 1], [1, 1, 1], pxRoomSize);
  
  light = player.light;
  
  console.log(currentRoom.type);

}

function restart() {
  objectManager.clear();
  setup();
  if (!statsOn) {
    $("loss").style.display = "none";
    $("win").style.display = "none";
    $("game").style.display = "block";    
  }
}

function gameOver() {
  if (!statsOn) {
    $("game").style.display = "none";
    $("loss").style.display = "block";
  } else {
    
  }
  game.over(restart);
}

function win() {
  if (!statsOn) {
    $("game").style.display = "none";
    $("win").style.display = "block";
  } else {

  }
  game.over(restart);    
}

function  adjustScreen() {
  display.width = window.innerWidth;
  display2.width = window.innerWidth;
  display2.height = window.innerHeight;
  display.height = window.innerHeight;
  setTimeout(adjustScreen, 3000);
}

/**
 * Start
 */
setup();
// stats on == no landing page
if (statsOn) {
  game.start();
} else {
  adjustScreen();
  $("instr").innerHTML += "GAME LOADED<br\>Click to Play";
  $("landing").onclick = function() {
  $("landing").style.display = "none";
    $("game").style.display = "block";
    game.start();
  };
}


