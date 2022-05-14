import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class RingApiService {

  private client: SupabaseClient;

  private get user() {
    return this.client?.auth?.user();
  }

  constructor() {}

  init(client: SupabaseClient) {
    this.client = client;
  }

  listRingers(id: string): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      const { data, error } = await this.client.from('rings')
        .select('from_id')
        .eq('to_id', id);

      if (error) {
        reject(error);
      } else {
        const ids: string[] = (data || []).map(ring => ring.from_id);
        resolve(ids);
      }
    });
  }

  listRingings(id: string): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      const { data, error } = await this.client.from('rings')
        .select('to_id')
        .eq('from_id', id);

      if (error) {
        reject(error);
      } else {
        const ids: string[] = (data || []).map(ring => ring.to_id);
        resolve(ids);
      }
    });
  }

  count(id: string): Promise<number> {
    return new Promise(async (resolve, reject) => {
      const { data, error, count } = await this.client.from('rings')
        .select('from_id', {count: 'exact', head: true})
        .eq('to_id', id);

      if (error) {
        reject(error);
      } else {
        resolve(count || 0);
      }
    });
  }

  create(from: string, to: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const { data, error } = await this.client.from('rings')
        .insert({
          from_id: from,
          to_id: to,
          created_at: new Date(),
        }, {
          returning: 'minimal', // Don't return the value after inserting
        });

      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  }

  remove(from: string, to: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const { data, error } = await this.client.from('rings')
        .delete()
        .eq('from_id', from)
        .eq('to_id', to);

      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  }

}