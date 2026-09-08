<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { createWebAdminClient } from '@/adapters/api/webAdminApi'

const auth = useAuthStore()
const loading = ref(true)
const error = ref('')
const success = ref('')
const accounts = ref([])
const roles = ref([])
const savingMemberCode = ref('')

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

function isSelf(account) {
  return Boolean(auth.user?.memberCode && auth.user.memberCode === account.memberCode)
}

async function handleRoleChange(account, event) {
  const newRole = event.target.value
  if (!newRole || newRole === account.role) return

  const previousRole = account.role
  error.value = ''
  success.value = ''
  savingMemberCode.value = account.memberCode
  event.target.value = previousRole

  try {
    if (!auth.isAuthenticated || !auth.token) {
      throw new Error('Web session ไม่พร้อมใช้งาน')
    }
    if (isSelf(account)) {
      throw new Error('ไม่อนุญาตให้เปลี่ยน Role ของบัญชีตนเอง')
    }

    const result = await client().assignStaffRole(auth.token, account.memberCode, newRole)
    account.role = result?.newRole || newRole
    success.value = `อัปเดต Role ของ ${account.memberCode} เป็น ${roleLabel(account.role)} แล้ว`
  } catch (e) {
    error.value = e?.message || 'ไม่สามารถเปลี่ยน Role ได้'
  } finally {
    savingMemberCode.value = ''
  }
}
</script>

<template>
  <div>
    <div class="flex flex-wrap justify-between items-center gap-3 mb-6">
      <div>
        <h1 class="text-3xl font-bold">จัดการเจ้าหน้าที่</h1>
        <p class="text-sm text-base-content/70 mt-1">ข้อมูลและ Role จากระบบกลาง · สิทธิ์ Admin เท่านั้น</p>
      </div>
      <button class="btn btn-primary" disabled title="การเพิ่มเจ้าหน้าที่ใหม่จะใช้ workflow แยก">
        + เพิ่มเจ้าหน้าที่
      </button>
    </div>

    <div v-if="error" class="alert alert-error mb-4">
      <span>{{ error }}</span>
    </div>
    <div v-if="success" class="alert alert-success mb-4">
      <span>{{ success }}</span>
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
                  <td class="font-mono">
                    {{ account.memberCode }}
                    <span v-if="isSelf(account)" class="badge badge-ghost badge-sm ml-1">บัญชีคุณ</span>
                  </td>
                  <td>{{ account.displayName || '-' }}</td>
                  <td>
                    <select
                      class="select select-bordered select-sm"
                      :value="account.role"
                      :disabled="isSelf(account) || savingMemberCode === account.memberCode"
                      @change="handleRoleChange(account, $event)"
                    >
                      <option v-for="role in roles" :key="role" :value="role">
                        {{ roleLabel(role) }}
                      </option>
                    </select>
                    <span v-if="savingMemberCode === account.memberCode" class="loading loading-spinner loading-xs ml-2"></span>
                  </td>
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
        <span>
          การเปลี่ยน Role ใช้ protected server workflow และมี audit trail ทุกครั้ง
          ระบบไม่อนุญาตให้ผู้ดูแลเปลี่ยน Role ของบัญชีตนเอง
        </span>
      </div>
    </template>
  </div>
</template>
