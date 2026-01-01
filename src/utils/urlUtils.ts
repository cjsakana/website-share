/**
 * URL 处理工具函数
 * 用于清除 URL 中的追踪参数，保持链接干净
 */

// 常见的追踪参数列表
const TRACKING_PARAMS = [
  // UTM 参数
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'utm_source_platform',
  'utm_creative_format',
  'utm_marketing_tactic',
  // 社交媒体追踪
  'fbclid',      // Facebook
  'gclid',       // Google Ads
  'gclsrc',      // Google Ads
  'dclid',       // DoubleClick
  'msclkid',     // Microsoft/Bing Ads
  'twclid',      // Twitter
  'igshid',      // Instagram
  'mc_cid',      // Mailchimp
  'mc_eid',      // Mailchimp
  // 其他常见追踪参数
  'ref',
  'ref_src',
  'ref_url',
  'source',
  'affiliate',
  'aff_id',
  'campaign_id',
  'ad_id',
  'click_id',
  '_ga',         // Google Analytics
  '_gl',         // Google Analytics
  'yclid',       // Yandex
  'wickedid',
  'wicked_source',
  'spm',         // 淘宝/阿里
  'scm',         // 淘宝/阿里
  'pvid',
  'algo_pvid',
  'algo_expid',
  'btsid',
  'ws_ab_test',
  'share_source',
  'share_medium',
]

/**
 * 清除 URL 中的追踪参数
 * @param url - 原始 URL 字符串
 * @returns 清除追踪参数后的 URL
 */
export function cleanTrackingParams(url: string): string {
  try {
    const urlObj = new URL(url)
    
    // 遍历并删除所有追踪参数
    TRACKING_PARAMS.forEach(param => {
      urlObj.searchParams.delete(param)
    })
    
    // 返回清理后的 URL
    return urlObj.toString()
  } catch {
    // 如果 URL 解析失败，返回原始 URL
    return url
  }
}

/**
 * 检查 URL 是否包含追踪参数
 * @param url - 要检查的 URL 字符串
 * @returns 是否包含追踪参数
 */
export function hasTrackingParams(url: string): boolean {
  try {
    const urlObj = new URL(url)
    
    return TRACKING_PARAMS.some(param => urlObj.searchParams.has(param))
  } catch {
    return false
  }
}

/**
 * 在新标签页中打开清洁的 URL
 * @param url - 原始 URL 字符串
 */
export function openCleanUrl(url: string): void {
  const cleanUrl = cleanTrackingParams(url)
  window.open(cleanUrl, '_blank', 'noopener,noreferrer')
}

/**
 * 获取追踪参数列表（用于测试或扩展）
 * @returns 追踪参数数组的副本
 */
export function getTrackingParams(): string[] {
  return [...TRACKING_PARAMS]
}
