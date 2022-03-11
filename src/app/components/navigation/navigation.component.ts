import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

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
    router.events.pipe(
      filter(val => val instanceof NavigationEnd)
    ).subscribe((val: NavigationEnd) => {
      this.active = val.urlAfterRedirects.split('/')[2];
    });
  }

  private updateStatusBar() {
    this.meta.updateTag({
      name: 'theme-color',
      content: this.active === 'home' ? '#f8b6f7' : '#ffffff',
    });
  }

}
