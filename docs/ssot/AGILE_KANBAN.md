# AGILE_KANBAN

Status: ACTIVE

## Board

BACKLOG → READY → IN_PROGRESS → REVIEW → TEST → DONE

Optional:
- BLOCKED
- RELEASE_READY

## WIP Limits

- IN_PROGRESS: <= 3
- REVIEW: <= 3
- TEST: <= 3
- BLOCKED: ไม่จำกัด แต่ต้องมี owner/reason

## Pull Policy

งานเข้า READY ได้เมื่อ:
- Requirement ID
- Acceptance Criteria
- SSOT references
- dependencies
- test plan
- security/data impact

งานเข้า IN_PROGRESS ได้เมื่อ WIP ไม่เกิน limit

งานเข้า REVIEW ได้เมื่อ:
- code committed/pushed
- local/headless tests implemented
- no known Critical defect

งานเข้า TEST ได้เมื่อ:
- PR opened
- CI started
- reviewer findings resolved

งานเข้า DONE ได้เมื่อ:
- CI PASS
- required tests PASS
- traceability updated
- evidence recorded
- docs synchronized
- merged to authoritative branch

## Current Priority

P0:
1. remaining legacy compatibility/security retirement audit
2. release/staging security readiness
3. production verification blockers

P1:
4. Web admin completion
5. remaining legacy compatibility retirement
6. frontend dependency maintenance after verified baseline

P2:
7. Staging/UAT/release hardening
8. operational monitoring and production verification

## Cadence

Kanban continuous flow; no fixed sprint required.
Weekly review:
- throughput
- cycle time
- blocked items
- escaped defects
- CI health
- security findings
- migration ledger


## Live Execution Board — 2026-09-08

### IN_PROGRESS / TEST

- none

### READY

1. `REL-WEBHOOK-001` — MTP6LineCoopBot #68  
   Deploy/cut over verified webhook ingress and collect production evidence

### BACKLOG

- Web admin completion / RBAC workflows
- remaining legacy compatibility/security retirement audit
- release/staging/UAT hardening

### DONE

- `SEC-LEGACY-003` — MTP6LineCoopBot #79 — DONE (backend code/CI complete; SSOT sync in this checkpoint); scheduled opts orchestration retired @ dc1a04e; backend CI #148 PASS
- `SEC-LEGACY-002` — MTP6LineCoopBot #77 — DONE (backend code/CI complete; SSOT sync in this checkpoint); browser API-key mount/config retired @ dec540ef; backend CI #146 PASS
- `SEC-WEBHOOK-001` — MTP6LineCoopBot #65 — DONE (code scope); gateway @ 110de3e CI #1 + Apps Script privacy @ 9019873 CI #135 PASS; production cutover tracked by #68
- `UI-DEPS-001` — MTP6LineCoopBot #26 — DONE @ 49e656fc; Webapp CI #27 PASS; router/store smoke gate added
- `SEC-LEGACY-001` — MTP6LineCoopBot #56 — DONE; reads @ 95d4f66 CI #115, activation @ cc70d58b CI #126, LIFF renew @ aade6512 CI #11, chat renewal @ 4979d9b0 CI #129, legacy renewal retirement @ 787c79a8 CI #131
- `SEC-WEB-004` — MTP6LineCoopBot #46 — DONE; secure backend @ 3f052961, LIFF caller @ e174e625, chat handoff @ 09dbfc88, legacy activation retirement @ cc70d58b CI #126 PASS
- `SEC-WEB-003` — MTP6LineCoopBot #37 — DONE; settings 3ea0171/60b4d35, audit 82cf8ee/481b175, reports 820bd14/dbb1df2, renewal 5fd6d28/3d6f04e, staff read 715318a/4b2987b, role catalog 1f8ec59/3051119, audited role assignment 841b37a/96e77a5 — all recorded CI PASS
- `SEC-WEB-002` — MTP6LineCoopBot #16 — DONE; server session 1406a00f CI #81, LINE exchange fe332fde CI #85, Web client auth 97dc634e CI #8, member RBAC d78a1bc CI #87, client member migration 07ca08e CI #11 PASS
- `CORE-FIN-001` — MTLineCoopBot #14 — DONE; backend authority @ 45582b4 CI #74, frontend @ 0de0c0e UI CI #1, duplicate retirement @ daffda7 CI #76 PASS
- `APP-SCHEDULED-001` — MTLineCoopBot #13 — DONE @ 5489622; foundation CI #70 + runtime CI #72 PASS; legacy scheduled shells retired @ dc1a04e CI #148

- `SEC-LIFF-001` — MTP6LineCoopBot #15 — DONE @ d3deac7; LIFF CI #5 PASS
- `ARCH-DATA-001` — MTLineCoopBot #9 — DONE @ 255d862; backend CI #60 PASS
- `APP-MEMBER-001` — MTLineCoopBot #10 — DONE @ 91bd7cb; backend CI #63 PASS
- `APP-MEMBER-002` — MTLineCoopBot #11 — DONE @ 4dd0391; backend CI #65 PASS
- `ARCH-PORTS-002` — MTLineCoopBot #12 — DONE @ 58ee3d9; backend CI #67 PASS

## Pull Rule for Live Board

ทีมดึงงานจาก READY เข้า IN_PROGRESS ได้เมื่อ:
- WIP รวมไม่เกิน 3
- dependency พร้อม
- issue มี acceptance criteria/test gate
- branch ตั้งชื่อตาม work item
- commit/push เป็น checkpoints สั้น ๆ

เมื่อ card DONE:
- close issue
- update migration ledger
- update traceability evidence
- pull next highest-priority BACKLOG card into READY


## Pipeline Mapping

Kanban state is a quality state, not only a work-status label.

| Kanban | Required Pipeline State |
|---|---|
| BACKLOG | requirement not ready |
| READY | requirement + analysis + architecture + test design ready |
| IN_PROGRESS | development + self-review |
| REVIEW | peer/code review |
| TEST | CI + QA + security + audit |
| RELEASE_READY | release pipeline gates satisfied through UAT/approval as applicable |
| DONE | merge + evidence + SSOT sync complete |
| BLOCKED | pipeline stopped with explicit reason/owner |

Canonical process:
- `process/TEAM_DEVELOPMENT_PIPELINE.md`
- `process/CI_PIPELINE_STANDARD.md`
- `process/RELEASE_DEPLOYMENT_PIPELINE.md`


### SEC-WEB-003 Checkpoints

- Admin Settings read — DONE: backend @ 3ea0171 CI #92; frontend @ 60b4d35 Webapp CI #13
- Audit Log read — DONE: backend @ 82cf8ee CI #94; frontend @ 481b175 Webapp CI #15
- Reports read — DONE: backend @ 820bd14 CI #96; frontend @ dbb1df2 Webapp CI #17
- Protected Web renewal write — DONE: backend @ 5fd6d28 CI #98; frontend @ 3d6f04e Webapp CI #19
- Staff management / role catalog / audited role assignment — DONE: backend @ 715318a/1f8ec59/841b37a; frontend @ 4b2987b/3051119/96e77a5; recorded CI PASS
- SEC-WEB-003 issue #37 — DONE / CLOSED; activation identity binding was separated to SEC-WEB-004 and is also DONE


### SEC-WEB-003 Protected Write Checkpoints

- Protected Web renewal write — DONE: backend @ 5fd6d28 CI #98; frontend @ 3d6f04e Webapp CI #19
- Activation / identity binding — SPLIT TO SEC-WEB-004; DONE there
- Staff/Role admin capabilities — DONE


### Authorization Consistency

- Role vocabulary consistency — DONE: canonical `member|staff|manager|admin`; backend @ a8beda3 CI #100 PASS


### SEC-WEB-003 Admin Capability Checkpoints

- Staff Management read — DONE: backend @ 715318a CI #106; frontend @ 4b2987b Webapp CI #21
- Role Catalog read — DONE: backend @ 1f8ec59 CI #108; frontend @ 3051119 Webapp CI #23
- Staff role assignment/write — DONE: backend @ 841b37a CI #110; frontend @ 96e77a5 Webapp CI #25


### SEC-LEGACY-002 Checkpoint

- Dead Apps Script browser API-key authentication compatibility — DONE: backend @ dec540ef; CI #146 PASS
- `api_key` query/body parsing removed
- `Config.API_KEY` removed
- canonical route auth metadata + fail-closed unknown-route regression gate retained

### SEC-LEGACY-001 Checkpoints

- Production Web/LIFF caller audit — DONE for legacy member reads
- Internal LINE EventHandler caller migration — DONE @ 95d4f66
- Legacy GET profile/savings/loans/dividends/validity retirement — DONE @ 95d4f66 CI #115
- Legacy activation compatibility — DONE / RETIRED @ cc70d58b CI #126
- Legacy renewal compatibility — DONE / RETIRED @ 787c79a8 CI #131


### SEC-LEGACY-003 Checkpoint

- ExpiryService opts compatibility shell — RETIRED @ dc1a04e; CI #148 PASS
- NoticeService opts compatibility shell — RETIRED @ dc1a04e; CI #148 PASS
- LoanReminderService opts compatibility shell — RETIRED @ dc1a04e; CI #148 PASS
- LineBot scheduled services are thin Application adapters; canonical behavior remains in headless Application tests

### SEC-WEBHOOK-001 Checkpoints

- ADR/security standard — DONE
- Verified Node 24 ingress gateway — CODE VERIFIED @ 110de3e; Webhook Ingress CI #1 PASS
- Apps Script raw-body log hardening — CODE VERIFIED @ 9019873; backend CI #135 PASS
- Deployment/config runbook — DOCUMENTED
- Staging deployment + negative/positive signature verification — MOVED TO REL-WEBHOOK-001 #68
- LINE Developers production cutover — MOVED TO REL-WEBHOOK-001 #68


## API-COMPAT-001 — Loan `equal_total` deprecation policy

Status: POLICY_ACCEPTED / RETIREMENT_PENDING

- Governance issue: #81
- Decision: ADR-0006
- Canonical payment types remain `equal_principal|equal_installment`.
- Legacy `equal_total` remains accepted temporarily and normalizes to `equal_installment`.
- New first-party UI/code must not emit the alias.
- Deprecation clock starts only at the first production-verified cutover that includes ADR-0006.
- Target retirement is 60 calendar days after that verified cutover.
- Before retirement: re-audit repository callers and satisfy production release evidence.
- No sensitive loan payload/amount/member/PII/raw-body telemetry is permitted.
- Current code/CI evidence does not claim staging or production verification.

Next gate: establish the real production cutover date through the release pipeline, then compute the retirement date from that evidence.


### ARCH-LEGACY-001 Checkpoint

- Legacy `Data.MemberRepository` compatibility factory — RETIRED @ 582b73c
- DB adapter selection now belongs to `Composition.SystemFactory`
- `Ports.MemberRepositoryPort` is enforced at the composition boundary
- LINE content reads migrated through the canonical system repository
- CI #154 PASS: syntax, Test.js contracts, architecture/retirement guard, ports, engines, application use cases, scheduled/security/protected-delivery gates, gitleaks
- API_DATA_CONTRACT unchanged: no external request/response/auth contract changed
- Remaining repository policy-helper cleanup stays tracked separately under BL-ARCH-003


### ARCH-LEGACY-002 Checkpoint

- `SheetsMemberRepository.isActiveMember/hasRole` — RETIRED @ c8491f7
- `SheetService.isActiveMember/hasRole` — RETIRED @ c8491f7
- validity/role Test.js coverage migrated to deterministic `MemberAccessEngine` with fixed clock
- `MemberRepositoryPort` remains persistence-only
- architecture regression guard prevents policy helpers from returning to persistence
- CI #156 PASS across syntax, Test.js contracts, architecture, ports, engines, application, scheduled/security/protected-delivery gates, and gitleaks
- BL-ARCH-003 — CLOSED / VERIFIED
- API_DATA_CONTRACT unchanged: no external request/response/auth contract changed


### ARCH-LEGACY-003 Checkpoint

- direct `Config.get()` in `WebApp` webhook delivery — RETIRED @ d338068
- direct `new Date()` in API health delivery — RETIRED @ d338068
- narrow `SystemFactory.createConfig()` / `createClock()` seams added and guarded by ConfigPort/ClockPort
- webhook secret verification still executes before webhook JSON parse and remains fail closed
- CI #158 PASS across syntax, Test.js contracts, architecture, ports, engines, application, scheduled/security/protected-delivery gates, and gitleaks
- BL-ARCH-002 remains OPEN for other hidden/global wiring outside this delivery sub-scope
- API_DATA_CONTRACT unchanged: request/response/auth semantics did not change


### ARCH-LEGACY-004 Checkpoint

- direct `Config.validate()` in `RichMenu.Deployer.deploy()` — RETIRED @ b5a8d36
- direct `Config.validate()` in `testConnection()` — RETIRED @ b5a8d36
- `ConfigPort.assertValidatable()` added as a separate capability; read-only ConfigPort consumers remain compatible
- `AppsScriptConfigAdapter.validate()` delegates to the existing `Config.validate()` implementation, preserving fail-closed validation semantics
- narrow `SystemFactory.createValidatedConfig()` composition seam added
- CI #160 PASS across syntax, Test.js contracts, architecture, config/port contracts, engines, application, scheduled/security/protected-delivery gates, and gitleaks
- BL-ARCH-002 remains OPEN for hidden/global wiring outside verified sub-scopes
- API_DATA_CONTRACT unchanged: external request/response/auth semantics did not change


### ARCH-LEGACY-005 Checkpoint

- direct `Config.validate()` in top-level `runExpiryCheck()` trigger — RETIRED @ d62da78
- direct `Config.validate()` in top-level `runNoticeBroadcast()` trigger — RETIRED @ d62da78
- direct `Config.validate()` in top-level `runLoanReminders()` trigger — RETIRED @ d62da78
- all three triggers now use `SystemFactory.createValidatedConfig().validate()`
- existing `Config.validate()` fail-closed semantics remain preserved through `AppsScriptConfigAdapter.validate()`
- service-level scheduled adapters still delegate directly to Application use cases
- runtime test now executes all three top-level trigger entrypoints and verifies exactly one config validation per trigger
- compatibility guard forbids direct scheduled `Config.validate()` reintroduction
- CI #162 PASS across syntax, Test.js contracts, architecture, ports, engines, application, scheduled runtime/compatibility, security/protected-delivery gates, and gitleaks
- BL-ARCH-002 remains OPEN for hidden/global wiring outside verified sub-scopes
- API_DATA_CONTRACT unchanged: external request/response/auth semantics did not change


### ARCH-LEGACY-006 Checkpoint

- `MemberRepositoryPort.activateMember` — RETIRED @ 8a3e55a
- `SheetsMemberRepository.activateMember` wrapper — RETIRED @ 8a3e55a
- `SheetService.activateMember()` wall-clock +365-day policy operation — RETIRED @ 8a3e55a
- canonical activation remains `ActivateMemberUseCase -> MemberActivationEngine + ClockPort -> repo.saveActivation()`
- Test.js header-reordering persistence coverage now uses deterministic precomputed activation values
- architecture regression guard prevents policy-bearing `activateMember` from returning to persistence
- CI #164 PASS across syntax, Test.js contracts, architecture, repository/port contracts, engines, application, scheduled/security/protected-delivery gates, and gitleaks
- BL-ARCH-002 remains OPEN for hidden/global wiring outside verified sub-scopes
- API_DATA_CONTRACT unchanged: external request/response/auth semantics did not change


### ARCH-LEGACY-007 Checkpoint

- activation audit `occurredAt` now propagates through `MemberRepositoryAuditAdapter` into durable `activated_dt`
- self-renewal and staff-renewal audit events now use the same `ClockPort` instant as renewal policy evaluation
- expiry/reminder/admin flows retain their existing Application-owned timestamps
- `SheetService.logActivation()` no longer calls `new Date()` for audit time
- expiry/reminder/admin durable writers no longer fall back to `new Date()`
- all durable audit writers reject missing timestamps before Spreadsheet access
- log-ID `Date.now()` generation remains explicitly out of scope for this checkpoint
- CI #166 and #168 exposed test-only cross-realm/JSON-clone Date comparison defects; assertions were corrected by epoch parsing without weakening timestamp authority checks
- CI #169 PASS across syntax, Test.js contracts, architecture, ports, engines, application, scheduled/security/protected-delivery gates, and gitleaks
- BL-ARCH-002 remains OPEN for hidden/global wiring outside verified sub-scopes
- API_DATA_CONTRACT unchanged: external request/response/auth semantics did not change


### ARCH-LEGACY-008 Checkpoint

- implicit wall-clock fallback in `Core.MemberRules.isActiveMember()` — RETIRED @ 2a1f4bb
- implicit wall-clock fallback in `Core.MemberRules.getExpiryStatus()` — RETIRED @ 2a1f4bb
- implicit wall-clock fallback in `Core.MemberRules.computeRenewal()` — RETIRED @ 2a1f4bb
- implicit wall-clock fallback in `Core.NoticeRules.getPendingNotices()` — RETIRED @ 2a1f4bb
- implicit wall-clock fallback in `Core.LoanRules.getDueLoans()` — RETIRED @ 2a1f4bb
- production Engine/Application callers already provide ClockPort-derived `now`; no production caller migration was required
- date parsing/copying constructors with supplied values remain allowed
- missing `now` now fails explicitly for time-sensitive Core evaluation
- architecture regression guard forbids zero-argument `new Date()` in these Core rule modules and verifies positive explicit-time behavior
- CI #171 PASS across syntax, Test.js contracts, architecture, ports, engines, application, scheduled/security/protected-delivery gates, and gitleaks
- BL-ARCH-002 remains OPEN for remaining hidden/global wiring such as audit identifier generation and any unverified seams
- API_DATA_CONTRACT unchanged: external request/response/auth semantics did not change


### ARCH-LEGACY-009 Checkpoint

- all registered `/api/member/me/*` routes are pinned to `auth: line-id-token`
- `ApiHandlers.requireLinePrincipal()` accepts raw ID token only, authenticates through the LINE identity adapter, and requires canonical authenticated `Principal`
- protected profile/finance API delivery delegates to `GetCurrentMemberProfileUseCase` / `GetCurrentMemberFinanceUseCase`
- profile/finance Application use cases own authenticated, member-binding, and member-access policy
- architecture guard forbids client body `lineUserId` identity authority in protected API handlers
- LINE webhook profile/finance presentation delegates to the same canonical use cases using a server-created Principal derived from webhook event context
- CI #173 failed because the new guard exposed a real missing `requireMemberBinding()` gate in the finance use case; root cause fixed and a fail-closed binding-denial test added
- backend merge @ 89b668c; CI #175 PASS across syntax, Test.js, architecture, ports, engines, application, scheduled/security/protected-delivery gates, and gitleaks
- stale SSOT Identity / Authorization / Member profile FOUNDATION/PARTIAL states reconciled to verified migrated status
- registered LIFF/API identity boundary is verified in code/CI; **no staging/production webhook ingress cutover claim** is made—REL-WEBHOOK-001 remains external release gate
- API_DATA_CONTRACT unchanged: external request/response/auth semantics did not change


### ARCH-LEGACY-010 Checkpoint

- legacy `MemberRepositoryPort.renewMember()` — RETIRED @ 7cf0583
- `SheetsMemberRepository.renewMember()` wrapper — RETIRED @ 7cf0583
- `SheetService.renewMember()` policy-bearing persistence operation — RETIRED @ 7cf0583
- `InMemoryMemberRepository.renewMember()` compatibility method — RETIRED @ 7cf0583
- legacy repository contract-test coverage removed; deterministic `saveRenewal()` coverage retained
- canonical self/staff renewal remains `Application -> Core.MemberRules.computeRenewal(member, now) -> repo.saveRenewal(...)`
- persistence no longer forces `memStatus='active'` or mutates `line_user_id` through a renewal compatibility API
- architecture regression guard prevents `renewMember` from returning to repository/persistence adapters
- CI #177 PASS across syntax, Test.js contracts, architecture, ports, engines, application, scheduled/security/protected-delivery gates, and gitleaks
- BL-ARCH-002 remains OPEN for remaining hidden/global wiring outside verified sub-scopes
- API_DATA_CONTRACT unchanged: external request/response/auth semantics did not change


### ARCH-LEGACY-011 Checkpoint

- repository tree enumerated from current GitHub main; private code-search zero results were not trusted as closure evidence
- new architecture guard recursively scans every production `app/**/*.js` file
- direct `Config.get()` / `Config.validate()` is permitted only inside `Adapters/Config/AppsScriptConfigAdapter.js`
- CI #179 exposed one remaining direct caller: operational `checkTokenHealth()` in `app/Test.js`
- root cause fixed by routing `checkTokenHealth()` through `Composition.SystemFactory.createConfig().get()`; guard was not weakened or given a Test.js exception
- `Config.js` remains the definition/source boundary; production callers consume it only through AppsScriptConfigAdapter + ConfigPort/SystemFactory
- backend merge @ 694ec4f; CI #180 PASS across syntax, Test.js, architecture, ports, engines, application, scheduled/security/protected-delivery gates, and gitleaks
- Config migration row is now `MIGRATED / REPOSITORY-WIDE CONFIGPORT AUTHORITY VERIFIED`
- BL-ARCH-002 remains OPEN for non-Config hidden/global seams still requiring explicit evidence
- API_DATA_CONTRACT unchanged: external request/response/auth semantics did not change


### ARCH-LEGACY-012 Checkpoint

- new architecture guard recursively scans every `app/**/*.js`
- zero-argument `new Date()` is permitted only in `Ports.ClockPort.systemClock()`
- input-derived `new Date(value)` parsing/copying remains allowed
- `Date.now()` identifier generation is explicitly outside this checkpoint and tracked separately
- CI #182 exposed one remaining current-time caller in `DataDict.generateDocumentation()`
- root cause fixed by requiring caller-supplied `generatedAt`; DataDict does not depend upward on Composition/SystemFactory
- guard strengthened to pin the explicit DataDict generation-time contract
- backend merge @ 3e46875; CI #184 PASS across syntax, Test.js, architecture, ports, engines, application, scheduled/security/protected-delivery gates, and gitleaks
- Clock/time migration row is now `MIGRATED / REPOSITORY-WIDE WALL-CLOCK AUTHORITY VERIFIED`
- BL-ARCH-002 remains OPEN for non-Clock hidden/global seams, including audit identifier generation if it is to be migrated
- API_DATA_CONTRACT unchanged: external request/response/auth semantics did not change


### ARCH-LEGACY-013 Checkpoint

- added `MemberAuditStorePort` for durable activation/expiry/reminder audit persistence
- added `SheetsMemberAuditStore`
- added canonical `DurableAuditAdapter` backed by `MemberAuditStorePort + AdminAuditStorePort`
- removed `logActivation/logExpiry/logReminder` from `MemberRepositoryPort`, `SheetsMemberRepository`, and `InMemoryMemberRepository`
- retired transitional `MemberRepositoryAuditAdapter`
- SystemFactory now composes `memberAuditStore` separately from `memberRepository`
- runtime load order and contract/architecture tests updated
- CI #186 exposed stale test reference to deleted transitional adapter; root cause fixed
- CI #187 exposed formatting-sensitive timestamp assertion; assertion made whitespace-tolerant without weakening semantic mapping
- backend merge @ ebeb59f; CI #188 PASS across syntax, Test.js, architecture, ports, engines, application, scheduled/security/protected-delivery gates, and gitleaks
- Audit logging remains PARTIAL until a repository-wide caller guard proves durable SheetService audit writers are reachable only through dedicated audit-store adapters
- API_DATA_CONTRACT unchanged: external request/response/auth semantics did not change


### ARCH-LEGACY-014 Checkpoint

- repository-wide architecture guard recursively scans every production `app/**/*.js`
- direct `LineBot.SheetService.logActivation()` / `appendExpiryLog()` / `appendReminderLog()` calls are allowed only in `SheetsMemberAuditStore`
- direct `LineBot.SheetService.appendAdminAuditLog()` is allowed only in `SheetsAdminAuditStore`
- `SystemFactory -> DurableAuditAdapter -> dedicated audit stores` composition is pinned by the guard
- no hidden production bypass was found
- backend merge @ 314ec41; CI #190 PASS across syntax, Test.js, architecture, ports, engines, application, scheduled/security/protected-delivery gates, and gitleaks
- Audit logging migration row is now `MIGRATED / REPOSITORY-WIDE DURABLE AUDIT AUTHORITY VERIFIED`
- BL-ARCH-002 remains OPEN for non-audit hidden/global seams still requiring explicit evidence
- API_DATA_CONTRACT unchanged: external request/response/auth semantics did not change


### ARCH-LEGACY-015 Checkpoint

- Webapp security scan now recursively covers every `webapp/src/**/*.js` and `webapp/src/**/*.vue`
- browser API-key/mock trust patterns are forbidden repository-wide
- direct `fetch()` is forbidden outside `src/adapters/api`
- credential/session/token persistence in `localStorage` is forbidden; non-sensitive UI preferences such as theme remain allowed
- member list/detail/renew use the shared session-authorized member API client
- admin settings/audit/staff/roles/role assignment use the shared session-authorized admin API client
- protected staff member renewal and staff role assignment are implemented and fail closed on server denial
- arbitrary Web activation-on-behalf remains intentionally fail-closed; canonical activation is verified LINE self-service per API contract
- CI #33 exposed a false positive on UI theme localStorage; guard refined to distinguish UI preference from credential persistence without weakening auth/session rules
- frontend merge @ 4e93b2f; Webapp CI #34 PASS across headless tests, router/store smoke, security scan and production build
- Web frontend migration row is now `MIGRATED / REPOSITORY-WIDE TRUST BOUNDARY VERIFIED`
- BL-TEST-001 remains separate/partially closed because broader component/E2E coverage is still pending
- API_DATA_CONTRACT unchanged: this checkpoint enforces the existing registered contract rather than changing it
