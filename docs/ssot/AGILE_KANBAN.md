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


## Live Execution Board — 2026-09-08

### READY — WIP intake (3)

1. `APP-MEMBER-001` — MTLineCoopBot #10  
   Extract ActivateMember application use case

### BACKLOG

- `UI-DEPS-001` — MTP6LineCoopBot #26 — controlled latest-stable Vue/Router/Pinia/Tailwind/daisyUI/Vite refresh
- `APP-MEMBER-002` — MTLineCoopBot #11 — RenewMember use case
- `ARCH-PORTS-002` — MTLineCoopBot #12 — AuditPort + ConfigPort
- `APP-SCHEDULED-001` — MTLineCoopBot #13 — expiry/notice/reminder engines
- `CORE-FIN-001` — MTLineCoopBot #14 — canonical LoanCalculationEngine
- `SEC-WEB-002` — MTP6LineCoopBot #16 — server-verified Web Session Principal

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


### DONE

- `SEC-LIFF-001` — MTP6LineCoopBot #15 — DONE @ d3deac7; LIFF CI #5 PASS

- `ARCH-DATA-001` — MTLineCoopBot #9 — DONE @ 255d862; backend CI #60 PASS
