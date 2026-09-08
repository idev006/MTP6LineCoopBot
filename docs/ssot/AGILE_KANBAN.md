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
1. LIFF protected data migration to raw ID token
2. verified Principal across member self-service
3. remove legacy client identity trust
4. Web server-session boundary

P1:
5. ActivateMember use case
6. RenewMember use case
7. InMemoryMemberRepository
8. AuditPort/ConfigPort

P2:
9. Scheduled engines
10. Web admin completion
11. Loan calculation canonicalization

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
