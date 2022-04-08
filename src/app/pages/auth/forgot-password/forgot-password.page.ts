import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import { HelperText } from '../../../interfaces';
import {
  LoaderService,
  SupabaseService,
} from '../../../services';

@Component({
  selector: 'app-auth-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {

  emailCtrl = new FormControl('', Validators.required);

  helperText: HelperText | undefined;

  isSentEmail = false;

  constructor(
    private router: Router,
    private loader: LoaderService,
    private supabase: SupabaseService,
  ) { }

  async submit() {
    const email = this.emailCtrl.value;

    if (!email) {
      return this.helperText = {
        error: true,
        text: 'Email ID is required',
      };
    }

    this.loader.start('Just a moment...');

    const { data, error } = await this.supabase.auth.resetPassword(email);

    this.loader.stop();

    if (error) {
      this.isSentEmail = false;
      this.helperText = { error: true, text: error.message };
      return;
    }

    if (data) {
      this.isSentEmail = true;
      return this.helperText = {
        error: false,
        text: `Email has been sent to you. It's has a magic link that'll log you in.`,
      };
    }
  }

}
