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
1. Protected Web write/admin operations (SEC-WEB-003)
2. remaining legacy client identity/API-key trust retirement audit
3. server-side RBAC for reports/settings/audit/admin capabilities

P1:
4. Web admin completion
5. controlled frontend dependency refresh
6. remaining legacy compatibility retirement

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

1. `SEC-WEB-003` — MTP6LineCoopBot #37  
   Protect Web write and admin operations

2. `UI-DEPS-001` — MTP6LineCoopBot #26  
   Controlled latest-stable frontend dependency refresh

### BACKLOG

- Web admin completion / RBAC workflows
- remaining legacy lineUserId retirement audit
- release/staging/UAT hardening

### DONE

- `SEC-WEB-002` — MTP6LineCoopBot #16 — DONE; server session 1406a00f CI #81, LINE exchange fe332fde CI #85, Web client auth 97dc634e CI #8, member RBAC d78a1bc CI #87, client member migration 07ca08e CI #11 PASS
- `CORE-FIN-001` — MTLineCoopBot #14 — DONE; backend authority @ 45582b4 CI #74, frontend @ 0de0c0e UI CI #1, duplicate retirement @ daffda7 CI #76 PASS
- `APP-SCHEDULED-001` — MTLineCoopBot #13 — DONE @ 5489622; foundation CI #70 + runtime CI #72 PASS

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
- Reports read — IN_PROGRESS
- Protected Web writes/admin operations — PENDING
