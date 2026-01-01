<script setup lang="ts">
/**
 * SiteCard 组件 - 网站卡片
 * 显示封面、标题、简介、标签，实现悬停效果
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */

import { ref } from 'vue'
import type { SiteMetadata } from '../types'

// Props 定义
interface Props {
  /** 网站数据 */
  site: SiteMetadata
}

const props = defineProps<Props>()

// Emits 定义
const emit = defineEmits<{
  /** 查看详情事件 */
  viewDetail: [site: SiteMetadata]
}>()

// 图片加载状态
const imageLoaded = ref(false)
const imageError = ref(false)

// 占位图 URL
const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"%3E%3Crect fill="%23e2e8f0" width="200" height="150"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E暂无图片%3C/text%3E%3C/svg%3E'

/**
 * 处理图片加载完成
 */
function handleImageLoad() {
  imageLoaded.value = true
}

/**
 * 处理图片加载失败
 */
function handleImageError() {
  imageError.value = true
}

/**
 * 处理卡片点击 - 打开详情页面
 */
function handleCardClick() {
  emit('viewDetail', props.site)
}

/**
 * 获取显示的封面图片
 */
function getCoverImage(): string {
  if (imageError.value || !props.site.cover) {
    return placeholderImage
  }
  return props.site.cover
}
</script>

<template>
  <article class="site-card" @click="handleCardClick">
    <!-- 封面图片区域 -->
    <div class="card-cover">
      <img
        :src="getCoverImage()"
        :alt="site.title"
        class="cover-image"
        :class="{ 'is-loaded': imageLoaded }"
        @load="handleImageLoad"
        @error="handleImageError"
      />
    </div>
    
    <!-- 卡片内容区域 -->
    <div class="card-content">
      <!-- 网站标题 -->
      <h3 class="card-title">{{ site.title }}</h3>
      
      <!-- 网站简介 -->
      <p class="card-description">{{ site.description }}</p>
      
      <!-- 标签列表 -->
      <div class="card-tags">
        <span
          v-for="tag in site.tags"
          :key="tag"
          class="tag"
        >
          {{ tag }}
        </span>
      </div>
    </div>
    
    <!-- 悬停遮罩 -->
    <div class="card-overlay">
      <span class="overlay-text">点击查看详情 →</span>
    </div>
  </article>
</template>

<style scoped>
/* 卡片容器 */
.site-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.site-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px var(--color-shadow);
  border-color: var(--color-accent);
}

/* 封面图片区域 */
.card-cover {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 比例 */
  background-color: var(--color-bg-secondary);
  overflow: hidden;
}

.cover-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.cover-image.is-loaded {
  opacity: 1;
}

.site-card:hover .cover-image {
  transform: scale(1.05);
}

/* 卡片内容区域 */
.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 0.5rem;
}

/* 网站标题 */
.card-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 网站简介 */
.card-description {
  margin: 0;
  flex: 1;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 标签列表 */
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.5rem;
}

/* 单个标签 */
.tag {
  padding: 0.125rem 0.5rem;
  background-color: var(--color-tag-bg);
  color: var(--color-tag-text);
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.25rem;
  white-space: nowrap;
}

/* 悬停遮罩 */
.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(59, 130, 246, 0.9);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.site-card:hover .card-overlay {
  opacity: 0;
}

.site-card:active .card-overlay {
  opacity: 1;
}

.overlay-text {
  color: white;
  font-size: 1rem;
  font-weight: 600;
}

/* 响应式 */
@media (max-width: 640px) {
  .card-content {
    padding: 0.75rem;
  }
  
  .card-title {
    font-size: 0.9375rem;
  }
  
  .card-description {
    font-size: 0.8125rem;
    -webkit-line-clamp: 2;
  }
}
</style>
