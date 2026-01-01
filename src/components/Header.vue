<script setup lang="ts">
/**
 * Header 组件 - 页面头部
 * 包含标题、主题切换、联系管理员
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */

import { computed } from 'vue'
import { useTheme } from '../composables/useTheme'

// Props 定义
interface Props {
  /** 网站标题 */
  title: string
  /** 管理员联系方式 */
  adminContact?: string
}

const props = withDefaults(defineProps<Props>(), {
  adminContact: ''
})

// Emits 定义
const emit = defineEmits<{
  /** 联系管理员事件 */
  contactAdmin: []
}>()

// 使用主题 composable
const { isDarkMode, toggleTheme, themePreference } = useTheme()

// 计算主题图标
const themeIcon = computed(() => {
  if (themePreference.value === 'system') {
    return '💻'
  }
  return isDarkMode.value ? '🌙' : '☀️'
})

// 计算主题提示文字
const themeTooltip = computed(() => {
  if (themePreference.value === 'system') {
    return '跟随系统'
  }
  return isDarkMode.value ? '切换到日间模式' : '切换到夜间模式'
})

/**
 * 处理联系管理员点击
 */
function handleContactAdmin() {
  emit('contactAdmin')
  alert(`其实没打算做，因为本网站主要是给自己人用的`)
  // 如果有邮箱地址，打开邮件客户端
  // if (props.adminContact && props.adminContact.includes('@')) {
  //   window.location.href = `mailto:${props.adminContact}`
  // }
}
</script>

<template>
  <header class="header">
    <div class="header-content">
      <!-- 网站标题 -->
      <h1 class="header-title">{{ title }}</h1>
      
      <!-- 操作按钮区域 -->
      <div class="header-actions">
        <!-- 主题切换按钮 -->
        <button
          class="header-btn theme-btn"
          :title="themeTooltip"
          @click="toggleTheme"
        >
          <span class="btn-icon">{{ themeIcon }}</span>
          <span class="btn-text">{{ isDarkMode ? '夜间' : '日间' }}</span>
        </button>
        
        <!-- 联系管理员按钮 -->
        <button
          class="header-btn contact-btn"
          title="联系管理员"
          @click="handleContactAdmin"
        >
          <span class="btn-icon">📧</span>
          <span class="btn-text">联系管理员</span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Header 容器 */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 1px 3px var(--color-shadow);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

/* Header 内容区域 */
.header-content {
  width: 100%;
  padding: 1.25rem 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

/* 网站标题 */
.header-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 操作按钮区域 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

/* 通用按钮样式 */
.header-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.header-btn:hover {
  background-color: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}

.header-btn:active {
  transform: scale(0.98);
}

/* 按钮图标 */
.btn-icon {
  font-size: 1.25rem;
  line-height: 1;
}

/* 按钮文字 */
.btn-text {
  font-weight: 500;
}

/* 响应式：移动端隐藏按钮文字 */
@media (max-width: 640px) {
  .header-content {
    padding: 0.75rem 1rem;
  }
  
  .header-title {
    font-size: 1.25rem;
  }
  
  .btn-text {
    display: none;
  }
  
  .header-btn {
    padding: 0.5rem;
  }
}
</style>
