#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const apiSrc = fs.readFileSync(path.join(__dirname, '..', 'liff', 'js', 'api.js'), 'utf8');
const appSrc = fs.readFileSync(path.join(__dirname, '..', 'liff', 'js', 'app.js'), 'utf8');
const configSrc = fs.readFileSync(path.join(__dirname, '..', 'liff', 'js', 'config.js'), 'utf8');

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

  let activationCaptured = null;
  const activation = await run(
    async (url, options) => {
      activationCaptured = { url, options };
      return {
        ok: true,
        json: async () => ({ ok: true, data: { mem_code: 'M1', changed: true } })
      };
    },
    'API.activateCurrentMember("raw-id-token", "ACT-001")'
  );
  if (!activation.changed) throw new Error('secure activation success not returned');
  if (!activationCaptured.url.endsWith('/api/member/me/activate')) {
    throw new Error('secure activation must use /api/member/me/activate');
  }
  const activationBody = JSON.parse(activationCaptured.options.body);
  if (activationBody.idToken !== 'raw-id-token' || activationBody.activateCode !== 'ACT-001') {
    throw new Error('secure activation request contract mismatch');
  }
  if ('lineUserId' in activationBody || 'api_key' in activationBody) {
    throw new Error('secure activation must not send lineUserId or API key');
  }

  let renewalCaptured = null;
  const renewal = await run(
    async (url, options) => {
      renewalCaptured = { url, options };
      return {
        ok: true,
        json: async () => ({ ok: true, data: { mem_code: 'M1', mem_exp_dt: '2027-09-09', mem_status: 'active' } })
      };
    },
    'API.renewCurrentMember("raw-id-token")'
  );
  if (renewal.mem_status !== 'active') throw new Error('secure renewal success not returned');
  if (!renewalCaptured.url.endsWith('/api/member/me/renew')) {
    throw new Error('secure renewal must use /api/member/me/renew');
  }
  const renewalBody = JSON.parse(renewalCaptured.options.body);
  if (renewalBody.idToken !== 'raw-id-token') throw new Error('secure renewal must send raw ID token');
  if ('lineUserId' in renewalBody || 'activateCode' in renewalBody || 'api_key' in renewalBody) {
    throw new Error('secure self-renew must not send lineUserId, activation code or API key');
  }

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

  for (const method of ['getCurrentMemberProfile', 'activateCurrentMember', 'renewCurrentMember', 'getCurrentSavings', 'getCurrentLoans', 'getCurrentDividends']) {
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
  if (!/MEMBER_NOT_LINKED/.test(appSrc) || !/API\.activateCurrentMember\(idToken, activateCode\)/.test(appSrc)) {
    throw new Error('LIFF app must hand unlinked verified identity to secure activation');
  }

  console.log('PASS  protected LIFF API uses POST self-service endpoints');
  console.log('PASS  raw ID token is body-only; no API key/lineUserId identity proof');
  console.log('PASS  missing/invalid/API failure paths fail closed');
  console.log('PASS  LIFF app uses getIDToken and no legacy getProfile identity path');
  if (!/API\.renewCurrentMember\(idToken\)/.test(appSrc)) {
    throw new Error('LIFF app must use secure self-renew endpoint');
  }

  console.log('PASS  LIFF secure activation sends verified ID token + entitlement code only');
  console.log('PASS  LIFF secure renewal sends verified ID token only');
  console.log('=== LIFF SECURITY TESTS PASS (6/6) ===');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
