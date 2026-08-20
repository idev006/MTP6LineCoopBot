<script setup>
/**
 * Login View
 * 
 * หน้าเข้าสู่ระบบ (username/password)
 * พร้อม error handling + responsive design
 */

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const auth = useAuthStore()
const notification = useNotification()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await auth.login(username.value, password.value)
    notification.success('เข้าสู่ระบบสำเร็จ')
    router.push('/app')
  } catch (e) {
    error.value = e.message || 'เข้าสู่ระบบไม่สำเร็จ'
    notification.error(error.value)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <div class="card bg-base-100 w-full max-w-md shadow-2xl">
      <div class="card-body">
        <!-- Header -->
        <div class="text-center mb-6">
          <h1 class="text-3xl font-bold">🏦 MTP6LineCoopBot</h1>
          <p class="text-base-content/70 mt-2">ระบบจัดการสมาชิกสหกรณ์</p>
        </div>

        <!-- Error alert -->
        <div v-if="error" class="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin">
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">ชื่อผู้ใช้</span>
            </label>
            <input 
              v-model="username"
              type="text" 
              placeholder="กรอกชื่อผู้ใช้" 
              class="input input-bordered w-full"
              :disabled="loading"
              autocomplete="username"
            />
          </div>

          <div class="form-control mb-6">
            <label class="label">
              <span class="label-text">รหัสผ่าน</span>
            </label>
            <input 
              v-model="password"
              type="password" 
              placeholder="กรอกรหัสผ่าน" 
              class="input input-bordered w-full"
              :disabled="loading"
              autocomplete="current-password"
            />
          </div>

          <div class="form-control">
            <button 
              type="submit" 
              class="btn btn-primary w-full"
              :disabled="loading"
            >
              <span v-if="loading" class="loading loading-spinner loading-sm"></span>
              เข้าสู่ระบบ
            </button>
          </div>
        </form>

        <!-- Footer -->
        <div class="divider">หรือ</div>
        
        <div class="text-center">
          <p class="text-sm text-base-content/70">
            เปิดใช้งานผ่าน LINE Bot
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
