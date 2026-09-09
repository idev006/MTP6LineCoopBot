import http from 'node:http'
import { loadConfig } from './config.mjs'
import { createWebhookHandler } from './handler.mjs'

export const MAX_WEBHOOK_BODY_BYTES = 1024 * 1024
export const REQUEST_TIMEOUT_MS = 15_000
export const HEADERS_TIMEOUT_MS = 10_000
export const CONNECTIONS_CHECKING_INTERVAL_MS = 1_000
export const KEEP_ALIVE_TIMEOUT_MS = 5_000

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
    let overflow = false

    req.on('data', chunk => {
      if (overflow) return

      size += chunk.length
      if (size > maxBytes) {
        // Stop retaining body bytes immediately, but continue draining the
        // request so the server can return a deterministic HTTP 413 instead
        // of resetting the connection mid-stream.
        overflow = true
        chunks.length = 0
        return
      }

      chunks.push(chunk)
    })

    req.on('end', () => {
      if (overflow) {
        const err = new Error('request body too large')
        err.code = 'BODY_TOO_LARGE'
        reject(err)
        return
      }
      resolve(Buffer.concat(chunks))
    })

    req.on('error', reject)
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

  return http.createServer({
    requestTimeout:REQUEST_TIMEOUT_MS,
    headersTimeout:HEADERS_TIMEOUT_MS,
    connectionsCheckingInterval:CONNECTIONS_CHECKING_INTERVAL_MS,
    keepAliveTimeout:KEEP_ALIVE_TIMEOUT_MS
  }, async (req, res) => {
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
