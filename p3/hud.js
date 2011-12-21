function HUD() {
  
  this.fade = 0;

  this.init();

  this.draw = function(){
    this.fade += .06;
    
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, 155, 155);

    var offsetx = currentRoom.x - 2;
    var offsety = currentRoom.y - 2;
    for(var y = 0; y<5; y++){
      for(var x = 0; x<5; x++){
    	var someRoom = level.dungeon[offsety+y][offsetx+x];
    	if(someRoom == null || someRoom.visited == false){
    	  ctx.drawImage(emptyImg,x*30,y*30);
    	}
    	else{
    	  ctx.drawImage(roomImg,x*30,y*30);
    	  ctx.fillStyle =  "rgba(0, 0, 0, 1)";
    	  if(someRoom.type.indexOf("n")!=-1){ctx.fillRect (x*30+13, y*30, 4, 4);}
    	  if(someRoom.type.indexOf("s")!=-1){ctx.fillRect (x*30+13, y*30+28, 4, 2);}
    	  if(someRoom.type.indexOf("e")!=-1){ctx.fillRect (x*30+28, y*30+13, 2, 4);}
	  if(someRoom.type.indexOf("w")!=-1){ctx.fillRect (x*30, y*30+13, 2, 4);}
	  if(someRoom.x == currentRoom.x && someRoom.y == currentRoom.y){
	    ctx.fillStyle =  "rgba(255, 255, 255, "+(((Math.sin(this.fade)+1)/2)*.3 + .3) +")";
	    ctx.fillRect (x*30+3, y*30+3, 24, 24);
	  }
    	}
      }
    }

    var sanityPos = display.width - 230;

    ctx.fillStyle = "#808080";
    ctx.fillRect(sanityPos - 5, 35, 210, 30);

    ctx.fillStyle = "#000000";
    ctx.fillRect(sanityPos, 40, 200, 20);

    ctx.fillStyle = "#008000";
    ctx.fillRect(sanityPos, 40, 2*player.sanity, 20);

    ctx.font = "20pt sans-serif";    
    ctx.fillText("Sanity", sanityPos + 60, 25);
  };
}
HUD.prototype = new GameObject;
