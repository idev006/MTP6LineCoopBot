import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { loadConfig, MIN_DOWNSTREAM_TIMEOUT_MS, MAX_DOWNSTREAM_TIMEOUT_MS } from '../src/config.mjs'
import { createServer, REQUEST_TIMEOUT_MS, HEADERS_TIMEOUT_MS, CONNECTIONS_CHECKING_INTERVAL_MS, KEEP_ALIVE_TIMEOUT_MS } from '../src/server.mjs'

const here=path.dirname(fileURLToPath(import.meta.url))
const root=path.resolve(here,'../../..')
const securityPath=path.join(root,'docs/ssot/security/WEBHOOK_INGRESS_SECURITY_STANDARD.md')
const readmePath=path.join(root,'gateway/webhook-ingress/README.md')
const workflowPath=path.join(root,'.github/workflows/webhook-ingress-ci.yml')
const imageWorkflowPath=path.join(root,'.github/workflows/webhook-ingress-image.yml')
const dockerfilePath=path.join(root,'gateway/webhook-ingress/Dockerfile')

test('canonical deployment environment names are the only accepted runtime contract', () => {
  const cfg=loadConfig({
    CHANNEL_SECRET:'channel-secret',
    DOWNSTREAM_URL:'https://script.google.com/macros/s/example/exec',
    DOWNSTREAM_SECRET:'downstream-secret',
    PORT:'8080',
    DOWNSTREAM_TIMEOUT_MS:'8000'
  })
  assert.equal(cfg.channelSecret,'channel-secret')
  assert.equal(cfg.downstreamUrl,'https://script.google.com/macros/s/example/exec')
  assert.equal(cfg.downstreamSecret,'downstream-secret')

  assert.throws(
    () => loadConfig({
      LINE_CHANNEL_SECRET:'legacy-channel',
      DOWNSTREAM_WEBHOOK_URL:'https://example.invalid/exec',
      DOWNSTREAM_WEBHOOK_SECRET:'legacy-downstream'
    }),
    /CHANNEL_SECRET.*DOWNSTREAM_URL.*DOWNSTREAM_SECRET/
  )
})

test('downstream transport config fails closed unless URL is clean HTTPS', () => {
  const baseEnv={
    CHANNEL_SECRET:'channel-secret',
    DOWNSTREAM_SECRET:'downstream-secret'
  }

  for (const downstreamUrl of [
    'http://script.google.com/macros/s/example/exec',
    'not-a-url',
    'https://user:pass@example.com/exec',
    'https://example.com/exec#fragment'
  ]) {
    assert.throws(
      () => loadConfig({...baseEnv, DOWNSTREAM_URL:downstreamUrl}),
      /DOWNSTREAM_URL/,
      downstreamUrl
    )
  }

  const cfg=loadConfig({
    ...baseEnv,
    DOWNSTREAM_URL:'https://script.google.com/macros/s/example/exec?existing=1'
  })
  assert.equal(cfg.downstreamUrl,'https://script.google.com/macros/s/example/exec?existing=1')
})

test('canonical security standard matches runtime path and environment names', () => {
  const standard=fs.readFileSync(securityPath,'utf8')
  for (const required of [
    '`CHANNEL_SECRET`',
    '`DOWNSTREAM_URL`',
    '`DOWNSTREAM_SECRET`',
    '`DOWNSTREAM_TIMEOUT_MS`',
    '`POST /webhook`',
    'HTTPS'
  ]) {
    assert.ok(standard.includes(required), `security standard missing ${required}`)
  }

  for (const forbidden of [
    'LINE_CHANNEL_SECRET',
    'DOWNSTREAM_WEBHOOK_URL',
    'DOWNSTREAM_WEBHOOK_SECRET'
  ]) {
    assert.equal(standard.includes(forbidden),false,`legacy deployment name returned: ${forbidden}`)
  }
})

test('operator README describes the complete repeatable negative verifier', () => {
  const readme=fs.readFileSync(readmePath,'utf8')
  for (const expected of [
    'missing signature',
    'malformed Base64',
    'wrong signature',
    'tampered after signing',
    'valid signed synthetic'
  ]) {
    assert.ok(readme.includes(expected), `README verifier contract missing: ${expected}`)
  }
})

test('Webhook Ingress CI watches canonical security standard changes', () => {
  const workflow=fs.readFileSync(workflowPath,'utf8')
  const watched="'docs/ssot/security/WEBHOOK_INGRESS_SECURITY_STANDARD.md'"
  assert.ok(workflow.split(watched).length >= 3,'security standard must trigger both push and pull_request CI')
})

test('container base image is pinned by immutable sha256 digest', () => {
  const dockerfile=fs.readFileSync(dockerfilePath,'utf8')
  const firstLine=dockerfile.split(/\r?\n/,1)[0]
  assert.match(
    firstLine,
    /^FROM node:24-alpine@sha256:[a-f0-9]{64}$/,
    'Dockerfile base image must retain tag + immutable sha256 digest pin'
  )
})


test('webhook release workflows pin external GitHub Actions by immutable commit SHA', () => {
  const workflows=[
    fs.readFileSync(workflowPath,'utf8'),
    fs.readFileSync(imageWorkflowPath,'utf8')
  ]

  for (const workflow of workflows) {
    const uses=[...workflow.matchAll(/^\s*-\s+uses:\s+([^\s#]+)(?:\s+#.*)?$/gm)].map(match=>match[1])
    assert.ok(uses.length > 0,'webhook workflow must contain at least one external action')

    for (const ref of uses) {
      assert.match(
        ref,
        /^[^@\s]+@[a-f0-9]{40}$/,
        `external action must be pinned to immutable 40-hex commit SHA: ${ref}`
      )
    }
  }

  const ci=workflows[0]
  const watched="'"+".github/workflows/webhook-ingress-image.yml"+"'"
  assert.ok(
    ci.split(watched).length >= 3,
    'image publish workflow changes must trigger both push and pull_request webhook CI'
  )
})


test('HTTP server explicitly bounds slow-client ingress timeouts', () => {
  assert.equal(REQUEST_TIMEOUT_MS,15_000)
  assert.equal(HEADERS_TIMEOUT_MS,10_000)
  assert.equal(CONNECTIONS_CHECKING_INTERVAL_MS,1_000)
  assert.equal(KEEP_ALIVE_TIMEOUT_MS,5_000)

  const server=createServer({
    config:{
      channelSecret:'test-channel-secret',
      downstreamUrl:'https://example.com/exec',
      downstreamSecret:'test-downstream-secret',
      downstreamTimeoutMs:8000,
      port:8080
    },
    logger:{info(){},warn(){},error(){}},
    fetchImpl:async () => {
      throw new Error('not expected')
    }
  })

  assert.equal(server.requestTimeout,REQUEST_TIMEOUT_MS)
  assert.equal(server.headersTimeout,HEADERS_TIMEOUT_MS)
  assert.equal(server.keepAliveTimeout,KEEP_ALIVE_TIMEOUT_MS)
  server.close()
})


test('downstream timeout configuration is an integer within the bounded fail-closed range', () => {
  assert.equal(MIN_DOWNSTREAM_TIMEOUT_MS,100)
  assert.equal(MAX_DOWNSTREAM_TIMEOUT_MS,30_000)

  const baseEnv={
    CHANNEL_SECRET:'channel-secret',
    DOWNSTREAM_URL:'https://script.google.com/macros/s/example/exec',
    DOWNSTREAM_SECRET:'downstream-secret'
  }

  for (const accepted of ['100','8000','30000']) {
    const cfg=loadConfig({...baseEnv, DOWNSTREAM_TIMEOUT_MS:accepted})
    assert.equal(cfg.downstreamTimeoutMs,Number(accepted),accepted)
  }

  for (const rejected of ['99','30001','100.5','NaN','Infinity']) {
    assert.throws(
      () => loadConfig({...baseEnv, DOWNSTREAM_TIMEOUT_MS:rejected}),
      /DOWNSTREAM_TIMEOUT_MS/,
      rejected
    )
  }
})
