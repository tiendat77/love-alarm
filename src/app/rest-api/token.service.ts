import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { UserToken } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class TokenApiService {

  private client: SupabaseClient;

  private get user() {
    return this.client?.auth?.user();
  }

  constructor() {}

  init(client: SupabaseClient) {
    this.client = client;
  }

  create(token: UserToken): Promise<UserToken> {
    return new Promise(async (resolve, reject) => {
      const { data, error } = await this.client.from('tokens')
        .insert({
          ...token,
          id: this.user?.id,
          updated_at: new Date(),
        }, {
          returning: 'minimal', // Don't return the value after inserting
        });

      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
  }

  update(token: UserToken) {
    const update = {
      ...token,
      id: this.user?.id,
      updated_at: new Date(),
    };

    return new Promise(async (resolve, reject) => {
      const { data, error } = await this.client.from('tokens')
        .upsert(update, {
          returning: 'minimal'
        });

      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  }

  read(): Promise<UserToken> {
    return new Promise(async (resolve, reject) => {
      const { data, error, status } = await this.client.from('tokens')
        .select('id,notification,bluetooth')
        .eq('id', this.user?.id)
        .single();

      if (error && status !== 406) {
        reject(error);
      } else {
        resolve(data as UserToken);
      }
    });
  }

}