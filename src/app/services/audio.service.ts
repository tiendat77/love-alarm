import { Injectable } from '@angular/core';
import { NativeAudio } from '@capacitor-community/native-audio';

import { PlatformService } from './platform.service';

interface Sounds {
  [key: string]: string;
}

export const SOUNDS = {
  welcome: 'welcome',
  alarm_1: 'ring_1',
};

@Injectable({ providedIn: 'root' })
export class AudioService {

  private sounds: Sounds = {};
  private player: HTMLAudioElement = new Audio();

  constructor(
    private platform: PlatformService,
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
  }

  prepare(path = 'assets/sounds/') {
    return Promise.all([
      this.preload(SOUNDS.welcome, path + 'welcome.mp3'),
      this.preload(SOUNDS.alarm_1, path + 'love_alarm_1.mp3'),
    ]);
  }

  preload(key: string, location: string) {
    this.sounds[key] = location;

    if (!this.platform.isNative) {
      return Promise.resolve();
    }

    return NativeAudio.preload({
      assetId: key,
      assetPath: 'public/' + location,
      audioChannelNum: 1,
      isUrl: false
    });
  }

  play(key: string) {
    const location = this.sounds[key];

    if (!location) {
      return;
    }

    if (!this.platform.isNative) {
      this.player.src = location;
      this.player.load();
      this.player.play();
      return;
    }

    NativeAudio.play({
      assetId: key,
      time: 0,
    });
  }

}
