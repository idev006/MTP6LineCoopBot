# RELEASE_GATES

สถานะ: PROPOSED

## Gate G0 — Requirement Ready
- Requirement ID
- Acceptance criteria
- Security/data impact
- Test mapping
- ADR ถ้าจำเป็น

## Gate G1 — Code Review Ready
- implementation complete
- no production mock fallback
- static checks pass
- unit/contract tests pass
- docs synchronized

## Gate G2 — Integration Ready
- integration tests pass
- negative paths pass
- auth/role checks verified
- no unresolved Critical/High finding for change

## Gate G3 — Staging Ready
- staging deployment identified
- test data controlled
- smoke + E2E pass
- migration/rollback tested if applicable

## Gate G4 — Production Approval
- UAT accepted
- security review passed
- backup/restore considerations complete
- release notes
- rollback plan
- approved change record

## Gate G5 — Production Verified
- deploy successful
- safe smoke test passed
- monitoring/log review clean
- release tag/commit recorded
- traceability updated

## Project Closure Gate
- approved scope complete
- final audit passed
- unresolved findings accepted or closed
- runbooks/handover complete
- SSOT reflects production truth


## Webhook Security Release Gate — SEC-WEBHOOK-001

Production LINE webhook cutover is blocked until:
- verified ingress gateway code CI PASS
- Apps Script raw-body logging removal CI PASS
- staging gateway deployment completed
- invalid/missing signatures proven unable to reach Apps Script
- valid signed request proven end-to-end
- LINE Developers Console Verify succeeds against gateway
- production rollback revision recorded
- channel secret/downstream secret stored outside source

Direct LINE → Apps Script delivery is not production-approved because the Apps Script Web App event contract does not expose the LINE signature header required by ADR-0005.

Operational procedure:
- `runbooks/WEBHOOK_INGRESS_DEPLOYMENT_RUNBOOK.md`
