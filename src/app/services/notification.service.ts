import { Injectable } from '@angular/core';
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';

import { ModalsService } from './modals.service';
import { StorageService } from './storage.service';
import { STORAGE_KEY } from '../configs/storage-key';

import moment from 'moment';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  token: string;

  constructor(
    private readonly storage: StorageService,
    private readonly modals: ModalsService,
  ) {}

  async init() {
    try {
      await PushNotifications.addListener('registration', token => {
        console.info('Registration token: ', token.value);
        this.token = token.value;
        this.storage.set(STORAGE_KEY.NOTIFICATION_TOKEN, token.value);
      });

      await PushNotifications.addListener('registrationError', err => {
        console.error('Registration error: ', err.error);
      });

      await PushNotifications.addListener('pushNotificationReceived', notification => {
        console.log('Push notification received: ', notification);
      });

      await PushNotifications.addListener('pushNotificationActionPerformed', action => {
        console.log('Push notification action performed', action.actionId);

        if (action.actionId === 'tap') {
          this.onNotificationTap(action.notification);
        }
      });

      await PushNotifications.register();

    } catch (e) {
      console.error(e);
    }
  }

  private onNotificationTap(notification: PushNotificationSchema) {
    const type = notification?.data?.type;

    switch (type) {
      case 'ring':
        const profileId = notification?.data?.profileId;
        this.modals.showUserProfile(profileId);
        break;

      default:
        break;
    }
  }

  notify(message: string) {
    return LocalNotifications.schedule({
      notifications: [
        {
          title: 'Notification',
          body: message,
          id: moment().unix(),
        }
      ]
    });
  }

  schedule(message: string, time: number) {
    return LocalNotifications.schedule({
      notifications: [
        {
          title: 'Notification',
          body: message,
          id: moment().unix(),
          schedule: { at: moment.unix(time).toDate() }
        }
      ]
    });
  }

}