import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { Platform } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {

  active = 'home';

  constructor(
    private router: Router,
    private meta: Meta,
    private platform: Platform,
  ) {
    router.events.pipe(
      filter(val => val instanceof NavigationEnd)
    ).subscribe((val: NavigationEnd) => {
      this.active = val.urlAfterRedirects.split('/')[2];
      this.updateStatusBar();
    });
  }

  private updateStatusBar() {
    if (this.active === 'home') {
      this.platform.is('hybrid')
        ? StatusBar.setOverlaysWebView({overlay: true})
        : this.meta.updateTag({name: 'theme-color',content: '#f8b6f7'});

    } else {
      this.platform.is('hybrid')
        ? StatusBar.setOverlaysWebView({overlay: false})
        : this.meta.updateTag({name: 'theme-color',content: '#ffffff'});
    }
  }

}
