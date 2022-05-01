import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { WebViewService } from '../../services';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {

  active = 'home';

  constructor(
    private router: Router,
    private webview: WebViewService,
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
      this.webview.showStatusBarOverlay();

    } else {
      this.webview.hideStatusBarOverlay();
    }
  }

}
