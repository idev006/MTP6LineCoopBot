#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const apiSrc = fs.readFileSync(path.join(__dirname, '..', 'liff', 'js', 'api.js'), 'utf8');

async function run(fetchImpl, expression) {
  const sandbox = {
    CONFIG: { API_BASE_URL: 'https://example.test', API_KEY: 'public-client-value' },
    URLSearchParams,
    fetch: fetchImpl,
    Error,
    Promise
  };
  vm.createContext(sandbox);
  return vm.runInContext(apiSrc + '\n' + expression, sandbox);
}

(async () => {
  const profile = await run(
    async () => ({ ok: true, json: async () => ({ ok: true, data: { mem_code: 'M1' } }) }),
    'API.getMemberProfile("U1")'
  );
  if (profile.mem_code !== 'M1') throw new Error('success envelope not returned');

  let envelopeFailed = false;
  try {
    await run(
      async () => ({ ok: true, json: async () => ({ ok: false, error: { code: 'DENIED', message: 'denied' } }) }),
      'API.getMemberProfile("U1")'
    );
  } catch (e) {
    envelopeFailed = e.code === 'DENIED';
  }
  if (!envelopeFailed) throw new Error('API error envelope must throw');

  let transportFailed = false;
  try {
    await run(
      async () => ({ ok: false, status: 500, json: async () => ({}) }),
      'API.getSavings("U1")'
    );
  } catch (_) {
    transportFailed = true;
  }
  if (!transportFailed) throw new Error('HTTP failure must throw');

  const src = fs.readFileSync(path.join(__dirname, '..', 'liff', 'js', 'app.js'), 'utf8');
  const forbidden = [
    /Use mock data for development/i,
    /SAV-0001/,
    /LN-2024-001/,
    /mem_fname:\s*['"]สมชาย/
  ];
  for (const p of forbidden) {
    if (p.test(src)) throw new Error('mock fallback pattern remains: ' + p);
  }

  console.log('PASS  LIFF API success envelope');
  console.log('PASS  LIFF API errors fail closed');
  console.log('PASS  LIFF financial/profile mock fallbacks absent');
  console.log('=== LIFF SECURITY TESTS PASS (3/3) ===');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
