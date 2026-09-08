# BUSINESS_WORKFLOWS

Status: ACCEPTED

## WF-BIZ-001 — Member Onboarding

Member obtains activation code
→ opens LINE
→ verifies identity
→ submits activation
→ system validates member/code
→ membership activated
→ LINE identity linked
→ member menu/service enabled
→ audit evidence written

## WF-BIZ-002 — Member Self-Service

Member opens LIFF
→ verified identity
→ member binding resolved
→ member access policy checked
→ profile/finance data read
→ UI displays authorized data

## WF-BIZ-003 — Membership Renewal

Member/authorized staff requests renewal
→ identity + authorization
→ current membership checked
→ renewal policy applied
→ new validity dates persisted
→ audit written
→ user notified

## WF-BIZ-004 — Staff Service

Staff signs in
→ server verifies session Principal
→ RBAC check
→ search/select member
→ permitted operation
→ audit trail
→ response

## WF-BIZ-005 — Scheduled Notification

Scheduler triggers job
→ trusted system Principal
→ query eligible records
→ policy engine decides recipients
→ messaging adapter sends
→ audit/log result
