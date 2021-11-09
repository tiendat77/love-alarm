import { Component } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';

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


    if (!this.isHome) {
      StatusBar.setStyle({style: Style.Light});
    } else {
      StatusBar.setStyle({style: Style.Dark});
    }
  }

}
