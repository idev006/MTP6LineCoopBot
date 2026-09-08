import test from 'node:test'
import assert from 'node:assert/strict'
import { createWebReportClient } from '../src/adapters/api/webReportApi.js'

test('summary report API sends verified session token via POST with no API key', async () => {
  const calls = []
  const client = createWebReportClient({
    baseUrl: 'https://example.test/exec',
    fetchImpl: async (url, options) => {
      calls.push({ url, options })
      return {
        ok: true,
        json: async () => ({
          ok: true,
          data: {
            summary: { totalMembers: 1 },
            financial: { totalSavings: 100 },
            generatedAt: '2026-09-08T00:00:00.000Z'
          }
        })
      }
    }
  })
  const data = await client.getSummary('opaque-session')
  assert.equal(data.summary.totalMembers, 1)
  assert.equal(calls[0].url, 'https://example.test/exec/api/web/reports/summary')
  assert.equal(calls[0].options.method, 'POST')
  const body = JSON.parse(calls[0].options.body)
  assert.equal(body.sessionToken, 'opaque-session')
  assert.equal('api_key' in body, false)
})

test('summary report API fails closed on denied envelope', async () => {
  const client = createWebReportClient({
    baseUrl: 'https://example.test/exec',
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({ ok: false, error: { code: 'FORBIDDEN', message: 'denied' } })
    })
  })
  await assert.rejects(() => client.getSummary('token'), err => err.code === 'FORBIDDEN')
})
