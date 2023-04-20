import { createApp } from 'vue';
import { createHead } from '@vueuse/head';
import { createPinia } from 'pinia';
import { VueFire, VueFireAuth } from 'vuefire'

import './index.css';

import App from './App.vue';
import router from './router';
import { firebaseApp } from './helpers/firebase';

const app = createApp(App);
const head = createHead();

app.config.compilerOptions.isCustomElement = (tag) => tag === 'ion-icon';

app.use(createPinia());
app.use(router);
app.use(head);
app.use(VueFire, {
  firebaseApp: firebaseApp,
  modules: [
    VueFireAuth(),
  ],
});

app.mount('#app')
