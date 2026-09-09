import http from 'node:http'
import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from '../src/server.mjs'
import { computeLineSignature } from '../src/signature.mjs'

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      resolve(`http://127.0.0.1:${address.port}`)
    })
  })
}

function close(server) {
  return new Promise(resolve => server.close(() => resolve()))
}

function createGatewayConfig(downstreamBase) {
  return {
    channelSecret:'integration-channel-secret',
    downstreamUrl:downstreamBase + '/exec',
    downstreamSecret:'integration-downstream-secret',
    downstreamTimeoutMs:2000,
    port:0
  }
}

test('full HTTP path verifies signature, preserves exact bytes downstream, and hides downstream response body', async t => {
  const received = { count:0, body:null, secret:null }

  const downstream = http.createServer((req, res) => {
    const chunks=[]
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => {
      received.count += 1
      received.body = Buffer.concat(chunks)
      const url = new URL(req.url, 'http://downstream.local')
      received.secret = url.searchParams.get('webhook_secret')
      res.writeHead(200, {'content-type':'application/json'})
      res.end(JSON.stringify({ internal:'must-not-cross-public-boundary' }))
    })
  })
  const downstreamBase=await listen(downstream)
  t.after(()=>close(downstream))

  const config=createGatewayConfig(downstreamBase)
  const gateway=createServer({
    config,
    logger:{info(){},warn(){},error(){}}
  })
  const gatewayBase=await listen(gateway)
  t.after(()=>close(gateway))

  const health=await fetch(gatewayBase + '/healthz')
  assert.equal(health.status,200)
  assert.equal(health.headers.get('cache-control'),'no-store')

  const rawBody=Buffer.from(
    '{"destination":"D","events":[{"type":"message","message":{"type":"text","text":"hello\\nworld"}}]}',
    'utf8'
  )
  const signature=computeLineSignature(rawBody, config.channelSecret)

  const response=await fetch(gatewayBase + '/webhook', {
    method:'POST',
    headers:{
      'content-type':'application/json; charset=utf-8',
      'X-LINE-SIGNATURE':signature
    },
    body:rawBody
  })
  const publicBody=await response.text()

  assert.equal(response.status,200)
  assert.equal(publicBody,JSON.stringify({ok:true}))
  assert.equal(publicBody.includes('must-not-cross-public-boundary'),false)
  assert.equal(received.count,1)
  assert.equal(Buffer.compare(received.body, rawBody),0)
  assert.equal(received.secret,config.downstreamSecret)
})

test('all mandatory signature-negative cases fail closed before downstream', async t => {
  let downstreamCalls=0
  const downstream=http.createServer((req,res)=>{
    downstreamCalls += 1
    res.writeHead(200)
    res.end('ok')
  })
  const downstreamBase=await listen(downstream)
  t.after(()=>close(downstream))

  const config=createGatewayConfig(downstreamBase)
  const gateway=createServer({
    config,
    logger:{info(){},warn(){},error(){}}
  })
  const gatewayBase=await listen(gateway)
  t.after(()=>close(gateway))

  const body=Buffer.from('{"destination":"D","events":[]}', 'utf8')
  const validSignature=computeLineSignature(body, config.channelSecret)
  const cases=[
    {
      name:'missing signature',
      headers:{},
      body
    },
    {
      name:'malformed Base64 signature',
      headers:{'x-line-signature':'%%%not-base64%%%'},
      body
    },
    {
      name:'wrong signature',
      headers:{'x-line-signature':'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='},
      body
    },
    {
      name:'tampered body with previously-valid signature',
      headers:{'x-line-signature':validSignature},
      body:Buffer.from('{"destination":"D","events":[{}]}', 'utf8')
    }
  ]

  for (const item of cases) {
    const response=await fetch(gatewayBase + '/webhook', {
      method:'POST',
      headers:item.headers,
      body:item.body
    })
    assert.equal(response.status,401,item.name)
    assert.equal(downstreamCalls,0,item.name)
  }
})


function rawRequest(base, { method='POST', headers={}, chunks=[] } = {}) {
  return new Promise((resolve, reject) => {
    const target=new URL('/webhook', base)
    const req=http.request({
      hostname:target.hostname,
      port:target.port,
      path:target.pathname,
      method,
      headers
    }, res => {
      const body=[]
      res.on('data', chunk => body.push(chunk))
      res.on('end', () => resolve({
        status:res.statusCode,
        body:Buffer.concat(body).toString('utf8')
      }))
    })
    req.on('error', reject)
    for (const chunk of chunks) req.write(chunk)
    req.end()
  })
}

test('HTTP boundary rejects non-POST and oversized bodies before handler/downstream', async t => {
  let downstreamCalls=0
  const downstream=http.createServer((req,res)=>{
    downstreamCalls += 1
    res.writeHead(200)
    res.end('ok')
  })
  const downstreamBase=await listen(downstream)
  t.after(()=>close(downstream))

  const gateway=createServer({
    config:createGatewayConfig(downstreamBase),
    logger:{info(){},warn(){},error(){}}
  })
  const gatewayBase=await listen(gateway)
  t.after(()=>close(gateway))

  const methodRejected=await rawRequest(gatewayBase, {
    method:'GET',
    headers:{'content-length':String(2 * 1024 * 1024)}
  })
  assert.equal(methodRejected.status,405)
  assert.equal(downstreamCalls,0)

  const declaredBody=Buffer.alloc(1024 * 1024 + 1, 0x62)
  const declaredOversize=await rawRequest(gatewayBase, {
    headers:{'content-length':String(declaredBody.length)},
    chunks:[declaredBody]
  })
  assert.equal(declaredOversize.status,413)
  assert.equal(JSON.parse(declaredOversize.body).error,'body_too_large')
  assert.equal(downstreamCalls,0)

  const chunk=Buffer.alloc(600 * 1024, 0x61)
  const streamedOversize=await rawRequest(gatewayBase, {
    headers:{'transfer-encoding':'chunked'},
    chunks:[chunk,chunk]
  })
  assert.equal(streamedOversize.status,413)
  assert.equal(JSON.parse(streamedOversize.body).error,'body_too_large')
  assert.equal(downstreamCalls,0)
})
