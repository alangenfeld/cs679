function Animation( obj, name, period ) {
    this.name = name;
    this.obj = obj;
    this.active = false;
    /// do next 

    this.period = period;
    this.tick = 0;
    

    /// Externally Defined Functions
    this.setEnvironments = function() {
	return ;
    }
    this.next = function() {
	return ;
    };
    this.draw = function() {
	return ;
    };

    
    this.init = function() {
	this.tick = 0;
	this.active = true;
	this.obj.onAnimation++;
	this.setEnvironments();
    }
    
    this.update = function() {
	if ( ! this.active ){
	    return ;
	}
	if ( this.tick < this.period ) {
	    this.tick++;
	    this.next();
	}else{
	    this.obj.onAnimation--;
	    this.active = false;
	}
    }
}
