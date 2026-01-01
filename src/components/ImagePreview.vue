<script setup lang="ts">
/**
 * ImagePreview 组件 - 图片预览/轮播
 * 支持多图预览和轮播功能
 * Requirements: 8.6
 */

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

// Props 定义
interface Props {
  /** 图片URL列表 */
  images: string[]
  /** 当前图片索引 */
  currentIndex?: number
  /** 是否显示 */
  visible: boolean
}

const props = withDefaults(defineProps<Props>(), {
  currentIndex: 0
})

// Emits 定义
const emit = defineEmits<{
  /** 关闭预览 */
  close: []
  /** 切换图片 */
  navigate: [index: number]
}>()

// 当前显示的图片索引
const activeIndex = ref(props.currentIndex)

// 图片加载状态
const imageLoaded = ref(false)

// 监听 props.currentIndex 变化
watch(() => props.currentIndex, (newIndex) => {
  activeIndex.value = newIndex
  imageLoaded.value = false
})

// 监听 visible 变化，重置状态
watch(() => props.visible, (visible) => {
  if (visible) {
    activeIndex.value = props.currentIndex
    imageLoaded.value = false
  }
})

/**
 * 计算当前显示的图片URL
 */
const currentImage = computed(() => {
  return props.images[activeIndex.value] || ''
})

/**
 * 计算是否有上一张图片
 */
const hasPrev = computed(() => {
  return activeIndex.value > 0
})

/**
 * 计算是否有下一张图片
 */
const hasNext = computed(() => {
  return activeIndex.value < props.images.length - 1
})

/**
 * 切换到上一张图片
 */
function prevImage() {
  if (hasPrev.value) {
    activeIndex.value--
    imageLoaded.value = false
    emit('navigate', activeIndex.value)
  }
}

/**
 * 切换到下一张图片
 */
function nextImage() {
  if (hasNext.value) {
    activeIndex.value++
    imageLoaded.value = false
    emit('navigate', activeIndex.value)
  }
}

/**
 * 跳转到指定图片
 */
function goToImage(index: number) {
  if (index >= 0 && index < props.images.length) {
    activeIndex.value = index
    imageLoaded.value = false
    emit('navigate', index)
  }
}

/**
 * 关闭预览
 */
function closePreview() {
  emit('close')
}

/**
 * 处理图片加载完成
 */
function handleImageLoad() {
  imageLoaded.value = true
}

/**
 * 处理键盘事件
 */
function handleKeydown(event: KeyboardEvent) {
  if (!props.visible) return
  
  switch (event.key) {
    case 'Escape':
      closePreview()
      break
    case 'ArrowLeft':
      prevImage()
      break
    case 'ArrowRight':
      nextImage()
      break
  }
}

/**
 * 阻止点击图片时关闭预览
 */
function handleContentClick(event: Event) {
  event.stopPropagation()
}

// 监听键盘事件
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="preview">
      <div
        v-if="visible && images.length > 0"
        class="preview-overlay"
        @click="closePreview"
      >
        <!-- 关闭按钮 -->
        <button
          class="close-btn"
          title="关闭 (Esc)"
          @click="closePreview"
        >
          ✕
        </button>
        
        <!-- 图片容器 -->
        <div class="preview-container" @click="handleContentClick">
          <!-- 上一张按钮 -->
          <button
            v-if="images.length > 1"
            class="nav-btn prev-btn"
            :class="{ 'is-disabled': !hasPrev }"
            :disabled="!hasPrev"
            title="上一张 (←)"
            @click="prevImage"
          >
            ‹
          </button>
          
          <!-- 图片显示区域 -->
          <div class="image-wrapper">
            <!-- 加载指示器 -->
            <div v-if="!imageLoaded" class="loading-indicator">
              <span class="loading-spinner"></span>
              <span class="loading-text">加载中...</span>
            </div>
            
            <!-- 图片 -->
            <img
              :src="currentImage"
              :alt="`图片 ${activeIndex + 1}`"
              class="preview-image"
              :class="{ 'is-loaded': imageLoaded }"
              @load="handleImageLoad"
            />
          </div>
          
          <!-- 下一张按钮 -->
          <button
            v-if="images.length > 1"
            class="nav-btn next-btn"
            :class="{ 'is-disabled': !hasNext }"
            :disabled="!hasNext"
            title="下一张 (→)"
            @click="nextImage"
          >
            ›
          </button>
        </div>
        
        <!-- 图片指示器 -->
        <div v-if="images.length > 1" class="preview-indicators">
          <button
            v-for="(_, index) in images"
            :key="index"
            class="indicator-dot"
            :class="{ 'is-active': index === activeIndex }"
            @click.stop="goToImage(index)"
          />
        </div>
        
        <!-- 图片计数 -->
        <div class="preview-counter">
          {{ activeIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* 遮罩层 */
.preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.9);
}

/* 关闭按钮 */
.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 图片容器 */
.preview-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 90vw;
  height: 80vh;
  gap: 1rem;
}

/* 导航按钮 */
.nav-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 2rem;
  font-weight: 300;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover:not(.is-disabled) {
  background-color: rgba(255, 255, 255, 0.2);
}

.nav-btn.is-disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* 图片包装器 */
.image-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: calc(100% - 8rem);
  height: 100%;
}

/* 加载指示器 */
.loading-indicator {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: white;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 0.875rem;
  opacity: 0.8;
}

/* 预览图片 */
.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.preview-image.is-loaded {
  opacity: 1;
}

/* 图片指示器 */
.preview-indicators {
  position: absolute;
  bottom: 4rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.indicator-dot {
  width: 0.5rem;
  height: 0.5rem;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.2s ease;
}

.indicator-dot:hover {
  background-color: rgba(255, 255, 255, 0.6);
}

.indicator-dot.is-active {
  background-color: white;
  transform: scale(1.2);
}

/* 图片计数 */
.preview-counter {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.25rem 0.75rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 0.875rem;
  border-radius: 1rem;
}

/* 过渡动画 */
.preview-enter-active,
.preview-leave-active {
  transition: all 0.3s ease;
}

.preview-enter-from,
.preview-leave-to {
  opacity: 0;
}

.preview-enter-from .preview-container,
.preview-leave-to .preview-container {
  transform: scale(0.95);
}

/* 响应式 */
@media (max-width: 640px) {
  .preview-container {
    max-width: 100vw;
    padding: 0 0.5rem;
  }
  
  .nav-btn {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.5rem;
  }
  
  .image-wrapper {
    max-width: calc(100% - 6rem);
  }
  
  .close-btn {
    top: 0.5rem;
    right: 0.5rem;
  }
}
</style>
