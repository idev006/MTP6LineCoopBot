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

1. `UI-DEPS-001` — MTP6LineCoopBot #26  
   Controlled latest-stable frontend dependency refresh

### BACKLOG

- Web admin completion / RBAC workflows
- remaining legacy lineUserId retirement audit
- release/staging/UAT hardening

### DONE

- `SEC-LEGACY-001` — MTP6LineCoopBot #56 — DONE; reads @ 95d4f66 CI #115, activation @ cc70d58b CI #126, LIFF renew @ aade6512 CI #11, chat renewal @ 4979d9b0 CI #129, legacy renewal retirement @ 787c79a8 CI #131
- `SEC-WEB-004` — MTP6LineCoopBot #46 — DONE; secure backend @ 3f052961, LIFF caller @ e174e625, chat handoff @ 09dbfc88, legacy activation retirement @ cc70d58b CI #126 PASS
- `SEC-WEB-003` — MTP6LineCoopBot #37 — DONE; settings 3ea0171/60b4d35, audit 82cf8ee/481b175, reports 820bd14/dbb1df2, renewal 5fd6d28/3d6f04e, staff read 715318a/4b2987b, role catalog 1f8ec59/3051119, audited role assignment 841b37a/96e77a5 — all recorded CI PASS
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
- Reports read — DONE: backend @ 820bd14 CI #96; frontend @ dbb1df2 Webapp CI #17
- Protected Web writes/admin operations — IN_PROGRESS


### SEC-WEB-003 Protected Write Checkpoints

- Protected Web renewal write — DONE: backend @ 5fd6d28 CI #98; frontend @ 3d6f04e Webapp CI #19
- Activation / identity binding — SPLIT TO CONTROLLED FOLLOW-UP
- Staff/Role admin capabilities — IN_PROGRESS


### Authorization Consistency

- Role vocabulary consistency — DONE: canonical `member|staff|manager|admin`; backend @ a8beda3 CI #100 PASS


### SEC-WEB-003 Admin Capability Checkpoints

- Staff Management read — DONE: backend @ 715318a CI #106; frontend @ 4b2987b Webapp CI #21
- Role Catalog read — DONE: backend @ 1f8ec59 CI #108; frontend @ 3051119 Webapp CI #23
- Staff role assignment/write — DONE: backend @ 841b37a CI #110; frontend @ 96e77a5 Webapp CI #25


### SEC-LEGACY-001 Checkpoints

- Production Web/LIFF caller audit — DONE for legacy member reads
- Internal LINE EventHandler caller migration — DONE @ 95d4f66
- Legacy GET profile/savings/loans/dividends/validity retirement — DONE @ 95d4f66 CI #115
- Legacy activation compatibility — DONE / RETIRED @ cc70d58b CI #126
- Legacy renewal compatibility — DONE / RETIRED @ 787c79a8 CI #131
