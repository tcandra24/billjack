import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./assets/css/index.css";
import router from '@/library/router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(router)
app.use(pinia)

app.mount("#app");
