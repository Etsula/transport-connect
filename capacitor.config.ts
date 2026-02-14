
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ship.app',
  appName: 'iShip',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
    },
  },
};

export default config;
