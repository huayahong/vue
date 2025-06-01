import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import './assets/main.css'

// 创建Vue应用实例
const app = createApp(App)

// 使用Vuex状态管理
app.use(store)

// 在DOM加载完成后挂载应用
document.addEventListener('DOMContentLoaded', () => {
  // 移除加载指示器
  const loadingElement = document.getElementById('app-loading')
  if (loadingElement) {
    loadingElement.style.display = 'none'
  }
  
  // 挂载Vue应用
  app.mount('#app')
})

// 添加错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue错误:', err)
  console.error('错误信息:', info)
}
