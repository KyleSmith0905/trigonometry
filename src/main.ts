import { createApp } from 'vue';
import { createHead } from '@vueuse/head';
import { createPinia } from 'pinia';

import './index.css';

import App from './App.vue';
import router from './router';

const app = createApp(App);
const head = createHead();

app.config.compilerOptions.isCustomElement = (tag) => tag === 'ion-icon';

app.use(createPinia());
app.use(router);
app.use(head);

app.mount('#app')
