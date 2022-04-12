import { Injectable } from '@angular/core';

import { CloudDatabaseService } from './cloud-database.service';
import { StorageService } from './storage.service';

import { UserMeta } from '../interfaces/user-meta';
import { UserProfile } from '../interfaces/user-profile';
import { STORAGE_KEY } from '../configs/storage-key';

@Injectable({ providedIn: 'root' })
export class UserService {

  meta: UserMeta;
  profile: UserProfile;

  constructor(
    private data: CloudDatabaseService,
    private storage: StorageService,
  ) { }

  async init() {
    try {
      const metadata = this.data.user?.user_metadata;
      const profile = await this.data.profile;

      if (metadata) {
        this.setMeta(metadata);
      }

      if (profile) {
        this.setProfile(profile);
      } else {
        // user does not have profile yet
        // so, create default one
        const profile = await this.data.createProfile();
        this.setProfile(profile);
      }

    } catch (error) {
      // network error, load from storage
      this.loadInfoFromStorage();
      console.error('[User] Init failed', error);
    }
  }

  setMeta(data: any) {
    this.meta = {
      ...data, // properties from provider

      name: data.name || data.full_name,
      bluetooth_id: data.bluetooth_id || null,
      notification_token: data.notification_token || null,
    };

    this.storage.set(STORAGE_KEY.USER_META, this.meta);
  }

  setProfile(data: any) {
    this.profile = {
      id: data.id,
      name: data.name,
      email: data.email,
      city: data.city || null,
      picture: data.picture || null,
      bio: data.bio || null,
      interested: data.interested || null,
      birthday: data.birthday || null,
      joindate: data.joindate || null,
    };

    this.storage.set(STORAGE_KEY.USER_PROFILE, this.profile);
  }

  private async loadInfoFromStorage() {
    const meta = await this.storage.get(STORAGE_KEY.USER_META);
    const profile = await this.storage.get(STORAGE_KEY.USER_PROFILE);

    if (meta) {
      this.meta = meta;
    }

    if (profile) {
      this.profile = profile;
    }
  }

}
