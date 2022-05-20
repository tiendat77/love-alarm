import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { StatusBarArea, Style } from 'capacitor-status-bar-area';

import { ThemeService } from './theme.service';
import { PlatformService } from './platform.service';

@Injectable({providedIn: 'root'})
export class WebViewService {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private readonly meta: Meta,
    private readonly theme: ThemeService,
    private readonly platform: PlatformService,
  ) { }

  init() {
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

  hideApp() {
    this.document.body.style.background = 'transparent';
    const element = this.document.getElementsByTagName('app-container')[0] as HTMLElement;
    if (element) {
      element.style.display = 'none';
    }
  }

  showApp() {
    this.document.body.style.background = 'var(--background-color)';
    const element = this.document.getElementsByTagName('app-container')[0] as HTMLElement;
    if (element) {
      element.style.display = null;
    }
  }

  setStatusBarStyle(style: 'dark' | 'light') {
    if (this.platform.isNative) {
      if (this.theme.isDark()) {
        // status bar text color white
        return StatusBarArea.setStyle({style: Style.Dark});
      }

      style === 'dark' ?
        StatusBarArea.setStyle({style: Style.Dark}) :
        StatusBarArea.setStyle({style: Style.Light});

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
