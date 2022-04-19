import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import {
  LoaderService,
  SupabaseService
} from '../../services';

import { HelperText } from '../../interfaces';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordModal {

  newPwdCtrl = new FormControl();

  helperText: HelperText | undefined;

  constructor(
    private readonly router: Router,
    private readonly loader: LoaderService,
    private readonly supabase: SupabaseService,
    private readonly modalCtrl: ModalController,
  ) { }

  async reset() {
    const newPassword = this.newPwdCtrl.value;

    if (!newPassword) {
      this.helperText = {
        error: true,
        text: 'New password are required',
      };

      return;
    }

    this.loader.start('Just a moment...');

    const { user, error } = await this.supabase.auth.changePassword(newPassword);

    this.loader.stop();

    if (error) {
      return this.helperText = { error: true, text: error.message };
    }

    if (user) {
      await this.router.navigate(['/']);
      await this.modalCtrl.dismiss();
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
