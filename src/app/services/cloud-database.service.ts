import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { SupabaseClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class CloudDatabaseService {

  private client: SupabaseClient;

  private get token() {
    return this.client.auth.session()?.access_token as string;
  }

  private get uid() {
    return this.client.auth.session()?.user?.id as string;
  }

  constructor(
    private readonly router: Router,
  ) { }

  init(client: SupabaseClient) {
    this.client = client;
  }

  fetchLog() {
    return this.client
      .from('laso')
      .select('*')
      .order('id', { ascending: false });
  }

  addLog(log) {
    return this.client
      .from('laso')
      .insert({
        data: log,
        user_id: this.uid,
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
    return this.client
      .from('laso')
      .delete()
      .match({ user_id: this.uid })
  }

}