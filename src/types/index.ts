/**
 * 网站分享平台类型定义
 * 定义所有核心数据结构和接口
 */

/**
 * 内容类型
 * text: 纯文本/Markdown 文本
 * file: 引用本地 Markdown 文件路径
 */
export type ContentType = 'text' | 'file'

/**
 * 网站元数据接口
 * 包含单个网站的所有信息
 */
export interface SiteMetadata {
  /** 唯一标识（数字自增） */
  id: number
  /** 网站标题 */
  title: string
  /** 封面图片URL */
  cover: string
  /** 网站链接 */
  url: string
  /** 标签数组 */
  tags: string[]
  /** 网站简介 */
  description: string
  /** 详细内容（Markdown 文本或文件路径） */
  content?: string
  /** 内容类型：text 为纯文本，file 为文件路径 */
  contentType?: ContentType
}

/**
 * 网站配置接口
 * 包含平台的全局配置信息
 */
export interface SiteConfig {
  /** 网站标题 */
  siteTitle: string
  /** 管理员联系方式 */
  adminContact: string
}

/**
 * JSON 数据文件结构
 * 对应 public/data/sites.json 的完整结构
 */
export interface SiteDataFile {
  /** 全局配置 */
  config: SiteConfig
  /** 网站列表 */
  sites: SiteMetadata[]
}

/**
 * 主题类型
 */
export type ThemePreference = 'light' | 'dark' | 'system'

/**
 * 本地存储数据结构
 */
export interface LocalStorageData {
  /** 主题偏好 */
  'theme-preference': ThemePreference
  /** 免责声明确认状态 */
  'disclaimer-confirmed': boolean
}

/**
 * 数据加载错误类型
 */
export type DataLoadError =
  | { type: 'NETWORK_ERROR'; message: string }
  | { type: 'PARSE_ERROR'; message: string }
  | { type: 'VALIDATION_ERROR'; field: string; message: string }

/**
 * 应用状态接口
 */
export interface AppState {
  /** 所有网站数据 */
  sites: SiteMetadata[]
  /** 过滤后的网站数据 */
  filteredSites: SiteMetadata[]
  /** 所有标签列表 */
  tags: string[]
  /** 搜索关键词 */
  searchQuery: string
  /** 夜间模式状态 */
  isDarkMode: boolean
  /** 是否显示免责声明 */
  showDisclaimer: boolean
  /** 加载状态 */
  isLoading: boolean
  /** 错误信息 */
  error: string | null
}
