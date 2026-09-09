import crypto from 'node:crypto'
import { getHeaderCaseInsensitive, verifyLineSignature } from './signature.mjs'
import { forwardVerifiedWebhook } from './forward.mjs'

function requestId() {
  return crypto.randomUUID()
}

function json(status, payload) {
  return {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload)
  }
}

export function createWebhookHandler({ config, fetchImpl = fetch, logger = console }) {
  if (!config) throw new Error('config is required')

  return async function handle({ method, headers, rawBody }) {
    const id = requestId()
    const started = Date.now()

    if (method !== 'POST') {
      logger.info?.({ requestId:id, outcome:'method_not_allowed', status:405 })
      return json(405, { ok:false, error:'method_not_allowed' })
    }

    if (!Buffer.isBuffer(rawBody)) {
      logger.warn?.({ requestId:id, outcome:'missing_raw_body', status:400 })
      return json(400, { ok:false, error:'invalid_body' })
    }

    const signature = getHeaderCaseInsensitive(headers, 'x-line-signature')
    const valid = verifyLineSignature({
      rawBody,
      signature,
      channelSecret:config.channelSecret
    })

    if (!valid) {
      logger.warn?.({ requestId:id, outcome:'signature_rejected', status:401, latencyMs:Date.now()-started })
      return json(401, { ok:false, error:'invalid_signature' })
    }

    let eventCount = null
    try {
      const parsed = JSON.parse(rawBody.toString('utf8'))
      eventCount = Array.isArray(parsed?.events) ? parsed.events.length : 0
    } catch {
      logger.warn?.({ requestId:id, outcome:'verified_invalid_json', status:400, latencyMs:Date.now()-started })
      return json(400, { ok:false, error:'invalid_json' })
    }

    try {
      const downstream = await forwardVerifiedWebhook({
        rawBody,
        downstreamUrl:config.downstreamUrl,
        downstreamSecret:config.downstreamSecret,
        timeoutMs:config.downstreamTimeoutMs,
        fetchImpl
      })

      logger.info?.({
        requestId:id,
        outcome:'forwarded',
        status:downstream.status,
        eventCount,
        latencyMs:Date.now()-started
      })
      return {
        status:downstream.status,
        headers:{ 'content-type':'application/json; charset=utf-8' },
        body:downstream.body
      }
    } catch (err) {
      logger.error?.({
        requestId:id,
        outcome:'downstream_error',
        status:502,
        code:err?.code || 'DOWNSTREAM_ERROR',
        eventCount,
        latencyMs:Date.now()-started
      })
      return json(502, { ok:false, error:'downstream_error' })
    }
  }
}
