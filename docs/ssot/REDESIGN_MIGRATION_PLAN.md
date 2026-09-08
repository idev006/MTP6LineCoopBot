# REDESIGN_MIGRATION_PLAN

Status: PROPOSED  
Target: migrate legacy backend/frontend to TARGET_SYSTEM_ARCHITECTURE incrementally

## Wave 0 — Architecture Foundation

Completed/partial:
- Composition.SystemFactory
- MemberRepositoryPort
- ClockPort
- MemberAccessEngine
- CI architecture/contract tests

Remaining:
- Principal model
- IdentityPort
- AuthorizationEngine
- ConfigPort
- AuditPort
- InMemoryMemberRepository

## Wave 1 — Security Boundary

1. Introduce Principal
2. IdentityPort contract
3. FakeIdentityAdapter
4. AuthorizationEngine
5. API adapter accepts verified principal only for protected use cases
6. LIFF identity verification adapter
7. Web session identity adapter
8. remove client-id-as-authentication behavior
9. fail-closed frontend auth

Exit:
- no protected capability trusts query/body lineUserId as authentication proof
- full auth tests headless

## Wave 2 — Member Application Use Cases

Extract:
- GetMemberProfile
- GetMemberFinance
- CheckMemberAccess
- ActivateMember
- RenewMember

LINE/API become thin delivery adapters.

Exit:
- member business orchestration independent from LINE/API
- InMemory repository integration suite

## Wave 3 — Scheduled Engines

Extract:
- ExpiryScan
- NoticeBroadcast
- LoanReminder

Separate policy vs messaging vs persistence.

## Wave 4 — UI/Frontend Cleanup

- shared API client
- remove production mock fallbacks
- route ReportView
- Vue unit tests
- Playwright critical flows
- UI only presentation/state

## Wave 5 — Financial Formula Authority

- make backend LoanCalculationEngine canonical
- frontend calculator calls engine/API or generated shared contract
- remove duplicate formula implementation
- property tests

## Wave 6 — Legacy Retirement

- remove repository policy methods
- shrink EventHandler
- remove obsolete static/global wiring
- retire duplicate docs
- update migration ledger

## Migration Safety

Every wave:
1. characterize current behavior
2. add/extend automated tests
3. small PR
4. CI PASS
5. merge
6. sync SSOT evidence
7. no unresolved regression
