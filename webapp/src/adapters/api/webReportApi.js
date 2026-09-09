/**
 * Server-authorized Web report API client.
 */
export function createWebReportClient({ baseUrl, fetchImpl = fetch } = {}) {
  const base = String(baseUrl || '').replace(/\/+$/, '')
  if (!base) throw new Error('ยังไม่ได้ตั้งค่า API endpoint')

  async function post(path, body) {
    const response = await fetchImpl(base + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    })
    if (!response.ok) throw new Error('ไม่สามารถเชื่อมต่อระบบรายงานได้')
    const result = await response.json()
    if (!result || result.ok !== true) {
      const err = new Error(result?.error?.message || 'ไม่สามารถเข้าถึงรายงานได้')
      err.code = result?.error?.code || 'REPORT_API_ERROR'
      throw err
    }
    return result.data
  }

  return Object.freeze({
    getSummary: sessionToken =>
      post('/api/web/reports/summary', { sessionToken })
  })
}
