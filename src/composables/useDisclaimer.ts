/**
 * 免责声明 Composable
 * 实现免责声明弹窗的显示逻辑和确认状态持久化
 * Requirements: 7.1, 7.3, 7.4
 */

import { ref, computed, onMounted } from 'vue'
import { isDisclaimerConfirmed, setDisclaimerConfirmed, clearDisclaimerConfirmed } from '../utils/storage'

// 全局状态（单例模式，确保多个组件共享同一状态）
const hasConfirmed = ref(false)
const isModalVisible = ref(false)
let isInitialized = false

/**
 * 免责声明 Composable
 * @returns 免责声明相关的响应式状态和方法
 */
export function useDisclaimer() {
  /**
   * 计算是否应该显示免责声明弹窗
   * 只有在未确认且弹窗可见时才显示
   */
  const shouldShowDisclaimer = computed<boolean>(() => {
    return !hasConfirmed.value && isModalVisible.value
  })

  /**
   * 初始化免责声明状态
   * 从本地存储读取确认状态，决定是否显示弹窗
   */
  function initDisclaimer(): void {
    if (isInitialized) return
    isInitialized = true

    // 从本地存储读取确认状态
    hasConfirmed.value = isDisclaimerConfirmed()
    
    // 如果用户未确认过，显示弹窗
    if (!hasConfirmed.value) {
      isModalVisible.value = true
    }
  }

  /**
   * 确认免责声明
   * 关闭弹窗并保存确认状态到本地存储
   */
  function confirmDisclaimer(): void {
    hasConfirmed.value = true
    isModalVisible.value = false
    setDisclaimerConfirmed(true)
  }

  /**
   * 显示免责声明弹窗
   * 用于手动触发显示（如用户想再次查看）
   */
  function showDisclaimer(): void {
    isModalVisible.value = true
  }

  /**
   * 隐藏免责声明弹窗
   * 仅隐藏弹窗，不改变确认状态
   */
  function hideDisclaimer(): void {
    isModalVisible.value = false
  }

  /**
   * 检查用户是否已确认免责声明
   * @returns 是否已确认
   */
  function checkConfirmed(): boolean {
    return hasConfirmed.value
  }

  // 组件挂载时初始化
  onMounted(() => {
    initDisclaimer()
  })

  return {
    // 状态
    hasConfirmed: computed(() => hasConfirmed.value),
    isModalVisible: computed(() => isModalVisible.value),
    shouldShowDisclaimer,
    
    // 方法
    initDisclaimer,
    confirmDisclaimer,
    showDisclaimer,
    hideDisclaimer,
    checkConfirmed,
  }
}

// ==================== 测试辅助函数 ====================

/**
 * 重置免责声明状态（仅用于测试）
 */
export function resetDisclaimerState(): void {
  hasConfirmed.value = false
  isModalVisible.value = false
  isInitialized = false
}

/**
 * 获取当前确认状态（仅用于测试）
 * @returns 是否已确认
 */
export function getConfirmedStateForTest(): boolean {
  return hasConfirmed.value
}

/**
 * 设置确认状态（仅用于测试，不触发持久化）
 * @param confirmed - 是否已确认
 */
export function setConfirmedStateForTest(confirmed: boolean): void {
  hasConfirmed.value = confirmed
}

/**
 * 获取弹窗可见状态（仅用于测试）
 * @returns 弹窗是否可见
 */
export function getModalVisibleForTest(): boolean {
  return isModalVisible.value
}

/**
 * 设置弹窗可见状态（仅用于测试）
 * @param visible - 是否可见
 */
export function setModalVisibleForTest(visible: boolean): void {
  isModalVisible.value = visible
}

/**
 * 重置并清除存储的免责声明状态（仅用于测试）
 */
export function resetAndClearDisclaimerForTest(): void {
  resetDisclaimerState()
  clearDisclaimerConfirmed()
}
