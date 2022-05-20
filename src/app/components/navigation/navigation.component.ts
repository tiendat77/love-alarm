import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {

  active = 'home';

  constructor(private router: Router) {
    router.events.pipe(
      filter(val => val instanceof NavigationEnd)
    ).subscribe((val: NavigationEnd) => {
      this.active = val.urlAfterRedirects.split('/')[2];
    });
  }

}
