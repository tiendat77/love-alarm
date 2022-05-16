import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

type ToastType = 'success' | 'error' | 'warning';

const ToastIcon = {
  'success': 'toast-success-filled',
  'error': 'toast-error-filled',
  'warning': 'toast-warning-filled'
};

@Injectable({ providedIn: 'root' })
export class ToastService {

  constructor(private toast: ToastController) { }

  async show(message: string, type: ToastType = 'success') {
    const toast = await this.toast.create({
      message,
      mode: 'ios',
      position: 'top',
      duration: 3000,
      cssClass: type,
      icon: ToastIcon[type],
    });

    return toast.present();
  }

}
