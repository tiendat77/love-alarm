import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { SupabaseClient } from '@supabase/supabase-js';
import { UserProfile } from '../interfaces/user-profile';

@Injectable({ providedIn: 'root' })
export class CloudDatabaseService {

  private client: SupabaseClient;

  private get token() {
    return this.client.auth.session()?.access_token as string;
  }

  get user() {
    return this.client.auth.user();
  }

  get profile() {
    return new Promise(async (resolve, reject) => {
      try {
        const profile = await this.getProfile();
        resolve(profile);
      } catch (error) {
        reject(error);
      }
    });
  }

  constructor(
    private readonly router: Router,
  ) { }

  init(client: SupabaseClient) {
    this.client = client;
  }

  getProfile() {
    return new Promise(async (resolve, reject) => {
      const { data: profile, error, status } = await this.client.from('profiles')
        .select('*')
        .eq('id', this.user?.id)
        .single();

      if (error && status !== 406) {
        reject(error);
      } else {
        resolve(profile);
      }
    });
  }

  createProfile() {
    const user = this.user;
    const metadata = user.user_metadata;
    const profile: UserProfile = {
      id: metadata.id,
      email: metadata.email,
      name: metadata.name || metadata.full_name,
      picture: metadata.avatar_url || metadata.picture || null,
      city: null,
      bio: null,
      interested: [],
      birthday: null,
      ringers: [],
      ringgings: [],
      joindate: user.created_at,
    };

    return new Promise(async (resolve, reject) => {
      const { data, error } = await this.client.from('profiles')
        .insert({
          ...profile,
          id: this.user?.id,
          updated_at: new Date(),
        }, {
          returning: 'minimal', // Don't return the value after inserting
        });

      if (error) {
        reject(error);
      } else {
        resolve(profile);
      }
    });
  }

  updateProfile(profile: UserProfile) {
    const update = {
      ...profile,
      id: this.user?.id,
      updated_at: new Date(),
    };

    return new Promise(async (resolve, reject) => {
      const { data, error } = await this.client.from('profiles')
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
        user_id: this.user.id,
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
      .match({ user_id: this.user.id })
  }

}