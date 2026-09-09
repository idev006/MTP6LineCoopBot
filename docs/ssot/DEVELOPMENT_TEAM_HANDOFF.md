# DEVELOPMENT_TEAM_HANDOFF

Status: ACTIVE — AUTHORIZED TO EXECUTE  
Last refreshed: 2026-09-09

## Directive

ทีมพัฒนาระบบให้ดำเนินการต่อจาก `main` ล่าสุดของทั้งสอง repository โดยยึด GitHub + `docs/ssot` เป็น SSOT

ห้ามใช้ queue เก่าจากเอกสารหรือบทสนทนาก่อนหน้าโดยไม่ตรวจ GitHub เพราะงานจำนวนมากถูก merge โดยทีม/branch คู่ขนานแล้ว

## Current Main Anchors

- MTP6LineCoopBot: `240a3ccf6c`
- MTLineCoopBot: `9019873a44`

These are observation anchors for this handoff, not permanent pins. Always fetch newer main first.

## Current Highest-Priority Work

`REL-WEBHOOK-001` — MTP6LineCoopBot #68

State: RELEASE_READY

Objective:
Deploy/cut over verified LINE webhook ingress and collect staging/production evidence.

Canonical runbook:
`docs/ssot/runbooks/WEBHOOK_INGRESS_DEPLOYMENT_RUNBOOK.md`

Canonical immutable release image:
`ghcr.io/idev006/mtp6linecoopbot-webhook-ingress@sha256:d9fd9fd3e304d9f99b9c720c63fe1492d54fcc0310a86457882cc15c331d7c17`

## Already Completed — Do Not Reimplement

- SEC-LIFF-001
- SEC-WEB-002
- SEC-WEB-003
- SEC-WEB-004
- SEC-LEGACY-001 member identity path retirement
- CORE-FIN-001
- APP-SCHEDULED-001
- APP-MEMBER-001 / APP-MEMBER-002
- ARCH-DATA-001 / ARCH-PORTS-002
- UI-DEPS-001
- SEC-WEBHOOK-001 code scope

Review current main/traceability if any of these appear to need changes.

## Mandatory Behavior

- read GitHub first
- avoid duplicate implementation
- Engine/Application/Port/Adapter boundaries
- fail closed
- server-authoritative identity/RBAC/business rules
- automated tests before/with refactor
- small coherent commits
- push frequently
- PR + CI before merge
- no merge on CI failure
- root-cause fixes only
- update SSOT evidence after every merged checkpoint
- production claims require deployment evidence

## Current Verification Snapshot

MTP6LineCoopBot:
- Webapp CI #30 PASS @ 240a3ccf6c
- LIFF CI #14 PASS @ 240a3ccf6c
- Loan Calculator CI #4 PASS @ 240a3ccf6c
- Pages deployment #74 PASS @ 240a3ccf6c
- Webhook Ingress CI #8 PASS @ da9ce4a179
- image publish #2 PASS @ da9ce4a179

MTLineCoopBot:
- backend CI #136 PASS @ 9019873a44

## Next Handoff Rule

ก่อนเริ่มแชต/รอบใหม่ ให้:
1. fetch main ทั้งสอง repo
2. inspect open PRs/issues
3. read AGILE_KANBAN
4. read latest DEVELOPMENT_HANDOFF_CHECKPOINT
5. continue highest-priority READY/RELEASE_READY card
