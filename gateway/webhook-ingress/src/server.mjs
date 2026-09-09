import http from 'node:http'
import { loadConfig } from './config.mjs'
import { createWebhookHandler } from './handler.mjs'

export const MAX_WEBHOOK_BODY_BYTES = 1024 * 1024

function responseHeaders() {
  return {
    'content-type':'application/json; charset=utf-8',
    'cache-control':'no-store',
    'x-content-type-options':'nosniff'
  }
}

function writeJson(res, status, payload) {
  res.writeHead(status, responseHeaders())
  res.end(JSON.stringify(payload))
}

export function collectRawBody(req, maxBytes = MAX_WEBHOOK_BODY_BYTES) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    let settled = false

    const cleanup = () => {
      req.off('data', onData)
      req.off('end', onEnd)
      req.off('error', onError)
    }

    const fail = err => {
      if (settled) return
      settled = true
      cleanup()
      // Keep the socket usable long enough for the HTTP error response while
      // discarding any unread request bytes without buffering them.
      req.on('error', () => {})
      req.resume()
      reject(err)
    }

    const onData = chunk => {
      size += chunk.length
      if (size > maxBytes) {
        const err = new Error('request body too large')
        err.code = 'BODY_TOO_LARGE'
        fail(err)
        return
      }
      chunks.push(chunk)
    }

    const onEnd = () => {
      if (settled) return
      settled = true
      cleanup()
      resolve(Buffer.concat(chunks))
    }

    const onError = err => {
      if (settled) return
      settled = true
      cleanup()
      reject(err)
    }

    req.on('data', onData)
    req.on('end', onEnd)
    req.on('error', onError)
  })
}

function declaredBodyTooLarge(req, maxBytes = MAX_WEBHOOK_BODY_BYTES) {
  const raw = req.headers['content-length']
  if (raw == null) return false
  const size = Number(raw)
  return Number.isFinite(size) && size > maxBytes
}

export function createServer({ config = loadConfig(), logger = console, fetchImpl = fetch } = {}) {
  const handleWebhook = createWebhookHandler({ config, logger, fetchImpl })

  return http.createServer(async (req, res) => {
    if (req.url === '/healthz' && req.method === 'GET') {
      writeJson(res, 200, { ok:true, service:'webhook-ingress' })
      return
    }

    if (req.url !== '/webhook') {
      writeJson(res, 404, { ok:false, error:'not_found' })
      return
    }

    if (req.method !== 'POST') {
      req.resume()
      logger.info?.({ outcome:'method_not_allowed', status:405 })
      writeJson(res, 405, { ok:false, error:'method_not_allowed' })
      return
    }

    if (declaredBodyTooLarge(req)) {
      req.resume()
      logger.warn?.({ outcome:'body_too_large', status:413 })
      writeJson(res, 413, { ok:false, error:'body_too_large' })
      return
    }

    try {
      const rawBody = await collectRawBody(req)
      const result = await handleWebhook({
        method:req.method,
        headers:req.headers,
        rawBody
      })
      res.writeHead(result.status, {
        ...result.headers,
        'cache-control':'no-store',
        'x-content-type-options':'nosniff'
      })
      res.end(result.body)
    } catch (err) {
      const status = err?.code === 'BODY_TOO_LARGE' ? 413 : 500
      const log = status === 413 ? logger.warn : logger.error
      log?.({ outcome:'request_error', status, code:err?.code || 'REQUEST_ERROR' })
      writeJson(res, status, { ok:false, error:status === 413 ? 'body_too_large' : 'internal_error' })
    }
  })
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const config = loadConfig()
  const server = createServer({ config })
  server.listen(config.port, '0.0.0.0', () => {
    console.log(JSON.stringify({ event:'webhook_ingress_started', port:config.port }))
  })
}
