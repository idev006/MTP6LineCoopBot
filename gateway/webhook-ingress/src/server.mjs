import http from 'node:http'
import { loadConfig } from './config.mjs'
import { createWebhookHandler } from './handler.mjs'

export function collectRawBody(req, maxBytes = 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0

    req.on('data', chunk => {
      size += chunk.length
      if (size > maxBytes) {
        const err = new Error('request body too large')
        err.code = 'BODY_TOO_LARGE'
        reject(err)
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export function createServer({ config = loadConfig(), logger = console, fetchImpl = fetch } = {}) {
  const handleWebhook = createWebhookHandler({ config, logger, fetchImpl })

  return http.createServer(async (req, res) => {
    if (req.url === '/healthz' && req.method === 'GET') {
      res.writeHead(200, {
        'content-type':'application/json; charset=utf-8',
        'cache-control':'no-store',
        'x-content-type-options':'nosniff'
      })
      res.end(JSON.stringify({ ok:true, service:'webhook-ingress' }))
      return
    }

    if (req.url !== '/webhook') {
      res.writeHead(404, {
        'content-type':'application/json; charset=utf-8',
        'cache-control':'no-store',
        'x-content-type-options':'nosniff'
      })
      res.end(JSON.stringify({ ok:false, error:'not_found' }))
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
      logger.error?.({ outcome:'request_error', status, code:err?.code || 'REQUEST_ERROR' })
      res.writeHead(status, {
        'content-type':'application/json; charset=utf-8',
        'cache-control':'no-store',
        'x-content-type-options':'nosniff'
      })
      res.end(JSON.stringify({ ok:false, error:status === 413 ? 'body_too_large' : 'internal_error' }))
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
