import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

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
  ) { }

  init(client: SupabaseClient) {
    this.client = client;

    this.client.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed', event, session);
      if (session?.user && event === 'SIGNED_IN') {
        this.onSignedIn(session);
      }

      if (event === 'SIGNED_OUT') {
        this.onSignedOut();
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
    return this.client.auth.signIn({ provider });
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

}