import { Injectable } from '@angular/core';

import { CloudDatabaseService } from './cloud-database.service';
import { StorageService } from './storage.service';
import { ServerlessService } from './serverless-functions.service';

import { STORAGE_KEY } from '../configs/storage-key';
import { UserToken, UserMeta, UserProfile } from '../interfaces';
import { forkJoin } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {

  meta: UserMeta;
  profile: UserProfile;
  token: UserToken;

  constructor(
    private data: CloudDatabaseService,
    private serverless: ServerlessService,
    private storage: StorageService,
  ) { }

  async init() {
    try {
      const metadata = this.data.user?.user_metadata;
      this.setMeta(metadata);

      const profile = await this.data.profile;
      this.setProfile(profile);

      const token = await this.data.token;
      const notificationToken = await this.storage.get(STORAGE_KEY.NOTIFICATION_TOKEN);

      if (notificationToken && notificationToken !== token?.notification) {
        token.notification = notificationToken;
        await this.data.updateToken(token);
        this.setToken(token);

      } else {
        // token is already exist and haven't changed
        this.setToken(token);
      }

    } catch (error) {
      // network error, load from storage
      this.loadInfoFromStorage();
      console.error('[User] Init failed', error);
    }
  }

  clear() {
    this.meta = null;
    this.token = null;
    this.profile = null;
    this.storage.remove(STORAGE_KEY.USER_META);
    this.storage.remove(STORAGE_KEY.USER_TOKEN);
    this.storage.remove(STORAGE_KEY.USER_PROFILE);
  }

  setMeta(data: any) {
    if (!data) {
      return;
    }

    this.meta = {
      ...data, // properties from provider
      name: data.name || data.full_name
    };

    this.storage.set(STORAGE_KEY.USER_META, this.meta);
  }

  setProfile(data: any) {
    if (!data) {
      return;
    }

    this.profile = {
      id: data.id,
      name: data.name,
      gender: data.gender,
      email: data.email,
      city: data.city || null,
      picture: data.picture || null,
      bio: data.bio || null,
      interested: data.interested || null,
      birthday: data.birthday || null,
      ringers: data.ringers || null,
      ringings: data.ringings || null,
      joindate: data.joindate || null,
    };

    this.storage.set(STORAGE_KEY.USER_PROFILE, this.profile);
  }

  setToken(data: any) {
    if (!data) {
      return;
    }

    this.token = {
      id: data.id,
      notification: data.notification,
      bluetooth: data.bluetooth,
    };

    this.storage.set(STORAGE_KEY.USER_TOKEN, this.token);
  }

  ring(id: string) {
    const ringings: string[] = this.profile?.ringings || [];

    if (ringings.includes(id)) {
      return;
    }

    ringings.push(id);
    this.profile.ringings = ringings;

    return forkJoin([
      this.data.updateProfile({ringings}),
      this.serverless.ring({id})
    ]).subscribe();
  }

  unring(id: string) {
    const ringings: string[] = (this.profile?.ringings || []).filter(ringing => {
      return ringing !== id;
    });

    this.profile.ringings = ringings;

    return forkJoin([
      this.data.updateProfile({ ringings }),
      this.serverless.unring({id})
    ]).subscribe();
  }

  private async loadInfoFromStorage() {
    const meta = await this.storage.get(STORAGE_KEY.USER_META);
    const profile = await this.storage.get(STORAGE_KEY.USER_PROFILE);
    const token = await this.storage.get(STORAGE_KEY.USER_TOKEN);

    if (meta) {
      this.meta = meta;
    }

    if (profile) {
      this.profile = profile;
    }

    if (token) {
      this.token = token;
    }
  }

}
