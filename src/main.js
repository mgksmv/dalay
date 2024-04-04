import './assets/scss/styles.scss';
import 'vue-toast-notification/dist/theme-bootstrap.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ToastPlugin from 'vue-toast-notification';
import { createManager } from '@vue-youtube/core';
import router from './router';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();
const youtubePlayerManager = createManager();

app.use(router);
app.use(pinia);
app.use(ToastPlugin);
app.use(youtubePlayerManager);

app.mount('#app');
