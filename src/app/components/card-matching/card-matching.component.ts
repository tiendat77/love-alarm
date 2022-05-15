import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import {
  CloudDataApiService,
  ServerlessService,
  StorageService,
  ToastService,
} from '../../services';
import { SendMessageModal } from '../../modals';

import { UserProfile } from '../../interfaces';
import { MESSAGES } from '../../configs/message';

@Component({
  selector: 'app-card-matching',
  templateUrl: './card-matching.component.html',
  styleUrls: ['./card-matching.component.scss'],
})
export class CardMatchingComponent {

  @Input() id: string;
  @Input() profile: UserProfile;

  private lastMessageTime: number = 0;

  constructor(
    private readonly data: CloudDataApiService,
    private readonly serverless: ServerlessService,
    private readonly toast: ToastService,
    private readonly storage: StorageService,
    private readonly modal: ModalController,
  ) { }

  ngOnInit() {
    if (!this.profile) {
      this.init();
    }
  }

  private async init() {
    try {
      const profile = await this.data.profile.readBasic(this.id);
      this.profile = profile;

      this.storage.set(this.id, profile);
    } catch (error) {
      console.error(error);

      const profile = await this.storage.get(this.id);
      this.profile = profile || null;
    }
  }

  async detail(mess: string) {
    const modal = await this.modal.create({
      cssClass: 'bottom-drawer',
      component: SendMessageModal,
      componentProps: {
        profile: this.profile,
        message: MESSAGES[mess],
      }
    });

    await modal.present();
  }

  message(mess: string) {
    if (Date.now() - this.lastMessageTime < 5000) {
      return;
    }

    const message = MESSAGES[mess];
    this.serverless.message({id: this.id}, message).subscribe(
      () => {
        this.lastMessageTime = Date.now();
        this.toast.show('Message sent!');
      },
      error => {
        console.error(error);
        this.toast.show('Something went wrong!');
      }
    );
  }

}
