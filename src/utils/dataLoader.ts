/**
 * 数据加载模块
 * 负责从 JSON 文件加载网站数据，包含错误处理和数据验证
 * Requirements: 1.1, 1.5
 */

import type { SiteDataFile, SiteMetadata, DataLoadError } from '../types'

/** 默认数据文件路径 */
const DEFAULT_DATA_PATH = '/data/sites.json'

/**
 * 验证 SiteMetadata 对象是否包含所有必需字段
 * @param site - 待验证的网站数据对象
 * @returns 验证结果，包含是否有效和错误信息
 */
export function validateSiteMetadata(site: unknown): { valid: boolean; error?: string } {
  // 检查是否为对象
  if (!site || typeof site !== 'object') {
    return { valid: false, error: '网站数据必须是对象' }
  }

  const siteObj = site as Record<string, unknown>

  // 检查 id（数字类型）
  if (typeof siteObj.id !== 'number') {
    return { valid: false, error: '字段 id 必须是数字' }
  }

  // 检查必需的字符串字段
  const requiredStringFields = ['title', 'cover', 'url', 'description']
  for (const field of requiredStringFields) {
    if (typeof siteObj[field] !== 'string') {
      return { valid: false, error: `字段 ${field} 必须是字符串` }
    }
  }

  // 检查 tags 数组
  if (!Array.isArray(siteObj.tags)) {
    return { valid: false, error: '字段 tags 必须是数组' }
  }
  if (!siteObj.tags.every((tag: unknown) => typeof tag === 'string')) {
    return { valid: false, error: '字段 tags 中的每个元素必须是字符串' }
  }

  // 检查可选的 content 字段
  if (siteObj.content !== undefined && typeof siteObj.content !== 'string') {
    return { valid: false, error: '字段 content 必须是字符串' }
  }

  // 检查可选的 contentType 字段
  if (siteObj.contentType !== undefined && 
      siteObj.contentType !== 'text' && 
      siteObj.contentType !== 'file') {
    return { valid: false, error: '字段 contentType 必须是 "text" 或 "file"' }
  }

  return { valid: true }
}

/**
 * 验证 SiteConfig 对象是否包含所有必需字段
 * @param config - 待验证的配置对象
 * @returns 验证结果，包含是否有效和错误信息
 */
export function validateSiteConfig(config: unknown): { valid: boolean; error?: string } {
  if (!config || typeof config !== 'object') {
    return { valid: false, error: '配置数据必须是对象' }
  }

  const configObj = config as Record<string, unknown>

  if (typeof configObj.siteTitle !== 'string') {
    return { valid: false, error: '字段 siteTitle 必须是字符串' }
  }

  if (typeof configObj.adminContact !== 'string') {
    return { valid: false, error: '字段 adminContact 必须是字符串' }
  }

  return { valid: true }
}

/**
 * 验证完整的数据文件结构
 * @param data - 待验证的数据对象
 * @returns 验证结果，包含是否有效和错误信息
 */
export function validateSiteDataFile(data: unknown): { valid: boolean; error?: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: '数据文件必须是对象' }
  }

  const dataObj = data as Record<string, unknown>

  // 验证 config
  const configResult = validateSiteConfig(dataObj.config)
  if (!configResult.valid) {
    return { valid: false, error: `配置验证失败: ${configResult.error}` }
  }

  // 验证 sites 数组
  if (!Array.isArray(dataObj.sites)) {
    return { valid: false, error: 'sites 必须是数组' }
  }

  // 验证每个网站数据
  for (let i = 0; i < dataObj.sites.length; i++) {
    const siteResult = validateSiteMetadata(dataObj.sites[i])
    if (!siteResult.valid) {
      return { valid: false, error: `网站 ${i} 验证失败: ${siteResult.error}` }
    }
  }

  return { valid: true }
}

/**
 * 创建数据加载错误对象
 * @param type - 错误类型
 * @param message - 错误消息
 * @param field - 可选的字段名（用于验证错误）
 * @returns DataLoadError 对象
 */
export function createDataLoadError(
  type: 'NETWORK_ERROR' | 'PARSE_ERROR' | 'VALIDATION_ERROR',
  message: string,
  field?: string
): DataLoadError {
  if (type === 'VALIDATION_ERROR' && field) {
    return { type, field, message }
  }
  return { type, message } as DataLoadError
}

/**
 * 从指定路径加载网站数据
 * @param path - JSON 文件路径，默认为 /data/sites.json
 * @returns Promise，成功时返回 SiteDataFile，失败时返回 DataLoadError
 */
export async function loadSiteData(
  path: string = DEFAULT_DATA_PATH
): Promise<{ success: true; data: SiteDataFile } | { success: false; error: DataLoadError }> {
  try {
    // 发起网络请求
    const response = await fetch(path)

    // 检查响应状态
    if (!response.ok) {
      return {
        success: false,
        error: createDataLoadError(
          'NETWORK_ERROR',
          `HTTP 错误: ${response.status} ${response.statusText}`
        )
      }
    }

    // 解析 JSON
    let data: unknown
    try {
      data = await response.json()
    } catch {
      return {
        success: false,
        error: createDataLoadError('PARSE_ERROR', 'JSON 解析失败，数据格式不正确')
      }
    }

    // 验证数据结构
    const validationResult = validateSiteDataFile(data)
    if (!validationResult.valid) {
      return {
        success: false,
        error: createDataLoadError('VALIDATION_ERROR', validationResult.error || '数据验证失败', 'data')
      }
    }

    // 返回成功结果
    return {
      success: true,
      data: data as SiteDataFile
    }
  } catch (err) {
    // 处理网络错误
    const message = err instanceof Error ? err.message : '未知网络错误'
    return {
      success: false,
      error: createDataLoadError('NETWORK_ERROR', `网络请求失败: ${message}`)
    }
  }
}

/**
 * 获取用户友好的错误消息
 * @param error - DataLoadError 对象
 * @returns 用户友好的错误消息字符串
 */
export function getErrorMessage(error: DataLoadError): string {
  switch (error.type) {
    case 'NETWORK_ERROR':
      return '数据加载失败，请检查网络连接'
    case 'PARSE_ERROR':
      return '数据格式错误，请联系管理员'
    case 'VALIDATION_ERROR':
      return `数据验证失败: ${error.field}`
    default:
      return '发生未知错误'
  }
}

/**
 * 从数据中提取所有唯一的主标签（第一个标签）
 * 只提取每个网站的第一个标签作为分类标签
 * @param sites - 网站数据数组
 * @returns 唯一主标签数组
 */
export function extractTags(sites: SiteMetadata[]): string[] {
  const tagSet = new Set<string>()
  for (const site of sites) {
    // 只取第一个标签作为分类标签
    if (site.tags && site.tags.length > 0) {
      tagSet.add(site.tags[0] as string)
    }
  }
  return Array.from(tagSet)
}
