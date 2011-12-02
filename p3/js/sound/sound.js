soundManager.url = 'js/sound/';
soundManager.flaseVersion = 9;
soundManager.useFlashBlock = true;

var sounds = new Array();
var soundFlags;
soundManager.onready(function() {
	//ID of sound, and the url path to the sound.
	//Loading all of the sounds.
	sounds["bgm0"] = soundManager.createSound({id: "bgm0", url: "js/sound/demo/coffin.mp3"});
	sounds["bgm0"].play();
	loopSound(sounds["bgm0"]);
	
});

function loopSound(sound){
	sound.play({
		onfinish: function() {
			loopSound(sound);
		}
	});
}