<script setup lang="ts">
/**
 * SiteCardGrid 组件 - 网站卡片网格
 * 按标签分组展示卡片
 * Requirements: 1.2, 9.4
 */

import { computed } from 'vue'
import type { SiteMetadata } from '../types'
import SiteCard from './SiteCard.vue'

// Props 定义
interface Props {
  /** 网站数据列表 */
  sites: SiteMetadata[]
  /** 是否按标签分组显示 */
  groupByTag?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  groupByTag: true
})

// Emits 定义
const emit = defineEmits<{
  /** 查看详情事件 */
  viewDetail: [site: SiteMetadata]
}>()

/**
 * 按标签分组的网站数据
 * 只按第一个标签分类，其他标签仅展示
 * 返回 Map<标签名, 网站列表>
 */
const groupedSites = computed(() => {
  if (!props.groupByTag) {
    return new Map([['全部', props.sites]])
  }
  
  const groups = new Map<string, SiteMetadata[]>()
  
  // 只按第一个标签分类
  props.sites.forEach(site => {
    if (site.tags && site.tags.length > 0) {
      const primaryTag = site.tags[0] as string // 只取第一个标签作为分类
      if (!groups.has(primaryTag)) {
        groups.set(primaryTag, [])
      }
      groups.get(primaryTag)!.push(site)
    }
  })
  
  return groups
})

/**
 * 获取标签的锚点 ID
 * @param tag - 标签名
 */
function getTagAnchorId(tag: string): string {
  return `tag-${tag}`
}

/**
 * 处理查看详情
 */
function handleViewDetail(site: SiteMetadata) {
  emit('viewDetail', site)
}
</script>

<template>
  <div class="site-card-grid">
    <!-- 按标签分组显示 -->
    <template v-if="groupByTag">
      <section
        v-for="[tag, tagSites] in groupedSites"
        :key="tag"
        :id="getTagAnchorId(tag)"
        class="tag-section"
      >
        <!-- 标签标题 -->
        <h2 class="section-title">
          <span class="title-icon">📁</span>
          <span class="title-text">{{ tag }}</span>
          <span class="title-count">{{ tagSites.length }}</span>
        </h2>
        
        <!-- 卡片网格 -->
        <div class="cards-grid">
          <SiteCard
            v-for="site in tagSites"
            :key="site.id"
            :site="site"
            @view-detail="handleViewDetail"
          />
        </div>
      </section>
    </template>
    
    <!-- 不分组显示 -->
    <template v-else>
      <div class="cards-grid">
        <SiteCard
          v-for="site in sites"
          :key="site.id"
          :site="site"
          @view-detail="handleViewDetail"
        />
      </div>
    </template>
    
    <!-- 空状态 -->
    <div v-if="sites.length === 0" class="empty-state">
      <span class="empty-icon">🔍</span>
      <p class="empty-text">暂无匹配的网站</p>
    </div>
  </div>
</template>

<style scoped>
/* 网格容器 */
.site-card-grid {
  width: 100%;
}

/* 标签分组区域 */
.tag-section {
  margin-bottom: 2rem;
  scroll-margin-top: 100px; /* 为锚点跳转预留头部空间 */
}

.tag-section:last-child {
  margin-bottom: 0;
}

/* 分组标题 */
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--color-border);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.title-icon {
  font-size: 1.25rem;
}

.title-text {
  flex: 1;
}

.title-count {
  padding: 0.125rem 0.5rem;
  background-color: var(--color-tag-bg);
  color: var(--color-tag-text);
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
}

/* 卡片网格 */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-text {
  margin: 0;
  font-size: 1rem;
  color: var(--color-text-muted);
}

/* 响应式 */
@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
  }
  
  .section-title {
    font-size: 1.125rem;
  }
  
  .tag-section {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 480px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
