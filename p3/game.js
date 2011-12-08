var statsOn = true;

shadows = true;
var canvas = document.getElementById("display");

var emptyImg = new Image();   // Create new img element
emptyImg.src = 'img/emptyImg.png';	
var roomImg = new Image();   // Create new img element
roomImg.src = 'img/roomImg.png';

var size = 17;

//init level
var pxRoomSize = 10;
var level = new Dungeon(size,pxRoomSize);

var currentRoom = level.dungeon[level.spawnX][level.spawnY];
currentRoom.enable();

var enemy = Array();
enemy.push(new Enemy([1,2,-1], [.3,.3,.3], ai1));
enemy.push(new Enemy([-2,3,-1], [.3,.3,.3], ai1));
enemy.push(new Enemy([-3,-2,-1], [.3,.3,.3], ai1));
enemy.push(new Enemy([2,0,-1], [.3,.3,.3], ai1));

var player = new Player([0, 0, 1], [1, 1, 1], pxRoomSize);

var light = player.light;

console.log(currentRoom.type);

//start the renderer
game.start();

function update(){	

}



