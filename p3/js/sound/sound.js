soundManager.url = 'js/sound/';
soundManager.flaseVersion = 9;
soundManager.useFlashBlock = true;

var sounds = new Array();
var soundFlags;
soundManager.onready(function() {
	//ID of sound, and the url path to the sound.
	//Loading all of the sounds.
	sounds["bgm0"] = soundManager.createSound({id: "bgm0", url: "js/sound/demo/yewbicAmbient03.wav"});
	sounds["aiHit0"] = soundManager.createSound({id: "aiHit0", url: "sounds/Hit_Hurt9.wav"});
	sounds["aiBloodSplat"] = soundManager.createSound({id: "aiBloodSplat", url: "sounds/55234__slykmrbyches__splattt.mp3"});
	
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