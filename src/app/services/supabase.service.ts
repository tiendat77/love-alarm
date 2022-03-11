import { Injectable } from '@angular/core';

import { AuthorizeService } from './authorize.service';
import { CloudStorageService } from './cloud-storage.service';
import { CloudDatabaseService } from './cloud-database.service';
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
    public readonly database: CloudDatabaseService,
  ) {
    try {
      this.client = createClient(
        environment.supabaseUrl,
        environment.supabaseKey
      );

      this.auth.init(this.client);
      this.storage.init(this.client);
      this.database.init(this.client);

    } catch {
      console.error('Failed to initialize Supabase client');
    }
  }

  init() {
    console.log(`[Supabase] Initializing Supabase client`);
  }

}
