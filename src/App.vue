<script setup lang="ts">
/**
 * App.vue - 主应用组件
 * 集成所有子组件，实现数据加载和状态管理，响应式布局
 * Requirements: 9.1, 9.2, 9.3
 */

import { ref, computed, onMounted, watch } from 'vue'
import type { SiteMetadata, SiteConfig } from './types'
import { loadSiteData, getErrorMessage, extractTags } from './utils/dataLoader'
import { useTheme } from './composables/useTheme'
import { useSearch } from './composables/useSearch'
import { useDisclaimer } from './composables/useDisclaimer'
import { useScroll } from './composables/useScroll'

// 导入组件
import Header from './components/Header.vue'
import SearchBar from './components/SearchBar.vue'
import TagNavigator from './components/TagNavigator.vue'
import SiteCardGrid from './components/SiteCardGrid.vue'
import FloatButton from './components/FloatButton.vue'
import DisclaimerModal from './components/DisclaimerModal.vue'
import SiteDetailPage from './components/SiteDetailPage.vue'

// ==================== 状态定义 ====================

// 网站配置
const siteConfig = ref<SiteConfig>({
  siteTitle: '网站收藏',
  adminContact: ''
})

// 网站数据
const sites = ref<SiteMetadata[]>([])

// 加载状态
const isLoading = ref(true)

// 错误信息
const errorMessage = ref<string | null>(null)

// 当前激活的标签
const activeTag = ref('')

// 网站详情页面状态
const showDetailPage = ref(false)
const selectedSite = ref<SiteMetadata | null>(null)

// ==================== Composables ====================

// 主题管理
const { initTheme } = useTheme()

// 搜索功能
const { searchQuery, filteredSites, showNoResults } = useSearch(sites)

// 免责声明
const { shouldShowDisclaimer, confirmDisclaimer } = useDisclaimer()

// 滚动管理
const { } = useScroll()

// ==================== 计算属性 ====================

// 提取所有标签
const allTags = computed(() => {
  return extractTags(sites.value)
})

// 是否按标签分组（搜索时不分组）
const shouldGroupByTag = computed(() => {
  return searchQuery.value.trim() === ''
})

// ==================== 方法 ====================

/**
 * 加载网站数据
 */
async function loadData() {
  isLoading.value = true
  errorMessage.value = null

  const result = await loadSiteData()

  if (result.success) {
    siteConfig.value = result.data.config
    sites.value = result.data.sites
  } else {
    errorMessage.value = getErrorMessage(result.error)
  }

  isLoading.value = false
}

/**
 * 处理标签选择 - 滚动到对应区域
 * @param tag - 选中的标签
 */
function handleTagSelect(tag: string) {
  activeTag.value = tag
  // 直接使用 ID 选择器滚动到标签对应的区域
  const anchorId = `tag-${tag}`
  const element = document.getElementById(anchorId)
  if (element) {
    const headerOffset = 100 // 为 header 预留空间
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.scrollY - headerOffset
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

/**
 * 处理联系管理员
 */
function handleContactAdmin() {
  // Header 组件内部已处理邮件跳转
  console.log('联系管理员:', siteConfig.value.adminContact)
}

/**
 * 处理查看网站详情
 * @param site - 网站数据
 */
function handleViewDetail(site: SiteMetadata) {
  selectedSite.value = site
  showDetailPage.value = true
  // 滚动到页面顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/**
 * 返回首页
 */
function handleBackToHome() {
  showDetailPage.value = false
  selectedSite.value = null
}

/**
 * 重试加载数据
 */
function retryLoad() {
  loadData()
}

// ==================== 生命周期 ====================

onMounted(() => {
  // 初始化主题
  initTheme()
  // 加载数据
  loadData()
})

// 监听搜索变化，清除激活标签
watch(searchQuery, (newQuery) => {
  if (newQuery.trim() !== '') {
    activeTag.value = ''
  }
})
</script>

<template>
  <div class="app">
    <!-- 详情页面 -->
    <SiteDetailPage
      v-if="showDetailPage && selectedSite"
      :site="selectedSite"
      @back="handleBackToHome"
    />

    <!-- 首页内容 -->
    <template v-else>
      <!-- 页面头部 -->
      <Header
        :title="siteConfig.siteTitle"
        :admin-contact="siteConfig.adminContact"
        @contact-admin="handleContactAdmin"
      />

      <!-- 主内容区域 -->
      <main class="main-content">
        <div class="content-wrapper">
          <!-- 侧边栏 - 标签导航（桌面端） -->
          <aside class="sidebar">
            <TagNavigator
              :tags="allTags"
              :active-tag="activeTag"
              @select-tag="handleTagSelect"
            />
          </aside>

          <!-- 主要内容区域 -->
          <div class="content-area">
            <!-- 搜索栏 -->
            <div class="search-section">
              <SearchBar v-model="searchQuery" />
            </div>

            <!-- 移动端标签导航 -->
            <div class="mobile-tags">
              <TagNavigator
                :tags="allTags"
                :active-tag="activeTag"
                @select-tag="handleTagSelect"
              />
            </div>

            <!-- 加载状态 -->
            <div v-if="isLoading" class="loading-state">
              <div class="loading-spinner"></div>
              <p class="loading-text">正在加载数据...</p>
            </div>

            <!-- 错误状态 -->
            <div v-else-if="errorMessage" class="error-state">
              <span class="error-icon">⚠️</span>
              <p class="error-text">{{ errorMessage }}</p>
              <button class="retry-btn" @click="retryLoad">重新加载</button>
            </div>

            <!-- 无搜索结果 -->
            <div v-else-if="showNoResults" class="empty-state">
              <span class="empty-icon">🔍</span>
              <p class="empty-text">没有找到匹配的网站</p>
              <p class="empty-hint">试试其他关键词？</p>
            </div>

            <!-- 网站卡片网格 -->
            <SiteCardGrid
              v-else
              :sites="filteredSites"
              :group-by-tag="shouldGroupByTag"
              @view-detail="handleViewDetail"
            />
          </div>
        </div>
      </main>

      <!-- 悬浮返回顶部按钮 -->
      <FloatButton />

      <!-- 免责声明弹窗 -->
      <DisclaimerModal
        :visible="shouldShowDisclaimer"
        @confirm="confirmDisclaimer"
      />
    </template>
  </div>
</template>

<style scoped>
/* 应用容器 */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  padding: 1.5rem;
  background-color: var(--color-bg-primary);
}

/* 内容包装器 - PC端全宽布局 */
.content-wrapper {
  width: 100%;
  max-width: none;
  padding: 0 2rem;
  display: flex;
  gap: 1.5rem;
}

/* 侧边栏 - 桌面端显示 */
.sidebar {
  flex-shrink: 0;
  width: 260px;
}

/* 主要内容区域 */
.content-area {
  flex: 1;
  min-width: 0; /* 防止 flex 子元素溢出 */
}

/* 搜索区域 */
.search-section {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

/* 移动端标签导航 - 默认隐藏 */
.mobile-tags {
  display: none;
  margin-bottom: 1rem;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 1rem;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
}

/* 错误状态 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-text {
  margin: 0 0 1rem 0;
  color: var(--color-text-secondary);
  font-size: 1rem;
}

.retry-btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background-color: var(--color-accent);
  color: white;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background-color: var(--color-accent-hover);
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
  color: var(--color-text-secondary);
  font-size: 1rem;
}

.empty-hint {
  margin: 0.5rem 0 0 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

/* ==================== 响应式布局 ==================== */

/* 平板端 */
@media (max-width: 1024px) {
  .content-wrapper {
    gap: 1rem;
  }

  .sidebar {
    width: 240px;
  }
}

/* 移动端 */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .content-wrapper {
    flex-direction: column;
  }

  /* 隐藏桌面端侧边栏 */
  .sidebar {
    display: none;
  }

  /* 显示移动端标签导航 */
  .mobile-tags {
    display: block;
  }

  .search-section {
    margin-bottom: 1rem;
  }
}

/* 小屏幕移动端 */
@media (max-width: 480px) {
  .main-content {
    padding: 0.75rem;
  }

  .loading-state,
  .error-state,
  .empty-state {
    padding: 3rem 1rem;
  }
}
</style>
