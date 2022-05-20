import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SplashScreenService {

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }

  show() {
    this.document.body.classList.remove('splash-screen-hidden');
  }

  hide(timeout = 3) {
    setTimeout(() => {
      this.document.body.classList.add('splash-screen-hidden');
    }, timeout * 1000);
  }

}
