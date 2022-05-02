import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { SupabaseClient } from '@supabase/supabase-js';
import { UserToken, UserMeta, UserProfile } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class CloudDatabaseService {

  private client: SupabaseClient;

  get user() {
    return this.client.auth.user();
  }

  get profile(): Promise<UserProfile> {
    return this.readProfile()
      .then((profile) => {
        if (!profile) {
          return this.createProfile();
        } else {
          return Promise.resolve(profile);
        }
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  }

  get token(): Promise<UserToken> {
    return this.readToken()
      .then((token) => {
        if (!token) {
          return this.createToken();
        } else {
          return Promise.resolve(token);
        }
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  }

  constructor(
    private readonly router: Router,
  ) { }

  init(client: SupabaseClient) {
    this.client = client;
  }

  // profile
  readProfile(): Promise<UserProfile> {
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

  createProfile(): Promise<UserProfile> {
    const user = this.user;
    const metadata = user.user_metadata;
    const profile: UserProfile = {
      id: metadata.id,
      email: user.email || metadata.email,
      name: metadata.name || metadata.full_name,
      picture: metadata.avatar_url || metadata.picture || null,
      city: null,
      bio: null,
      interested: [],
      birthday: null,
      ringers: [],
      ringings: [],
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

  updateProfile(profile: UserProfile): Promise<any> {
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

  listProfiles(columns = '*'): Promise<UserProfile[]> {
    return new Promise(async (resolve, reject) => {
      const { data, error } = await this.client.from('profiles')
        .select(columns)
        .not('id', 'eq', this.user?.id)
        .limit(200);

      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  }

  getSingleUserProfile(id: string): Promise<UserProfile> {
    return new Promise(async (resolve, reject) => {
      const { data, error } = await this.client.from('profiles')
        .select('id, name, gender, picture, bio, city, interested, birthday, ringers')
        .eq('id', id)
        .single();

      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  }

  getMultiUserProfile(ids: string[]): Promise<UserProfile[]> {
    if (!ids.length) {
      return Promise.resolve([]);
    }

    return new Promise(async (resolve, reject) => {
      const { data, error } = await this.client.from('profiles')
        .select('id, name, gender, picture, bio, city, interested, birthday, ringers')
        .in('id', ids);

      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  }

  // meta data
  updateMeta(meta: UserMeta) {
    return new Promise(async (resolve, reject) => {
      const { data, error } = await this.client.auth.update({data: meta});

      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  }

  // token
  createToken(notification?: string, bluetooth?: string): Promise<UserToken> {
    const user = this.user;
    const metadata = user.user_metadata;
    const token: UserToken = {
      id: metadata.id,
      notification: notification || null,
      bluetooth: bluetooth || null,
    };

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

  readToken(): Promise<UserToken> {
    return new Promise(async (resolve, reject) => {
      const { data, error, status } = await this.client.from('tokens')
        .select('id,notification,bluetooth')
        .eq('id', this.user?.id)
        .single();

      if (error && status !== 406) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  }

  updateToken(token: UserToken) {
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

}