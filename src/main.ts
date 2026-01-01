/**
 * 应用入口文件
 * 初始化 Vue 应用并挂载到 DOM
 */

import { createApp } from 'vue'
// 导入全局样式（包含 CSS 变量和 Tailwind）
import './styles/main.css'
import App from './App.vue'

// 创建并挂载 Vue 应用
createApp(App).mount('#app')
