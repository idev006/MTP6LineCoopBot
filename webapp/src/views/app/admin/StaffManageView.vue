<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { createWebAdminClient } from '@/adapters/api/webAdminApi'

const auth = useAuthStore()
const loading = ref(true)
const error = ref('')
const accounts = ref([])
const roles = ref([])

function client() {
  return createWebAdminClient({ baseUrl: import.meta.env.VITE_API_BASE_URL })
}

async function loadStaff() {
  loading.value = true
  error.value = ''
  accounts.value = []
  roles.value = []

  try {
    if (!auth.isAuthenticated || !auth.token) {
      throw new Error('Web session ไม่พร้อมใช้งาน')
    }
    const data = await client().getStaffAccounts(auth.token)
    accounts.value = Array.isArray(data?.accounts) ? data.accounts : []
    roles.value = Array.isArray(data?.roles) ? data.roles : []
  } catch (e) {
    error.value = e?.message || 'ไม่สามารถโหลดข้อมูลเจ้าหน้าที่ได้'
    throw e
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    await loadStaff()
  } catch {
    // Explicit error state; no synthetic fallback.
  }
})

function roleLabel(role) {
  if (role === 'staff') return 'Staff'
  if (role === 'manager') return 'Manager'
  if (role === 'admin') return 'Admin'
  return role || '-'
}
</script>

<template>
  <div>
    <div class="flex flex-wrap justify-between items-center gap-3 mb-6">
      <div>
        <h1 class="text-3xl font-bold">จัดการเจ้าหน้าที่</h1>
        <p class="text-sm text-base-content/70 mt-1">ข้อมูลจากระบบกลาง · สิทธิ์ Admin เท่านั้น</p>
      </div>
      <button class="btn btn-primary" disabled title="รอ protected write endpoint">
        + เพิ่มเจ้าหน้าที่
      </button>
    </div>

    <div v-if="error" class="alert alert-error mb-6">
      <span>{{ error }}</span>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <template v-else>
      <div class="stats shadow mb-6">
        <div class="stat">
          <div class="stat-title">บัญชีเจ้าหน้าที่</div>
          <div class="stat-value text-2xl">{{ accounts.length }}</div>
        </div>
        <div class="stat">
          <div class="stat-title">Roles ที่อนุญาต</div>
          <div class="stat-desc">{{ roles.map(roleLabel).join(' · ') || '-' }}</div>
        </div>
      </div>

      <div class="card bg-base-100 shadow">
        <div class="card-body p-0">
          <div class="overflow-x-auto">
            <table class="table table-zebra">
              <thead>
                <tr>
                  <th>รหัสสมาชิก</th>
                  <th>ชื่อ</th>
                  <th>Role</th>
                  <th>สถานะสมาชิก</th>
                  <th>LINE</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="account in accounts" :key="account.memberCode">
                  <td class="font-mono">{{ account.memberCode }}</td>
                  <td>{{ account.displayName || '-' }}</td>
                  <td><span class="badge badge-outline">{{ roleLabel(account.role) }}</span></td>
                  <td>
                    <span class="badge" :class="account.status === 'active' ? 'badge-success' : 'badge-ghost'">
                      {{ account.status || '-' }}
                    </span>
                  </td>
                  <td>{{ account.lineLinked ? 'เชื่อมแล้ว' : 'ยังไม่เชื่อม' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="accounts.length === 0 && !error" class="text-center py-8">
            <p class="text-base-content/70">ไม่พบบัญชีเจ้าหน้าที่</p>
          </div>
        </div>
      </div>

      <div class="alert mt-6">
        <span>การเพิ่ม/แก้ไข Role ยังไม่เปิดใช้งานจนกว่า protected write workflow และ audit trail จะพร้อม</span>
      </div>
    </template>
  </div>
</template>
