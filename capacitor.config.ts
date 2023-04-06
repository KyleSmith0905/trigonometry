import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'www.kylesmith0905.trigonometrysimulator',
  appName: 'Trigonometry Simulator',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'http://192.168.254.153:5173/',
    cleartext: true,
  }
};

export default config;
