import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { Subscription } from 'rxjs';

import { PlatformService } from './platform.service';
import { StorageService } from './storage.service';
import { STORAGE_KEY } from '../configs/storage-key';

@Injectable({ providedIn: 'root' })
export class BLEService {

  isScanning = false;

  private scanSubscription: Subscription;

  constructor(
    private storage: StorageService,
    private platform: PlatformService,
  ) { }

  async init() {
    const deviceId = await Device.getId();
    if (deviceId?.uuid) {
      console.log('Device ID', deviceId.uuid);
      this.storage.set(STORAGE_KEY.BLE_TOKEN, deviceId.uuid);
    }
  }

  async start() {
    try {
      await BleClient.initialize();

      this.isScanning = true;
      await BleClient.requestLEScan(
        {
          services: [],
        },
        (result) => {
          console.log('received new scan result', result);
        }
      );

      setTimeout(async () => {
        await BleClient.stopLEScan();
        this.isScanning = false;
        console.log('stopped scanning');
      }, 50000);
    } catch (error) {
      this.isScanning = false;
      console.error(error);
    }
  }

}
