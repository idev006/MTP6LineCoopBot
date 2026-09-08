# DEVELOPMENT_TEAM_HANDOFF

Status: ACTIVE — AUTHORIZED TO EXECUTE

## Directive

ทีมพัฒนาระบบได้รับคำสั่งให้ดำเนินการตาม Project SSOT โดยใช้ Agile Kanban และ Automated Test Gates

## Must Read Before Work

1. PROJECT_CHARTER.md
2. TARGET_SYSTEM_ARCHITECTURE.md
3. ENGINE_ARCHITECTURE_STANDARD.md
4. API_DATA_CONTRACT.md
5. TEST_STRATEGY.md
6. TEST_SUITE_CATALOG.md
7. AGILE_KANBAN.md
8. REDESIGN_MIGRATION_PLAN.md
9. REDESIGN_MIGRATION_LEDGER.md
10. TRACEABILITY_MATRIX.md
11. RELEASE_GATES.md

## Mandatory Development Behavior

- Engine-first
- UI as adapter
- explicit ports/contracts
- explicit composition
- full automated test by default
- fail-closed security
- small coherent commits
- push frequently
- PR + CI before merge
- update SSOT evidence after every merged checkpoint

## Team Roles

Engineering:
- implement/refactor
- maintain contracts
- no silent architecture drift

Testing:
- automate acceptance/negative tests
- regression protection
- reject flaky tests

Security/Audit:
- verify Principal/authz/data boundary
- evidence-driven status
- reject unverified completion

Project/Process:
- enforce WIP
- unblock dependencies
- maintain Kanban and migration ledger

## First Development Queue

1. Switch LIFF profile/savings/loans/dividends to raw ID token protected endpoints
2. Add LIFF identity contract tests
3. Remove protected client lineUserId calls
4. Add InMemoryMemberRepository
5. Extract ActivateMember application use case
6. Extract RenewMember application use case
7. Introduce AuditPort + ConfigPort
8. Begin server-side Web session Principal
