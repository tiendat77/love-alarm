import { Injectable } from '@angular/core';
import { BleClient } from 'love-alarm-ble';

import { UserService } from './user.service';
import { StorageService } from './storage.service';
import { PlatformService } from './platform.service';

@Injectable({ providedIn: 'root' })
export class BLEService {

  isScanning = false;

  constructor(
    private user: UserService,
    private storage: StorageService,
    private platform: PlatformService,
  ) { }

  async init() {
    await BleClient.initialize({
      advertising: this.user.profile?.id
    });
  }

  async scan() {
    try {
      this.isScanning = true;
      await BleClient.scan(
        (result) => {
          console.log('received new scan result', result);
        }
      );

      this.isScanning = false;
      console.log('scanning stopped');
    } catch (error) {
      this.isScanning = false;
      console.error(error);
    }
  }

  async read(address: string) {
    try {
      // read user profile from found device
      const result = await BleClient.read({address});
      console.log('read result', result);
    } catch (error) {
      console.error(error);
    }
  }

}
