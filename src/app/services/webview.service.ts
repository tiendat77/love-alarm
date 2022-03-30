import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class WebViewService {

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }

  hideApp() {
    const element = this.document.getElementsByTagName('app-container')[0] as HTMLElement;
    if (element) {
      element.style.display = 'none';
    }
  }

  showApp() {
    const element = this.document.getElementsByTagName('app-container')[0] as HTMLElement;
    if (element) {
      element.style.display = null;
    }
  }

}
