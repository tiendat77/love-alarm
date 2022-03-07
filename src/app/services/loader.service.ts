import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class LoaderService {

  private loader: HTMLIonLoadingElement;

  constructor(
    private loading: LoadingController
  ) { }

  async start(message = 'Chờ tí nhé ^^') {
    this.loader = await this.loading.create({
      message,
      mode: 'ios',
    });

    await this.loader.present();
  }

  stop(timeout = 750) {
    setTimeout(async () => {
      await this.loader?.dismiss();
    }, timeout);
  }

}