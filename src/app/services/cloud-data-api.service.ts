import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';

import {
  MetaApiService,
  ProfileApiService,
  RingApiService,
  TokenApiService
} from '../rest-api';

@Injectable({ providedIn: 'root' })
export class CloudDataApiService {

  private client: SupabaseClient;

  public get user() {
    return this.client?.auth?.user();
  }

  constructor(
    public readonly meta: MetaApiService,
    public readonly profile: ProfileApiService,
    public readonly ring: RingApiService,
    public readonly token: TokenApiService,
  ) { }

  init(client: SupabaseClient) {
    this.client = client;
    this.meta.init(client);
    this.profile.init(client);
    this.ring.init(client);
    this.token.init(client);
  }

}