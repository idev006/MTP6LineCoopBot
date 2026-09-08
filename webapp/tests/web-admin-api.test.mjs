import test from 'node:test'
import assert from 'node:assert/strict'
import { createWebAdminClient } from '../src/adapters/api/webAdminApi.js'

test('admin settings API sends opaque session token with POST and no API key', async () => {
  const calls = []
  const client = createWebAdminClient({
    baseUrl: 'https://example.test/exec',
    fetchImpl: async (url, options) => {
      calls.push({ url, options })
      return {
        ok: true,
        json: async () => ({
          ok: true,
          data: {
            appName: 'MTP6LineCoopBot',
            dbType: 'sheets',
            expiryWarningDays: 30,
            paymentReminderDays: 14,
            webSessionTtlSeconds: 28800,
            features: {}
          }
        })
      }
    }
  })

  const result = await client.getSettings('opaque-session')
  assert.equal(result.appName, 'MTP6LineCoopBot')
  assert.equal(calls[0].url, 'https://example.test/exec/api/web/admin/settings')
  assert.equal(calls[0].options.method, 'POST')
  const body = JSON.parse(calls[0].options.body)
  assert.equal(body.sessionToken, 'opaque-session')
  assert.equal('api_key' in body, false)
})

test('admin settings API fails closed on HTTP and API envelope errors', async () => {
  const httpClient = createWebAdminClient({
    baseUrl: 'https://example.test/exec',
    fetchImpl: async () => ({ ok: false })
  })
  await assert.rejects(() => httpClient.getSettings('token'))

  const deniedClient = createWebAdminClient({
    baseUrl: 'https://example.test/exec',
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({ ok: false, error: { code: 'FORBIDDEN', message: 'denied' } })
    })
  })
  await assert.rejects(
    () => deniedClient.getSettings('token'),
    err => err.code === 'FORBIDDEN'
  )
})
