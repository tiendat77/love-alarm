import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage {

  isHome: boolean;

  constructor() { }

  navigated({tab}) {
    this.isHome = tab === 'home';
  }

}
