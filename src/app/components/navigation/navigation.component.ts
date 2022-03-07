import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';

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
  ) {
    const activeUrl = this.router.url.split('/')[2];
    this.active = activeUrl ? activeUrl : 'home';
    this.updateStatusBar();
  }

  navigate(url) {
    this.active = url;
    this.updateStatusBar();
    this.router.navigate(['/app/' + url]);
  }

  updateStatusBar() {
    // for pwa
    this.meta.updateTag({
      name: 'theme-color',
      content: this.active === 'home' ? '#f8b6f7' : '#ffffff',
    });
  }

}
