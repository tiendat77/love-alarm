import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { MyQrCodeModal } from '../../modals';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  constructor(
    private modal: ModalController
  ) { }

  ngOnInit() {
  }

  scan() {
  }

  async qrcode() {
    const modal = await this.modal.create({
      component: MyQrCodeModal
    });

    modal.present();
  }

}
