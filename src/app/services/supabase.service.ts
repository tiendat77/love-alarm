import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from './user.service';
import { environment } from '../../environments/environment';

import {
  createClient,
  Provider,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class SupabaseService {

  token: string | undefined;
  private client: SupabaseClient;

  constructor(
    private readonly router: Router,
    private readonly user: UserService,
  ) {
    this.client = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  init() {
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

  onSignedIn(session: Session) {
    this.token = session?.access_token;
    this.user.set(session.user?.id, session?.user?.user_metadata);
    this.router.navigate(['/']);
  }

  onSignedOut() {
    this.router.navigate(['/auth/sign-in']);
  }

  getSession(): Session | null {
    return this.client.auth.session();
  }

  refreshSession() {
    return this.client.auth.refreshSession();
  }

  signUp(email: string, password: string, name: string) {
    return this.client.auth.signUp({ email, password }, {data: { name }});
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
    const session = this.getSession();
    return this.client.auth.api.updateUser(session.access_token as string, {
      password: newPassword,
    });
  }

  fetchLog() {
    return this.client
      .from('laso')
      .select('*')
      .order('id', { ascending: false });
  }

  addLog(log) {
    const userId = this.getSession()?.user?.id as string;
    return this.client
      .from('laso')
      .insert({
        data: log,
        user_id: userId
      })
      .single();
  }

  removeLog(id: string) {
    return this.client
      .from('laso')
      .delete()
      .eq('id', id);
  }

  removeAllLog() {
    const userId = this.getSession()?.user?.id as string;
    return this.client
      .from('laso')
      .delete()
      .match({ user_id: userId })
  }

}
