import test from 'node:test'
import assert from 'node:assert/strict'
import { createWebMemberClient } from '../src/adapters/api/webMemberApi.js'

test('member API sends session token in POST body and no API key', async () => {
  const calls = []
  const client = createWebMemberClient({
    baseUrl: 'https://example.test/exec',
    fetchImpl: async (url, options) => {
      calls.push({ url, options })
      return {
        ok: true,
        json: async () => ({ ok: true, data: { members: [], page: 1, limit: 20, total: 0, totalPages: 0 } })
      }
    }
  })
  await client.listMembers('opaque-session', { search: 'M1' })
  assert.equal(calls[0].url, 'https://example.test/exec/api/web/members/list')
  assert.equal(calls[0].options.method, 'POST')
  const body = JSON.parse(calls[0].options.body)
  assert.equal(body.sessionToken, 'opaque-session')
  assert.equal('api_key' in body, false)
})

test('member API fails closed on error envelope', async () => {
  const client = createWebMemberClient({
    baseUrl: 'https://example.test/exec',
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({ ok: false, error: { code: 'FORBIDDEN', message: 'denied' } })
    })
  })
  await assert.rejects(
    () => client.getMemberDetail('opaque-session', 'M1'),
    err => err.code === 'FORBIDDEN'
  )
})
