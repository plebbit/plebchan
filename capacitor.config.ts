import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'plebchan.android',
  appName: 'plebchan',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    Device: {
      lazyLoad: true,
    },
  },
};

export default config;
