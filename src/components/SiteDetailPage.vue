<script setup lang="ts">
/**
 * SiteDetailPage 组件 - 网站详情页面
 * 从上到下布局，支持 Markdown 内容渲染
 */

import { ref, computed, onMounted, watch } from 'vue'
import { marked } from 'marked'
import type { SiteMetadata } from '../types'
import { openCleanUrl } from '../utils/urlUtils'

// 配置 marked 选项
marked.setOptions({
  breaks: true, // 支持换行
  gfm: true     // 支持 GitHub 风格 Markdown
})

// Props 定义
interface Props {
  /** 网站数据 */
  site: SiteMetadata
}

const props = defineProps<Props>()

// Emits 定义
const emit = defineEmits<{
  /** 返回首页 */
  back: []
}>()

// Markdown 内容
const markdownContent = ref('')
const isLoadingContent = ref(false)
const contentError = ref('')

// 渲染后的 HTML
const renderedHtml = computed(() => {
  if (!markdownContent.value) return ''
  return marked(markdownContent.value) as string
})

/**
 * 返回首页
 */
function handleBack() {
  emit('back')
}

/**
 * 访问网站
 */
function handleVisit() {
  openCleanUrl(props.site.url)
}

/**
 * 加载 Markdown 内容
 */
async function loadContent() {
  if (!props.site.content) {
    markdownContent.value = ''
    return
  }

  // 如果是文件类型，从文件加载
  if (props.site.contentType === 'file') {
    isLoadingContent.value = true
    contentError.value = ''
    try {
      const response = await fetch(props.site.content)
      if (!response.ok) {
        throw new Error(`加载失败: ${response.status}`)
      }
      markdownContent.value = await response.text()
    } catch (err) {
      contentError.value = err instanceof Error ? err.message : '加载内容失败'
      markdownContent.value = ''
    } finally {
      isLoadingContent.value = false
    }
  } else {
    // 文本类型，直接使用
    markdownContent.value = props.site.content
  }
}

// 组件挂载时加载内容
onMounted(() => {
  loadContent()
})

// 监听 site 变化重新加载
watch(() => props.site, () => {
  loadContent()
}, { deep: true })
</script>

<template>
  <div class="detail-page">
    <!-- 顶部导航栏 -->
    <header class="detail-header">
      <button class="back-btn" @click="handleBack">
        <span class="back-icon">←</span>
        <span class="back-text">返回首页</span>
      </button>
      <h1 class="page-title">{{ site.title }}</h1>
      <button class="visit-btn-header" @click="handleVisit">
        🔗 访问网站
      </button>
    </header>

    <!-- 主内容区域（从上到下布局） -->
    <main class="detail-main">
      <article class="detail-article">
        <!-- 标题 -->
        <h1 class="article-title">{{ site.title }}</h1>
        
        <!-- 标签 -->
        <div class="article-tags">
          <span v-for="tag in site.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
        
        <!-- 简介 -->
        <section class="article-section">
          <h2 class="section-title">📝 简介</h2>
          <p class="article-description">{{ site.description }}</p>
        </section>
        
        <!-- 详细内容（Markdown） -->
        <section v-if="site.content" class="article-section">
          <h2 class="section-title">📖 详细介绍</h2>
          
          <!-- 加载中 -->
          <div v-if="isLoadingContent" class="content-loading">
            <span class="loading-spinner"></span>
            <span>正在加载内容...</span>
          </div>
          
          <!-- 加载错误 -->
          <div v-else-if="contentError" class="content-error">
            ⚠️ {{ contentError }}
          </div>
          
          <!-- Markdown 内容 -->
          <div 
            v-else 
            class="markdown-content"
            v-html="renderedHtml"
          ></div>
        </section>
        
        <!-- 网站链接 -->
        <section class="article-section">
          <h2 class="section-title">🔗 网站地址</h2>
          <a :href="site.url" target="_blank" rel="noopener noreferrer" class="site-url">
            {{ site.url }}
          </a>
        </section>
        
        
      </article>
    </main>
  </div>
</template>

<style scoped>
/* 详情页容器 */
.detail-page {
  min-height: 100vh;
  background-color: var(--color-bg-primary);
}

/* 顶部导航栏 */
.detail-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 2.5rem;
  background-color: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 1px 3px var(--color-shadow);
}

/* 返回按钮 */
.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background-color: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}

.back-icon {
  font-size: 1.25rem;
}

/* 页面标题 */
.page-title {
  flex: 1;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 头部访问按钮 */
.visit-btn-header {
  padding: 0.625rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background-color: var(--color-accent);
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.visit-btn-header:hover {
  background-color: var(--color-accent-hover);
}

/* 主内容区域 */
.detail-main {
  padding: 2.5rem;
  display: flex;
  justify-content: center;
}

/* 文章容器 */
.detail-article {
  width: 100%;
  max-width: 900px;
}

/* 文章标题 */
.article-title {
  margin: 0 0 1.5rem 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.3;
}

/* 标签 */
.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
}

.tag {
  padding: 0.375rem 1rem;
  background-color: var(--color-tag-bg);
  color: var(--color-tag-text);
  font-size: 1rem;
  font-weight: 500;
  border-radius: 0.5rem;
}

/* 文章区块 */
.article-section {
  margin-bottom: 2.5rem;
}

.section-title {
  margin: 0 0 1rem 0;
  font-size: 1.375rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

/* 简介 */
.article-description {
  margin: 0;
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--color-text-secondary);
}

/* 内容加载状态 */
.content-loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  color: var(--color-text-muted);
}

.loading-spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.content-error {
  padding: 1rem 1.5rem;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 0.5rem;
  color: #ef4444;
}

/* Markdown 内容样式 */
.markdown-content {
  font-size: 1rem;
  line-height: 1.9;
  color: var(--color-text-secondary);
}

.markdown-content :deep(h1) {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 2rem 0 1rem;
  color: var(--color-text-primary);
}

.markdown-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1.75rem 0 0.875rem;
  color: var(--color-text-primary);
}

.markdown-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem;
  color: var(--color-text-primary);
}

.markdown-content :deep(p) {
  margin: 0 0 1rem;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 1rem 0;
  padding-left: 2rem;
}

.markdown-content :deep(ol) {
  list-style-type: decimal;
}

.markdown-content :deep(li) {
  margin: 0.5rem 0;
}

.markdown-content :deep(li a) {
  color: var(--color-accent);
  text-decoration: none;
}

.markdown-content :deep(li a:hover) {
  text-decoration: underline;
}

.markdown-content :deep(code) {
  padding: 0.125rem 0.375rem;
  background-color: var(--color-bg-secondary);
  border-radius: 0.25rem;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9em;
}

.markdown-content :deep(a) {
  color: var(--color-accent);
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

.markdown-content :deep(strong) {
  font-weight: 600;
  color: var(--color-text-primary);
}

.markdown-content :deep(hr) {
  margin: 2rem 0;
  border: none;
  border-top: 1px solid var(--color-border);
}

.markdown-content :deep(.md-image) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

/* 网站链接 */
.site-url {
  display: inline-block;
  color: var(--color-accent);
  font-size: 1.125rem;
  text-decoration: none;
  word-break: break-all;
}

.site-url:hover {
  text-decoration: underline;
}

/* 操作按钮 */
.article-actions {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.visit-btn-main {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 0.75rem;
  background-color: var(--color-accent);
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.visit-btn-main:hover {
  background-color: var(--color-accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* 响应式 */
@media (max-width: 768px) {
  .detail-header {
    padding: 1rem 1.5rem;
    gap: 1rem;
  }
  
  .back-text {
    display: none;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .detail-main {
    padding: 1.5rem;
  }
  
  .article-title {
    font-size: 1.75rem;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
}
</style>
