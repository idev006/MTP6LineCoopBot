#!/usr/bin/env node
'use strict';

const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');

const canonical=fs.readFileSync(path.join(root,'loan_calculator.html'),'utf8');
const legacy=fs.readFileSync(path.join(root,'tools','loan_calculator.html'),'utf8');

if(!canonical.includes('/api/loan/calculate')) {
  throw new Error('canonical calculator must call /api/loan/calculate');
}
if(!/method:\s*['"]POST['"]/.test(canonical)) {
  throw new Error('canonical calculator must use POST');
}
if(!canonical.includes('equal_installment')) {
  throw new Error('canonical UI must use equal_installment contract');
}
if(/equal_total/.test(canonical)) {
  throw new Error('legacy equal_total enum must not remain in canonical UI');
}

const forbiddenFormulaPatterns=[
  /getDaysDiff\s*=/,
  /getNextMonthEnd\s*=/,
  /balance\s*\*\s*rate\s*\*\s*days\s*\/\s*365/,
  /monthlyRate\s*=\s*rate\s*\/\s*12/,
  /Math\.pow\s*\(\s*1\s*\+\s*monthlyRate/,
  /principalToPay\s*=/
];
for(const p of forbiddenFormulaPatterns){
  if(p.test(canonical)) throw new Error('business formula leaked into canonical UI: '+p);
}

if(!/http-equiv=["']refresh["']/.test(legacy) || !/\.\.\/loan_calculator\.html/.test(legacy)) {
  throw new Error('legacy tools calculator must redirect to canonical root page');
}

const configRef=/src=["']liff\/js\/config\.js["']/.test(canonical);
if(!configRef) throw new Error('canonical calculator must reuse project API configuration');

console.log('PASS  canonical calculator uses backend POST calculation contract');
console.log('PASS  no loan business formula remains in canonical UI');
console.log('PASS  canonical payment enum is equal_installment');
console.log('PASS  legacy tools calculator redirects to canonical page');
console.log('=== LOAN CALCULATOR UI CONTRACT TESTS PASS (4/4) ===');
