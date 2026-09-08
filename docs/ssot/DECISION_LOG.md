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
