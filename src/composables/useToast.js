import { ref, reactive } from 'vue'

// Global toast state
const toasts = ref([])
let toastId = 0

// Toast types with their configurations
const toastTypes = {
  success: {
    icon: '✓',
    bgColor: 'bg-green-500',
    borderColor: 'border-green-600'
  },
  error: {
    icon: '✗',
    bgColor: 'bg-red-500',
    borderColor: 'border-red-600'
  },
  warning: {
    icon: '⚠',
    bgColor: 'bg-yellow-500',
    borderColor: 'border-yellow-600'
  },
  info: {
    icon: 'ℹ',
    bgColor: 'bg-blue-500',
    borderColor: 'border-blue-600'
  }
}

export function useToast() {
  const addToast = (message, type = 'info', duration = 5000) => {
    const id = ++toastId
    const toast = {
      id,
      message,
      type,
      duration,
      ...toastTypes[type],
      createdAt: Date.now()
    }
    
    toasts.value.push(toast)
    
    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }
  
  const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  const clearAllToasts = () => {
    toasts.value = []
  }
  
  // Convenience methods
  const success = (message, duration = 4000) => addToast(message, 'success', duration)
  const error = (message, duration = 6000) => addToast(message, 'error', duration)
  const warning = (message, duration = 5000) => addToast(message, 'warning', duration)
  const info = (message, duration = 4000) => addToast(message, 'info', duration)
  
  // For confirm dialogs replacement
  const confirm = (message, title = 'Confirm Action') => {
    return new Promise((resolve) => {
      const confirmToast = {
        id: ++toastId,
        message,
        title,
        type: 'confirm',
        isConfirm: true,
        onConfirm: () => {
          removeToast(confirmToast.id)
          resolve(true)
        },
        onCancel: () => {
          removeToast(confirmToast.id)
          resolve(false)
        }
      }
      
      toasts.value.push(confirmToast)
    })
  }
  
  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
    confirm
  }
}