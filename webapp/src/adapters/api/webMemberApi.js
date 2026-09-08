/**
 * Server-authorized Web member API client.
 * All calls require an opaque server session token.
 */
export function createWebMemberClient({ baseUrl, fetchImpl = fetch } = {}) {
  const base = String(baseUrl || '').replace(/\/+$/, '')
  if (!base) throw new Error('ยังไม่ได้ตั้งค่า API endpoint')

  async function post(path, body) {
    const response = await fetchImpl(base + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    })
    if (!response.ok) throw new Error('ไม่สามารถเชื่อมต่อระบบข้อมูลสมาชิกได้')
    const result = await response.json()
    if (!result || result.ok !== true) {
      const err = new Error(result?.error?.message || 'ไม่สามารถเข้าถึงข้อมูลสมาชิกได้')
      err.code = result?.error?.code || 'MEMBER_API_ERROR'
      throw err
    }
    return result.data
  }

  return Object.freeze({
    listMembers: (sessionToken, params = {}) =>
      post('/api/web/members/list', { sessionToken, ...params }),
    getMemberDetail: (sessionToken, memberCode) =>
      post('/api/web/members/detail', { sessionToken, memberCode })
  })
}
