import test from 'node:test'
import assert from 'node:assert/strict'
import { createWebAdminClient } from '../src/adapters/api/webAdminApi.js'

test('role catalog API uses POST session token and canonical vocabulary', async () => {
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
            roles: [
              { id: 'member', assignableToStaff: false, capabilities: ['member-self-service'] },
              { id: 'staff', assignableToStaff: true, capabilities: ['member-read'] },
              { id: 'manager', assignableToStaff: true, capabilities: ['member-read'] },
              { id: 'admin', assignableToStaff: true, capabilities: ['admin-settings-read'] }
            ],
            canonicalRoleIds: ['member','staff','manager','admin'],
            assignableStaffRoleIds: ['staff','manager','admin']
          }
        })
      }
    }
  })

  const data = await client.getRoleCatalog('opaque-session')
  assert.deepEqual(data.canonicalRoleIds, ['member','staff','manager','admin'])
  assert.deepEqual(data.assignableStaffRoleIds, ['staff','manager','admin'])
  assert.equal(calls[0].url, 'https://example.test/exec/api/web/admin/roles')
  assert.equal(calls[0].options.method, 'POST')

  const body = JSON.parse(calls[0].options.body)
  assert.equal(body.sessionToken, 'opaque-session')
  assert.equal('api_key' in body, false)
})

test('role catalog API fails closed on forbidden envelope', async () => {
  const client = createWebAdminClient({
    baseUrl: 'https://example.test/exec',
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({ ok: false, error: { code: 'FORBIDDEN', message: 'denied' } })
    })
  })

  await assert.rejects(
    () => client.getRoleCatalog('token'),
    err => err.code === 'FORBIDDEN'
  )
})
