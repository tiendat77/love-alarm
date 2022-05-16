import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

import { UserProfile } from '../../interfaces';
import { ServerlessService, ToastService } from '../../services';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss'],
})
export class SendMessageModal {

  @Input() profile: UserProfile;
  @Input() message: string;

  isSending$ = new BehaviorSubject(false);

  constructor(
    private readonly modalCtrl: ModalController,
    private readonly toast: ToastService,
    private readonly serverless: ServerlessService,
  ) {}

  async send() {
    try {
      this.isSending$.next(true);
      await this.serverless.message(this.profile, this.message).toPromise();
      await this.modalCtrl.dismiss();
      this.toast.show('Message sent!', 'success');

    } catch (error) {
      console.error(error);
      this.isSending$.next(false);
      this.toast.show('Something went wrong!', 'error');
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
