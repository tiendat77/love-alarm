import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalsService, WebViewService } from '../../services';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  ringers: number = 0;

  constructor(
    private readonly router: Router,
    private readonly modals: ModalsService,
    private readonly webview: WebViewService,
  ) {}

  navigate(url: string) {
    this.router.navigateByUrl(url);
  }

  async settings() {
    this.webview.setStatusBarStyle('light');
    await this.modals.showSettings();
    this.webview.setStatusBarStyle('dark');
  }

  test() {
    if (this.ringers !== 0) {
      this.ringers--;
    } else {
      this.ringers++;
    }
  }

}
