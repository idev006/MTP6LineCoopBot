# REDESIGN_MIGRATION_LEDGER

Status: ACTIVE  
Authority: ADR-0003 + TARGET_SYSTEM_ARCHITECTURE.md

## Purpose

ตารางนี้ใช้ติดตามการย้าย legacy implementation → target modular architecture โดยไม่ให้เกิด silent drift หรือรีบลบของเดิมก่อนมี evidence

| Capability | Legacy source | Target | Current state | Evidence | Legacy retirement gate |
|---|---|---|---|---|---|
| Member validity | Core.MemberRules + repo policy helpers | MemberAccessEngine | MIGRATED / LEGACY REPOSITORY POLICY HELPERS RETIRED | backend 9a589db CI #46; policy-helper retirement c8491f7 CI #156 PASS | retain MemberAccessEngine/Core/Clock authority and architecture regression guard |
| Repository contract | Data.MemberRepository mixed contract/factory + legacy policy-bearing activation operation | MemberRepositoryPort + composition | MIGRATED / LEGACY FACTORY + POLICY HELPERS + ACTIVATION POLICY SEAM RETIRED | f06dfb5 CI #41; InMemoryMemberRepository @ 255d862 CI #60 PASS; factory retirement @ 582b73c CI #154 PASS; policy-helper retirement @ c8491f7 CI #156 PASS; activation policy seam retirement @ 8a3e55a CI #164 PASS | keep reusable adapter contracts, deterministic saveActivation persistence, and persistence-only architecture guards |
| Clock/time | new Date() in multiple flows | ClockPort | PARTIAL / DELIVERY + REPOSITORY ACTIVATION + DURABLE AUDIT TIMESTAMP WALL-CLOCK RETIRED | de7fc1f CI #43; delivery wiring d338068 CI #158 PASS; activation policy seam retirement 8a3e55a CI #164 PASS; audit timestamp authority 4073c78 CI #169 PASS | keep ClockPort in engines/application; continue auditing remaining non-policy date construction and identifier generation separately |
| Identity | client lineUserId/API key context | Principal + IdentityPort | FOUNDATION | a2253eb, CI #48 | protected delivery paths use verified identity adapter |
| Authorization | distributed role/member checks | AuthorizationEngine | FOUNDATION | a2253eb, CI #48 | protected use cases own policy; UI/adapter checks non-authoritative |
| Member profile | ApiHandlers direct repository lookup | GetCurrentMemberProfileUseCase | PARTIAL | backend 060fe63, CI #51 PASS | protected API/LINE delivery switch to verified Principal |
| Member activation | client-lineUserId / ActivationService direct binding | verified LINE subject + secure self-activation + ActivateMemberUseCase | RETIRED LEGACY / MIGRATED | secure backend 3f052961; LIFF e174e625; chat handoff 09dbfc88; legacy retirement cc70d58b CI #126 PASS | keep retirement guard; no legacy activation route/service reintroduction |
| Member renewal | client/webhook lineUserId + RenewalService + /api/member/renew | Principal-based RenewMemberUseCase + verified LIFF self-renew | RETIRED LEGACY / MIGRATED | canonical backend 4dd0391 CI #65; LIFF aade6512 CI #11; chat handoff 4979d9b0 CI #129; legacy retirement 787c79a8 CI #131 | keep retirement guard; no legacy renewal route/service reintroduction |
| Expiry | ExpiryService orchestration / opts compatibility shell | ExpiryScanUseCase + MessagingPort + MemberMenuPort | RETIRED LEGACY / MIGRATED | foundation b0194b5 CI #70; runtime switch 5489622 CI #72; shell retirement dc1a04e CI #148 | keep thin-adapter retirement guard; no duplicate scheduled orchestration |
| Notice | NoticeService orchestration / opts compatibility shell | NoticeBroadcastUseCase + MessagingPort | RETIRED LEGACY / MIGRATED | foundation b0194b5 CI #70; runtime switch 5489622 CI #72; shell retirement dc1a04e CI #148 | keep thin-adapter retirement guard; no duplicate scheduled orchestration |
| Loan reminder | LoanReminderService orchestration / opts compatibility shell | LoanReminderUseCase + MessagingPort + AuditPort | RETIRED LEGACY / MIGRATED | foundation b0194b5 CI #70; runtime switch 5489622 CI #72; shell retirement dc1a04e CI #148 | keep thin-adapter retirement guard; no duplicate scheduled orchestration |
| Loan calculation | duplicated backend/frontend static formulas | Core.LoanCalculator + CalculateLoanUseCase + public API | MIGRATED / CANONICAL; LEGACY ALIAS DEPRECATED | backend 45582b4 CI #74; frontend 0de0c0e UI CI #1; legacy backend UI retired daffda7 CI #76; ADR-0006 / API-COMPAT-001 #81 | retain architecture guards; keep equal_total input alias until 60 days after first production-verified ADR-0006 cutover, then re-audit callers + production evidence before retirement |
| LIFF identity | client lineUserId | Line ID Token Identity Adapter | MIGRATED / LEGACY MEMBER IDENTITY PATHS RETIRED | verifier @ 865569b; LIFF switch @ d3deac7; activation @ 3f052961/e174e625; renewal caller @ aade6512; legacy activation/renewal retired @ cc70d58b/787c79a8 | retain verified-identity and retirement guards |
| Web auth | fail-open/client-only session | Web Session Identity Adapter + opaque server session | MIGRATED AUTH BOUNDARY | backend 1406a00f CI #81; LINE exchange fe332fde CI #85; Web client 97dc634e CI #8 | protected routes remain server-session authoritative; retain auth regression guards |
| Web API authentication compatibility | query/body `api_key` + `Config.API_KEY` fallback in Apps Script Web mount | explicit public routes + route-owned `line-id-token` / `web-session` authentication | RETIRED | backend dec540ef; CI #146 PASS | keep API-key retirement CI guard; no browser shared-secret authentication reintroduction |
| Web frontend | direct fetches + client API key/mock fallbacks | shared session-authorized API clients + presentation-only UI | PARTIAL / MEMBER + SETTINGS + AUDIT + REPORT READS MIGRATED | member d78a1bc/07ca08e; settings 3ea0171/60b4d35; audit 82cf8ee/481b175; reports 820bd14/dbb1df2 with CI PASS | migrate protected writes/admin capabilities; remove remaining legacy client trust |
| Audit logging | mixed direct logs/sheets + persistence timestamp fallback | AuditPort + adapter | PARTIAL / CRITICAL TIMESTAMP AUTHORITY MIGRATED | AuditPort + repository/in-memory adapters @ 58ee3d9 CI #67 PASS; activation/renewal migrated; durable timestamp authority @ 4073c78 CI #169 PASS | keep application-owned ClockPort timestamps and audit-first/fail-closed guards; continue retiring remaining direct audit persistence where applicable |
| Config | Config.get/validate globals | ConfigPort | PARTIAL / DELIVERY + RICHMENU + SCHEDULED TRIGGER GLOBALS RETIRED | ConfigPort + AppsScriptConfigAdapter @ 58ee3d9 CI #67 PASS; delivery wiring d338068 CI #158 PASS; RichMenu validated wiring b5a8d36 CI #160 PASS; scheduled trigger wiring d62da78 CI #162 PASS | keep SystemFactory ConfigPort authority; continue auditing remaining direct config globals outside verified sub-scopes |

## Migration State Vocabulary

- PLANNED
- FOUNDATION
- IN PR
- PARTIAL
- MIGRATED
- BLOCKED
- RETIRE_READY
- RETIRED

## Retirement Rule

Legacy implementation จะถูกลบเมื่อ:
1. target implementation มี contract
2. automated tests ผ่าน
3. production caller ถูก switch ครบ
4. no remaining references ที่จำเป็น
5. rollback/migration impact ตรวจแล้ว
6. traceability/evidence อัปเดต
7. PR review ผ่าน

ห้ามลบ legacy เพียงเพราะ target code ถูกสร้างแล้ว


| Web staff renewal | legacy/disabled client renewal path | RenewMemberByStaffUseCase + protected Web session write | MIGRATED | backend 5fd6d28 CI #98; frontend 3d6f04e CI #19 | keep activation/binding separate; retire legacy web renewal callers after reference audit |


| Web admin staff | placeholder/no server authority | admin-only Staff Accounts read + sanitized UI | STAFF READ MIGRATED | backend 715318a CI #106; frontend 4b2987b Webapp CI #21 | role catalog + protected staff role/write flows remain |


| Web admin role catalog | placeholder/hardcoded UI taxonomy | Security.RoleCatalog + admin-only role catalog API | ROLE CATALOG MIGRATED | backend 1f8ec59 CI #108; frontend 3051119 Webapp CI #23 | protected role assignment write + audit remain |


| Web admin staff role assignment | placeholder/no protected role write | AssignStaffRoleUseCase + StaffAdminRepositoryPort + privileged audit store | MIGRATED | backend 841b37a CI #110; frontend 96e77a5 Webapp CI #25 | activation/identity binding remains separate under SEC-WEB-004; audit remaining legacy role callers before retirement |


| Legacy member identity-sensitive routes | client/API-key lineUserId reads/activation/renewal | verified Principal + application use cases | RETIRED | reads 95d4f66 CI #115; activation cc70d58b CI #126; renewal 787c79a8 CI #131 | keep retirement guards; audit any future compatibility endpoint before adding |


| LINE webhook ingress | direct LINE → Apps Script + downstream shared secret only | Verified Node ingress → signature verification → Apps Script downstream gate | CODE_VERIFIED / CUTOVER PENDING | gateway 110de3e CI #1; Apps Script privacy 9019873 CI #135 | deploy staging/prod gateway, LINE Console cutover, then retire direct ingress as supported production path |
