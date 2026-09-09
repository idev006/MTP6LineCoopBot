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
