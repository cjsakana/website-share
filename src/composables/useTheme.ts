/**
 * 主题切换 Composable
 * 实现夜间/日间模式切换、持久化、系统主题检测
 * Requirements: 4.1, 4.2, 4.3, 4.4
 */

import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { ThemePreference } from '../types'
import { getThemePreference, setThemePreference } from '../utils/storage'

// 全局状态（单例模式，确保多个组件共享同一状态）
const themePreference = ref<ThemePreference>('system')
const systemPrefersDark = ref(false)
let mediaQuery: MediaQueryList | null = null
let isInitialized = false

/**
 * 获取系统是否偏好深色模式
 * @returns 系统是否偏好深色模式
 */
function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * 系统主题变化处理函数
 * @param event - MediaQueryListEvent
 */
function handleSystemThemeChange(event: MediaQueryListEvent): void {
  systemPrefersDark.value = event.matches
}

/**
 * 应用主题到 DOM
 * @param isDark - 是否为深色模式
 */
function applyThemeToDOM(isDark: boolean): void {
  if (typeof document === 'undefined') return
  
  const root = document.documentElement
  if (isDark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

/**
 * 主题切换 Composable
 * @returns 主题相关的响应式状态和方法
 */
export function useTheme() {
  /**
   * 计算当前是否为深色模式
   * 根据用户偏好和系统设置决定
   */
  const isDarkMode = computed<boolean>(() => {
    if (themePreference.value === 'system') {
      return systemPrefersDark.value
    }
    return themePreference.value === 'dark'
  })

  /**
   * 设置主题偏好
   * @param preference - 主题偏好值
   */
  function setTheme(preference: ThemePreference): void {
    themePreference.value = preference
    setThemePreference(preference)
  }

  /**
   * 切换主题
   * 在 light 和 dark 之间切换（不包含 system）
   */
  function toggleTheme(): void {
    const newTheme: ThemePreference = isDarkMode.value ? 'light' : 'dark'
    setTheme(newTheme)
  }

  /**
   * 循环切换主题
   * 按 light -> dark -> system -> light 顺序循环
   */
  function cycleTheme(): void {
    const order: ThemePreference[] = ['light', 'dark', 'system']
    const currentIndex = order.indexOf(themePreference.value)
    const nextIndex = (currentIndex + 1) % order.length
    const nextTheme = order[nextIndex]
    if (nextTheme) {
      setTheme(nextTheme)
    }
  }

  /**
   * 初始化主题
   * 从本地存储恢复主题偏好，监听系统主题变化
   */
  function initTheme(): void {
    if (isInitialized) return
    isInitialized = true

    // 从本地存储恢复主题偏好
    themePreference.value = getThemePreference()
    
    // 获取系统主题偏好
    systemPrefersDark.value = getSystemPrefersDark()
    
    // 监听系统主题变化
    if (typeof window !== 'undefined') {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', handleSystemThemeChange)
    }

    // 应用初始主题
    applyThemeToDOM(isDarkMode.value)
  }

  /**
   * 清理主题监听器
   */
  function cleanupTheme(): void {
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }

  // 监听主题变化，自动应用到 DOM
  watch(isDarkMode, (newValue) => {
    applyThemeToDOM(newValue)
  })

  // 组件挂载时初始化
  onMounted(() => {
    initTheme()
  })

  // 组件卸载时清理（仅在最后一个使用者卸载时清理）
  onUnmounted(() => {
    // 注意：由于是单例模式，这里不清理监听器
    // 如果需要完全清理，可以调用 cleanupTheme()
  })

  return {
    // 状态
    themePreference: computed(() => themePreference.value),
    isDarkMode,
    systemPrefersDark: computed(() => systemPrefersDark.value),
    
    // 方法
    setTheme,
    toggleTheme,
    cycleTheme,
    initTheme,
    cleanupTheme,
  }
}

// ==================== 测试辅助函数 ====================

/**
 * 重置主题状态（仅用于测试）
 */
export function resetThemeState(): void {
  themePreference.value = 'system'
  systemPrefersDark.value = false
  isInitialized = false
  if (mediaQuery) {
    mediaQuery.removeEventListener('change', handleSystemThemeChange)
    mediaQuery = null
  }
}

/**
 * 设置系统主题偏好（仅用于测试）
 * @param prefersDark - 是否偏好深色模式
 */
export function setSystemPrefersDarkForTest(prefersDark: boolean): void {
  systemPrefersDark.value = prefersDark
}

/**
 * 获取当前主题偏好（仅用于测试）
 * @returns 当前主题偏好
 */
export function getThemePreferenceForTest(): ThemePreference {
  return themePreference.value
}

/**
 * 设置主题偏好（仅用于测试，不触发持久化）
 * @param preference - 主题偏好
 */
export function setThemePreferenceForTest(preference: ThemePreference): void {
  themePreference.value = preference
}
