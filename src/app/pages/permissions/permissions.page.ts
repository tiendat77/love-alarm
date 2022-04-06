import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Swiper } from 'swiper';

import { BleClient } from '@capacitor-community/bluetooth-le';
import { PushNotifications } from '@capacitor/push-notifications';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.page.html',
  styleUrls: ['./permissions.page.scss'],
})
export class PermissionsPage {

  swiper: Swiper;

  constructor(private router: Router) {}

  async enableNotification() {
    const result = await PushNotifications.requestPermissions();

    if (result.receive === 'granted') {
      this.swiper.slideNext();
    }
  }

  async enableLocation() {
    await BleClient.initialize({ androidNeverForLocation: true });
    this.swiper.slideNext();
  }

  startApp() {
    this.router.navigateByUrl('/app/home', { replaceUrl: true });
  }

  setSwiperInstance(swiper: Swiper) {
    this.swiper = swiper;
  }

  onSlideChange([swiper]) {
  }

}
