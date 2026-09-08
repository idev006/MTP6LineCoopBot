import test from 'node:test'
import assert from 'node:assert/strict'
import { createWebAdminClient } from '../src/adapters/api/webAdminApi.js'

test('staff role assignment uses POST session body and no API key', async () => {
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
            memberCode: 'S001',
            oldRole: 'staff',
            newRole: 'manager',
            changed: true,
            auditConfirmed: true
          }
        })
      }
    }
  })

  const result = await client.assignStaffRole('opaque-session', 'S001', 'manager')
  assert.equal(result.newRole, 'manager')
  assert.equal(calls[0].url, 'https://example.test/exec/api/web/admin/staff/role')
  assert.equal(calls[0].options.method, 'POST')
  const body = JSON.parse(calls[0].options.body)
  assert.deepEqual(body, {
    sessionToken: 'opaque-session',
    memberCode: 'S001',
    role: 'manager'
  })
  assert.equal('api_key' in body, false)
})

test('staff role assignment fails closed on denied envelope', async () => {
  const client = createWebAdminClient({
    baseUrl: 'https://example.test/exec',
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({
        ok: false,
        error: { code: 'SELF_ROLE_CHANGE_FORBIDDEN', message: 'denied' }
      })
    })
  })

  await assert.rejects(
    () => client.assignStaffRole('token', 'A001', 'staff'),
    err => err.code === 'SELF_ROLE_CHANGE_FORBIDDEN'
  )
})
