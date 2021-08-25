import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dathuynh.lovealarm',
  appName: 'Love Alarm',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 0,
      splashImmersive: true
    }
  }
};

export default config;
