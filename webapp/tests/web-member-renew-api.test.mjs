import test from 'node:test'
import assert from 'node:assert/strict'
import { createWebMemberClient } from '../src/adapters/api/webMemberApi.js'

test('protected renewal sends session token and memberCode via POST without API key', async () => {
  const calls = []
  const client = createWebMemberClient({
    baseUrl: 'https://example.test/exec',
    fetchImpl: async (url, options) => {
      calls.push({ url, options })
      return {
        ok: true,
        json: async () => ({
          ok: true,
          data: {
            mem_code: 'M001',
            mem_exp_dt: '2027-12-31',
            mem_status: 'active'
          }
        })
      }
    }
  })

  const result = await client.renewMember('opaque-session', 'M001')
  assert.equal(result.mem_code, 'M001')
  assert.equal(calls[0].url, 'https://example.test/exec/api/web/members/renew')
  assert.equal(calls[0].options.method, 'POST')
  const body = JSON.parse(calls[0].options.body)
  assert.equal(body.sessionToken, 'opaque-session')
  assert.equal(body.memberCode, 'M001')
  assert.equal('api_key' in body, false)
})

test('protected renewal fails closed on denied server response', async () => {
  const client = createWebMemberClient({
    baseUrl: 'https://example.test/exec',
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({
        ok: false,
        error: { code: 'FORBIDDEN', message: 'denied' }
      })
    })
  })

  await assert.rejects(
    () => client.renewMember('opaque-session', 'M001'),
    err => err.code === 'FORBIDDEN'
  )
})
