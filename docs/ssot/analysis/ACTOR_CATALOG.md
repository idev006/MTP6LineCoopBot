# ACTOR_CATALOG

Status: ACCEPTED  
Authority: ADR-0003 / TARGET_SYSTEM_ARCHITECTURE

## Actors

### ACT-MEMBER — Member
Goal:
- access own cooperative information
- activate/renew membership
- view profile/savings/loans/dividends
- receive notices/reminders
- use approved calculators/tools

Authentication:
- LINE/LIFF verified Principal for protected self-service

### ACT-STAFF — Staff
Goal:
- search/view member data within assigned permissions
- support activation/renewal/member service
- operational administration

Authentication:
- server-verified Web Session Principal

### ACT-MANAGER — Manager
Goal:
- perform elevated operational member-service work
- search/view member data and reports under server-side RBAC
- renew members on behalf where explicitly authorized
- retain own member self-service when member-bound

Authentication:
- server-verified Web Session Principal for operational capabilities
- verified LINE/LIFF Principal for own member self-service

Boundary:
- Manager is not equivalent to Administrator; admin-only settings, staff/role management, and audit capabilities require explicit admin authorization.

### ACT-ADMIN — Administrator
Goal:
- manage staff/roles/configuration
- access audit/report/settings capabilities
- operational administration with elevated privileges

Authentication:
- server-verified Web Session Principal

### ACT-AUDITOR — Auditor
Goal:
- read audit evidence/logs/reports
- verify compliance without unnecessary write privileges

Authentication:
- server-verified Web Session Principal

### ACT-SYSTEM — System/Scheduler
Goal:
- run expiry scans
- notices
- reminders
- scheduled maintenance

Authentication:
- trusted system Principal / controlled trigger

### ACT-LINE — LINE Platform
External actor:
- webhook events
- reply/push messaging
- LIFF runtime

### ACT-LINE-IDP — LINE Identity Provider
External actor:
- verifies raw LINE Login/LIFF ID token
- returns trusted subject/claims
