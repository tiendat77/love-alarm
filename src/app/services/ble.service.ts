import { Injectable } from '@angular/core';
import { BLE } from '@awesome-cordova-plugins/ble/ngx';
import { Subscription } from 'rxjs';

import { PlatformService } from './platform.service';

@Injectable({ providedIn: 'root' })
export class BLEService {

  private scanSubscription: Subscription;

  constructor(
    private ble: BLE,
    private platform: PlatformService,
  ) { }

  init() {
    this.scanSubscription = this.ble.scan([], 20)
    .subscribe((device) => {
      console.log(device);
    });
  }

  start() {
    this.scanSubscription = this.ble.startScan([]).subscribe((device) => {
      console.log(device);
    });
  }

  stop() {
    this.scanSubscription.unsubscribe();
    this.ble.stopScan();
  }

}
