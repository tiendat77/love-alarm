import { Injectable } from '@angular/core';

import { AuthorizeService } from './authorize.service';
import { CloudStorageService } from './cloud-storage.service';
import { CloudDataApiService } from './cloud-data-api.service';
import { environment } from '../../environments/environment';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class SupabaseService {

  get session() {
    return this.client.auth.session();
  }

  private client: SupabaseClient;

  constructor(
    public readonly auth: AuthorizeService,
    public readonly storage: CloudStorageService,
    public readonly data: CloudDataApiService,
  ) { }

  init() {
    try {
      this.client = createClient(
        environment.supabaseUrl,
        environment.supabaseKey
      );

      this.auth.init(this.client);
      this.storage.init(this.client);
      this.data.init(this.client);
      console.log(`[Supabase] Initialized Supabase client`);

    } catch {
      console.error('[Supabase] Failed to initialize Supabase client');
    }
  }

}
