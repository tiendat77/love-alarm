import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';

import { from, of, zip } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { RingApiService } from './ring.service';
import { UserProfile } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class ProfileApiService {

  private client: SupabaseClient;

  private get user() {
    return this.client?.auth?.user();
  }

  constructor(
    private ring: RingApiService,
  ) {}

  init(client: SupabaseClient) {
    this.client = client;
  }

  create(): Promise<UserProfile> {
    const metadata = this.user.user_metadata;
    const profile: UserProfile = {
      email: this.user.email || metadata.email,
      name: metadata.name || metadata.full_name,
      picture: metadata.avatar_url || metadata.picture || null,
      city: null,
      bio: null,
      interested: [],
      birthday: null
    };

    return new Promise(async (resolve, reject) => {
      const { data, error } = await this.client.from('profiles')
        .insert({
          ...profile,
          id: this.user?.id,
          created_at: new Date(),
          updated_at: new Date(),
        });

      if (error) {
        reject(error);
      } else {
        resolve(data[0]);
      }
    });
  }

  update(profile: UserProfile) {
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

  /**
   * read logged user profile
   * with full detail include ringings and ringers
   */
  readOwn() {
    const id = this.user?.id;

    return from(this._read(id)).pipe(
      switchMap((profile) => {
        if (!profile) {
          // create new profile if not exist
          return zip(
            this.create(),
            of([] as string[]),
            of([] as string[]),
          );
        }

        return zip(
          of(profile),
          this.ring.listRingers(id),
          this.ring.listRingings(id)
        );
      }),
      map(([profile, ringers, ringings]) => {
        return {
          ...profile,
          ringers,
          ringings,
          totalRingers: ringers.length,
          totalRinging: ringings.length,
        } as UserProfile;
      }),
      catchError((error) => {
        console.error(error);
        return of(null);
      })
    ).toPromise();
  }

  /**
   * read profile detail from other user
   * include detail info and count ringers
   * used in profile modal
   */
  read(id: string): Promise<UserProfile> {
    return zip(
      this._read(id),
      this.ring.count(id),
    ).pipe(
      map(([profile, ringers]) => {
        return {
          ...profile,
          totalRingers: ringers
        } as UserProfile;
      }),
      catchError((error) => {
        console.error(error);
        return of(null);
      })
    ).toPromise();
  }

  /**
   * read profile info from other user
   * with basic detail, not include ringers and ringings
   * used in ring modal, scan modal, matching component
   */
  readBasic(id: string): Promise<UserProfile> {
    return this._read(id, ['id', 'name', 'picture', 'gender']);
  }

  readMultiBasic(ids: string[]): Promise<UserProfile[]> {
    if (!ids.length) {
      return Promise.resolve([]);
    }

    return new Promise(async (resolve, reject) => {
      const { data, error } = await this.client.from('profiles')
        .select('id, name, gender, picture')
        .in('id', ids);

      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  }

  private _read(id: string, columns: string | string[] = '*'): Promise<UserProfile> {
    return new Promise(async (resolve, reject) => {
      if (typeof columns !== 'string') {
        columns = columns.join(',');
      }

      const { data, error, status } = await this.client.from('profiles')
        .select(columns)
        .eq('id', id)
        .single();

      if (error && status !== 406) {
        return reject(error);
      }

      // not exist
      if (status === 406) {
        return resolve(null);
      }

      resolve(data || null);
    });
  }

  listAll(
    columns: string | string[] = 'id, name, gender, picture',
    maximum: number = 200
  ): Promise<UserProfile[]> {
    return new Promise(async (resolve, reject) => {
      if (typeof columns !== 'string') {
        columns = columns.join(',');
      }

      const { data, error } = await this.client.from('profiles')
        .select(columns)
        .not('id', 'eq', this.user?.id)
        .limit(maximum);

      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  }

}