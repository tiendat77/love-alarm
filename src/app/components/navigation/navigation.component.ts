import { Component } from '@angular/core';
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
  ) {
    const activeUrl = this.router.url.split('/')[2];
    this.active = activeUrl ? activeUrl : 'home';
  }

  navigate(url) {
    this.active = url;
    this.router.navigate(['/app/' + url]);
  }

}
