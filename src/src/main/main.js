import { ViteSSG } from 'vite-ssg/single-page';
import App from './App.vue';
import store from '@/common/store';

export const createApp = ViteSSG(App,  ({ app }) => {
    app.use(store.createPinia());
});