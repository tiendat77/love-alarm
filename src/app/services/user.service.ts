import { Injectable } from '@angular/core';

import { CloudDataApiService } from './cloud-data-api.service';
import { StorageService } from './storage.service';
import { ServerlessService } from './serverless-functions.service';
import { ToastService } from './toast.service';

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
  matchings$ = new BehaviorSubject<UserProfile[]>([]);

  constructor(
    private readonly data: CloudDataApiService,
    private readonly serverless: ServerlessService,
    private readonly storage: StorageService,
    private readonly toast: ToastService,
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

    const matchings: string[] = lodash.intersection(
      data.ringers || [],
      data.ringings || []
    );

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
      ringers: data.ringers || [],
      ringings: data.ringings || [],
      mathings: matchings || [],
      joindate: data.joindate || null,
    };

    this.ringings$.next(this.profile.ringings || []);
    this.storage.set(STORAGE_KEY.USER_PROFILE, this.profile);

    this.preLoadMatchings(matchings);
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
        this.toast.show('Ring failed, please try again');
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

  private preLoadMatchings(ids: string[]) {
    this.data.profile.readMultiBasic(ids)
    .then((profiles: UserProfile[]) => {
      this.matchings$.next(profiles);
      this.storage.set(STORAGE_KEY.MATCHINGS, profiles);
    })
    .catch(async (error) => {
      const profiles = await this.storage.get(STORAGE_KEY.MATCHINGS);
      this.matchings$.next(profiles || []);

      console.error(error);
    });
  }

  private loadFromStorage() {
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
