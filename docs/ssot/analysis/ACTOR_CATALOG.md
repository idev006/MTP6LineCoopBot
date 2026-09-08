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
