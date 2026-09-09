# SYSTEM_WORKFLOWS

Status: ACCEPTED

## WF-SYS-001 — Protected LIFF Read

LIFF
→ liff.getIDToken()
→ POST protected API
→ LineIdentityAdapter
→ LineIdTokenVerifier
→ LINE Identity Provider
→ verified claims
→ Principal
→ Application Use Case
→ MemberAccess/Authorization
→ MemberRepositoryPort
→ Sheets Adapter
→ result
→ LIFF UI

## WF-SYS-002 — Web Staff Request

Web UI
→ session credential
→ WebSessionIdentityAdapter
→ Principal
→ AuthorizationEngine
→ Application Use Case
→ Ports
→ Adapters
→ response

## WF-SYS-003 — LINE Webhook

LINE Platform
→ Webhook Delivery Adapter
→ event parsing
→ verified/trusted event boundary
→ Application Use Case
→ Engines/Ports
→ Reply/Push Messaging Adapter
→ LINE Platform

## WF-SYS-004 — Scheduled Job

Apps Script Trigger
→ System Principal
→ Scheduled Application Use Case
→ Domain Policy
→ Repository/Messaging/Audit Ports
→ concrete adapters
