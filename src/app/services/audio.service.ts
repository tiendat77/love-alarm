import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

interface Sounds {
  [key: string]: string;
}

export const SOUND_WELCOME = 'welcome';
export const SOUND_RING_1 = 'ring_1';

@Injectable({ providedIn: 'root' })
export class AudioService {

  private isNative = false;
  private sounds: Sounds = {};
  private player: HTMLAudioElement = new Audio();

  constructor(
    private audio: NativeAudio,
    private platform: Platform,
  ) {
    this.initialize();
  }

  initialize() {
    /**
     * To fix error:
     *  Uncaught (in promise) DOMException: play() failed because the user didn't interact with the document first.
     */
    this.player.muted = false;
    this.player.autoplay = true;

    if (this.platform.is('hybrid')) {
      this.isNative = true;
    }
  }

  prepare(path = 'assets/sounds/') {
    return Promise.all([
      this.preload(SOUND_WELCOME, path + 'welcome.mp3'),
      this.preload(SOUND_RING_1, path + 'love_alarm_1.mp3'),
    ]);
  }

  preload(key: string, location: string) {
    this.sounds[key] = location;

    if (this.isNative) {
      return this.audio.preloadSimple(key, location);
    }

    return Promise.resolve(key);
  }

  play(key: string) {
    const location = this.sounds[key];

    if (!location) {
      return;
    }

    if (this.isNative) {
      this.audio.play(key);

    } else {
      this.player.src = location;
      this.player.load();
      this.player.play();
    }
  }

}
