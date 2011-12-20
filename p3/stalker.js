function Stalker(spawnRoom){

	this.room = spawnRoom;
	this.dirSet = false;
	this.dir = null;
	this.stalking;
	this.destination = [0,0];
	this.pos = [0,0];
	//get a random tile in the spawn room to spawn the stalker
	//set the pos
	//playerDirection
	
	
	this.update = function(){
		loadModel(this, "bugEyed");
  		this.color3d = [.5, 0, .5];
  		this.shaderName = "enemy";
		speed = .02;
		//if player is in the same room
		if(currentRoom == this.room){
			stalking = true;
			dirSet = false;
		}
		//else, move towards a random door
		else{
			if(!this.dirSet){
				var dirIndex = (Math.round(Math.random()*this.room.type.count));
				this.dir = this.room.type.charAt(dirIndex);
			}
		}
		
		//move towards your destination
		if(stalking){
			this.destination = [player.currX, player.currY];
		}
		else{
			switch(dir){
			//if it's n
				//pos == [];
			//if it's s
			//if it's e
			//if it's w
			}
		}
		
		//check to see if it has hit a door.
		//if so, move to a new room and set the dirset to false
		
		//if it collides with the player....?
	}



}

Stalker..prototype = new GameObject3D;