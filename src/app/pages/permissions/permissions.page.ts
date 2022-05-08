import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Swiper } from 'swiper';

import { PlatformService } from '../../services';
import { BleClient } from 'love-alarm-ble';
import { PushNotifications } from '@capacitor/push-notifications';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.page.html',
  styleUrls: ['./permissions.page.scss'],
})
export class PermissionsPage {

  swiper: Swiper;

  constructor(
    private readonly router: Router,
    private readonly platform: PlatformService,
  ) {}

  async enableNotification() {
    if (this.platform.isNative) {
      let status = await PushNotifications.checkPermissions();

      if (status.receive === 'prompt') {
        status = await PushNotifications.requestPermissions();
      }
  
      if (status.receive !== 'granted') {
        throw new Error('User denied permissions!');
      }

      await PushNotifications.register();
    }

    this.swiper.slideNext();
  }

  async enableLocation() {
    if (this.platform.isNative) {
      await BleClient.initialize({ advertising: null });
    }

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
