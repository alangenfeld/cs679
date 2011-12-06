	function GameRoom(type, x, y, pxSize){
		//say this is a 6x6 room
		//(0,0) is bottom left
		var size = 5;
		this.type = type;
		this.x = x;
		this.y = y;
		this.grid = new Array(5);
		
		for(var x = 0; x<size; x++){
			this.grid[x] = new Array(5);
		}
		
		//add items to the room here randomly
		
		var randX = Math.round(Math.random()*4);
		var randY = Math.round(Math.random()*4);
		
		//we minus 3 to center it
		//TODO can we disable a box so that the current room's box is the only one shown?
		var someBox = new Box([(randX-2)*(pxSize/5),(randY-2)*(pxSize/5),0], [pxSize/5,pxSize/5,1]);
		
		var enemyRand = Math.random();
		var enemyProb = 0.6;
		this.enemies = new Array();
		if(enemyRand <= enemyProb){
			var enemyType = Math.floor(Math.random() * 2);
			var enemyRandX = Math.random()
			if(enemyType === 0){
				this.enemies.push(new Enemy([Math.random() * 5, Math.random() * 5, 1], 3, ai0, []));
			}
			else{
				this.enemies.push(new Enemy([Math.random() * 5, Math.random() * 5, 1], 3, ai1, []));
				this.enemies.push(new Enemy([Math.random() * 5, Math.random() * 5, 1], 3, ai1, []));
				this.enemies.push(new Enemy([Math.random() * 5, Math.random() * 5, 1], 3, ai1, []));
				this.enemies.push(new Enemy([Math.random() * 5, Math.random() * 5, 1], 3, ai1, []));
				this.enemies.push(new Enemy([Math.random() * 5, Math.random() * 5, 1], 3, ai1, []));
			}
		}
		
		//debugger;
		someBox.render = false;
		this.grid[randX][randY] = someBox;
		
		//we can also decide what kind of room it is here. puzzle room etc
		
		this.checkCollisionAt = function(x,y){
			//console.log("x = "+x+" y="+y);
			//if(this.grid[x][y]!=null){
				//thing = this.grid[x][y];
				//thing.collide();?
				//check type and do somehting based on that?
			//}
		}
		this.update = function(){
			for(e in this.enemies){
				this.enemies[e].update();
			}
		}
		
		this.enable = function(){
			for(e in this.enemies){
				this.enemies[e].enable();
			}
			for(var a = 0; a<size; a++){
				for(var b = 0; b<size; b++){
					var object = this.grid[a][b];
					if(object != null){
						object.render = true;
					}
				}
			}
			console.log("moving to the next room with type : "+currentRoom.type+" at "+currentRoom.x+" y "+currentRoom.y);
		}
		
		this.disable = function(){
			for(e in this.enemies){
				this.enemies[e].disable();
			}
			for(var a = 0; a<size; a++){
				for(var b = 0; b<size; b++){
					var object = this.grid[a][b];
					if(object != null){
						object.render = false;
					}
				}
			}
		}
		
		this.init();
	}
	
	
	
	function genRoomString(max, currentType, x, y){
		if(max < 1)return currentType;
		var draw = "nsew";
		//console.log("room at "+x+" "+y);
		
		draw = difStrings(draw, currentType);
		
		//can't go north
		if(y==0){draw = draw.replace("n","");}
		//can't go south
		if(y==size-1){draw = draw.replace("s","");}
		//can't go west
		if(x==0){draw = draw.replace("w","");}
		//can't go west
		if(x==size-1){draw = draw.replace("e","");}
		
		//console.log("possible = "+draw);
		var numDir = draw.length;
		var count = Math.round(Math.random()*numDir);
		if(count<1)count = 1;
		if(max<count)count = max;
		//console.log("count = "+count);
		for(var x = 0; x<count; x++){
			var index = Math.round(Math.random()*(draw.length-1));
			currentType = currentType + draw.charAt(index);
			draw = draw.replace(draw.charAt(index),"");
		}
		//console.log("type = "+currentType);
		return currentType;
	}
	
	function mergeStrings(a,b){
		for(var i = 0; i<b.length; i++){
			if(a.indexOf(b.charAt(i))== -1){
				a = a + b.charAt(i);
			}
		}
		return a;
	}

	function difStrings(a,b){
		for(var i = 0; i<b.length; i++){
			a = a.replace(b.charAt(i),"");
		}
		return a;
	}
GameRoom.prototype = GameObject();