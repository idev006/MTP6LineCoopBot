# SYSTEM_BASELINE

Baseline date: 2026-09-08  
สถานะ: INITIAL AUDIT BASELINE

## Repositories

### MTP6LineCoopBot
หน้าที่ปัจจุบัน: Web/LIFF/UI + เอกสารสำเนาบางส่วน  
Default branch: main  
Baseline commit ที่ตรวจ: `effa30f3674b80351c95c3efe4e5fb13e471f1fa`

### MTLineCoopBot
หน้าที่ปัจจุบัน: Apps Script backend + LINE Bot + Core/Data/API + tests/CI  
Default branch: main  
Baseline tree/commit ที่ตรวจพบล่าสุด: `955a753cdcafe282527c0ad8d82400c4a9c89ae8`

## Verified Present — Backend Repo

พบ source จริง:
- app/Api/*
- app/Core/*
- app/Data/*
- app/LineBot/*
- app/RichMenu/*
- app/DataDict.js
- app/Test.js
- app/WebApp.js
- scripts/ci-test.js
- .github/workflows/ci.yml
- .gitleaks.toml

## Verified Present — Web Repo

พบ:
- Vue 3/Vite Web App
- Pinia stores
- Vue Router
- member/report/admin views บางส่วน
- LIFF static app
- loan calculator
- project docs copy

## Known Baseline Risks / Gaps

### BL-SEC-001 — Fail-open Web Authentication
`webapp/src/stores/auth.js` fallback เป็น mock admin/staff เมื่อ API error

สถานะ: OPEN / HIGH

### BL-SEC-002 — LIFF mock financial fallback
LIFF แสดง mock profile/savings/loans เมื่อ backend error บางกรณี

สถานะ: OPEN / HIGH

### BL-SEC-003 — Client API key
Web/LIFF ใส่ API key ใน client configuration จึงห้ามถือเป็น secret/authentication หลัก

สถานะ: OPEN

### BL-DOC-001 — Duplicate documentation
เอกสารสำเนาระหว่างสอง repo มีโอกาส drift

สถานะ: OPEN

### BL-TEST-001 — Web automated tests
webapp package scripts ยังไม่มี unit/e2e/lint gates

สถานะ: OPEN

### BL-ARCH-001 — Loan formula duplication
loan calculator UI มีสูตรของตัวเอง ขณะที่ backend มี Core/LoanCalculator.js

สถานะ: OPEN

## Baseline Rule

รายการในเอกสารเก่าที่ระบุ ✅ แต่ยังไม่มี evidence ใน TRACEABILITY_MATRIX จะไม่ถูกยกระดับเป็น VERIFIED โดยอัตโนมัติ
