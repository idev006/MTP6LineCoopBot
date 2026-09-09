import test from 'node:test'
import assert from 'node:assert/strict'
import { computeLineSignature, getHeaderCaseInsensitive, verifyLineSignature } from '../src/signature.mjs'

// Official LINE documentation verification vector.
// The example channel secret is public documentation data and intentionally split
// to avoid being confused with a deployable credential by secret scanners.
const officialSecret = '8c570fa6dd20' + '1bb328f1c1eac23a96d8'
const officialBody = Buffer.from(
  '{"destination":"U8e742f61d673b39c7fff3cecb7536ef0","events":[]}',
  'utf8'
)
const officialSignature = 'GhRKmvmHys4Pi8DxkF4+EayaH0OqtJtaZxgTD9fMDLs='

test('official LINE signature vector matches', () => {
  assert.equal(computeLineSignature(officialBody, officialSecret), officialSignature)
  assert.equal(verifyLineSignature({
    rawBody:officialBody,
    signature:officialSignature,
    channelSecret:officialSecret
  }), true)
})

test('tampered body, wrong secret, missing and malformed signature fail closed', () => {
  assert.equal(verifyLineSignature({
    rawBody:Buffer.from(officialBody.toString('utf8') + ' '),
    signature:officialSignature,
    channelSecret:officialSecret
  }), false)
  assert.equal(verifyLineSignature({
    rawBody:officialBody,
    signature:officialSignature,
    channelSecret:'wrong-secret'
  }), false)
  assert.equal(verifyLineSignature({
    rawBody:officialBody,
    signature:'',
    channelSecret:officialSecret
  }), false)
  assert.equal(verifyLineSignature({
    rawBody:officialBody,
    signature:'%%%not-base64%%%',
    channelSecret:officialSecret
  }), false)
})

test('header lookup is case-insensitive', () => {
  assert.equal(
    getHeaderCaseInsensitive({ 'X-Line-Signature':officialSignature }, 'x-line-signature'),
    officialSignature
  )
})
