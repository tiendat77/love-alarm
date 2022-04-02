import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  ringers: number = 0;

  constructor() {}

  test() {
    if (this.ringers !== 0) {
      this.ringers--;
    } else {
      this.ringers++;
    }
  }

}
