<template>
  <div class="toast-container">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="getToastClasses(toast)"
        class="toast"
      >
        <!-- Regular Toast -->
        <div v-if="!toast.isConfirm" class="toast-content">
          <div class="toast-icon">{{ getToastIcon(toast.type) }}</div>
          <div class="toast-message">{{ toast.message }}</div>
          <button 
            class="toast-close"
            @click="removeToast(toast.id)"
            aria-label="Close notification"
          >
            ×
          </button>
        </div>

        <!-- Confirm Dialog Toast -->
        <div v-else class="toast-confirm">
          <div class="toast-confirm-header">
            <div class="toast-icon">❓</div>
            <div class="toast-title">{{ toast.title }}</div>
          </div>
          <div class="toast-message">{{ toast.message }}</div>
          <div class="toast-actions">
            <button 
              class="toast-btn toast-btn-cancel"
              @click="toast.onCancel"
            >
              Cancel
            </button>
            <button 
              class="toast-btn toast-btn-confirm"
              @click="toast.onConfirm"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToast } from '../composables/useToast.js'

const { toasts, removeToast } = useToast()

const getToastIcon = (type) => {
  const icons = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ'
  }
  return icons[type] || 'ℹ'
}

const getToastClasses = (toast) => {
  if (toast.isConfirm) {
    return 'toast-confirm-container'
  }
  
  const classes = {
    success: 'toast-success',
    error: 'toast-error',
    warning: 'toast-warning',
    info: 'toast-info'
  }
  
  return classes[toast.type] || 'toast-info'
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  min-width: 300px;
  max-width: 500px;
  margin-bottom: 12px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toast-icon {
  font-size: 20px;
  font-weight: bold;
  flex-shrink: 0;
  width: 24px;
  text-align: center;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  color: white;
}

.toast-close {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-close:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Toast Type Styles */
.toast-success {
  background-color: #28a745;
  border-left: 4px solid #1e7e34;
}

.toast-error {
  background-color: #dc3545;
  border-left: 4px solid #bd2130;
}

.toast-warning {
  background-color: #ffc107;
  border-left: 4px solid #d39e00;
  color: #212529;
}

.toast-warning .toast-message {
  color: #212529;
}

.toast-warning .toast-close {
  color: #212529;
}

.toast-warning .toast-close:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.toast-info {
  background-color: #17a2b8;
  border-left: 4px solid #138496;
}

/* Confirm Dialog Styles */
.toast-confirm-container {
  background-color: white;
  border: 2px solid #4A148C;
  color: #333;
  min-width: 350px;
}

.toast-confirm {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toast-confirm-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e9ecef;
}

.toast-title {
  font-weight: 600;
  font-size: 16px;
  color: #4A148C;
}

.toast-confirm .toast-message {
  color: #333;
  font-size: 14px;
  line-height: 1.5;
}

.toast-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.toast-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 80px;
}

.toast-btn-cancel {
  background-color: #6c757d;
  color: white;
}

.toast-btn-cancel:hover {
  background-color: #5a6268;
}

.toast-btn-confirm {
  background-color: #4A148C;
  color: white;
}

.toast-btn-confirm:hover {
  background-color: #2D1B69;
}

/* Animations */
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.36, 0, 0.66, -0.56);
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}

/* Responsive Design */
@media (max-width: 600px) {
  .toast-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }
  
  .toast {
    min-width: auto;
    max-width: none;
  }
  
  .toast-confirm-container {
    min-width: auto;
  }
  
  .toast-content {
    gap: 8px;
  }
  
  .toast-message {
    font-size: 13px;
  }
  
  .toast-actions {
    gap: 8px;
  }
  
  .toast-btn {
    padding: 6px 12px;
    font-size: 13px;
    min-width: 70px;
  }
}</style>