<script setup>
/**
 * App Root Component
 * 
 * Includes notification toasts
 */

import { useNotification } from '@/composables/useNotification'

const { notifications, remove } = useNotification()
</script>

<template>
  <router-view />
  
  <!-- Notification Toasts -->
  <div class="fixed bottom-4 right-4 z-50 space-y-2">
    <div 
      v-for="n in notifications" 
      :key="n.id"
      class="alert shadow-lg"
      :class="{
        'alert-success': n.type === 'success',
        'alert-error': n.type === 'error',
        'alert-warning': n.type === 'warning',
        'alert-info': n.type === 'info'
      }"
    >
      <span>{{ n.message }}</span>
      <button @click="remove(n.id)" class="btn btn-ghost btn-xs">✕</button>
    </div>
  </div>
</template>
