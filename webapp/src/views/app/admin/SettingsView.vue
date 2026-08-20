<script setup>
/**
 * Settings View
 * 
 * หน้าตั้งค่าระบบ (Admin only)
 */

import { ref, onMounted } from 'vue'

const loading = ref(true)
const settings = ref(null)

onMounted(async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const apiKey = import.meta.env.VITE_API_KEY
    
    const queryParams = new URLSearchParams({
      path: 'admin/settings',
      api_key: apiKey
    })

    const response = await fetch(`${baseUrl}?${queryParams}`)
    const result = await response.json()

    if (result.ok) {
      settings.value = result.data
    }
  } catch (e) {
    console.warn('Using mock data:', e.message)
    // Mock data
    settings.value = {
      appName: 'MTP6LineCoopBot',
      version: '1.0.0',
      dbType: 'sheets',
      expiryWarningDays: 30,
      paymentReminderDays: 14,
      features: {
        liffEnabled: true,
        webhookEnabled: true,
        autoExpiryCheck: true
      }
    }
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">ตั้งค่าระบบ</h1>

    <div v-if="loading" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="settings" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- System Info -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">📋 ข้อมูลระบบ</h2>
          
          <div class="divider"></div>
          
          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-base-content/70">ชื่อระบบ</span>
              <span class="font-medium">{{ settings.appName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-base-content/70">เวอร์ชัน</span>
              <span class="font-medium">{{ settings.version }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-base-content/70">ฐานข้อมูล</span>
              <span class="font-medium">{{ settings.dbType }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Configuration -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">⚙️ การตั้งค่า</h2>
          
          <div class="divider"></div>
          
          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-base-content/70">แจ้งเตือนก่อนหมดอายุ (วัน)</span>
              <span class="font-medium">{{ settings.expiryWarningDays }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-base-content/70">เตือนชำระหนี้ (วัน)</span>
              <span class="font-medium">{{ settings.paymentReminderDays }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Features -->
      <div class="card bg-base-100 shadow lg:col-span-2">
        <div class="card-body">
          <h2 class="card-title">🚀 ฟีเจอร์</h2>
          
          <div class="divider"></div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="flex items-center gap-3 p-4 bg-base-200 rounded-lg">
              <input type="checkbox" class="toggle toggle-primary" :checked="settings.features.liffEnabled" disabled />
              <div>
                <p class="font-medium">LIFF App</p>
                <p class="text-sm text-base-content/70">สำหรับสมาชิก</p>
              </div>
            </div>

            <div class="flex items-center gap-3 p-4 bg-base-200 rounded-lg">
              <input type="checkbox" class="toggle toggle-primary" :checked="settings.features.webhookEnabled" disabled />
              <div>
                <p class="font-medium">LINE Webhook</p>
                <p class="text-sm text-base-content/70">รับข้อความจาก LINE</p>
              </div>
            </div>

            <div class="flex items-center gap-3 p-4 bg-base-200 rounded-lg">
              <input type="checkbox" class="toggle toggle-primary" :checked="settings.features.autoExpiryCheck" disabled />
              <div>
                <p class="font-medium">Auto Expiry Check</p>
                <p class="text-sm text-base-content/70">ตรวจอัตโนมัติรายวัน</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
