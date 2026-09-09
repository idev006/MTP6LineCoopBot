# DEVELOPMENT_EXECUTION_PLAN

Status: ACTIVE  
Method: Agile Kanban  
Authority: PROJECT_CHARTER + ADR-0002 + ADR-0003 + TEST_STRATEGY + RELEASE_GATES

## Mission

พัฒนาระบบจน Production Verified โดยใช้เอกสาร SSOT เป็นตัวนำการพัฒนา

## Workstreams

1. Security & Identity
2. Member Application Engines
3. LINE/LIFF Delivery Migration
4. Web Admin
5. Scheduled Jobs
6. Financial Engine Authority
7. Testing/CI/CD
8. Operations/Deployment
9. Documentation/Audit

## Execution Order

### Wave A — Security Boundary
- LIFF ใช้ raw ID token
- protected member endpoints ใช้ Principal
- remove client lineUserId identity trust
- web session Principal
- server authorization

### Wave B — Member Engines
- ActivateMember
- RenewMember
- GetMemberProfile
- GetMemberFinance
- Validity/Authorization

### Wave C — Scheduled Engines
- ExpiryScan
- NoticeBroadcast
- LoanReminder

### Wave D — Web/Admin
- shared API client
- Staff/Admin RBAC
- reports/settings/audit
- unit + E2E

### Wave E — Financial Authority
- canonical LoanCalculationEngine
- remove duplicate UI formula
- property tests

### Wave F — Release
- staging
- UAT
- production deployment
- rollback/backup verification
- final audit

## Engineering Rule

ทุก card:
Requirement → Acceptance Criteria → Architecture impact → Code → Test → CI → Evidence → SSOT update

ห้ามปิด card หากไม่มี automated evidence เว้นแต่เป็น manual/UAT item ที่ระบุชัด


## Mandatory Pipeline Standards

All workstreams must follow:
- `process/TEAM_DEVELOPMENT_PIPELINE.md`
- `process/CI_PIPELINE_STANDARD.md`
- `process/RELEASE_DEPLOYMENT_PIPELINE.md`

The Development Execution Plan defines **what** to deliver; these pipeline standards define **how work must flow and pass quality/release gates**.
