<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const auth = useAuthStore()
const notification = useNotification()
const error = ref('')

async function handleLineLogin() {
  error.value = ''
  try {
    const result = await auth.loginWithLine()
    if (result?.redirecting) return
    notification.success('เข้าสู่ระบบสำเร็จ')
    router.push('/app')
  } catch (e) {
    error.value = e.message || 'เข้าสู่ระบบไม่สำเร็จ'
    notification.error(error.value)
  }
}
</script>

<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <div class="card bg-base-100 w-full max-w-md shadow-2xl">
      <div class="card-body">
        <div class="text-center mb-6">
          <h1 class="text-3xl font-bold">🏦 MTP6LineCoopBot</h1>
          <p class="text-base-content/70 mt-2">ระบบเจ้าหน้าที่สหกรณ์</p>
        </div>

        <div v-if="error" class="alert alert-error mb-4">
          <span>{{ error }}</span>
        </div>

        <div class="alert mb-4">
          <span>
            ใช้บัญชี LINE ที่ผูกกับข้อมูลเจ้าหน้าที่ในระบบ
            สิทธิ์ staff / manager / admin จะถูกตรวจสอบที่เซิร์ฟเวอร์
          </span>
        </div>

        <button
          type="button"
          class="btn btn-success w-full"
          :disabled="auth.loading"
          @click="handleLineLogin"
        >
          <span v-if="auth.loading" class="loading loading-spinner loading-sm"></span>
          เข้าสู่ระบบด้วย LINE
        </button>

        <p class="text-xs text-base-content/60 text-center mt-4">
          ระบบจะไม่เชื่อ User ID หรือ Role ที่ส่งมาจากเบราว์เซอร์
        </p>
      </div>
    </div>
  </div>
</template>
