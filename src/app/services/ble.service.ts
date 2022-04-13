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
          console.log('rawAdvertisement', this.parse(result.rawAdvertisement));
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

  parse(value: DataView): any {
    const flags = value.getUint8(0);
    const rate16Bits = flags & 0x1;
    let hell;
    if (rate16Bits > 0) {
      hell = value.getUint16(1, true);
    } else {
      hell = value.getUint8(1);
    }
    return hell;
  }

}
