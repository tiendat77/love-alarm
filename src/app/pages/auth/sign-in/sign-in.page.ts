import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { HelperText } from '../../../interfaces';
import { LoaderService, SupabaseService } from '../../../services';

@Component({
  selector: 'app-auth-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage {

  authForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  helperText: HelperText | undefined;

  constructor(
    private readonly router: Router,
    private readonly loader: LoaderService,
    private readonly supabase: SupabaseService,
  ) { }

  async signIn() {
    const { email, password } = this.authForm.value;

    if (!email || !password) {
      this.helperText = {
        error: true,
        text: 'Email and password are required',
      };

      return;
    }

    this.loader.start('Just a moment...');

    const { user, error, session } = await this.supabase.auth.signIn(email, password);

    this.loader.stop();

    if (error) {
      this.helperText = { error: true, text: error.message };
      return;
    }

    if (user) {
      await this.router.navigate(['/']);
    }
  }

  async navigateSignInWithGoogle() {
    await this.supabase.auth.signInWithProvider('google').catch(error => {
      console.error('Error: ', error.message);
    });
  }

}
