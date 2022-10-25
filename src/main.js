import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)
import router from './router/index.js'

/* 引入Element Plus */
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
/* 引入Element图标库 */
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}


app.use(router).use(ElementPlus).mount('#app')
