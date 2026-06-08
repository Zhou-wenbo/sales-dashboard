// 🔴 修复 ResizeObserver loop completed with undelivered notifications
const debounce = (fn, delay) => {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};
window.ResizeObserver = class ResizeObserver extends window.ResizeObserver {
  constructor(callback) {
    super(debounce(callback, 20));
  }
};

// ==================================================
// 下面是你原来的 main.js 代码，不动！
// ==================================================
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus)
app.use(router)
app.mount('#app')