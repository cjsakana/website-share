/**
 * 搜索 Composable
 * 使用 Fuse.js 实现模糊搜索功能
 * Requirements: 6.2, 6.5
 */

import { ref, computed } from 'vue'
import Fuse, { type IFuseOptions } from 'fuse.js'
import type { SiteMetadata } from '../types'

// Fuse.js 配置选项
const FUSE_OPTIONS: IFuseOptions<SiteMetadata> = {
  // 搜索的字段：标题、简介、标签
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'description', weight: 0.3 },
    { name: 'tags', weight: 0.3 },
  ],
  // 模糊匹配阈值（0 = 精确匹配，1 = 匹配所有）
  threshold: 0.4,
  // 忽略位置
  ignoreLocation: true,
  // 包含匹配信息
  includeScore: true,
  // 最小匹配字符长度
  minMatchCharLength: 1,
  // 使用扩展搜索
  useExtendedSearch: false,
}

/**
 * 搜索 Composable
 * @param sites - 响应式的网站数据数组
 * @returns 搜索相关的响应式状态和方法
 */
export function useSearch(sites: ReturnType<typeof ref<SiteMetadata[]>>) {
  // 搜索关键词
  const searchQuery = ref('')

  /**
   * 执行搜索
   * @param query - 搜索关键词
   * @param data - 网站数据数组
   * @returns 搜索结果
   */
  function performSearch(query: string, data: SiteMetadata[]): SiteMetadata[] {
    // 空搜索返回全部数据 (Requirement 6.5)
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      return data
    }

    // 如果没有数据，返回空数组
    if (!data || data.length === 0) {
      return []
    }

    // 创建临时 Fuse 实例进行搜索
    const fuse = new Fuse(data, FUSE_OPTIONS)
    const results = fuse.search(trimmedQuery)
    
    // 返回匹配的网站数据
    return results.map(result => result.item)
  }

  /**
   * 计算过滤后的网站数据
   * 根据搜索关键词进行模糊匹配 (Requirement 6.2)
   */
  const filteredSites = computed<SiteMetadata[]>(() => {
    return performSearch(searchQuery.value, sites.value || [])
  })

  /**
   * 是否有搜索结果
   */
  const hasResults = computed<boolean>(() => {
    return filteredSites.value.length > 0
  })

  /**
   * 是否正在搜索（有搜索关键词）
   */
  const isSearching = computed<boolean>(() => {
    return searchQuery.value.trim().length > 0
  })

  /**
   * 是否显示无结果提示
   */
  const showNoResults = computed<boolean>(() => {
    return isSearching.value && !hasResults.value
  })

  /**
   * 设置搜索关键词
   * @param query - 搜索关键词
   */
  function setSearchQuery(query: string): void {
    searchQuery.value = query
  }

  /**
   * 清空搜索
   */
  function clearSearch(): void {
    searchQuery.value = ''
  }

  return {
    // 状态
    searchQuery,
    filteredSites,
    hasResults,
    isSearching,
    showNoResults,
    
    // 方法
    setSearchQuery,
    clearSearch,
    performSearch,
  }
}

// ==================== 独立搜索函数（用于测试和外部调用）====================

/**
 * 独立的搜索函数
 * 不依赖 Vue 响应式系统，可用于测试
 * @param sites - 网站数据数组
 * @param query - 搜索关键词
 * @returns 搜索结果
 */
export function searchSites(sites: SiteMetadata[], query: string): SiteMetadata[] {
  // 空搜索返回全部数据 (Requirement 6.5)
  const trimmedQuery = query.trim()
  if (!trimmedQuery) {
    return sites
  }

  // 如果没有数据，返回空数组
  if (!sites || sites.length === 0) {
    return []
  }

  // 创建 Fuse 实例进行搜索
  const fuse = new Fuse(sites, FUSE_OPTIONS)
  const results = fuse.search(trimmedQuery)
  
  // 返回匹配的网站数据
  return results.map(result => result.item)
}

/**
 * 获取 Fuse.js 配置（用于测试）
 */
export function getFuseOptions(): IFuseOptions<SiteMetadata> {
  return { ...FUSE_OPTIONS }
}
