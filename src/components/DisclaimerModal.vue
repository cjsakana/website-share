<script setup lang="ts">
/**
 * DisclaimerModal 组件 - 免责声明弹窗
 * 显示免责声明内容
 * Requirements: 7.1, 7.2
 */

// Props 定义
interface Props {
  /** 是否显示弹窗 */
  visible: boolean
}

defineProps<Props>()

// Emits 定义
const emit = defineEmits<{
  /** 确认事件 */
  confirm: []
}>()

/**
 * 处理确认按钮点击
 */
function handleConfirm() {
  emit('confirm')
}

/**
 * 阻止点击遮罩关闭弹窗
 */
function handleOverlayClick(event: Event) {
  // 只有点击遮罩层本身才阻止，不阻止内容区域的点击
  if (event.target === event.currentTarget) {
    // 免责声明必须确认，不允许点击遮罩关闭
    event.stopPropagation()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="modal-overlay"
        @click="handleOverlayClick"
      >
        <div class="modal-container">
          <!-- 弹窗头部 -->
          <div class="modal-header">
            <span class="header-icon">⚠️</span>
            <h2 class="header-title">免责声明</h2>
          </div>
          
          <!-- 弹窗内容 -->
          <div class="modal-content">
            <p class="disclaimer-text">
              欢迎访问本网站！在您继续浏览之前，请仔细阅读以下免责声明：
            </p>
            
            <ul class="disclaimer-list">
              <li>
                <strong>个人分享：</strong>
                本网站仅做个人向分享，所有内容均为个人收藏整理，不代表任何官方立场。
              </li>
              <li>
                <strong>免费服务：</strong>
                本网站不收取任何费用，所有资源链接均为免费提供。
              </li>
              <li>
                <strong>第三方内容：</strong>
                本网站不对第三方网站的内容、安全性、可用性负责。访问第三方网站时请自行判断风险。
              </li>
              <li>
                <strong>链接有效性：</strong>
                由于网络环境变化，部分链接可能失效，本网站不保证所有链接的持续有效性。
              </li>
              <li>
                <strong>版权声明：</strong>
                如有侵权内容，请联系管理员，我们将及时处理。
              </li>
            </ul>
            
            <p class="disclaimer-footer">
              点击"我已知晓"按钮即表示您已阅读并同意以上声明。
            </p>
          </div>
          
          <!-- 弹窗底部 -->
          <div class="modal-footer">
            <button
              class="confirm-btn"
              @click="handleConfirm"
            >
              我已知晓
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* 遮罩层 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

/* 弹窗容器 */
.modal-container {
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-card);
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

/* 弹窗头部 */
.modal-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  background-color: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
}

.header-icon {
  font-size: 1.5rem;
}

.header-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

/* 弹窗内容 */
.modal-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.disclaimer-text {
  margin: 0 0 1rem 0;
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.disclaimer-list {
  margin: 0 0 1rem 0;
  padding-left: 1.25rem;
  list-style-type: disc;
}

.disclaimer-list li {
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.disclaimer-list li:last-child {
  margin-bottom: 0;
}

.disclaimer-list strong {
  color: var(--color-text-primary);
}

.disclaimer-footer {
  margin: 1rem 0 0 0;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
  font-size: 0.875rem;
  color: var(--color-text-muted);
  text-align: center;
}

/* 弹窗底部 */
.modal-footer {
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  justify-content: center;
}

/* 确认按钮 */
.confirm-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 0.5rem;
  background-color: var(--color-accent);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.confirm-btn:hover {
  background-color: var(--color-accent-hover);
  transform: translateY(-1px);
}

.confirm-btn:active {
  transform: translateY(0);
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(20px);
}

/* 响应式 */
@media (max-width: 640px) {
  .modal-container {
    max-height: 85vh;
  }
  
  .modal-header {
    padding: 1rem 1.25rem;
  }
  
  .header-title {
    font-size: 1.125rem;
  }
  
  .modal-content {
    padding: 1.25rem;
  }
  
  .disclaimer-text {
    font-size: 0.875rem;
  }
  
  .disclaimer-list li {
    font-size: 0.8125rem;
  }
}
</style>
