import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { SupabaseClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class CloudStorageService {

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

  getAvatarUrl(path: string) {
    return new Promise<string>(async (resolve, reject) => {
      const { publicURL, error } = await this.client.storage
        .from('avatars')
        .getPublicUrl(path);

      if (error) {
        reject(error);
      } else {
        resolve(publicURL);
      }
    });
  }

  uploadAvatar(path: string, file: File) {
    return new Promise(async (resolve, reject) => {
      const { data, error } = await this.client.storage
        .from('avatars')
        .upload(path, file);

      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  }

  async deleteAvatar(path: string) {
    return await this.client.storage
      .from('avatars')
      .remove([path]);
  }

}