import test from 'node:test'
import assert from 'node:assert/strict'
import { createWebAdminClient } from '../src/adapters/api/webAdminApi.js'

test('admin audit API sends session token in POST body without API key', async () => {
  const calls = []
  const client = createWebAdminClient({
    baseUrl: 'https://example.test/exec',
    fetchImpl: async (url, options) => {
      calls.push({ url, options })
      return {
        ok: true,
        json: async () => ({
          ok: true,
          data: { logs: [{ type: 'expiry', id: 'E1', memCode: 'M1', status: 'expiring', daysLeft: 7 }] }
        })
      }
    }
  })

  const data = await client.getAuditLog('opaque-session', { type: 'expiry', limit: 50 })
  assert.equal(data.logs.length, 1)
  assert.equal(calls[0].url, 'https://example.test/exec/api/web/admin/audit-log')
  assert.equal(calls[0].options.method, 'POST')

  const body = JSON.parse(calls[0].options.body)
  assert.equal(body.sessionToken, 'opaque-session')
  assert.equal(body.type, 'expiry')
  assert.equal(body.limit, 50)
  assert.equal('api_key' in body, false)
})

test('admin audit API fails closed on denied envelope', async () => {
  const client = createWebAdminClient({
    baseUrl: 'https://example.test/exec',
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({ ok: false, error: { code: 'FORBIDDEN', message: 'denied' } })
    })
  })

  await assert.rejects(
    () => client.getAuditLog('token', { type: 'all' }),
    err => err.code === 'FORBIDDEN'
  )
})
