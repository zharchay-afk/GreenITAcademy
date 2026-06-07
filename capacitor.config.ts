import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'lu.greenit.academie',
  appName: 'Green IT Académie',
  // Le build natif est séparé du build GitHub Pages (base URL différente)
  webDir: 'dist-native',
  server: {
    // HTTPS scheme requis pour les API modernes du navigateur (localStorage, etc.)
    androidScheme: 'https',
  },
  android: {
    buildOptions: {
      releaseType: 'APK',
    },
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#1a2e1a',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
  },
};

export default config;
