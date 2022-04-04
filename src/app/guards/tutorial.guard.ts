import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';

import { Storage } from '@ionic/storage';
import { STORAGE_KEY } from '../configs/storage-key';

@Injectable({providedIn: 'root'})
export class TutorialGuard implements CanLoad {

  constructor(
    private storage: Storage,
    private router: Router
  ) {}

  canLoad() {
    return this.storage.get(STORAGE_KEY.TUTORIAL).then(res => {
      if (res) {
        this.router.navigate(['/app', 'home']);
        return false;

      } else {
        return true;
      }
    });
  }

}
