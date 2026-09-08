<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { createWebAdminClient } from '@/adapters/api/webAdminApi'

const auth = useAuthStore()
const loading = ref(true)
const error = ref('')
const roles = ref([])
const canonicalRoleIds = ref([])
const assignableStaffRoleIds = ref([])

function client() {
  return createWebAdminClient({ baseUrl: import.meta.env.VITE_API_BASE_URL })
}

async function loadRoles() {
  loading.value = true
  error.value = ''
  roles.value = []
  canonicalRoleIds.value = []
  assignableStaffRoleIds.value = []

  try {
    if (!auth.isAuthenticated || !auth.token) {
      throw new Error('Web session ไม่พร้อมใช้งาน')
    }

    const data = await client().getRoleCatalog(auth.token)
    roles.value = Array.isArray(data?.roles) ? data.roles : []
    canonicalRoleIds.value = Array.isArray(data?.canonicalRoleIds) ? data.canonicalRoleIds : []
    assignableStaffRoleIds.value = Array.isArray(data?.assignableStaffRoleIds) ? data.assignableStaffRoleIds : []
  } catch (e) {
    error.value = e?.message || 'ไม่สามารถโหลด Role Catalog ได้'
    throw e
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    await loadRoles()
  } catch {
    // Explicit error state; no synthetic fallback.
  }
})
</script>

<template>
  <div>
    <div class="flex flex-wrap justify-between items-center gap-3 mb-6">
      <div>
        <h1 class="text-3xl font-bold">Role Catalog</h1>
        <p class="text-sm text-base-content/70 mt-1">Canonical authorization vocabulary จากระบบกลาง</p>
      </div>
      <button class="btn btn-primary" disabled title="Role taxonomy เป็น canonical contract">
        + เพิ่ม Role
      </button>
    </div>

    <div v-if="error" class="alert alert-error mb-6">
      <span>{{ error }}</span>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          v-for="role in roles"
          :key="role.id"
          class="card bg-base-100 shadow"
        >
          <div class="card-body">
            <div class="flex items-center justify-between gap-3">
              <div>
                <h2 class="card-title">{{ role.label }}</h2>
                <p class="font-mono text-sm text-base-content/60">{{ role.id }}</p>
              </div>
              <span class="badge" :class="role.assignableToStaff ? 'badge-primary' : 'badge-ghost'">
                {{ role.assignableToStaff ? 'ใช้กับเจ้าหน้าที่ได้' : 'Member only' }}
              </span>
            </div>

            <p class="text-base-content/70">{{ role.description }}</p>

            <div class="divider my-2"></div>

            <div>
              <p class="font-medium mb-2">Capabilities</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="capability in role.capabilities"
                  :key="capability"
                  class="badge badge-outline"
                >
                  {{ capability }}
                </span>
                <span v-if="!role.capabilities?.length" class="text-sm text-base-content/60">-</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="roles.length === 0 && !error" class="text-center py-8">
        <p class="text-base-content/70">ไม่พบข้อมูล Role Catalog</p>
      </div>

      <div class="alert mt-6">
        <span>
          Role taxonomy เป็นส่วนหนึ่งของ Authorization Contract จึงไม่เปิดแก้ไขจาก UI โดยตรง
          การ assign/change role จะใช้ protected write workflow แยกต่างหาก
        </span>
      </div>
    </template>
  </div>
</template>
