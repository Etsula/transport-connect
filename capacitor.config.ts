
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1f592579eb6844f2b49cd09f54d69102',
  appName: 'transport-connect',
  webDir: 'dist',
  server: {
    url: "https://1f592579-eb68-44f2-b49c-d09f54d69102.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
    },
  },
};

export default config;
