import { createPinia } from 'pinia'
import { createApp } from 'vue'
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import vuetify from './plugins/vuetify'
import App from './App.vue'

// Create Pinia instance
const pinia = createPinia()
// Use persisted state with Pinia so our store data will persist even after page refresh

createApp(App)
  .use(pinia)
  .use(vuetify)
  .mount('#app')
