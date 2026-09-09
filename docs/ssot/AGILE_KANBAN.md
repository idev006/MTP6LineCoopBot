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


### ARCH-LEGACY-016 Checkpoint

- added `IdPort` as explicit identifier-generation boundary
- added production `AppsScriptIdAdapter` using `Utilities.getUuid()`; no wall-clock fallback
- `SystemFactory` now composes/injects `idGenerator`
- `SheetsMemberAuditStore` generates prefixed `LOG` / `ELOG` / `RLOG` IDs before persistence
- `SheetsAdminAuditStore` generates prefixed `ALOG` IDs before persistence
- `SheetService` audit writers require caller-supplied `logId` and reject missing IDs before Spreadsheet access
- all backend `Date.now()` calls in `app/**/*.js` are forbidden by architecture regression guard
- IdPort production adapter contract and SystemFactory injection/default wiring are covered by CI
- backend merge @ 9b5e7bb; CI #192 PASS across syntax, Test.js, architecture, ports, engines, application, scheduled/security/protected-delivery gates, and gitleaks
- identifier generation migration is now `MIGRATED / EXPLICIT ID AUTHORITY VERIFIED`
- BL-ARCH-002 remains OPEN pending audit of any remaining hidden/global service dependencies outside verified Config/Clock/ID/repository/audit/scheduled scopes
- API_DATA_CONTRACT unchanged: external request/response/auth semantics did not change


### ARCH-LEGACY-017 Checkpoint

- audited every backend `app/**/*.js` path on current main for Apps Script runtime globals
- Core/Application/Engine/Ports/Composition/Data/Security contain no direct runtime-global access
- remaining framework globals are intentionally confined to adapters, delivery, persistence/infrastructure shells, trigger setup, RichMenu tooling, Dashboard/SeedData/Test utilities, and signature/config boundaries
- new repository-wide architecture guard forbids runtime globals from leaking back into business/composition layers
- `Logger` observability inside imperative shell is not treated as business authority
- backend merge @ a38d997; CI #194 PASS across syntax, Test.js, architecture, ports, engines, application, scheduled/security/protected-delivery gates, and gitleaks
- BL-ARCH-002 is now `CLOSED / VERIFIED`
- closure does not prohibit framework primitives at explicit infrastructure/delivery boundaries; it prevents hidden dependency wiring in the functional core/application architecture
- API_DATA_CONTRACT unchanged: external request/response/auth semantics did not change


### DOC-SSOT-001 Checkpoint

- audited documentation trees across both repositories and confirmed extensive duplicate basenames under backend `app/docs/`
- verified `.clasp.json` rootDir is `app`, but clasp runtime extensions are JS/GS/HTML/JSON; Markdown copies are not Apps Script runtime artifacts
- retired all substantive backend `app/docs/*.md` copies
- retained only `app/docs/README.md` as a short legacy pointer to `idev006/MTP6LineCoopBot/docs/ssot/`
- updated backend root README to stop presenting `app/docs` as project-book authority
- added CI governance guard preventing substantive backend documentation copies from returning
- CI #196 exposed case-sensitive pointer assertion; fixed without weakening SSOT requirement
- CI #197 exposed stale legacy README links that first replacement missed; root cause fixed by removing the legacy block
- backend merge @ c7df357; CI #198 PASS across architecture, contracts, application/security/protected-delivery gates and gitleaks
- BL-DOC-001 is now `CLOSED / VERIFIED`
- API_DATA_CONTRACT unchanged: documentation-governance change only


### TEST-WEB-001 Checkpoint

- audited current Webapp test stack before adding dependencies
- existing Vue/Vite install already includes `@vue/server-renderer` / compiler support; no new test framework dependency added
- added Vite SSR component integration smoke for representative views: Home, Dashboard, StaffManage, AuditLog
- tests use real Vue + Pinia context and compile/load `.vue` modules through Vite SSR without network calls
- Webapp CI now gates: headless engine/API tests → router/store smoke → component integration smoke → repository-wide security scan → production build
- frontend merge @ 38964de; Webapp CI #36 PASS across all gates
- BL-TEST-001 is now `CLOSED / VERIFIED FOR ACTIVE WEB BASELINE`
- production browser/deployment smoke remains a Release Pipeline concern rather than a development-baseline blocker
- API_DATA_CONTRACT unchanged: test-coverage checkpoint only


### REL-WEBHOOK-002 Checkpoint

- issue #123 — DONE (code/release-readiness scope only)
- deployed-gateway verifier aligned with mandatory signature-negative cases @ `74d8a447`
- full HTTP integration proves missing/malformed/wrong/tampered signature cases fail closed before downstream
- PR #124 merged; Webhook Ingress CI #9 PASS
- main Webhook Ingress CI #10 PASS
- Publish Webhook Ingress Image #3 PASS
- current immutable CODE_VERIFIED candidate: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress:sha-74d8a4470905`
- digest: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress@sha256:c30c1e56e6c59b74ade44b6b0a72c65d1a9849ac2e3b3a5021d693cd4e3f8c16`
- REL-WEBHOOK-001 #68 remains RELEASE_READY / external-gate pending; no staging, LINE Console cutover or production claim is made
- API_DATA_CONTRACT unchanged; `equal_total` deprecation clock has not started


### REL-WEBHOOK-003 Checkpoint

- issue #126 — DONE (release-readiness hardening scope)
- canonical webhook security standard reconciled with runtime env/path contract @ `b1de92da`
- deployment-contract regression test added; legacy env aliases fail the canonical runtime test
- Webhook Ingress CI now triggers when the canonical security standard changes
- PR #127 merged; Webhook Ingress CI #11 PASS
- main Webhook Ingress CI #12 PASS
- Publish Webhook Ingress Image #4 PASS
- current immutable CODE_VERIFIED candidate: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress:sha-b1de92dab20f`
- digest: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress@sha256:810a321094def55a6d612dc5c166c51fad53a900230e60378f5b47f27523ba84`
- REL-WEBHOOK-001 #68 remains RELEASE_READY / CUTOVER PENDING; no staging or production claim
- API_DATA_CONTRACT unchanged; `equal_total` deprecation clock has not started


### REL-WEBHOOK-004 Checkpoint

- issue #129 — DONE (release-readiness supply-chain hardening)
- webhook base image pinned by immutable digest @ `94839c90`
- pinned base: `node:24-alpine@sha256:e67514e5d0f6c46656005e1b693b2ec9d52e80b641307de684d4a015ba7a4eaf`
- deployment-contract regression test now rejects an unpinned base image
- PR #130 merged; Webhook Ingress CI #13 PASS
- main Webhook Ingress CI #14 PASS
- Publish Webhook Ingress Image #5 PASS
- current immutable CODE_VERIFIED candidate: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress:sha-94839c90d340`
- candidate digest: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress@sha256:e7e567e14b155d8bfd093878297361e9a7baedc10108c3571e3550d1d5ef1b33`
- REL-WEBHOOK-001 #68 remains RELEASE_READY / CUTOVER PENDING; no staging or production claim
- API_DATA_CONTRACT unchanged; `equal_total` deprecation clock has not started


### REL-WEBHOOK-005 Checkpoint

- issue #132 — DONE (release-readiness transport hardening)
- `DOWNSTREAM_URL` now fails closed unless it is a clean HTTPS URL @ `4947bed7`
- plaintext HTTP, invalid URLs, embedded credentials and URL fragments are rejected at config load
- forwarding adapter retains redirect fail-closed behavior
- PR #133 merged; Webhook Ingress CI #15 PASS
- main Webhook Ingress CI #16 PASS
- Publish Webhook Ingress Image #6 PASS
- current immutable CODE_VERIFIED candidate: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress:sha-4947bed7bec3`
- candidate digest: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress@sha256:5dfcf5dfa42b9cef6b2d453b7c7924e3c871488178b1d624de7b875a76745fcb`
- pinned base remains: `node:24-alpine@sha256:e67514e5d0f6c46656005e1b693b2ec9d52e80b641307de684d4a015ba7a4eaf`
- REL-WEBHOOK-001 #68 remains RELEASE_READY / CUTOVER PENDING; no staging or production claim
- API_DATA_CONTRACT unchanged; `equal_total` deprecation clock has not started


### REL-WEBHOOK-006 Checkpoint

- issue #135 — DONE (public response boundary hardening)
- downstream/Apps Script response bodies no longer cross public `/webhook` @ `74188a7a`
- downstream bodies are cancelled/not buffered for public response construction
- successful downstream 2xx returns stable gateway-owned `{"ok":true}`
- downstream non-2xx remains fail-closed
- PR #136 merged; Webhook Ingress CI #17 PASS
- main Webhook Ingress CI #18 PASS
- Publish Webhook Ingress Image #7 PASS
- current immutable CODE_VERIFIED candidate: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress:sha-74188a7aa6cf`
- candidate digest: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress@sha256:5c59e308f4faa59b05f15ac84d987bb7eb0a2c3314ce42af571160009c87aa70`
- pinned base remains: `node:24-alpine@sha256:e67514e5d0f6c46656005e1b693b2ec9d52e80b641307de684d4a015ba7a4eaf`
- REL-WEBHOOK-001 #68 remains RELEASE_READY / CUTOVER PENDING; no staging or production claim
- API_DATA_CONTRACT unchanged; `equal_total` deprecation clock has not started


### REL-WEBHOOK-007 Checkpoint

- issue #138 — DONE (HTTP ingress body-limit correctness hardening)
- existing 1 MiB buffered body cap preserved @ `3e655d51`
- non-POST `/webhook` rejects with `405` before body collection
- declared oversized `Content-Length` rejects with `413` before buffering
- streamed overflow stops retaining bytes immediately, drains the remaining request without buffering and then returns deterministic `413`
- oversized/non-POST cases never reach signature handler or downstream adapter
- CI #19 failed on socket-reset behavior; root cause fixed rather than weakening assertions
- CI #20 exposed an invalid HTTP test fixture; fixture corrected without reducing acceptance criteria
- PR #139 merged after Webhook Ingress CI #21 PASS
- main Webhook Ingress CI #22 PASS
- Publish Webhook Ingress Image #8 PASS
- current immutable CODE_VERIFIED candidate: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress:sha-3e655d51fa99`
- candidate digest: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress@sha256:7184dac64af8e77fc5dac3cfdd0a4953523313bcafc3161571d59ed60a62c8ab`
- pinned base remains: `node:24-alpine@sha256:e67514e5d0f6c46656005e1b693b2ec9d52e80b641307de684d4a015ba7a4eaf`
- REL-WEBHOOK-001 #68 remains RELEASE_READY / CUTOVER PENDING; no staging or production claim
- API_DATA_CONTRACT unchanged; `equal_total` deprecation clock has not started


### REL-WEBHOOK-008 Checkpoint

- issue #141 — DONE (GitHub Actions supply-chain hardening)
- webhook release workflows no longer execute mutable action tags @ `c80417f4`
- `actions/checkout` pinned to `11d5960a326750d5838078e36cf38b85af677262` (`v4`)
- `actions/setup-node` pinned to `49933ea5288caeca8642d1e84afbd3f7d6820020` (`v4`)
- regression guard requires every external `uses:` in webhook CI/image workflows to use an immutable 40-hex commit SHA
- image-publish workflow changes now trigger Webhook Ingress CI on pull requests and `main`
- action upgrades require explicit source diff, review and CI evidence
- PR #142 merged after Webhook Ingress CI #23 PASS
- main Webhook Ingress CI #24 PASS
- Publish Webhook Ingress Image #9 PASS
- current immutable CODE_VERIFIED candidate: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress:sha-c80417f430c0`
- candidate digest: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress@sha256:b238c42a81fe9be020ed55d08858428d06fee80a66884631a3aea7454ab5a93a`
- pinned container base remains: `node:24-alpine@sha256:e67514e5d0f6c46656005e1b693b2ec9d52e80b641307de684d4a015ba7a4eaf`
- REL-WEBHOOK-001 #68 remains RELEASE_READY / CUTOVER PENDING; no staging or production claim
- API_DATA_CONTRACT unchanged; `equal_total` deprecation clock has not started


### REL-WEBHOOK-009 Checkpoint

- issue #144 — DONE (slow-client ingress availability hardening)
- public webhook server no longer relies on broad Node HTTP defaults @ `51075b6c`
- complete request receive timeout: 15 seconds
- complete headers timeout: 10 seconds
- incomplete-request timeout checking interval: 1 second
- keep-alive idle timeout after response: 5 seconds
- runtime regression asserts the configured `http.Server` request/header/keep-alive timeout properties
- downstream forwarding timeout remains independently controlled by `DOWNSTREAM_TIMEOUT_MS`
- PR #145 merged after Webhook Ingress CI #25 PASS
- main Webhook Ingress CI #26 PASS
- Publish Webhook Ingress Image #10 PASS
- current immutable CODE_VERIFIED candidate: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress:sha-51075b6c3ee4`
- candidate digest: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress@sha256:66939f32431c8f0825ba5a2b2599feba9bc93926d1715a23e873abbb9087ddb4`
- GitHub Actions remain pinned: checkout `11d5960a326750d5838078e36cf38b85af677262`; setup-node `49933ea5288caeca8642d1e84afbd3f7d6820020`
- pinned container base remains: `node:24-alpine@sha256:e67514e5d0f6c46656005e1b693b2ec9d52e80b641307de684d4a015ba7a4eaf`
- REL-WEBHOOK-001 #68 remains RELEASE_READY / CUTOVER PENDING; no staging or production claim
- API_DATA_CONTRACT unchanged; `equal_total` deprecation clock has not started


### REL-WEBHOOK-010 Checkpoint

- issue #147 — DONE (pre-body signature hardening)
- missing, malformed Base64 and wrong decoded-length `x-line-signature` values now reject with `401` before request-body collection @ `6dcb1b40`
- well-formed signatures are syntax-only candidates and still undergo body-dependent HMAC-SHA256 verification with `CHANNEL_SECRET`
- handler full verification remains in place as defense-in-depth
- rejected pre-body cases never reach downstream
- body-size `413` tests now use a well-formed but incorrect signature so they continue to exercise the body-limit boundary independently
- CI #27 failed because the new validator was not imported in its unit test; test wiring was corrected without weakening assertions
- PR #148 merged after Webhook Ingress CI #28 PASS
- main Webhook Ingress CI #29 PASS
- Publish Webhook Ingress Image #11 PASS
- current immutable CODE_VERIFIED candidate: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress:sha-6dcb1b405c70`
- candidate digest: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress@sha256:82757d01edc1f68911475321d0069fe38acb07eea9f72d9963ada1a6c24263c1`
- pinned container base remains: `node:24-alpine@sha256:e67514e5d0f6c46656005e1b693b2ec9d52e80b641307de684d4a015ba7a4eaf`
- REL-WEBHOOK-001 #68 remains RELEASE_READY / CUTOVER PENDING; no staging or production claim
- API_DATA_CONTRACT unchanged; `equal_total` deprecation clock has not started


### REL-WEBHOOK-011 Checkpoint

- issue #150 — DONE (downstream timeout configuration hardening)
- `DOWNSTREAM_TIMEOUT_MS` remains optional with default 8000 ms
- accepted range is integer 100–30000 ms inclusive @ `3eb75cd7`
- values below 100, above 30000, fractional values, `NaN`, and infinite values fail startup with `CONFIG_INVALID`
- forwarding adapter abort-on-timeout behavior is unchanged
- operator README and canonical webhook security standard now expose the bounded timeout contract
- PR #151 merged after Webhook Ingress CI #30 PASS
- main Webhook Ingress CI #31 PASS
- Publish Webhook Ingress Image #12 PASS
- current immutable CODE_VERIFIED candidate: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress:sha-3eb75cd7f80c`
- candidate digest: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress@sha256:f727b5f231907dff42604aa49395c40afee97778ead8a951f4e8c55bc2fc0d9d`
- pinned container base remains: `node:24-alpine@sha256:e67514e5d0f6c46656005e1b693b2ec9d52e80b641307de684d4a015ba7a4eaf`
- REL-WEBHOOK-001 #68 remains RELEASE_READY / CUTOVER PENDING; no staging or production claim
- API_DATA_CONTRACT unchanged; `equal_total` deprecation clock has not started


### REL-WEBHOOK-012 Checkpoint

- issue #153 — DONE (gateway secret-independence hardening)
- `CHANNEL_SECRET` and `DOWNSTREAM_SECRET` now fail closed if configured to the same non-empty value @ `f8e1db76`
- distinct non-empty values remain accepted
- startup error exposes only the violated `SECRET_INDEPENDENCE` invariant and never includes either secret value
- secret names and downstream transport remain unchanged
- PR #154 merged after Webhook Ingress CI #32 PASS
- main Webhook Ingress CI #33 PASS
- Publish Webhook Ingress Image #13 PASS
- current immutable CODE_VERIFIED candidate: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress:sha-f8e1db769d5f`
- candidate digest: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress@sha256:30f32c3d88b59001cdf17a9e872882d82e5923ddd651a50406fc893aa4d0cbde`
- pinned container base remains: `node:24-alpine@sha256:e67514e5d0f6c46656005e1b693b2ec9d52e80b641307de684d4a015ba7a4eaf`
- REL-WEBHOOK-001 #68 remains RELEASE_READY / CUTOVER PENDING; no staging or production claim
- API_DATA_CONTRACT unchanged; `equal_total` deprecation clock has not started


### REL-WEBHOOK-013 Checkpoint

- issue #156 — DONE (native Node 24 release-action upgrade)
- reviewed upstream `actions/checkout` latest release v7.0.1 and pinned commit `3d3c42e5aac5ba805825da76410c181273ba90b1`
- reviewed upstream `actions/setup-node` latest release v7.0.0 and pinned commit `820762786026740c76f36085b0efc47a31fe5020`
- both reviewed upstream `action.yml` manifests declare `runs.using: node24`
- webhook CI and image workflows retain immutable 40-hex action pins with human-readable version comments
- regression guard prevents the previous Node 20-targeting v4 commits from returning
- PR #157 merged after Webhook Ingress CI #34 PASS
- main Webhook Ingress CI #35 PASS using the new exact pins
- main CI log review found no Node 20 deprecation warning
- Publish Webhook Ingress Image #14 PASS
- current immutable CODE_VERIFIED candidate: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress:sha-352fc705612c`
- candidate digest: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress@sha256:22ca6733eea5d1747bd2ecf52a5dbc060e173d1281ba5ef85f340e0d1fb99f8e`
- REL-WEBHOOK-001 #68 remains RELEASE_READY / CUTOVER PENDING; no staging or production claim
- API_DATA_CONTRACT unchanged; `equal_total` deprecation clock has not started


### Apps Script Deployment Sync Gate

- backend coding baseline is complete at `MTLineCoopBot@c7df357d29b37f6c74e0203cea850190087fd122`; backend CI #199 PASS
- this does **not** prove the deployed Google Apps Script Web App is running that commit
- backend repository has no build/bundle phase; `.clasp.json` uses `rootDir: app` and Apps Script runs V8 source directly
- before real-environment verification, operator must checkout canonical backend `main`, verify HEAD, run `clasp push`, then create/update the Web App deployment version
- record Apps Script deployment/version ID and deployed source commit as release evidence
- status: **CODE COMPLETE / DEPLOYMENT SYNC REQUIRED / THEN READY FOR STAGING VERIFICATION**
- do not spend time on LINE live testing before this sync gate passes
