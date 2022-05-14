import { ChangeDetectorRef, Component, Input, NgZone } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Swiper } from 'swiper';
import { BehaviorSubject, forkJoin, of, Subject } from 'rxjs';
import { catchError, skip, switchMap, takeUntil, tap } from 'rxjs/operators';

import { UserProfile } from '../../interfaces';

import {
  CloudDataApiService,
  ModalsService,
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
  @Input() tab: 'ringers' | 'ringings' = 'ringers';

  isLoading$ = new BehaviorSubject<boolean>(true);
  destroy$ = new Subject();

  swiper: Swiper;
  activeTab = 0;

  ringers: UserProfile[] = [];
  ringings: UserProfile[] = [];

  constructor(
    public readonly user: UserService,
    private readonly toast: ToastService,
    private readonly data: CloudDataApiService,
    private readonly modals: ModalsService,

    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
  ) {}

  ngOnInit() {
    this.init();

    this.user.ringings$.pipe(
      skip(1), // skip first time, it's already get in init()
      takeUntil(this.destroy$),
      switchMap((ringings) => this.data.profile.readMultiBasic(ringings || [])),
      catchError((error) => {
        console.error(error);
        return of([] as UserProfile[]);
      })
    ).subscribe(ringings => {
      this.ringings = ringings;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private init() {
    this.isLoading$.next(true);

    forkJoin([
      this.data.profile.readMultiBasic(this.profile.ringers || []),
      this.data.profile.readMultiBasic(this.profile.ringings || [])
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
    await this.modals.showUserProfile(profile.id);
  }

  async menu(profile: UserProfile) {
    const actionSheet = await this.actionSheetCtrl.create({
      cssClass: 'action-sheet',
      header: `${profile.name}`,
      buttons: [
        {
          text: 'View profile',
          handler: () => {
            this.view(profile);
          }
        },
        {
          text: 'Unring',
          handler: () => {
            this.unring(profile);
          }
        }
      ]
    });

    await actionSheet.present();
  }

  async unring(profile: UserProfile) {
    const confirmed = await this.modals.showConfirmUnring(profile);

    if (!confirmed) {
      return;
    }

    this.user.unring(profile.id);
    this.ringings = this.ringings.filter(ringing => ringing.id !== profile.id);
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

    if (this.tab === 'ringings') {
      this.ngZone.run(() => {
        this.activeTab = 1;
        this.swiper?.slideTo(1);
        this.cdr.detectChanges();
      });
    }
  }

  onSlideChange([swiper]) {
    this.ngZone.run(() => {
      this.activeTab = swiper.realIndex;
      this.cdr.detectChanges();
    });
  }

}
