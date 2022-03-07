import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class ToastService {

  constructor(private toast: ToastController) { }

  async show(message: string, duration = 3000) {
    const toast = await this.toast.create({
      message,
      duration,
    });

    return toast.present();
  }

}
