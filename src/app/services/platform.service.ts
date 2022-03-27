import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class PlatformService {

  get isNative() {
    return this.platform.is('hybrid');
  }

  constructor(
    private platform: Platform,
  ) {}

}