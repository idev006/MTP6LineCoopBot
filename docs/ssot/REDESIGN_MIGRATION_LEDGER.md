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
| Member renewal | ApiHandlers + RenewalService | RenewMember use case/engine | PLANNED | - | deterministic clock + regression parity |
| Expiry | ExpiryService | ExpiryScan application/engine | PLANNED | - | scheduled adapter thin + fake messaging/repo tests |
| Notice | NoticeService | PublishNotice/Broadcast use case | PLANNED | - | messaging/audit ports + contract tests |
| Loan reminder | LoanReminderService | LoanReminder use case/engine | PLANNED | - | scheduled adapter thin |
| Loan calculation | Core + standalone UI formula | canonical LoanCalculationEngine | BLOCKED DUPLICATION | BL-ARCH-001 | one formula authority + property tests |
| LIFF identity | client lineUserId | Line ID Token Identity Adapter | MIGRATED (member self-service) | backend verifier @ 865569b + LIFF switch @ d3deac7; LIFF CI #5 PASS | retire remaining legacy protected lineUserId paths after reference audit |
| Web auth | fail-open mock admin | Web Session Identity Adapter | PARTIAL | fail-open closed @ e1a54aa; Webapp CI #3 PASS | server-verified session/Principal adapter + expiry/revocation tests |
| Web frontend | component/store direct fetches | shared API client + presentation-only UI | PLANNED | - | unit/E2E gates |
| Audit logging | mixed direct logs/sheets | AuditPort + adapter | PLANNED | - | critical writes audit through port |
| Config | Config.get globals | ConfigPort | PLANNED | - | engines/use cases no global config reads |

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
