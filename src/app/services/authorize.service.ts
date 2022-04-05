import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

import { UserService } from './user.service';

import {
  Provider,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class AuthorizeService {

  private client: SupabaseClient;

  private get token() {
    return this.client.auth.session()?.access_token as string;
  }

  private get uid() {
    return this.client.auth.session()?.user?.id as string;
  }

  constructor(
    private readonly router: Router,
    private readonly user: UserService,
    private readonly platform: Platform,
  ) { }

  init(client: SupabaseClient) {
    this.client = client;

    this.client.auth.onAuthStateChange((event, session) => {
      console.log(`[Supabase] Auth state changed: ${event}`);
      console.log(`[Supabase] Session: `, session);

      if (session?.user && event === 'SIGNED_IN') {
        this.onSignedIn(session);
      }

      if (event === 'SIGNED_OUT') {
        this.onSignedOut();
      }

      if (event === 'PASSWORD_RECOVERY') {
        this.onResetedPassword();
      }
    });
  }

  private onSignedIn(session: Session) {
    this.user.set(session.user?.id, session?.user?.user_metadata);
    this.router.navigate(['/']);
  }

  private onSignedOut() {
    this.router.navigate(['/auth/sign-in']);
  }

  private onResetedPassword() {
    this.router.navigate(['/auth/reset-password']);
  }

  signUp(email: string, password: string, name: string) {
    const meta = {
      name: name,
    };

    return this.client.auth.signUp(
      { email, password },
      { data: meta }
    );
  }

  signIn(email: string, password: string) {
    return this.client.auth.signIn({ email, password });
  }

  signInWithProvider(provider: Provider) {
    const redirectTo: string = this.platform.is('hybrid')
      ? 'com.dathuynh.lovealarm://login-callback/'
      : window.location.origin + '/login-callback/';
    return this.client.auth.signIn({ provider }, {redirectTo});
  }

  signOut() {
    return this.client.auth.signOut();
  }

  resetPassword(email: string) {
    return this.client.auth.api.resetPasswordForEmail(email);
  }

  changePassword(newPassword: string) {
    return this.client.auth.api.updateUser(
      this.token,
      { password: newPassword }
    );
  }

  setAuth(access_token: string, refresh_token: string) {
    return new Promise(async (resolve, reject) => {
      this.client.auth.setAuth(access_token);

      const {session, error} = await this.client.auth.setSession(refresh_token);

      if (!error) {
        resolve(session);
      } else {
        reject(error);
      }
    });
  }

}