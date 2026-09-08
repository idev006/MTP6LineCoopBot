# REDESIGN_MIGRATION_LEDGER

Status: ACTIVE  
Authority: ADR-0003 + TARGET_SYSTEM_ARCHITECTURE.md

## Purpose

ตารางนี้ใช้ติดตามการย้าย legacy implementation → target modular architecture โดยไม่ให้เกิด silent drift หรือรีบลบของเดิมก่อนมี evidence

| Capability | Legacy source | Target | Current state | Evidence | Legacy retirement gate |
|---|---|---|---|---|---|
| Member validity | Core.MemberRules + repo policy helpers | MemberAccessEngine | MIGRATED primary API/LINE paths | backend 9a589db, CI #46 | no remaining production consumer of repo policy helpers |
| Repository contract | Data.MemberRepository mixed contract/factory | MemberRepositoryPort + composition | PARTIAL | f06dfb5, CI #41; InMemoryMemberRepository @ 255d862, CI #60 PASS | production/test adapters pass reusable contract suite; continue legacy factory extraction |
| Clock/time | new Date() in multiple flows | ClockPort | PARTIAL | de7fc1f, CI #43 | all time-sensitive engines inject clock |
| Identity | client lineUserId/API key context | Principal + IdentityPort | FOUNDATION | a2253eb, CI #48 | protected delivery paths use verified identity adapter |
| Authorization | distributed role/member checks | AuthorizationEngine | FOUNDATION | a2253eb, CI #48 | protected use cases own policy; UI/adapter checks non-authoritative |
| Member profile | ApiHandlers direct repository lookup | GetCurrentMemberProfileUseCase | PARTIAL | backend 060fe63, CI #51 PASS | protected API/LINE delivery switch to verified Principal |
| Member activation | ApiHandlers + ActivationService | MemberActivationEngine + ActivateMemberUseCase | MIGRATED PRIMARY PATH | backend 91bd7cb, CI #63 PASS | retire legacy activateMember persistence-policy compatibility after no callers remain |
| Member renewal | legacy ApiHandlers/RenewalService | Principal-based RenewMemberUseCase + protected self-renew | MIGRATED PRIMARY SELF-SERVICE | backend 4dd0391, CI #65 PASS | migrate/retire legacy lineUserId renewal path after caller audit |
| Expiry | ExpiryService orchestration | ExpiryScanUseCase + MessagingPort + MemberMenuPort | MIGRATED PRIMARY RUNTIME | foundation b0194b5 CI #70; runtime switch 5489622 CI #72 | retire legacy opts compatibility path after reference audit |
| Notice | NoticeService orchestration | NoticeBroadcastUseCase + MessagingPort | MIGRATED PRIMARY RUNTIME | foundation b0194b5 CI #70; runtime switch 5489622 CI #72 | retire legacy opts compatibility path after reference audit |
| Loan reminder | LoanReminderService orchestration | LoanReminderUseCase + MessagingPort + AuditPort | MIGRATED PRIMARY RUNTIME | foundation b0194b5 CI #70; runtime switch 5489622 CI #72 | retire legacy opts compatibility path after reference audit |
| Loan calculation | duplicated backend/frontend static formulas | Core.LoanCalculator + CalculateLoanUseCase + public API | MIGRATED / CANONICAL | backend 45582b4 CI #74; frontend 0de0c0e UI CI #1; legacy backend UI retired daffda7 CI #76 | retain architecture guards; remove legacy equal_total alias after compatibility window |
| LIFF identity | client lineUserId | Line ID Token Identity Adapter | MIGRATED (member self-service) | backend verifier @ 865569b + LIFF switch @ d3deac7; LIFF CI #5 PASS | retire remaining legacy protected lineUserId paths after reference audit |
| Web auth | fail-open/client-only session | Web Session Identity Adapter + opaque server session | MIGRATED AUTH BOUNDARY | backend 1406a00f CI #81; LINE exchange fe332fde CI #85; Web client 97dc634e CI #8 | protected writes/admin operations remain under SEC-WEB-003 |
| Web frontend | direct fetches + client API key/mock fallbacks | shared session-authorized API clients + presentation-only UI | PARTIAL / MEMBER + SETTINGS + AUDIT + REPORT READS MIGRATED | member d78a1bc/07ca08e; settings 3ea0171/60b4d35; audit 82cf8ee/481b175; reports 820bd14/dbb1df2 with CI PASS | migrate protected writes/admin capabilities; remove remaining legacy client trust |
| Audit logging | mixed direct logs/sheets | AuditPort + adapter | PARTIAL | AuditPort + repository/in-memory adapters @ 58ee3d9, CI #67 PASS; activation/renewal migrated | migrate scheduled/admin critical writes through AuditPort |
| Config | Config.get globals | ConfigPort | PARTIAL | ConfigPort + AppsScriptConfigAdapter @ 58ee3d9, CI #67 PASS; SystemFactory wired | migrate remaining direct global config reads incrementally |

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
