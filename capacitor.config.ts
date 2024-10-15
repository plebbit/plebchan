import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'plebchan.android',
  appName: 'plebchan',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
