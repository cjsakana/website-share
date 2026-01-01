<script setup lang="ts">
/**
 * TagNavigator 组件 - 标签导航
 * 实现标签列表和点击跳转，底部固定收起按钮
 * Requirements: 2.1, 2.2, 2.3, 2.4
 */

import { ref, onMounted, onUnmounted } from 'vue'

// Props 定义
interface Props {
  /** 标签列表 */
  tags: string[]
  /** 当前激活的标签 */
  activeTag?: string
}

const props = withDefaults(defineProps<Props>(), {
  activeTag: ''
})

// Emits 定义
const emit = defineEmits<{
  /** 选择标签事件 */
  selectTag: [tag: string]
}>()

// 折叠状态
const isCollapsed = ref(false)

// 是否为移动端
const isMobile = ref(false)

/**
 * 检测是否为移动端
 */
function checkMobile() {
  isMobile.value = window.innerWidth < 768
}

/**
 * 切换折叠状态
 */
function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}

/**
 * 处理标签点击
 * @param tag - 点击的标签
 */
function handleTagClick(tag: string) {
  emit('selectTag', tag)
}

// 监听窗口大小变化
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <nav class="tag-navigator" :class="{ 'is-collapsed': isCollapsed, 'is-mobile': isMobile }">
    <!-- 标签列表区域（可滚动） -->
    <div v-if="!isCollapsed" class="tag-list-wrapper">
      <h3 class="tag-title">标签分类</h3>
      
      <ul class="tags">
        <li
          v-for="tag in tags"
          :key="tag"
          class="tag-item"
          :class="{ 'is-active': tag === activeTag }"
        >
          <button
            class="tag-btn"
            @click="handleTagClick(tag)"
          >
            <span class="tag-indicator"></span>
            <span class="tag-name">{{ tag }}</span>
          </button>
        </li>
      </ul>
    </div>
    
    <!-- 底部固定收起按钮 -->
    <button
      class="collapse-btn"
      :class="{ 'is-expanded': !isCollapsed }"
      @click="toggleCollapse"
    >
      <span class="collapse-icon">{{ isCollapsed ? '📑' : '◀' }}</span>
      <span v-if="!isCollapsed" class="collapse-text">收起导航</span>
      <span v-else class="collapse-text">展开</span>
    </button>
  </nav>
</template>

<style scoped>
/* 标签导航容器 */
.tag-navigator {
  position: sticky;
  top: 90px;
  display: flex;
  flex-direction: column;
  width: 260px;
  height: calc(100vh - 110px);
  background-color: var(--color-bg-secondary);
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  overflow: hidden;
}

/* 收起状态 */
.tag-navigator.is-collapsed {
  width: 80px;
}

/* 标签列表包装器（可滚动区域） */
.tag-list-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  padding-bottom: 0;
}

/* 标签标题 */
.tag-title {
  margin: 0 0 1.25rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* 标签列表 */
.tags {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* 标签项 */
.tag-item {
  margin: 0;
}

/* 标签按钮 */
.tag-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background-color: transparent;
  color: var(--color-text-secondary);
  font-size: 1.0625rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-btn:hover {
  background-color: var(--color-bg-card);
  color: var(--color-text-primary);
}

/* 激活状态 */
.tag-item.is-active .tag-btn {
  background-color: var(--color-accent);
  color: white;
}

/* 标签指示器 */
.tag-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-text-muted);
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.tag-item.is-active .tag-indicator {
  background-color: white;
}

/* 标签名称 */
.tag-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 底部固定收起按钮 */
.collapse-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  border: none;
  border-top: 1px solid var(--color-border);
  background-color: var(--color-bg-card);
  color: var(--color-text-secondary);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.collapse-btn:hover {
  background-color: var(--color-accent);
  color: white;
}

.collapse-icon {
  font-size: 1.25rem;
}

.collapse-text {
  font-size: 0.9375rem;
}

/* 收起状态下的按钮 */
.is-collapsed .collapse-btn {
  flex-direction: column;
  gap: 0.25rem;
  padding: 1.5rem 0.5rem;
}

.is-collapsed .collapse-text {
  font-size: 0.75rem;
}

/* 滚动条样式 */
.tag-list-wrapper::-webkit-scrollbar {
  width: 6px;
}

.tag-list-wrapper::-webkit-scrollbar-thumb {
  background-color: var(--color-border);
  border-radius: 3px;
}

.tag-list-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-text-muted);
}

/* 移动端样式 */
.tag-navigator.is-mobile {
  position: relative;
  top: 0;
  width: 100%;
  height: auto;
  max-height: none;
  margin-bottom: 1rem;
}

.is-mobile .tag-list-wrapper {
  max-height: 300px;
  padding: 1rem;
}

.is-mobile .tags {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.is-mobile .tag-btn {
  width: auto;
  padding: 0.5rem 1rem;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
}

.is-mobile .tag-indicator {
  display: none;
}

.is-mobile .collapse-btn {
  padding: 0.75rem 1rem;
}

.is-mobile.is-collapsed .collapse-btn {
  flex-direction: row;
}
</style>
