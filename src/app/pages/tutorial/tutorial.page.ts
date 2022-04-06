import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Swiper } from 'swiper';

import { STORAGE_KEY } from '../../configs/storage-key';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage {

  swiper: Swiper;
  showSkip = true;

  step = 1;
  percent = 0;
  offset = null;

  readonly total = 3;
  readonly meter = (19.5 * 2) * Math.PI; // radius * 2 * PI

  constructor(
    private router: Router,
    private storage: Storage,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.updateIndicator();
  }

  ionViewWillEnter() {
    this.storage.get(STORAGE_KEY.TUTORIAL).then(res => {
      if (res === true) {
        this.router.navigateByUrl(
          '/app/home',
          { replaceUrl: true }
        );
      }
    });
  }

  next() {
    if (this.step < this.total) {
      this.step++;
      this.updateIndicator();
      this.swiper.slideNext();
      return;
    }

    this.startApp();
  }

  private updateIndicator() {
    this.percent = this.step / this.total * 100;
    this.offset = this.meter - (this.meter * (this.clamp(this.percent) / 100));
  }

  private clamp(value: number, min = 0, max = 100) {
    return Math.min(Math.max(value, min), max);
  }

  startApp() {
    this.router
    .navigateByUrl('/permissions', { replaceUrl: true })
    .then(() => {
      this.storage.set(STORAGE_KEY.TUTORIAL, true);
    });
  }

  setSwiperInstance(swiper: Swiper) {
    this.swiper = swiper;
  }

  onSlideChange([swiper]) {
    this.ngZone.run(() => {
      this.step = swiper.realIndex + 1;
      this.updateIndicator();
    });
  }

  onSlideChangeStart() {
    this.showSkip = !this.swiper.isEnd;
    this.cd.detectChanges();
  }

}
