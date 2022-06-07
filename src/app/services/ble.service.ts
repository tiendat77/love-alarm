import { Injectable } from '@angular/core';
import { BleClient } from 'love-alarm-ble';

import { UserService } from './user.service';
import { ModalsService } from './modals.service';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, last, map, mergeMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BLEService {

  isScanning = false;
  ringer$ = new BehaviorSubject<number>(0);

  private devices = new Map<string, string>();

  constructor(
    private readonly user: UserService,
    private readonly modals: ModalsService,
  ) { }

  async init() {
    await BleClient.initialize({
      advertising: this.user.profile?.id
    });

    console.log('ringgings', this.user.profile.ringers)
    await BleClient.matches({
      profiles: this.user.profile.ringers || []
    });

    await BleClient.startAdvertise();

    await BleClient.watch((result) => {
      console.log('watch result', result);
      this.onRing(result);
    });
  }

  async destroy() {
    try {
      await BleClient.stopScan();
      await BleClient.stopAdvertise();
    } catch (e) {
      console.error(e);
    }
  }

  async setMatches(profiles: string[]) {
    await BleClient.matches({profiles});
  }

  scan() {
    return new Observable(observer => {
      this.isScanning = true;
      this.devices.clear();

      BleClient.startScan((result) => {
        observer.next(result.address);
      })
      .then(() => observer.complete())
      .catch(() => observer.complete());

    }).pipe(
      mergeMap((address: string) => {
        return BleClient.read({address}).then(result => {
          console.log('read result', result);
          if (result.profile) {
            this.devices.set(address, result.profile);
          }

          return result?.profile;
        });
      }),
      last(),
      map((value) => {
        this.isScanning = false;
        return Array.from(this.devices.values());
      }),
      catchError((error) => {
        console.error(error);
        this.isScanning = false;
        this.devices.clear();
        return of(Array.from(this.devices.values()));
      })
    );
  }

  async stop() {
    this.isScanning = false;
    await BleClient.stopScan();
  }

  onRing(result) {
    const ringers = this.ringer$.value;

    if (result.type === 'un-ring') {
      if (ringers === 0) {
        return;
      }

      return this.ringer$.next(ringers - 1);
    }

    if (result.type === 'ring') {
      return this.ringer$.next(ringers + 1);
    }
  }

  async checkStatus() {
    try {
      const { enable } = await BleClient.isEnable();

      if (!enable) {
        const confirm = await this.modals.showBluetoothWarning();

        if (confirm) {
          await BleClient.enable();
        }

        return Promise.resolve(true);

      } else {
        return Promise.resolve(true);
      }
    } catch (error) {
      console.error(error);
      return Promise.resolve(false);
    }
  }

}
