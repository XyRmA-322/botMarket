import { createApp } from 'vue'
import App from './App.vue'

// Базовые стили Vuetify (необходимы с Vite)
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import vuetify from './plugins/vuetify'


createApp(App)
  .use(vuetify)
  .mount('#app')