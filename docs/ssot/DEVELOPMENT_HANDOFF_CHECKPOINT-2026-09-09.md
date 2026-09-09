# DEVELOPMENT_HANDOFF_CHECKPOINT — 2026-09-09

Status: ACTIVE — READY FOR NEXT CHAT / DEVELOPMENT CONTINUATION

## Source of Truth

Repositories:
1. `idev006/MTP6LineCoopBot` — Web/LIFF/UI + authoritative `docs/ssot`
2. `idev006/MTLineCoopBot` — Apps Script backend

Always read both `main` branches before implementation because parallel branches/teams may have merged newer work.

## Current Main Baselines

### MTP6LineCoopBot
Current main observed: `240a3ccf6c` — `release(config): make Web and LIFF runtime configuration deployable`

Recent verified main workflows:
- Webapp CI #30 — PASS
- LIFF CI #14 — PASS
- Loan Calculator CI #4 — PASS
- GitHub Pages build/deploy #74 — PASS

Webhook release candidate evidence:
- source commit: `da9ce4a179db5bff8790daa25a834da00cf7601e`
- image: `ghcr.io/idev006/mtp6linecoopbot-webhook-ingress:sha-da9ce4a179db`
- digest: `sha256:d9fd9fd3e304d9f99b9c720c63fe1492d54fcc0310a86457882cc15c331d7c17`
- Webhook Ingress CI #8 — PASS
- Publish Webhook Ingress Image #2 — PASS

### MTLineCoopBot
Current main observed: `9019873a44` — `security(webhook): remove raw webhook body logging`

Recent verified backend CI:
- CI #136 — PASS @ `9019873a44`
- CI #132 — PASS @ `787c79a841`
- CI #130 — PASS @ `4979d9b0fc`
- CI #127 — PASS @ `cc70d58bf3`

## Completed Major Security / Architecture Work

Verified and merged:
- LIFF raw ID-token member self-service
- server-verified Web session + expiry/revocation
- Web member reads with server RBAC
- Web admin settings/audit/reports
- protected Web renewal write
- staff read / role catalog / audited role assignment
- secure LINE self-activation
- legacy client-lineUserId member read/activation/renewal routes retired
- chat activation/renewal handoff to verified LIFF flows
- canonical LoanCalculationEngine/API authority
- scheduled Application Layer migration
- webhook raw-body logging removal
- verified LINE webhook ingress gateway code + image

Do not recreate these capabilities. Audit current main and reuse them.

## Current Release-Ready Queue

### REL-WEBHOOK-001 — Issue #68
State: RELEASE_READY / OPEN

Goal:
Promote verified webhook ingress from CODE_VERIFIED to PRODUCTION_VERIFIED.

Required gates:
1. deploy immutable gateway image to staging
2. configure `CHANNEL_SECRET`
3. configure independent `DOWNSTREAM_SECRET`
4. configure Apps Script `WEBHOOK_SECRET`
5. prove invalid/missing/tampered signatures never reach Apps Script
6. prove valid signed webhook forwards exact raw body
7. verify no raw body/secret logging
8. record rollback revision
9. deploy production gateway
10. change LINE Developers webhook URL to gateway `/webhook`
11. run LINE Developers Console Verify
12. controlled message/postback smoke tests
13. monitor error/redelivery/telemetry
14. record production evidence in SSOT

Runbook:
`docs/ssot/runbooks/WEBHOOK_INGRESS_DEPLOYMENT_RUNBOOK.md`

Repeatable verifier:
`npm run verify:deployment`

Important:
Direct LINE → Apps Script is not approved after cutover.

## Current Priority After Webhook Cutover

P0:
1. REL-WEBHOOK-001 staging/production verification
2. production verification blockers / release evidence
3. remaining legacy compatibility/security retirement audit

P1:
4. Web admin completion where capability gaps remain
5. legacy compatibility cleanup supported by caller/reference audit
6. deployment/runtime configuration hardening

P2:
7. UAT/release hardening
8. operational monitoring and production verification

## Mandatory Development Pipeline

Every work item:

```text
Requirement / SSOT
→ Analysis Ready
→ Architecture Ready
→ Test Design
→ Development
→ Self Review
→ Code Review
→ Automated CI
→ Security / QA
→ Audit / Traceability
→ Merge
→ SSOT Evidence Sync
→ DONE
```

Rules:
- small coherent commits
- push frequently
- PR before merge
- never merge red CI
- fix root cause; do not weaken assertions/bypass gates
- no duplicate implementation if newer branch/PR/main already contains the capability
- CODE_PRESENT ≠ CI_VERIFIED ≠ PRODUCTION_VERIFIED

## Mandatory Reading for New Chat

1. `docs/ssot/README.md`
2. `docs/ssot/AGILE_KANBAN.md`
3. `docs/ssot/DEVELOPMENT_EXECUTION_PLAN.md`
4. `docs/ssot/process/TEAM_DEVELOPMENT_PIPELINE.md`
5. `docs/ssot/process/CI_PIPELINE_STANDARD.md`
6. `docs/ssot/process/RELEASE_DEPLOYMENT_PIPELINE.md`
7. `docs/ssot/TRACEABILITY_MATRIX.md`
8. `docs/ssot/REDESIGN_MIGRATION_LEDGER.md`
9. `docs/ssot/RELEASE_GATES.md`
10. `docs/ssot/runbooks/WEBHOOK_INGRESS_DEPLOYMENT_RUNBOOK.md`
11. Issue #68

## First Action in New Chat

1. fetch latest `main` of both repositories
2. inspect open PRs/issues/branches
3. inspect REL-WEBHOOK-001 #68
4. do not repeat completed implementation
5. proceed with release/staging verification if provider access is available
6. otherwise advance only tasks that can be verified in repo/CI and record the external deployment blocker explicitly

## Working Agreement

The development team is authorized to proceed autonomously within approved SSOT and pipeline standards.

Escalate only material scope/security architecture/breaking contract/irreversible production decisions that are not already governed by accepted ADR/SSOT.
