import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import store from './store';
import ganttastic from "@infectoone/vue-ganttastic";

createApp(App).use(ganttastic).use(store).mount('#app');
