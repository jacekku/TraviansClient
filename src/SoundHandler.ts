import Utilities from "./Utilities";

type SoundType = "SFX" | "MUSIC";
type CollectionType = "WALKING";
class SoundHandler {
  private SFX: any = {
    axe_chop: import("./assets/sounds/sfx/axe_chop.mp3"),
    building_hammer: import("./assets/sounds/sfx/building_hammer.mp3"),
    pickaxe: import("./assets/sounds/sfx/pickaxe.wav"),
    water_splash: import("./assets/sounds/sfx/water_splash.mp3"),
    blacksmith_hammer: import("./assets/sounds/sfx/blacksmith_hammer.mp3"),
    WALKING: [
      import("./assets/sounds/sfx/walking/walking(2).mp3"),
      import("./assets/sounds/sfx/walking/walking(3).mp3"),
      import("./assets/sounds/sfx/walking/walking(4).mp3"),
      import("./assets/sounds/sfx/walking/walking(5).mp3"),
      import("./assets/sounds/sfx/walking/walking(6).mp3"),
      import("./assets/sounds/sfx/walking/walking(8).mp3"),
      import("./assets/sounds/sfx/walking/walking(9).mp3"),
    ],
  };
  private MUSIC: any = {};

  sfxVolume = 0.5;
  musicVolume = 0.5;

  constructor() {
    this.loadAllSounds();
  }
  playSound(soundName: string) {
    this.SFX[soundName].play();
  }

  playRandom(soundType: CollectionType) {
    const int = Utilities.getRandomInt(0, this.SFX[soundType].length);
    this.SFX[soundType][int].play();
  }

  loadAllSounds() {
    this.loadSoundsInObject(this.SFX);
  }
  loadSoundsInObject(obj: any) {
    Object.keys(obj).forEach((key) => {
      if (key.toUpperCase() == key) {
        this.loadSoundsInArray(obj[key]);
      } else {
        obj[key].then((source: any) => {
          obj[key] = new Audio(source.default);
        });
      }
    });
  }

  loadSoundsInArray(arr: any[]) {
    arr.forEach((promise, index) => {
      promise.then((source: any) => {
        arr[index] = new Audio(source.default);
      });
    });
  }

  changeVolume(volume: number, type: SoundType) {
    if (type == "SFX") {
      this.sfxVolume = volume;
      Object.values(this.SFX)
        .flat(2)
        .forEach((sound: any) => (sound.volume = this.sfxVolume));
    }
    if (type == "MUSIC") {
      this.musicVolume = volume;
      Object.values(this.MUSIC).forEach(
        (sound: any) => (sound.volume = volume)
      );
    }
  }
}

export default new SoundHandler();
