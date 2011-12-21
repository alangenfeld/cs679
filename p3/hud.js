function HUD() {
  
  this.fade = 0;

  this.init();
  
  var messTimer = 0;
  this.mess = "";
  
  this.showMessage = function(message){
  	this.MessTimer = 1;
  	this.mess = message;
  }
  
  this.draw = function(){
    this.fade += .04;
    
    if(messTimer>0){
    	ctx.fillStyle = "#808080";
    	ctx.font = "20pt sans-serif";    
    	ctx.fillText(this.mess, 0, display.height-25);
    }
    
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

	ctx.fillStyle = "#808080";
    ctx.font = "20pt sans-serif";    
    ctx.fillText("Sanity", sanityPos + 60, 25);

    ctx.fillStyle = "#808080";
    ctx.fillRect(215, 50, 50, 50);
    ctx.fillStyle = "#000000";
    ctx.fillRect(220, 55, 40, 40);

    if (player.hasKey) {
      ctx.fillStyle = "#000080";
      ctx.fillText("Magic Lantern", 170, 25);

      ctx.drawImage(keyImg, 220, 55);
    } else {
      ctx.fillStyle = "#808080";
      ctx.fillText("No Item", 190, 25);
    }

	 if(showFlash==true){
    	ctx.drawImage(splashImage, display.width/2-400,display.height/2-300);
    }

  };
}
HUD.prototype = new GameObject;
