<script setup lang="ts">
/**
 * SearchBar 组件 - 搜索栏
 * 实现搜索输入框
 * Requirements: 6.1
 */

import { ref, watch } from 'vue'

// Props 定义
interface Props {
  /** 搜索关键词 (v-model) */
  modelValue: string
  /** 占位符文字 */
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '搜索网站标题、简介、标签...'
})

// Emits 定义
const emit = defineEmits<{
  /** 更新搜索关键词 */
  'update:modelValue': [value: string]
}>()

// 本地输入值
const localValue = ref(props.modelValue)

// 监听 props 变化，同步到本地值
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
})

/**
 * 处理输入变化
 */
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  localValue.value = target.value
  emit('update:modelValue', target.value)
}

/**
 * 清空搜索框
 */
function clearSearch() {
  localValue.value = ''
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="search-bar">
    <!-- 搜索图标 -->
    <span class="search-icon">🔍</span>
    
    <!-- 搜索输入框 -->
    <input
      type="text"
      class="search-input"
      :value="localValue"
      :placeholder="placeholder"
      @input="handleInput"
    />
    
    <!-- 清空按钮 -->
    <button
      v-if="localValue"
      class="clear-btn"
      title="清空搜索"
      @click="clearSearch"
    >
      ✕
    </button>
  </div>
</template>

<style scoped>
/* 搜索栏容器 */
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 700px;
  background-color: var(--color-bg-secondary);
  border: 2px solid var(--color-border);
  border-radius: 1rem;
  transition: all 0.2s ease;
}

.search-bar:focus-within {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

/* 搜索图标 */
.search-icon {
  position: absolute;
  left: 1.25rem;
  font-size: 1.25rem;
  color: var(--color-text-muted);
  pointer-events: none;
}

/* 搜索输入框 */
.search-input {
  width: 100%;
  padding: 1rem 3rem 1rem 3.5rem;
  border: none;
  background: transparent;
  color: var(--color-text-primary);
  font-size: 1.125rem;
  outline: none;
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

/* 清空按钮 */
.clear-btn {
  position: absolute;
  right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: var(--color-text-muted);
  color: var(--color-bg-primary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background-color: var(--color-text-secondary);
}

/* 响应式 */
@media (max-width: 640px) {
  .search-bar {
    max-width: 100%;
  }
  
  .search-input {
    padding: 0.875rem 2.75rem 0.875rem 3rem;
    font-size: 1rem;
  }
  
  .search-icon {
    font-size: 1.125rem;
  }
}
</style>
