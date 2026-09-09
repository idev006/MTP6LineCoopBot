# ACTOR_USE_CASE_MATRIX

Status: ACCEPTED

| Use Case | Member | Staff | Manager | Admin | Auditor | System |
|---|---:|---:|---:|---:|---:|---:|
| UC-MEM-001 Activate membership | ✅ | support only | support only | - | - |
| UC-MEM-002 Renew membership | ✅ | ✅ | ✅ | - | - |
| UC-MEM-003 View own profile | ✅ | - | - | - | - |
| UC-MEM-004 View own savings | ✅ | - | - | - | - |
| UC-MEM-005 View own loans | ✅ | - | - | - | - |
| UC-MEM-006 View own dividends | ✅ | - | - | - | - |
| UC-MEM-007 Use loan calculator | ✅ | ✅ | ✅ | - | - |
| UC-STAFF-001 Search member | - | ✅ | ✅ | read-only if approved | - |
| UC-STAFF-002 View member detail | - | ✅ | ✅ | read-only if approved | - |
| UC-STAFF-003 Renew member on behalf | - | ✅ | ✅ | ✅ | - | - |
| UC-STAFF-004 Assist activation handoff (no direct binding) | - | support only | support only | support only | - | - |
| UC-ADMIN-001 Manage staff | - | - | ✅ | - | - |
| UC-ADMIN-002 Manage roles/permissions | - | - | ✅ | read-only | - |
| UC-ADMIN-003 Manage settings | - | - | ✅ | - | - |
| UC-AUD-001 Review audit log | - | limited | ✅ | ✅ | - |
| UC-REP-001 View reports | - | ✅ | ✅ | ✅ | - |
| UC-SYS-001 Expiry scan | - | - | - | - | ✅ |
| UC-SYS-002 Notice broadcast | - | initiate/approve if allowed | ✅ | - | execute |
| UC-SYS-003 Loan reminder | - | - | - | - | ✅ |

Legend:
- ✅ primary/authorized actor
- support only = actor may assist but does not replace authentication/authorization of the primary use case
- read-only if approved = controlled permission via RBAC
