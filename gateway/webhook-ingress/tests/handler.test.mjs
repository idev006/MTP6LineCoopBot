import test from 'node:test'
import assert from 'node:assert/strict'
import { computeLineSignature } from '../src/signature.mjs'
import { createWebhookHandler } from '../src/handler.mjs'

const config = Object.freeze({
  channelSecret:'unit-test-channel-secret',
  downstreamUrl:'https://downstream.example/exec',
  downstreamSecret:'unit-test-downstream-secret',
  downstreamTimeoutMs:1000
})

function quietLogger() {
  const entries=[]
  return {
    entries,
    info:x=>entries.push(x),
    warn:x=>entries.push(x),
    error:x=>entries.push(x)
  }
}

test('invalid signature is rejected before JSON parse or forwarding', async () => {
  let forwarded = false
  const logger = quietLogger()
  const handler = createWebhookHandler({
    config,
    logger,
    fetchImpl:async()=>{forwarded=true;throw new Error('must not forward')}
  })

  const rawBody = Buffer.from('{this is not json}', 'utf8')
  const result = await handler({
    method:'POST',
    headers:{'x-line-signature':'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='},
    rawBody
  })

  assert.equal(result.status,401)
  assert.equal(forwarded,false)
  assert.equal(logger.entries.some(e=>Object.values(e).some(v=>String(v).includes(rawBody.toString('utf8')))),false)
})

test('verified webhook forwards exact raw bytes with downstream secret and returns generic success', async () => {
  const rawBody = Buffer.from('{"destination":"D","events":[]}', 'utf8')
  const signature = computeLineSignature(rawBody, config.channelSecret)
  let captured

  const handler = createWebhookHandler({
    config,
    logger:quietLogger(),
    fetchImpl:async(url, options)=>{
      captured={url:String(url), options}
      return {
        ok:true,
        status:200,
        body:{cancel:async()=>{}}
      }
    }
  })

  const result = await handler({
    method:'POST',
    headers:{'X-LINE-SIGNATURE':signature},
    rawBody
  })

  assert.equal(result.status,200)
  assert.equal(result.body,JSON.stringify({ok:true}))
  assert.ok(captured.url.includes('webhook_secret='))
  assert.equal(Buffer.compare(Buffer.from(captured.options.body), rawBody),0)
  assert.equal(captured.url.includes(config.channelSecret),false)
})

test('downstream response body is never reflected through the public webhook response', async () => {
  const rawBody=Buffer.from('{"events":[]}', 'utf8')
  const signature=computeLineSignature(rawBody, config.channelSecret)
  const internal='INTERNAL_DIAGNOSTIC account=member-123 secret-like-value'
  let cancelled=false

  const result=await createWebhookHandler({
    config,
    logger:quietLogger(),
    fetchImpl:async()=>({
      ok:true,
      status:200,
      body:{cancel:async()=>{cancelled=true}},
      text:async()=>internal
    })
  })({
    method:'POST',
    headers:{'x-line-signature':signature},
    rawBody
  })

  assert.equal(result.status,200)
  assert.equal(result.body,JSON.stringify({ok:true}))
  assert.equal(result.body.includes(internal),false)
  assert.equal(cancelled,true)
})

test('verified malformed JSON is rejected and not forwarded', async () => {
  const rawBody=Buffer.from('{bad json}', 'utf8')
  const signature=computeLineSignature(rawBody, config.channelSecret)
  let forwarded=false
  const result=await createWebhookHandler({
    config,
    logger:quietLogger(),
    fetchImpl:async()=>{forwarded=true}
  })({
    method:'POST',
    headers:{'x-line-signature':signature},
    rawBody
  })
  assert.equal(result.status,400)
  assert.equal(forwarded,false)
})

test('downstream failure fails closed', async () => {
  const rawBody=Buffer.from('{"events":[]}', 'utf8')
  const signature=computeLineSignature(rawBody, config.channelSecret)
  const result=await createWebhookHandler({
    config,
    logger:quietLogger(),
    fetchImpl:async()=>({ok:false,status:503,body:{cancel:async()=>{}}})
  })({
    method:'POST',
    headers:{'x-line-signature':signature},
    rawBody
  })
  assert.equal(result.status,502)
})
