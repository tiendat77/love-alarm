import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { StatusBarArea, Style } from 'capacitor-status-bar-area';

import { StorageService } from './storage.service';
import { PlatformService } from './platform.service';
import { STORAGE_KEY } from '../configs/storage-key';

@Injectable({providedIn: 'root'})
export class WebViewService {

  isDarkTheme = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private readonly meta: Meta,
    private readonly storage: StorageService,
    private readonly platform: PlatformService,
  ) { }

  async init() {
    this.initStatusBar();
    this.getTheme();
    this.setTheme();
  }

  hideApp() {
    const element = this.document.getElementsByTagName('app-container')[0] as HTMLElement;
    if (element) {
      element.style.display = 'none';
    }
  }

  showApp() {
    const element = this.document.getElementsByTagName('app-container')[0] as HTMLElement;
    if (element) {
      element.style.display = null;
    }
  }

  private async getTheme() {
    const isDark = !!(await this.storage.get(STORAGE_KEY.DARK_THEME));
    this.isDarkTheme = isDark;
  }

  private setTheme(dark: boolean = this.isDarkTheme) {
    this.storage.set(STORAGE_KEY.DARK_THEME, dark);

    dark ?
      this.document.body.classList.add('dark-theme') :
      this.document.body.classList.remove('dark-theme');
  }

  toggleDarkTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.setTheme(this.isDarkTheme);
  }

  initStatusBar() {
    if (!this.platform.isNative) {
      return;
    }

    StatusBarArea.setStyle({style: Style.Light});
    StatusBarArea.setBackgroundColor({color: '#ffffff'});
    StatusBarArea.setOverlaysWebView({overlay: true});

    StatusBarArea.getHeight().then((info) => {
      document.documentElement.style.setProperty(
        '--status-bar-safe-area',
        `${info?.height || 24}px`
      );
    });
  }

  async setStatusBarStyle(style: 'dark' | 'light') {
    if (this.platform.isNative) {
      style === 'dark' ?
      await StatusBarArea.setStyle({style: Style.Dark}) :
      await StatusBarArea.setStyle({style: Style.Light});

    } else {
      style === 'dark' ?
        this.meta.updateTag({name: 'theme-color',content: '#000000'}) :
        this.meta.updateTag({name: 'theme-color',content: '#ffffff'});
    }
  }

  hideStatusBarOverlay() {
    this.platform.isNative
      ? StatusBarArea.setOverlaysWebView({overlay: false})
      : this.meta.updateTag({name: 'theme-color',content: '#ffffff'});
  }

  showStatusBarOverlay() {
    this.platform.isNative
        ? StatusBarArea.setOverlaysWebView({overlay: true})
        : this.meta.updateTag({name: 'theme-color',content: '#f8b6f7'});
  }

}
