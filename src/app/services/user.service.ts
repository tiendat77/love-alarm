import { Injectable } from '@angular/core';

import { CloudDataApiService } from './cloud-data-api.service';
import { StorageService } from './storage.service';
import { ServerlessService } from './serverless-functions.service';

import { STORAGE_KEY } from '../configs/storage-key';
import { UserToken, UserMeta, UserProfile } from '../interfaces';
import { BehaviorSubject, forkJoin, from, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import lodash from 'lodash';

@Injectable({ providedIn: 'root' })
export class UserService {

  meta: UserMeta;
  profile: UserProfile;
  token: UserToken;

  ringings$ = new BehaviorSubject<string[]>([]);
  matching$ = new BehaviorSubject<string[]>([]);

  constructor(
    private data: CloudDataApiService,
    private serverless: ServerlessService,
    private storage: StorageService,
  ) { }

  async init() {
    try {
      const metadata = this.data.user?.user_metadata;
      this.setMeta(metadata);

      const profile = await this.data.profile.readOwn();
      this.setProfile(profile);

      const token = await this.data.token.read();
      const notificationToken = await this.storage.get(STORAGE_KEY.NOTIFICATION_TOKEN);

      if (notificationToken && notificationToken !== token?.notification) {
        token.notification = notificationToken;
        await this.data.token.update(token);
        this.setToken(token);

      } else {
        // token is already exist and haven't changed
        this.setToken(token);
      }

    } catch (error) {
      // network error, load from storage
      this.loadFromStorage();
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

    const matching = lodash.intersection(
      this.profile.ringers,
      this.profile.ringings
    );

    this.matching$.next(matching);
    this.ringings$.next(this.profile.ringings || []);

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
    // can't ring yourself
    if (id === this.profile.id) {
      return Promise.resolve();
    }

    return forkJoin([
      this.data.ring.create(this.profile.id, id),
      this.serverless.ring({id})
    ]).pipe(
      tap(() => {
        const ringings: string[] = this.profile?.ringings || [];

        if (!ringings.includes(id)) {
          ringings.push(id);
        }

        this.profile.ringings = ringings;
        this.ringings$.next(ringings);
      }),
      catchError(error => {
        console.error('[User] Ring failed', error);
        return of(null);
      })
    ).toPromise();
  }

  unring(id: string) {
    return from(
      this.data.ring.remove(this.profile.id, id)
    ).pipe(
      tap(() => {
        const ringings: string[] = (this.profile?.ringings || []).filter(ringing => ringing !== id);

        this.profile.ringings = ringings;
        this.ringings$.next(ringings);
      }),
      catchError(error => {
        console.error('[User] Un-ring failed', error);
        return of(null);
      })
    ).toPromise();
  }

  private async loadFromStorage() {
    forkJoin([
      this.storage.get(STORAGE_KEY.USER_META),
      this.storage.get(STORAGE_KEY.USER_PROFILE),
      this.storage.get(STORAGE_KEY.USER_TOKEN),
    ]).subscribe(
      ([meta, profile, token]) => {
        this.meta = meta || this.meta || null;
        this.profile = profile || this.profile || null;
        this.token = token || this.token || null;
      },
      (error) => {console.error(error)}
    );
  }

}
