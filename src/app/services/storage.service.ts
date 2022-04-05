import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class StorageService {

  constructor(
    private storage: Storage
  ) { }

  async init() {
    await this.storage.create();
  }

  get(key: string) {
    return this.storage.get(key);
  }

  set(key: string, value: any) {
    return this.storage.set(key, value);
  }

  remove(key: string, value: any) {
    return this.storage.remove(key);
  }

}