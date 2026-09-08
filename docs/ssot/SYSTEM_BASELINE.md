# SYSTEM_BASELINE

Baseline date: 2026-09-08  
สถานะ: INITIAL AUDIT BASELINE

## Repositories

### MTP6LineCoopBot
หน้าที่ปัจจุบัน: Web/LIFF/UI + Project Governance SSOT  
Default branch: main  
Baseline commit ที่ตรวจ: `effa30f3674b80351c95c3efe4e5fb13e471f1fa`

### MTLineCoopBot
หน้าที่ปัจจุบัน: Apps Script backend + LINE Bot + Core/Data/API + tests/CI  
Default branch: main  
Baseline commit: `955a753cdcafe282527c0ad8d82400c4a9c89ae8`

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

### Backend test implementation evidence

`scripts/ci-test.js` มี Node headless harness และประกาศ test 34 รายการ รวม:
- menu/caption contracts
- webhook signature/secret
- member validity
- repository/data layer
- finance/content
- date conversion
- expiry
- API layer/mount
- activation/renewal
- notice/reminder
- Core member/loan rules
- Flex components/cards

CI workflow มี:
- node syntax check
- contract test runner
- secret scan
- gitleaks

**Evidence distinction:** ตรวจพบ test/CI implementation แต่ connector ไม่พบ workflow-run/combined-status evidence สำหรับ backend commit `955a753...` ณ รอบ audit นี้ จึงยังไม่ถือว่า CI_VERIFIED

## Verified Present — Web Repo

พบ:
- Vue 3/Vite Web App
- Pinia stores
- Vue Router
- member/report/admin views บางส่วน
- LIFF static app
- loan calculator
- project docs copy

## Engine/Plug-in Baseline

ดู `ENGINE_AUDIT_BASELINE.md`

สรุป:
- Core engines: มีฐานดีบางส่วน
- Repository port/adapter: มีจริง แต่ port + factory ยัง coupled
- Headless Node harness: มีจริงและเป็นฐานต่อยอด
- Explicit composition root: ยังไม่มี
- Identity/Clock/Messaging/Audit ports: ยังไม่เป็น first-class contracts
- LINE/Event/API layers ยังมี hidden/global wiring บางส่วน

## Known Baseline Risks / Gaps

### BL-SEC-001 — Fail-open Web Authentication
เดิม `webapp/src/stores/auth.js` fallback เป็น mock admin/staff เมื่อ API error

สถานะ: CLOSED IN CODE — `MTP6LineCoopBot@e1a54aa`; Webapp CI run #3 PASS

หมายเหตุ: client session state ไม่ใช่ server-side authorization; session expiry/verification ฝั่ง server ยังต้องทำตาม REQ-SEC-004/005

### BL-SEC-002 — LIFF mock financial fallback
LIFF เดิมแสดง mock profile/savings/loans เมื่อ backend error

สถานะ: CLOSED IN CODE — `MTP6LineCoopBot@14c2da2`; LIFF CI run #1 PASS

หมายเหตุ: การยืนยัน identity ของ LIFF ยังอยู่ใน BL-SEC-003/REQ-SEC-002 และยังไม่ถือว่าปลอดภัยครบ

### BL-SEC-003 — Client API key / unverified identity
Web/LIFF ใส่ API key ใน client และ backend API accepts lineUserId from request context

สถานะ: OPEN / HIGH

### BL-DOC-001 — Duplicate documentation
เอกสารสำเนาระหว่างสอง repo มีโอกาส drift

สถานะ: OPEN

### BL-TEST-001 — Web automated tests
webapp package scripts ยังไม่มี unit/e2e/lint gates

สถานะ: OPEN

### BL-TEST-002 — CI run evidence not verified
พบ workflow/test code แต่ยังไม่มี run/status evidence จาก connector สำหรับ backend baseline commit

สถานะ: OPEN / EVIDENCE GAP

### BL-ARCH-001 — Loan formula duplication
เดิม loan calculator UI หลายจุดมีสูตร Actual/365/PMT ของตัวเอง ขณะที่ backend มี Core/LoanCalculator.js

สถานะ: CLOSED / VERIFIED
- canonical backend authority: `MTLineCoopBot@45582b4`; CI #74 PASS
- canonical API-backed frontend calculator: `MTP6LineCoopBot@0de0c0e`; Loan Calculator CI #1 PASS
- backend duplicate HTML retired: `MTLineCoopBot@daffda7`; CI #76 PASS
- architecture guards ป้องกัน formula duplication กลับมา

### BL-ARCH-002 — Hidden dependency wiring
repository/config/time/services ถูก resolve ผ่าน globals/factories หลายจุด

สถานะ: OPEN

### BL-ARCH-003 — Policy in repository contract
`isActiveMember` และ `hasRole` ยังอยู่ใน persistence contract

สถานะ: OPEN

## Baseline Rule

รายการในเอกสารเก่าที่ระบุ ✅ แต่ยังไม่มี evidence ใน TRACEABILITY_MATRIX จะไม่ถูกยกระดับเป็น VERIFIED โดยอัตโนมัติ
