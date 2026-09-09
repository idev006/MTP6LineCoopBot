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
เดิม Web/LIFF ใช้ client API key และ client-provided identity ในหลาย path

สถานะ: CLOSED FOR MIGRATED MEMBER IDENTITY PATHS
- LIFF self-service uses verified raw ID token
- Web uses opaque server session + verified Principal
- Web member/admin reads/writes use server-side RBAC
- legacy reads/validity retired @ 95d4f66
- legacy activation retired @ cc70d58b
- legacy renewal retired @ 787c79a8

### BL-DOC-001 — Duplicate documentation
เอกสารสำเนาระหว่างสอง repo มีโอกาส drift

สถานะ: OPEN

### BL-TEST-001 — Web automated tests
เดิม webapp ไม่มี automated auth/security/build gates

สถานะ: PARTIALLY CLOSED
- headless engine tests + security scan + production build run in Webapp CI
- auth/session/member API regressions are covered
- broader component/E2E coverage remains pending

### BL-TEST-002 — CI run evidence not verified
Initial baseline lacked workflow-run evidence.

สถานะ: CLOSED FOR ACTIVE DEVELOPMENT BASELINE
- repeated backend CI evidence is recorded in TRACEABILITY_MATRIX
- recent security retirement CI #126/#129/#131 PASS
- recent Webapp dependency CI #27 PASS

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


### BL-SEC-004 — Webhook authenticity

Current direct Apps Script webhook ingress validates a URL/query downstream secret but cannot verify the LINE `x-line-signature` header through the documented Apps Script Web App event contract.

Status: OPEN / RELEASE BLOCKER

Target: ADR-0005 verified webhook ingress gateway.

Additional privacy gap: raw webhook body logging in Apps Script must be removed before release.
