import test from 'node:test'
import assert from 'node:assert/strict'
import { createWebAdminClient } from '../src/adapters/api/webAdminApi.js'

test('staff accounts API uses POST session token and no API key', async () => {
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
            accounts: [{ memberCode: 'S001', displayName: 'Staff One', role: 'staff', status: 'active', lineLinked: true }],
            roles: ['staff','manager','admin']
          }
        })
      }
    }
  })
  const data = await client.getStaffAccounts('opaque-session')
  assert.equal(data.accounts.length, 1)
  assert.deepEqual(data.roles, ['staff','manager','admin'])
  assert.equal(calls[0].url, 'https://example.test/exec/api/web/admin/staff')
  assert.equal(calls[0].options.method, 'POST')
  const body = JSON.parse(calls[0].options.body)
  assert.equal(body.sessionToken, 'opaque-session')
  assert.equal('api_key' in body, false)
})

test('staff accounts API fails closed on forbidden envelope', async () => {
  const client = createWebAdminClient({
    baseUrl: 'https://example.test/exec',
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({ ok: false, error: { code: 'FORBIDDEN', message: 'denied' } })
    })
  })
  await assert.rejects(
    () => client.getStaffAccounts('token'),
    err => err.code === 'FORBIDDEN'
  )
})
