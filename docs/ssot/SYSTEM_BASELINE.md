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

หมายเหตุ: registered LIFF/API identity boundary ถูกปิดและ verified แล้วภายใต้ BL-SEC-003; ส่วน production webhook ingress/cutover ยังคงเป็น release evidence แยกภายใต้ REL-WEBHOOK-001

### BL-SEC-003 — Client API key / unverified identity
เดิม Web/LIFF ใช้ client API key และ client-provided identity ในหลาย path

สถานะ: CLOSED / VERIFIED FOR REGISTERED API MOUNT
- LIFF self-service uses verified raw ID token
- Web uses opaque server session + verified Principal
- Web member/admin reads/writes use server-side RBAC
- legacy reads/validity retired @ 95d4f66
- legacy activation retired @ cc70d58b
- legacy renewal retired @ 787c79a8
- Apps Script Web API mount browser `api_key` fallback and `Config.API_KEY` retired @ dec540ef; backend CI #146 PASS
- only `auth: none` routes are public; protected routes use `line-id-token` or `web-session`
- unknown/unregistered API paths fail closed as `NOT_FOUND`; arbitrary legacy API-key input cannot authorize them
- protected member routes are pinned to `line-id-token`; ApiHandlers create verified LINE Principal and delegate member profile/finance to canonical Application use cases @ 89b668c; backend CI #175 PASS
- profile/finance use cases own authenticated + member-binding + member-access policy; CI #173 exposed and #175 closed a missing finance member-binding gate
- LINE webhook profile/finance presentation also delegates to the same use cases using a server-created Principal from webhook event context; this code evidence does not claim production webhook ingress cutover
- Web frontend source tree is now guarded repository-wide: browser API-key/mock trust patterns are forbidden across `webapp/src/**/*.{js,vue}` and direct `fetch()` is forbidden outside `src/adapters/api`; protected renewal and staff-role writes use opaque server-session APIs; arbitrary Web activation remains fail-closed @ 4e93b2f; Webapp CI #34 PASS

### BL-DOC-001 — Duplicate documentation
เอกสารสำเนาระหว่างสอง repo มีโอกาส drift

สถานะ: CLOSED / VERIFIED
- substantive legacy Markdown copies under backend `app/docs/` retired @ c7df357; backend CI #198 PASS
- backend `app/docs/README.md` remains a legacy pointer only to canonical `idev006/MTP6LineCoopBot/docs/ssot/`
- backend root README now directs project documentation to the canonical SSOT
- CI governance guard prevents substantive `app/docs/*.md` copies from returning
- `.clasp.json` pushes only JS/GS/HTML/JSON runtime artifacts, so retiring Markdown copies does not affect Apps Script deployment

### BL-TEST-001 — Web automated tests
เดิม webapp ไม่มี automated auth/security/build gates

สถานะ: CLOSED / VERIFIED FOR ACTIVE WEB BASELINE
- headless engine/API tests run in Webapp CI
- router/store smoke covers protected navigation/state wiring
- repository-wide security scan covers browser trust boundaries
- Vite SSR component integration smoke renders representative guest/protected/admin views with real Vue + Pinia context @ 38964de; Webapp CI #36 PASS
- production build remains a required gate
- production browser/deployment smoke remains a Release Pipeline concern and is not required to keep this development baseline closed

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

สถานะ: CLOSED / VERIFIED
- Expiry / Notice / Loan Reminder production runtime delegated to Application use cases @ 5489622; CI #72 PASS
- duplicate scheduled `opts` orchestration and direct repository/domain/messaging shells retired @ dc1a04e; backend CI #148 PASS
- member repository adapter selection moved into Composition.SystemFactory and legacy Data.MemberRepository factory retired @ 582b73c; backend CI #154 PASS
- WebApp webhook config and API health time now resolve through narrow SystemFactory ConfigPort/ClockPort seams @ d338068; backend CI #158 PASS
- RichMenu deployment/test connection validated config now resolves through ConfigPort adapter + narrow SystemFactory seam @ b5a8d36; backend CI #160 PASS
- top-level Expiry / Notice / Loan Reminder triggers now validate config through the canonical validated ConfigPort composition seam @ d62da78; backend CI #162 PASS
- legacy repository `activateMember()` policy operation that computed `now + 365 days` inside persistence was retired; canonical activation remains `ActivateMemberUseCase -> MemberActivationEngine + ClockPort -> saveActivation()` @ 8a3e55a; backend CI #164 PASS
- durable activation/renewal/expiry/reminder/admin audit timestamps now originate from Application-owned ClockPort evidence; SheetService rejects missing timestamps before Spreadsheet access and no longer synthesizes audit time with `new Date()` @ 4073c78; backend CI #169 PASS
- time-sensitive `Core.MemberRules`, `Core.NoticeRules`, and `Core.LoanRules` no longer read machine time; callers must supply `now` explicitly from Engine/Application ClockPort context @ 2a1f4bb; backend CI #171 PASS
- legacy repository `renewMember()` operation that forced `memStatus='active'` and could mutate `line_user_id` was retired; canonical renewal remains `RenewMemberUseCase/RenewMemberByStaffUseCase -> Core.MemberRules + ClockPort -> saveRenewal()` @ 7cf0583; backend CI #177 PASS
- repository-wide ConfigPort invariant now scans every `app/**/*.js`; the remaining manual `checkTokenHealth()` direct `Config.get()` caller was migrated through `SystemFactory.createConfig()` and no direct Config global caller remains outside `AppsScriptConfigAdapter` @ 694ec4f; backend CI #180 PASS
- repository-wide ClockPort invariant now scans every `app/**/*.js`; CI #182 exposed the remaining `DataDict.generateDocumentation()` zero-argument `new Date()` caller, which now requires caller-supplied `generatedAt`; zero-argument `new Date()` remains only in `ClockPort.systemClock()` @ 3e46875; backend CI #184 PASS
- durable audit IDs now originate from explicit `IdPort` authority: `AppsScriptIdAdapter` generates opaque UUID-based IDs, dedicated audit stores apply prefixes, and `SheetService` requires caller-supplied `logId` before Spreadsheet access; repository-wide guard forbids `Date.now()` in backend app tree @ 9b5e7bb; backend CI #192 PASS
- member audit persistence is no longer part of `MemberRepositoryPort`; `MemberAuditStorePort` + `SheetsMemberAuditStore` now back canonical `DurableAuditAdapter`, while admin audit remains behind `AdminAuditStorePort`; transitional `MemberRepositoryAuditAdapter` retired @ ebeb59f; backend CI #188 PASS
- repository-wide durable audit caller guard now proves `SheetService` activation/expiry/reminder/admin audit writers are callable only through `SheetsMemberAuditStore` / `SheetsAdminAuditStore`; no hidden bypass found @ 314ec41; backend CI #190 PASS
- repository-wide runtime-global layer guard proves Apps Script globals are absent from Core/Application/Engine/Ports/Composition/Data/Security and remain confined to imperative-shell/infrastructure/tooling boundaries @ a38d997; backend CI #194 PASS
- BL-ARCH-002 closure does not prohibit framework globals inside explicit delivery/infrastructure adapters; it prohibits hidden runtime dependencies from leaking into business/composition layers

### BL-ARCH-003 — Policy in repository contract
Legacy `isActiveMember` / `hasRole` policy wrappers have been removed from `SheetsMemberRepository` and `SheetService`. The persistence port was already policy-free; `MemberAccessEngine` + `Core.MemberRules` + `ClockPort` remain the canonical policy authority.

สถานะ: CLOSED / VERIFIED
- backend @ c8491f7
- CI #156 PASS
- architecture regression guard prevents member validity/role policy from returning to the persistence adapter/service

## Baseline Rule

รายการในเอกสารเก่าที่ระบุ ✅ แต่ยังไม่มี evidence ใน TRACEABILITY_MATRIX จะไม่ถูกยกระดับเป็น VERIFIED โดยอัตโนมัติ


### BL-SEC-004 — Webhook authenticity

Direct Apps Script cannot verify the LINE `x-line-signature` header through the documented Web App event contract.

Status: CLOSED IN CODE / RELEASE CUTOVER PENDING

Implemented:
- verified Node 24 ingress gateway @ `110de3e`; Webhook Ingress CI #1 PASS
- exact raw-body HMAC-SHA256 verification before JSON parse
- official LINE signature vector + tamper/missing/malformed/downstream failure tests
- Apps Script raw webhook body logging removed @ `9019873`; backend CI #135 PASS
- ADR-0005 + deployment/cutover runbook

Remaining release blocker:
- staging deployment/security verification
- LINE Developers Console production webhook cutover
- production smoke/monitoring evidence

Tracked by: REL-WEBHOOK-001 (#68)


### BL-API-001 — Public loan legacy input alias

`POST /api/loan/calculate` has a canonical `paymentType` vocabulary of `equal_principal|equal_installment`, while legacy `equal_total` remains accepted as a temporary input alias and normalizes to `equal_installment`.

Status: CONTROLLED DEPRECATION / NOT YET RETIRED
- ADR-0006 defines a 60-calendar-day deprecation window
- the clock begins only at the first production-verified cutover that includes ADR-0006
- current code/CI evidence does not establish that production start date
- new first-party UI/code must not emit the alias
- retirement requires a fresh caller audit plus production release evidence
- no sensitive loan payload telemetry is permitted

Tracked by: API-COMPAT-001 (#81).
