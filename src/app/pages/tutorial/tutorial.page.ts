import { Component, NgZone, ViewChild } from '@angular/core';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage {

  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  activeTab = 0;

  constructor(
    private ngZone: NgZone
  ) { }

  onSlideChange([swiper]) {
    this.ngZone.run(() => {
      this.activeTab = swiper.realIndex;
    });
  }

}
