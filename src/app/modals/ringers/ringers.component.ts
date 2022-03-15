import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { UserService } from '../../services';

@Component({
  selector: 'app-ringers',
  templateUrl: './ringers.component.html',
  styleUrls: ['./ringers.component.scss'],
})
export class RingersModal {

  ringers = [];
  ringings = [];

  constructor(
    public user: UserService,
    private modalCtrl: ModalController
  ) {
    this.init();
  }

  private init() {
    this.ringers = [
      {name: 'Ringer 1', id: 1, avatar: 'https://randomuser.me/api/portraits/'},
    ];
  }

  ring(user: any) {
    console.log('ring', user);
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
