# USE_CASE_CATALOG

Status: ACCEPTED

## Member

### UC-MEM-001 — Activate Membership
Primary actor: Member  
Goal: link verified LINE identity to a cooperative member record and activate membership.  
Target application: ActivateMemberUseCase  
Key ports: MemberRepositoryPort, ClockPort, AuditPort  
Key negatives: invalid code, used code, identity mismatch, duplicate retry.

### UC-MEM-002 — Renew Membership
Primary actor: Member / authorized Staff/Admin  
Target application: RenewMemberUseCase  
Key ports: MemberRepositoryPort, ClockPort, AuditPort.

### UC-MEM-003 — View Own Profile
Primary actor: Member  
Target application: GetCurrentMemberProfileUseCase  
Authentication: verified Principal only.

### UC-MEM-004 — View Own Savings
Primary actor: Member  
Target application: GetCurrentMemberFinanceUseCase(kind=savings)

### UC-MEM-005 — View Own Loans
Primary actor: Member  
Target application: GetCurrentMemberFinanceUseCase(kind=loans)

### UC-MEM-006 — View Own Dividends
Primary actor: Member  
Target application: GetCurrentMemberFinanceUseCase(kind=dividends)

### UC-MEM-007 — Loan Calculator
Primary actor: Member/Staff/Admin  
Target: canonical LoanCalculationEngine.

## Staff/Admin

### UC-STAFF-001 — Search Member
Target application: SearchMemberUseCase

### UC-STAFF-002 — View Member Detail
Target application: GetMemberDetailUseCase  
Authorization: staff/admin/auditor according to RBAC.

### UC-STAFF-003 — Activate/Renew on Behalf
Target application: controlled staff/admin operation with audit trail.

### UC-ADMIN-001 — Manage Staff
Target application: StaffManagementUseCase

### UC-ADMIN-002 — Manage Roles/Permissions
Target application: RoleManagementUseCase

### UC-ADMIN-003 — Manage Settings
Target application: SettingsManagementUseCase

### UC-AUD-001 — Review Audit Log
Target application: GetAuditLogUseCase

### UC-REP-001 — View Reports
Target application: ReportQueryUseCase

## System

### UC-SYS-001 — Expiry Scan
Target application: ExpiryScanUseCase

### UC-SYS-002 — Notice Broadcast
Target application: PublishNoticeUseCase

### UC-SYS-003 — Loan Reminder
Target application: LoanReminderUseCase

## Mandatory Use Case Spec Fields

Every detailed use case must define:
- Use Case ID
- Actors
- Goal
- Trigger
- Preconditions
- Authentication
- Authorization
- Main Flow
- Alternative Flow
- Error Flow
- Postconditions
- Application Use Case
- Domain Engines
- Ports
- Delivery/API
- Data touched
- Audit requirement
- Acceptance Criteria
- Test IDs
