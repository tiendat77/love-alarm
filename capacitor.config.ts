import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dat_huynh.love_alarm',
  appName: 'Love Alarm',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 0
    }
  }
};

export default config;
