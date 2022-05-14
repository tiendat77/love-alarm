import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { UserMeta } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class MetaApiService {

  private client: SupabaseClient;

  constructor() {}

  init(client: SupabaseClient) {
    this.client = client;
  }

  update(meta: UserMeta) {
    return new Promise(async (resolve, reject) => {
      const { data, error } = await this.client.auth.update({data: meta});

      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  }

}