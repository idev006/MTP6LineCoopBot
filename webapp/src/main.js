/**
 * Main Entry Point
 * 
 * Vue 3 + Pinia + Vue Router
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// Styles
import './assets/css/main.css'

// Create app
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)

// Mount
app.mount('#app')
