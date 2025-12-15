import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pigg.brokerage',
  appName: 'PIGG',
  webDir: 'dist',

  // Server configuration
  server: {
    // For development, you can use live reload
    // url: 'http://192.168.1.x:5173',
    // cleartext: true,
    androidScheme: 'https',
  },

  // iOS specific settings
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    backgroundColor: '#0D0D0D', // dark-bg color
  },

  // Android specific settings
  android: {
    backgroundColor: '#0D0D0D', // dark-bg color
    allowMixedContent: false,
  },

  // Plugins configuration
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0D0D0D',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0D0D0D',
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
