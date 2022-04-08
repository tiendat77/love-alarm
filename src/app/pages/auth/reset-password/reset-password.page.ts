import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import {
  LoaderService,
  SupabaseService
} from '../../../services';

import { HelperText } from '../../../interfaces';

@Component({
  selector: 'app-auth-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {

  newPwdCtrl = new FormControl();

  helperText: HelperText | undefined;

  constructor(
    private readonly router: Router,
    private readonly loader: LoaderService,
    private readonly supabase: SupabaseService,
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
    }
  }

}
