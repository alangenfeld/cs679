	function GameRoom(type, x, y){
		var size = 6;
		this.type = type;
		this.x = x;
		this.y = y;
		this.grid = new Array();
		for(var x = 0; x<size; x++){
			this.grid[new Array()];
		}
		
		//add items to the room here randomly
		//we can also decide what kind of room it is here. puzzle room etc
	}
	
	
	
	function genRoomString(max, currentType, x, y){
		if(max < 1)return currentType;
		var draw = "nsew";
		console.log("room at "+x+" "+y);
		
		draw = difStrings(draw, currentType);
		
		//can't go north
		if(y==0){draw = draw.replace("n","");}
		//can't go south
		if(y==size-1){draw = draw.replace("s","");}
		//can't go west
		if(x==0){draw = draw.replace("w","");}
		//can't go west
		if(x==size-1){draw = draw.replace("e","");}
		
		console.log("possible = "+draw);
		var numDir = draw.length;
		var count = Math.round(Math.random()*numDir);
		if(count<1)count = 1;
		if(max<count)count = max;
		console.log("count = "+count);
		for(var x = 0; x<count; x++){
			var index = Math.round(Math.random()*(draw.length-1));
			currentType = currentType + draw.charAt(index);
			draw = draw.replace(draw.charAt(index),"");
		}
		console.log("type = "+currentType);
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