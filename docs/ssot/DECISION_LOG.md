# DECISION_LOG

สถานะ: ACTIVE INDEX

| ADR | เรื่อง | Status | Date | Supersedes |
|---|---|---|---|---|
| ADR-0001 | Project SSOT and change-control model | ACCEPTED | 2026-09-08 | - |
| ADR-0002 | Engine-first Lego/Plug-in architecture | ACCEPTED | 2026-09-08 | - |
| ADR-0003 | Canonical target architecture + Principal security boundary | ACCEPTED | 2026-09-08 | - |

## Rule

การตัดสินใจ Class C ตาม CHANGE_CONTROL.md ต้องมี ADR และลงทะเบียนในตารางนี้


## 2026-09-08 — ADR-0004 Secure LINE identity binding

Decision:
- activation code is entitlement proof, not identity proof
- canonical activation requires verified LINE ID-token Principal
- direct staff/admin arbitrary LINE binding is prohibited
- same-subject retries are idempotent
- conflicting subject/member bindings fail closed
- chat activation becomes a LIFF verified-identity handoff
- raw activation code is excluded from new secure audit records

Status: ACCEPTED under SEC-WEB-004.


## 2026-09-09 — ADR-0005 Verified LINE Webhook Ingress

Decision: ACCEPTED

LINE webhook production ingress must verify `x-line-signature` against the exact raw body before Apps Script/event processing. Because the Apps Script Web App event contract does not expose the needed request header, use a provider-neutral verification gateway in front of Apps Script. The existing downstream shared secret is defense-in-depth, not LINE-origin authentication.


## 2026-09-09 — ADR-0006 Public loan API legacy alias deprecation

Decision: ACCEPTED

The public loan calculation input alias `paymentType=equal_total` remains temporarily accepted and normalizes to canonical `equal_installment`.

Deprecation policy:
- canonical input/output vocabulary remains `equal_principal|equal_installment`
- new first-party UI/code must not emit `equal_total`
- the deprecation clock starts only on the first production-verified cutover that includes this policy
- retirement target is 60 calendar days after that verified production cutover
- code/CI/staging evidence alone does not start the clock
- before retirement, perform a fresh repository caller audit and satisfy production release evidence
- compatibility telemetry, if added, may record only a coarse categorical alias occurrence/count; it must not log loan payloads, amounts, member/PII, or raw request bodies
- if production evidence cannot establish a safe retirement at the target date, the alias remains accepted until a new controlled decision is recorded

Tracked by: API-COMPAT-001 (#81).
