import { Component, NgZone, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SwiperComponent } from 'swiper/angular';

import { UserService } from '../../services';

const mock_1 = [
  {name: 'Scarlett Johansson', picture: 'https://i.pinimg.com/564x/ca/e8/e6/cae8e6a4a0e62bef7c744aa73e83fbb4.jpg'},
  {name: 'Han So Hee', picture: 'https://i.pinimg.com/564x/ab/21/22/ab21221f7e352ef121987657bda236fa.jpg'},
  {name: 'Han So Hee', picture: 'https://i.pinimg.com/564x/ab/21/22/ab21221f7e352ef121987657bda236fa.jpg'},
  {name: 'Han So Hee', picture: 'https://i.pinimg.com/564x/ab/21/22/ab21221f7e352ef121987657bda236fa.jpg'},
  {name: 'Han So Hee', picture: 'https://i.pinimg.com/564x/ab/21/22/ab21221f7e352ef121987657bda236fa.jpg'},
  {name: 'Han So Hee', picture: 'https://i.pinimg.com/564x/ab/21/22/ab21221f7e352ef121987657bda236fa.jpg'},
  {name: 'Han So Hee', picture: 'https://i.pinimg.com/564x/ab/21/22/ab21221f7e352ef121987657bda236fa.jpg'},
  {name: 'Han So Hee', picture: 'https://i.pinimg.com/564x/ab/21/22/ab21221f7e352ef121987657bda236fa.jpg'},
  {name: 'Han So Hee', picture: 'https://i.pinimg.com/564x/ab/21/22/ab21221f7e352ef121987657bda236fa.jpg'},
  {name: 'Han So Hee', picture: 'https://i.pinimg.com/564x/ab/21/22/ab21221f7e352ef121987657bda236fa.jpg'},
  {name: 'Han So Hee', picture: 'https://i.pinimg.com/564x/ab/21/22/ab21221f7e352ef121987657bda236fa.jpg'},
  {name: 'Han So Hee', picture: 'https://i.pinimg.com/564x/ab/21/22/ab21221f7e352ef121987657bda236fa.jpg'},
  {name: 'Han So Hee', picture: 'https://i.pinimg.com/564x/ab/21/22/ab21221f7e352ef121987657bda236fa.jpg'},
  {name: 'Han So Hee', picture: 'https://i.pinimg.com/564x/ab/21/22/ab21221f7e352ef121987657bda236fa.jpg'},
  {name: 'Han So Hee', picture: 'https://i.pinimg.com/564x/ab/21/22/ab21221f7e352ef121987657bda236fa.jpg'},
  {name: 'Han So Hee', picture: 'https://i.pinimg.com/564x/ab/21/22/ab21221f7e352ef121987657bda236fa.jpg'},
  {name: 'Han So Hee', picture: 'https://i.pinimg.com/564x/ab/21/22/ab21221f7e352ef121987657bda236fa.jpg'},
  {name: 'Han So Hee', picture: 'https://i.pinimg.com/564x/ab/21/22/ab21221f7e352ef121987657bda236fa.jpg'},
  {name: 'Han So Hee', picture: 'https://i.pinimg.com/564x/ab/21/22/ab21221f7e352ef121987657bda236fa.jpg'},
  {name: 'Han So Hee', picture: 'https://i.pinimg.com/564x/ab/21/22/ab21221f7e352ef121987657bda236fa.jpg'},
  {name: 'Han So Hee', picture: 'https://i.pinimg.com/564x/ab/21/22/ab21221f7e352ef121987657bda236fa.jpg'},
  {name: 'Han So Hee', picture: 'https://i.pinimg.com/564x/ab/21/22/ab21221f7e352ef121987657bda236fa.jpg'},
  {name: 'Han So Hee', picture: 'https://i.pinimg.com/564x/ab/21/22/ab21221f7e352ef121987657bda236fa.jpg'},
];

const mock_2 = [
  {name: 'Ji Soo', picture: 'https://i.pinimg.com/564x/30/78/ab/3078abf521ef05e6613e0f9880fea39b.jpg'}
];

@Component({
  selector: 'app-ringers',
  templateUrl: './ringers.component.html',
  styleUrls: ['./ringers.component.scss'],
})
export class RingersModal {

  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  activeTab = 0;

  ringers = [];
  ringings = [];

  constructor(
    public readonly user: UserService,

    private ngZone: NgZone,
    private modalCtrl: ModalController,
  ) {
    this.init();
  }

  private init() {
    this.ringers = mock_1;
    this.ringings = mock_2;
  }

  ring(user: any) {
    console.log('ring', user);
  }

  close() {
    this.modalCtrl.dismiss();
  }

  slideTo(index: number) {
    this.activeTab = index;
    this.swiper?.swiperRef.slideTo(index);
  }

  onSlideChange([swiper]) {
    this.ngZone.run(() => {
      this.activeTab = swiper.realIndex;
    });
  }

}
