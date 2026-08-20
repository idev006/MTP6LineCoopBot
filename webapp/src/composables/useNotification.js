/**
 * useNotification composable
 * 
 * จัดการ notifications (toast messages)
 */

import { ref } from 'vue'

const notifications = ref([])

export function useNotification() {
  function show(message, type = 'info', duration = 5000) {
    const id = Date.now()
    notifications.value.push({ id, message, type })
    
    setTimeout(() => {
      remove(id)
    }, duration)
  }

  function remove(id) {
    const idx = notifications.value.findIndex(n => n.id === id)
    if (idx !== -1) {
      notifications.value.splice(idx, 1)
    }
  }

  function success(message) {
    show(message, 'success')
  }

  function error(message) {
    show(message, 'error')
  }

  function warning(message) {
    show(message, 'warning')
  }

  function info(message) {
    show(message, 'info')
  }

  return {
    notifications,
    show,
    remove,
    success,
    error,
    warning,
    info
  }
}
