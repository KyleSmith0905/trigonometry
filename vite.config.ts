import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import legacy from '@vitejs/plugin-legacy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'ion-icon',
        },
      },
    }),
    legacy({
      targets: ['chrome >= 64', 'edge >= 79', 'safari >= 11.1', 'firefox >= 67'],
      ignoreBrowserslistConfig: true,
      renderLegacyChunks: false,
      /**
       * Polyfills required by modern browsers
       *
       * Since some low-version modern browsers do not support the new syntax
       * You need to load polyfills corresponding to the syntax to be compatible
       * At build, all required polyfills are packaged according to the target browser version range
       * But when the page is accessed, only the required part is loaded depending on the browser version
       *
       * Two configuration methods:
       *
       * 1. true
       *  - Automatically load all required polyfills based on the target browser version range
       *  - Demerit: will introduce polyfills that are not needed by modern browsers in higher versions,
       *    as well as more aggressive polyfills.
       *
       * 2、string[]
       *  - Add low-version browser polyfills as needed
       *  - Demerit: It needs to be added manually, which is inflexible;
       *    it will be discovered after the production is deployed, resulting in production failure! ! !
       */
      // modernPolyfills: ['es/global-this'],
      //  or
      modernPolyfills: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: "Trigonometry Simulator",
        short_name: "Trig Simulator",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ],
        theme_color: "#f1f5f9",
        background_color: "#f1f5f9",
        display: "standalone",
        start_url: "/"
      }    
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    target: 'es2015'
  },
  base: './',
})
