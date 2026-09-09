# WEBHOOK_INGRESS_SECURITY_STANDARD

Status: ACCEPTED / MANDATORY  
Authority: ADR-0005  
Work item: SEC-WEBHOOK-001

## Security Contract

A LINE webhook event MUST NOT be processed until the original `x-line-signature` has been validated against the exact raw request body.

## Gateway Environment Contract

Required secrets/config:
- `LINE_CHANNEL_SECRET`
- `DOWNSTREAM_WEBHOOK_URL`
- `DOWNSTREAM_WEBHOOK_SECRET`

Optional:
- `PORT`
- downstream timeout

Secrets must come from deployment secret management/environment. Never place real values in repo files.

## HTTP Contract

Input:
- `POST /` or configured webhook path
- raw `application/json` body
- `x-line-signature` header

Success:
- verify signature
- forward exact body unchanged
- append only downstream authentication transport required by Apps Script
- return an appropriate 2xx response after downstream acceptance

Rejected request:
- never forward to Apps Script

## Operational Metrics

Minimum:
- verified requests
- rejected signature count
- downstream failure count
- latency
- HTTP status distribution

Do not use raw event payload as operational log content.

## Incident Response

On suspected secret compromise:
1. rotate downstream secret
2. if LINE channel secret compromised, reissue in LINE Developers Console
3. update gateway secret atomically
4. verify webhook
5. review rejection/downstream metrics
6. record incident/evidence in project SSOT
