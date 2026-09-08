#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const apiSrc = fs.readFileSync(path.join(__dirname, '..', 'liff', 'js', 'api.js'), 'utf8');
const appSrc = fs.readFileSync(path.join(__dirname, '..', 'liff', 'js', 'app.js'), 'utf8');

async function run(fetchImpl, expression) {
  const sandbox = {
    CONFIG: {
      API_BASE_URL: 'https://script.google.com/macros/s/test/exec',
      API_KEY: 'public-client-value'
    },
    fetch: fetchImpl,
    Error,
    Promise,
    JSON,
    String
  };
  vm.createContext(sandbox);
  return vm.runInContext(apiSrc + '\n' + expression, sandbox);
}

(async () => {
  let captured = null;
  const profile = await run(
    async (url, options) => {
      captured = { url, options };
      return {
        ok: true,
        json: async () => ({ ok: true, data: { mem_code: 'M1' } })
      };
    },
    'API.getCurrentMemberProfile("raw-id-token")'
  );

  if (profile.mem_code !== 'M1') throw new Error('protected profile success envelope not returned');
  if (!captured || !captured.url.endsWith('/api/member/me/profile')) {
    throw new Error('protected profile must use /api/member/me/profile');
  }
  if (captured.options.method !== 'POST') throw new Error('protected member route must be POST');
  const body = JSON.parse(captured.options.body);
  if (body.idToken !== 'raw-id-token') throw new Error('raw ID token must be in POST body');
  if ('api_key' in body) throw new Error('protected request must not send client API key');
  if ('lineUserId' in body) throw new Error('protected request must not send client lineUserId');

  let missingFailed = false;
  try {
    await run(async () => ({ ok: true, json: async () => ({ ok: true, data: {} }) }),
      'API.getCurrentMemberProfile("")');
  } catch (e) {
    missingFailed = e.code === 'UNAUTHENTICATED';
  }
  if (!missingFailed) throw new Error('missing ID token must fail closed');

  let envelopeFailed = false;
  try {
    await run(
      async () => ({ ok: true, json: async () => ({ ok: false, error: { code: 'DENIED', message: 'denied' } }) }),
      'API.getCurrentSavings("raw-id-token")'
    );
  } catch (e) {
    envelopeFailed = e.code === 'DENIED';
  }
  if (!envelopeFailed) throw new Error('API error envelope must throw');

  let transportFailed = false;
  try {
    await run(
      async () => ({ ok: false, status: 500, json: async () => ({}) }),
      'API.getCurrentLoans("raw-id-token")'
    );
  } catch (_) {
    transportFailed = true;
  }
  if (!transportFailed) throw new Error('HTTP failure must throw');

  for (const method of ['getCurrentMemberProfile', 'getCurrentSavings', 'getCurrentLoans', 'getCurrentDividends']) {
    if (!apiSrc.includes(method)) throw new Error('missing protected API method: ' + method);
  }

  const executableApiSrc = apiSrc
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');

  const forbiddenApi = [
    /getMemberProfile\s*\(lineUserId\)/,
    /getSavings\s*\(lineUserId\)/,
    /getLoans\s*\(lineUserId\)/,
    /\{\s*lineUserId\s*\}/,
    /lineUserId\s*:/
  ];
  for (const p of forbiddenApi) {
    if (p.test(executableApiSrc)) throw new Error('legacy protected identity path remains in executable api.js: ' + p);
  }

  const forbiddenApp = [
    /liff\.getProfile\s*\(/,
    /lineUserId/,
    /Use mock data for development/i,
    /SAV-0001/,
    /LN-2024-001/,
    /mem_fname:\s*['"]สมชาย/
  ];
  for (const p of forbiddenApp) {
    if (p.test(appSrc)) throw new Error('legacy/mock identity-data path remains in app.js: ' + p);
  }

  if (!/liff\.getIDToken\s*\(\)/.test(appSrc)) {
    throw new Error('LIFF app must obtain raw ID token');
  }

  console.log('PASS  protected LIFF API uses POST self-service endpoints');
  console.log('PASS  raw ID token is body-only; no API key/lineUserId identity proof');
  console.log('PASS  missing/invalid/API failure paths fail closed');
  console.log('PASS  LIFF app uses getIDToken and no legacy getProfile identity path');
  console.log('=== LIFF SECURITY TESTS PASS (4/4) ===');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
