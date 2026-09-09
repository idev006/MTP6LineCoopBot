/**
 * UI Store
 * 
 * จัดการ state สำหรับ UI
 * - sidebar: เปิด/ปิด sidebar
 * - theme: light/dark
 * - notifications: toast notifications
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUiStore = defineStore('ui', () => {
  // State
  const sidebarOpen = ref(true)
  const theme = ref(localStorage.getItem('theme') || 'light')
  const notifications = ref([])

  // Getters
  const isDark = computed(() => theme.value === 'dark')

  // Actions
  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function closeSidebar() {
    sidebarOpen.value = false
  }

  function openSidebar() {
    sidebarOpen.value = true
  }

  function setTheme(newTheme) {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  function toggleTheme() {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  function addNotification(notification) {
    const id = Date.now()
    notifications.value.push({ id, ...notification })
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id)
    }, 5000)
  }

  function removeNotification(id) {
    const idx = notifications.value.findIndex(n => n.id === id)
    if (idx !== -1) {
      notifications.value.splice(idx, 1)
    }
  }

  function showSuccess(message) {
    addNotification({ type: 'success', message })
  }

  function showError(message) {
    addNotification({ type: 'error', message })
  }

  function showWarning(message) {
    addNotification({ type: 'warning', message })
  }

  function showInfo(message) {
    addNotification({ type: 'info', message })
  }

  return {
    // State
    sidebarOpen,
    theme,
    notifications,
    
    // Getters
    isDark,
    
    // Actions
    toggleSidebar,
    closeSidebar,
    openSidebar,
    setTheme,
    toggleTheme,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
})
