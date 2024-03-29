import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

import { HashHelper } from '../helpers';
import { UserService } from './user.service';

import {
  Provider,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js';
import { BLEService } from './ble.service';

@Injectable({ providedIn: 'root' })
export class AuthorizeService {

  private client: SupabaseClient;

  private isLogged = false;

  private get token() {
    return this.client.auth.session()?.access_token as string;
  }

  constructor(
    private readonly router: Router,
    private readonly user: UserService,
    private readonly ble: BLEService,
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
    if (this.isLogged) {
      return;
    }

    this.isLogged = true;
    this.router.navigateByUrl('/app/home', { replaceUrl: true });

    setTimeout(async () => {
      await this.user.init();
      await this.ble.init();
    });
  }

  private onSignedOut() {
    this.isLogged = false;
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
      { email, password: HashHelper.md5(password) },
      { data: meta }
    );
  }

  signIn(email: string, password: string) {
    return this.client.auth.signIn({
      email,
      password: HashHelper.md5(password)
    });
  }

  signInWithProvider(provider: Provider) {
    const redirectTo: string = this.platform.is('hybrid')
      ? 'com.dathuynh.lovealarm://login-callback/'
      : window.location.origin + '/login-callback/';

    return this.client.auth.signIn({ provider }, {redirectTo});
  }

  signOut() {
    this.user.clear();
    this.ble.destroy();
    return this.client.auth.signOut();
  }

  resetPassword(email: string) {
    const redirectTo: string = this.platform.is('hybrid')
      ? 'com.dathuynh.lovealarm://auth/reset-password/'
      : window.location.origin + '/auth/reset-password/';

    return this.client.auth.api.resetPasswordForEmail(
      email,
      {redirectTo}
    );
  }

  changePassword(newPassword: string) {
    return this.client.auth.api.updateUser(
      this.token,
      { password: HashHelper.md5(newPassword) }
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