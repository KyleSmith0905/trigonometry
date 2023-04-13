import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'www.kylesmith0905.trigonometrysimulator',
  appName: 'Trigonometry Simulator',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'http://10.0.0.217:5173/',
    cleartext: true,
  }
};

export default config;
