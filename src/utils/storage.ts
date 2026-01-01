/**
 * 本地存储工具函数
 * 提供安全的 localStorage 操作，支持降级到内存存储
 */

import type { ThemePreference } from '../types'

// 存储键名常量
export const STORAGE_KEYS = {
  THEME_PREFERENCE: 'theme-preference',
  DISCLAIMER_CONFIRMED: 'disclaimer-confirmed',
} as const

// 内存存储（用于 localStorage 不可用时的降级方案）
const memoryStorage = new Map<string, string>()

/**
 * 检查 localStorage 是否可用
 * @returns 是否可用
 */
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * 安全地从存储中获取值
 * @param key - 存储键名
 * @returns 存储的值，不存在则返回 null
 */
export function safeGetItem(key: string): string | null {
  try {
    if (isLocalStorageAvailable()) {
      return localStorage.getItem(key)
    }
    return memoryStorage.get(key) ?? null
  } catch {
    return memoryStorage.get(key) ?? null
  }
}

/**
 * 安全地设置存储值
 * @param key - 存储键名
 * @param value - 要存储的值
 * @returns 是否成功存储到 localStorage
 */
export function safeSetItem(key: string, value: string): boolean {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.setItem(key, value)
      return true
    }
    memoryStorage.set(key, value)
    return false
  } catch {
    memoryStorage.set(key, value)
    return false
  }
}

/**
 * 安全地删除存储值
 * @param key - 存储键名
 */
export function safeRemoveItem(key: string): void {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem(key)
    }
    memoryStorage.delete(key)
  } catch {
    memoryStorage.delete(key)
  }
}

// ==================== 主题偏好相关 ====================

/**
 * 获取保存的主题偏好
 * @returns 主题偏好，默认返回 'system'
 */
export function getThemePreference(): ThemePreference {
  const value = safeGetItem(STORAGE_KEYS.THEME_PREFERENCE)
  if (value === 'light' || value === 'dark' || value === 'system') {
    return value
  }
  return 'system'
}

/**
 * 保存主题偏好
 * @param theme - 主题偏好值
 */
export function setThemePreference(theme: ThemePreference): void {
  safeSetItem(STORAGE_KEYS.THEME_PREFERENCE, theme)
}

// ==================== 免责声明相关 ====================

/**
 * 检查用户是否已确认免责声明
 * @returns 是否已确认
 */
export function isDisclaimerConfirmed(): boolean {
  const value = safeGetItem(STORAGE_KEYS.DISCLAIMER_CONFIRMED)
  return value === 'true'
}

/**
 * 保存免责声明确认状态
 * @param confirmed - 是否确认
 */
export function setDisclaimerConfirmed(confirmed: boolean): void {
  safeSetItem(STORAGE_KEYS.DISCLAIMER_CONFIRMED, String(confirmed))
}

/**
 * 清除免责声明确认状态（用于测试或重置）
 */
export function clearDisclaimerConfirmed(): void {
  safeRemoveItem(STORAGE_KEYS.DISCLAIMER_CONFIRMED)
}

// ==================== 工具函数 ====================

/**
 * 清除所有应用相关的存储数据
 */
export function clearAllStorage(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    safeRemoveItem(key)
  })
}

/**
 * 获取内存存储（用于测试）
 * @returns 内存存储的 Map 副本
 */
export function getMemoryStorage(): Map<string, string> {
  return new Map(memoryStorage)
}

/**
 * 清除内存存储（用于测试）
 */
export function clearMemoryStorage(): void {
  memoryStorage.clear()
}
