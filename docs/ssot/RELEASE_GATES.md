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
