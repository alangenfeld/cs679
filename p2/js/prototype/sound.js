function SoundManager() {
    this.sounds = new Array();
    this.bindSound = function( soundID ){
	this.sounds.push( document.getElementById(soundID) );
    }
}
sound = new SoundManager();
sound.bindSound( "pawn0" );


