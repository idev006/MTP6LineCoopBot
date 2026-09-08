/**
 * Server-authorized Web admin API client.
 * Browser-visible API keys are never authentication proof.
 */
export function createWebAdminClient({ baseUrl, fetchImpl = fetch } = {}) {
  const base = String(baseUrl || '').replace(/\/+$/, '')
  if (!base) throw new Error('ยังไม่ได้ตั้งค่า API endpoint')

  async function post(path, body) {
    const response = await fetchImpl(base + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    })

    if (!response.ok) {
      throw new Error('ไม่สามารถเชื่อมต่อระบบผู้ดูแลได้')
    }

    const result = await response.json()
    if (!result || result.ok !== true) {
      const err = new Error(result?.error?.message || 'ไม่สามารถเข้าถึงข้อมูลผู้ดูแลได้')
      err.code = result?.error?.code || 'ADMIN_API_ERROR'
      throw err
    }

    return result.data
  }

  return Object.freeze({
    getSettings: sessionToken =>
      post('/api/web/admin/settings', { sessionToken }),
    getAuditLog: (sessionToken, options = {}) =>
      post('/api/web/admin/audit-log', { sessionToken, ...options }),
    getStaffAccounts: sessionToken =>
      post('/api/web/admin/staff', { sessionToken }),
    getRoleCatalog: sessionToken =>
      post('/api/web/admin/roles', { sessionToken })
  })
}
