import { Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';

import { StorageService } from './storage.service';
import { STORAGE_KEY } from '../configs/storage-key';

import moment from 'moment';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  token: string;

  constructor(
    private readonly storage: StorageService
  ) {}

  async init() {
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

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
    });

    await PushNotifications.register();
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