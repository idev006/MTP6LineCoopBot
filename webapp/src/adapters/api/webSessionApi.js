/**
 * Provider-neutral Web session API client.
 * No Vue/Pinia/DOM dependencies.
 */
export function createWebSessionClient({ baseUrl, fetchImpl = fetch } = {}) {
  const base = String(baseUrl || '').replace(/\/+$/, '')
  if (!base) throw new Error('ยังไม่ได้ตั้งค่า API endpoint')

  async function post(path, body) {
    const response = await fetchImpl(base + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    })
    if (!response.ok) throw new Error('ไม่สามารถเชื่อมต่อระบบยืนยันตัวตนได้')
    const result = await response.json()
    if (!result || result.ok !== true) {
      const err = new Error(result?.error?.message || 'การยืนยันตัวตนไม่สำเร็จ')
      err.code = result?.error?.code || 'AUTH_FAILED'
      throw err
    }
    return result.data
  }

  return Object.freeze({
    exchangeLineIdToken: idToken => post('/api/web/session/line', { idToken }),
    verifySession: sessionToken => post('/api/web/session/verify', { sessionToken }),
    revokeSession: sessionToken => post('/api/web/session/revoke', { sessionToken })
  })
}
