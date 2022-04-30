import { Injectable } from '@angular/core';
import { BleClient } from 'love-alarm-ble';

import { UserService } from './user.service';

import { from, Observable, of, timer } from 'rxjs';
import { catchError, concatMap, delay, last, map, mergeMap, takeUntil } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BLEService {

  isScanning = false;

  private devices = new Map<string, string>();

  constructor(
    private user: UserService
  ) { }

  async init() {
    await BleClient.initialize({
      advertising: this.user.profile?.id
    });

    await BleClient.advertise();
  }

  async destroy() {
    try {
      await BleClient.stopScan();
      await BleClient.stopAdvertise();
    } catch (e) {
      console.error(e);
    }
  }

  listen() {
    const timer$ = timer(12000);
    return new Observable(observer => {
      this.isScanning = true;
      this.devices.clear();

      this.fakeScan().pipe(takeUntil(timer$)).subscribe(
        (value) => {
        observer.next(value?.address);
        },
        (error) => {
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      );
    }).pipe(
      mergeMap((address: string) => {
        return this.fakeRead(address).pipe(
          map(result => {
            console.log('read result', result);
            if (result.profile) {
              this.devices.set(address, result.profile);
            }

            return result?.profile;
          })
        );
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

  private fakeScan() {
    return from([
      {address: '00:00:00:00:00:01', name: 'IPhone 13'},
      {address: '00:00:00:00:00:02', name: 'Realme 5'},
      {address: '00:00:00:00:00:03', name: 'Samsung S50'},
    ]).pipe(
      concatMap(device => of(device).pipe(delay(2000)))
    );
  }

  private fakeRead(address) {
    const maping = {
      '00:00:00:00:00:01': '24248560-88d3-4bec-a9e2-3c5fbfa35707',
      '00:00:00:00:00:02': '6679a16a-2936-4b33-ba77-c702c4cb863b',
      '00:00:00:00:00:03': '8c2741ec-1d5c-4ab3-9afc-2d20cb9d359b',
    };
    return of({
      address,
      profile: maping[address]
    }).pipe(
      delay(1500)
    );
  }

  scan() {
    return new Observable(observer => {
      this.isScanning = true;
      this.devices.clear();

      BleClient.scan((result) => {
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

}
