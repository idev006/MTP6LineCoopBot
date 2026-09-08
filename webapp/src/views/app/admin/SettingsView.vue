<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { createWebAdminClient } from '@/adapters/api/webAdminApi'

const auth = useAuthStore()
const loading = ref(true)
const error = ref('')
const settings = ref(null)

const sessionHours = computed(() => {
  const seconds = Number(settings.value?.webSessionTtlSeconds || 0)
  return seconds > 0 ? seconds / 3600 : 0
})

function client() {
  return createWebAdminClient({ baseUrl: import.meta.env.VITE_API_BASE_URL })
}

async function loadSettings() {
  loading.value = true
  error.value = ''
  settings.value = null

  try {
    if (!auth.isAuthenticated || !auth.token) {
      throw new Error('Web session ไม่พร้อมใช้งาน')
    }
    settings.value = await client().getSettings(auth.token)
  } catch (e) {
    error.value = e?.message || 'ไม่สามารถโหลดการตั้งค่าระบบได้'
    throw e
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    await loadSettings()
  } catch {
    // Error is rendered explicitly; no synthetic fallback is allowed.
  }
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">ตั้งค่าระบบ</h1>

    <div v-if="error" class="alert alert-error mb-6">
      <span>{{ error }}</span>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="settings" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <span class="text-base-content/70">ฐานข้อมูล</span>
              <span class="font-medium">{{ settings.dbType }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-base-content/70">อายุ Web session</span>
              <span class="font-medium">{{ sessionHours }} ชั่วโมง</span>
            </div>
          </div>
        </div>
      </div>

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

      <div class="card bg-base-100 shadow lg:col-span-2">
        <div class="card-body">
          <h2 class="card-title">🚀 ฟีเจอร์</h2>
          <div class="divider"></div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="flex items-center gap-3 p-4 bg-base-200 rounded-lg">
              <input type="checkbox" class="toggle toggle-primary" :checked="settings.features?.liffEnabled" disabled />
              <div>
                <p class="font-medium">LIFF App</p>
                <p class="text-sm text-base-content/70">พร้อมยืนยันตัวตนผ่าน LINE</p>
              </div>
            </div>

            <div class="flex items-center gap-3 p-4 bg-base-200 rounded-lg">
              <input type="checkbox" class="toggle toggle-primary" :checked="settings.features?.webhookConfigured" disabled />
              <div>
                <p class="font-medium">LINE Webhook</p>
                <p class="text-sm text-base-content/70">สถานะการตั้งค่า</p>
              </div>
            </div>

            <div class="flex items-center gap-3 p-4 bg-base-200 rounded-lg">
              <input type="checkbox" class="toggle toggle-primary" :checked="settings.features?.autoExpiryCheck" disabled />
              <div>
                <p class="font-medium">Auto Expiry Check</p>
                <p class="text-sm text-base-content/70">ตรวจอัตโนมัติรายวัน</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!loading && !error" class="alert">
      <span>ไม่มีข้อมูลการตั้งค่าที่สามารถแสดงได้</span>
    </div>
  </div>
</template>
