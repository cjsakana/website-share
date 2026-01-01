/**
 * 滚动管理 Composable
 * 实现返回顶部按钮可见性逻辑和平滑滚动功能
 * Requirements: 5.2, 5.3, 5.4, 2.3
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'

// 默认滚动阈值（像素），超过此值显示返回顶部按钮
const DEFAULT_SCROLL_THRESHOLD = 300

// 全局状态（单例模式，确保多个组件共享同一状态）
const scrollY = ref(0)
const scrollThreshold = ref(DEFAULT_SCROLL_THRESHOLD)
let isInitialized = false
let scrollHandler: (() => void) | null = null

/**
 * 获取当前滚动位置
 * @returns 当前垂直滚动位置
 */
function getCurrentScrollY(): number {
  if (typeof window === 'undefined') return 0
  return window.scrollY || window.pageYOffset || 0
}

/**
 * 滚动事件处理函数
 */
function handleScroll(): void {
  scrollY.value = getCurrentScrollY()
}

/**
 * 滚动管理 Composable
 * @param threshold - 可选的滚动阈值，默认 300px
 * @returns 滚动相关的响应式状态和方法
 */
export function useScroll(threshold?: number) {
  // 如果提供了自定义阈值，更新全局阈值
  if (threshold !== undefined) {
    scrollThreshold.value = threshold
  }

  /**
   * 计算返回顶部按钮是否应该显示
   * 当滚动位置大于等于阈值时显示 (Requirements 5.3, 5.4)
   */
  const showBackToTop = computed<boolean>(() => {
    return scrollY.value >= scrollThreshold.value
  })

  /**
   * 计算当前是否在页面顶部区域
   */
  const isAtTop = computed<boolean>(() => {
    return scrollY.value < scrollThreshold.value
  })

  /**
   * 初始化滚动监听
   */
  function initScroll(): void {
    if (isInitialized) return
    isInitialized = true

    // 获取初始滚动位置
    scrollY.value = getCurrentScrollY()

    // 添加滚动事件监听
    if (typeof window !== 'undefined') {
      scrollHandler = handleScroll
      window.addEventListener('scroll', scrollHandler, { passive: true })
    }
  }

  /**
   * 清理滚动监听
   */
  function cleanupScroll(): void {
    if (scrollHandler && typeof window !== 'undefined') {
      window.removeEventListener('scroll', scrollHandler)
      scrollHandler = null
    }
    isInitialized = false
  }

  /**
   * 平滑滚动到页面顶部 (Requirement 5.2)
   */
  function scrollToTop(): void {
    if (typeof window === 'undefined') return
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  /**
   * 平滑滚动到指定位置
   * @param y - 目标垂直位置（像素）
   */
  function scrollToPosition(y: number): void {
    if (typeof window === 'undefined') return
    
    window.scrollTo({
      top: y,
      behavior: 'smooth'
    })
  }

  /**
   * 平滑滚动到指定元素 (Requirement 2.3)
   * @param element - 目标元素或元素选择器
   * @param offset - 可选的偏移量（像素），用于调整最终位置
   */
  function scrollToElement(element: HTMLElement | string, offset: number = 0): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    let targetElement: HTMLElement | null = null

    if (typeof element === 'string') {
      // 如果是选择器字符串，查找元素
      targetElement = document.querySelector(element)
    } else {
      targetElement = element
    }

    if (!targetElement) return

    // 获取元素相对于视口的位置
    const rect = targetElement.getBoundingClientRect()
    const absoluteTop = rect.top + window.scrollY

    // 滚动到元素位置（考虑偏移量）
    window.scrollTo({
      top: absoluteTop - offset,
      behavior: 'smooth'
    })
  }

  /**
   * 设置滚动阈值
   * @param value - 新的阈值（像素）
   */
  function setThreshold(value: number): void {
    scrollThreshold.value = value
  }

  // 组件挂载时初始化
  onMounted(() => {
    initScroll()
  })

  // 组件卸载时清理
  onUnmounted(() => {
    // 注意：由于是单例模式，这里不立即清理
    // 如果需要完全清理，可以调用 cleanupScroll()
  })

  return {
    // 状态
    scrollY: computed(() => scrollY.value),
    scrollThreshold: computed(() => scrollThreshold.value),
    showBackToTop,
    isAtTop,

    // 方法
    initScroll,
    cleanupScroll,
    scrollToTop,
    scrollToPosition,
    scrollToElement,
    setThreshold,
  }
}

// ==================== 测试辅助函数 ====================

/**
 * 重置滚动状态（仅用于测试）
 */
export function resetScrollState(): void {
  scrollY.value = 0
  scrollThreshold.value = DEFAULT_SCROLL_THRESHOLD
  isInitialized = false
  if (scrollHandler && typeof window !== 'undefined') {
    window.removeEventListener('scroll', scrollHandler)
    scrollHandler = null
  }
}

/**
 * 获取当前滚动位置（仅用于测试）
 * @returns 当前滚动位置
 */
export function getScrollYForTest(): number {
  return scrollY.value
}

/**
 * 设置滚动位置（仅用于测试，不触发实际滚动）
 * @param y - 滚动位置
 */
export function setScrollYForTest(y: number): void {
  scrollY.value = y
}

/**
 * 获取滚动阈值（仅用于测试）
 * @returns 当前阈值
 */
export function getScrollThresholdForTest(): number {
  return scrollThreshold.value
}

/**
 * 设置滚动阈值（仅用于测试）
 * @param threshold - 阈值
 */
export function setScrollThresholdForTest(threshold: number): void {
  scrollThreshold.value = threshold
}

/**
 * 计算返回顶部按钮可见性（纯函数，用于测试）
 * @param scrollPosition - 滚动位置
 * @param threshold - 阈值
 * @returns 是否应该显示按钮
 */
export function calculateShowBackToTop(scrollPosition: number, threshold: number): boolean {
  return scrollPosition >= threshold
}

/**
 * 获取默认滚动阈值（用于测试）
 * @returns 默认阈值
 */
export function getDefaultScrollThreshold(): number {
  return DEFAULT_SCROLL_THRESHOLD
}
