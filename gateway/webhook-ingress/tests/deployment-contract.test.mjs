import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { loadConfig } from '../src/config.mjs'

const here=path.dirname(fileURLToPath(import.meta.url))
const root=path.resolve(here,'../../..')
const securityPath=path.join(root,'docs/ssot/security/WEBHOOK_INGRESS_SECURITY_STANDARD.md')
const readmePath=path.join(root,'gateway/webhook-ingress/README.md')
const workflowPath=path.join(root,'.github/workflows/webhook-ingress-ci.yml')
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

test('canonical security standard matches runtime path and environment names', () => {
  const standard=fs.readFileSync(securityPath,'utf8')
  for (const required of [
    '`CHANNEL_SECRET`',
    '`DOWNSTREAM_URL`',
    '`DOWNSTREAM_SECRET`',
    '`DOWNSTREAM_TIMEOUT_MS`',
    '`POST /webhook`'
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
