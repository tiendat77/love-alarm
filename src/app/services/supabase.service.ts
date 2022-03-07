import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import {
  AuthChangeEvent,
  createClient,
  Provider,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class SupabaseService {

  private supabaseClient: SupabaseClient;
  token: string | undefined;

  constructor(private readonly router: Router) {
    this.supabaseClient = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  init() {
    this.supabaseClient.auth.onAuthStateChange((event, session) => {
      // console.log('Auth state changed', event, session);
      if (session?.user && event === 'SIGNED_IN') {
        this.router.navigate(['/']);
      }
    });
  }

  getSession(): Session | null {
    return this.supabaseClient.auth.session();
  }

  refreshSession() {
    return this.supabaseClient.auth.refreshSession();
  }

  signUp(email: string, password: string) {
    return this.supabaseClient.auth.signUp({ email, password });
  }

  signIn(email: string, password: string) {
    return this.supabaseClient.auth.signIn({ email, password });
  }

  signInWithProvider(provider: Provider) {
    return this.supabaseClient.auth.signIn({ provider });
  }

  signOut() {
    return this.supabaseClient.auth.signOut();
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabaseClient.auth.onAuthStateChange(callback);
  }

  resetPassword(email: string) {
    return this.supabaseClient.auth.api.resetPasswordForEmail(email);
  }

  changePassword(newPassword: string) {
    const session = this.getSession();
    return this.supabaseClient.auth.api.updateUser(session.access_token as string, {
      password: newPassword,
    });
  }

  fetchLog() {
    return this.supabaseClient
      .from('laso')
      .select('*')
      .order('id', { ascending: false });
  }

  addLog(log) {
    const userId = this.getSession()?.user?.id as string;
    return this.supabaseClient
      .from('laso')
      .insert({
        data: log,
        user_id: userId
      })
      .single();
  }

  removeLog(id: string) {
    return this.supabaseClient
      .from('laso')
      .delete()
      .eq('id', id);
  }

  removeAllLog() {
    const userId = this.getSession()?.user?.id as string;
    return this.supabaseClient
      .from('laso')
      .delete()
      .match({ user_id: userId })
  }

}
