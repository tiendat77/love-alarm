import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { StatusBarArea, Style } from 'capacitor-status-bar-area';
import { STORAGE_KEY } from '../configs/storage-key';
import { combineLatest, fromEvent } from 'rxjs';
import { delay, filter, map, startWith, switchMap } from 'rxjs/operators';

export type Scheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private _scheme: Scheme = 'light';

  get scheme(): Scheme {
    return this._scheme;
  }

  set scheme(scheme: Scheme) {
    this._scheme = scheme;
    this.setScheme(scheme);
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private readonly modal: ModalController,
    private readonly router: Router,
  ) { }

  init() {
    const scheme = localStorage.getItem(STORAGE_KEY.SCHEME);
    if (scheme === 'light' || scheme === 'dark') {
      this.scheme = scheme as Scheme;
    } else {
      this.scheme = 'light';
    }

    this.listen();
  }

  toggle() {
    this.scheme = this.scheme === 'light' ? 'dark' : 'light';

    this.scheme === 'dark' ?
      StatusBarArea.setStyle({style: Style.Dark}) :
      StatusBarArea.setStyle({style: Style.Light})
  }

  isDark(): boolean {
    return this.scheme === 'dark';
  }

  private setScheme(scheme: Scheme) {
    this.document.body.classList.remove('light-theme', 'dark-theme');
    this.document.body.classList.add(`${scheme}-theme`);
    localStorage.setItem(STORAGE_KEY.SCHEME, scheme);
  }

  private listen() {
    // listen for url changes
    const routerEvent = this.router.events.pipe(
      filter(val => val instanceof NavigationEnd),
      map((event: NavigationEnd) => (event.urlAfterRedirects.split('/')[2] || ''))
    );

    // listen for modal open/dismiss events
    const modalEvent = combineLatest([
      fromEvent(window, 'ionModalDidPresent'),
      fromEvent(window, 'ionModalDidDismiss')
    ]).pipe(
      startWith(null),
      delay(300),
      switchMap(event => this.modal.getTop())
    );

    combineLatest([routerEvent, modalEvent]).subscribe(([router, modal]) => {
      /**
       * dark theme
       * status bar with white text in any screen
       */
      if (this.scheme === 'dark') {
        return StatusBarArea.setStyle({style: Style.Dark});
      }

      /**
       * light theme
       * status bar with white text only in home screen without any modal open
       */
      if (!!modal) {
        return StatusBarArea.setStyle({style: Style.Light});
      }

      router === 'home' ?
        StatusBarArea.setStyle({style: Style.Dark}) :
        StatusBarArea.setStyle({style: Style.Light});
    });
  }

}