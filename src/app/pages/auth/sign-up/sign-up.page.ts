import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { HelperText } from '../../../interfaces';
import { LoaderService, SupabaseService } from '../../../services';

@Component({
  selector: 'app-auth-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage {

  authForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  helperText: HelperText | undefined;

  constructor(
    private readonly router: Router,
    private readonly loader: LoaderService,
    private readonly supabase: SupabaseService,
  ) { }

  async signUp() {
    const { email, name, password } = this.authForm.value;

    if (!email || !password || !name) {
      this.helperText = {
        error: true,
        text: 'Email, name and password are required',
      };

      return;
    }

    this.loader.start('Just a moment...');

    const { user, error, session } = await this.supabase.signUp(email, password, name);

    this.loader.stop();

    if (error) {
      return this.helperText = { error: true, text: error.message };
    }

    if (user && !session && !error) {
      return this.helperText = {
        error: false,
        text: 'Check your email and click on the link to verify your account.',
      };
    }

    if (user) {
      await this.router.navigate(['/']);
    }
  }

  async navigateSignInWithGoogle() {
    await this.supabase.signInWithProvider('google').catch(error => {
      console.error('Error: ', error.message);
    });
  }

}
