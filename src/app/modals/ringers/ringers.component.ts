import { ChangeDetectorRef, Component, Input, NgZone } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Swiper } from 'swiper';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { UserProfileModal } from '../user-profile/user-profile.component';
import { UserProfile } from '../../interfaces';

import {
  CloudDatabaseService,
  ToastService,
  UserService
} from '../../services';

@Component({
  selector: 'app-ringers',
  templateUrl: './ringers.component.html',
  styleUrls: ['./ringers.component.scss'],
})
export class RingersModal {

  @Input() profile: UserProfile;

  isLoading$ = new BehaviorSubject<boolean>(true);

  swiper: Swiper;
  activeTab = 0;

  ringers = [];
  ringings = [];

  constructor(
    public readonly user: UserService,
    private readonly toast: ToastService,
    private readonly data: CloudDatabaseService,

    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private modalCtrl: ModalController,
  ) {}

  ngOnInit() {
    this.init();
  }

  private init() {
    this.isLoading$.next(true);

    forkJoin([
      this.data.getMultiUserProfile(this.profile.ringers || []),
      this.data.getMultiUserProfile(this.profile.ringings || [])
    ]).pipe(
      tap(([ringers, ringings]) => {
        this.ringers = ringers;
        this.ringings = ringings;
        this.isLoading$.next(false);
      }),
      catchError((error) => {
        console.error(error);
        this.isLoading$.next(false);
        this.toast.show('Load failed');

        return of();
      })
    ).subscribe();
  }

  async view(profile: UserProfile) {
    const modal = await this.modalCtrl.create({
      component: UserProfileModal,
      componentProps: { profile }
    });

    await modal.present();
  }

  close() {
    this.modalCtrl.dismiss();
  }

  slideTo(index: number) {
    this.activeTab = index;
    this.swiper?.slideTo(index);
  }

  setSwiperInstance(swiper: Swiper) {
    this.swiper = swiper;
  }

  onSlideChange([swiper]) {
    this.ngZone.run(() => {
      this.activeTab = swiper.realIndex;
      this.cdr.detectChanges();
    });
  }

}
