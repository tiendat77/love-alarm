import { Component } from '@angular/core';
import { SupabaseService } from '../../../services';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {

  constructor(
    private readonly supabase: SupabaseService,
  ) { }

  async navigateSignInWithGoogle() {
    await this.supabase.signInWithProvider('google').catch(error => {
      console.error('Error: ', error.message);
    });
  }

}
