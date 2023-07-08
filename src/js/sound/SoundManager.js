module.exports = class SoundManager {
    constructor(soundsUrl) {
        this.sounds = {};

        this.numCopies = 5;

        this.currentSoundName;

        this.createSounds(soundsUrl);

    }

    createSounds(soundsUrl) {
        for (var i = 0; i < soundsUrl.length; i++) {
            this.sounds[soundsUrl[i].name] = {index: 0, sounds:[]};

            for (var a = 0; a < this.numCopies; a++) {
                var sound = new Audio(soundsUrl[i].url);
                sound.volume = 0.5;
                this.sounds[soundsUrl[i].name].sounds.push(sound);
            }
        }
    }

    play(soundName) {
        this.currentSoundName = soundName;
        
        var currentIndex = this.sounds[soundName].index;
        this.sounds[soundName].sounds[currentIndex].play();
        this.sounds[soundName].index++;
        if(this.sounds[soundName].index >= this.sounds[soundName].sounds.length) {
            this.sounds[soundName].index = 0;
        }
    }

    playClean(soundName) {
        this.stopAllSounds();
        this.play(soundName);
    }

    setLooped(soundName, isLooped) {
        this.sounds[soundName].loop = isLooped;
    }

    setVolume(soundName, volume) {
        this.sounds[soundName].volume = volume;
    }

    stopSound(name) {
        this.sounds[name].currentTime = 0;
        this.sounds[name].pause();
    }

    stopAllSounds() {
        for (var name in this.sounds) {
            if (this.sounds.hasOwnProperty(name)) {
                this.stopSound(name);
            }
        }
    }
}