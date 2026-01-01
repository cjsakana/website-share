<script setup lang="ts">
/**
 * FloatButton 组件 - 悬浮按钮
 * 实现返回顶部按钮
 * Requirements: 5.1, 5.2
 */

import { useScroll } from '../composables/useScroll'

// Props 定义
interface Props {
  /** 是否可见（可选，默认根据滚动位置自动判断） */
  visible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: undefined
})

// Emits 定义
const emit = defineEmits<{
  /** 点击事件 */
  click: []
}>()

// 使用滚动 composable
const { showBackToTop, scrollToTop } = useScroll()

/**
 * 计算按钮是否显示
 * 如果 props.visible 有值则使用 props，否则使用滚动状态
 */
function isVisible(): boolean {
  if (props.visible !== undefined) {
    return props.visible
  }
  return showBackToTop.value
}

/**
 * 处理按钮点击
 */
function handleClick() {
  emit('click')
  scrollToTop()
}
</script>

<template>
  <Transition name="float-btn">
    <button
      v-show="isVisible()"
      class="float-button"
      title="返回顶部"
      @click="handleClick"
    >
      <span class="btn-icon">↑</span>
      <span class="btn-text">顶部</span>
    </button>
  </Transition>
</template>

<style scoped>
/* 悬浮按钮 */
.float-button {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  padding: 0.5rem;
  border: none;
  border-radius: 50%;
  background-color: var(--color-accent);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.float-button:hover {
  background-color: var(--color-accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5);
}

.float-button:active {
  transform: translateY(0);
}

/* 按钮图标 */
.btn-icon {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
}

/* 按钮文字 */
.btn-text {
  font-size: 0.625rem;
  font-weight: 500;
  margin-top: 0.125rem;
}

/* 过渡动画 */
.float-btn-enter-active,
.float-btn-leave-active {
  transition: all 0.3s ease;
}

.float-btn-enter-from,
.float-btn-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

/* 响应式 */
@media (max-width: 640px) {
  .float-button {
    right: 1rem;
    bottom: 1rem;
    width: 3rem;
    height: 3rem;
  }
  
  .btn-icon {
    font-size: 1rem;
  }
  
  .btn-text {
    display: none;
  }
}
</style>
