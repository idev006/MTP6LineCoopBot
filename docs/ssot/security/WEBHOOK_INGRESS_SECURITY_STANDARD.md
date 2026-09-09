# WEBHOOK_INGRESS_SECURITY_STANDARD

Status: ACCEPTED / MANDATORY  
Authority: ADR-0005  
Work item: SEC-WEBHOOK-001

## Security Contract

A LINE webhook event MUST NOT be processed until the original `x-line-signature` has been validated against the exact raw request body.

## Gateway Environment Contract

Required secrets/config:
- `CHANNEL_SECRET` — LINE Messaging API channel secret
- `DOWNSTREAM_URL` — Apps Script `/exec` deployment URL
- `DOWNSTREAM_SECRET` — independent high-entropy secret matching Apps Script `WEBHOOK_SECRET`

Optional:
- `PORT` — default `8080`
- `DOWNSTREAM_TIMEOUT_MS` — default `8000`

Secrets must come from deployment secret management/environment. Never place real values in repo files.

### Downstream transport

Because the gateway transports `DOWNSTREAM_SECRET` to the Apps Script downstream request, `DOWNSTREAM_URL` must fail closed unless it is a clean HTTPS URL.

Required:
- scheme is `https:`
- hostname is present
- no embedded username/password
- no URL fragment
- redirects remain disabled/fail-closed in the forwarding adapter

Plaintext `http:` downstream transport is forbidden.

## HTTP Contract

Input:
- `POST /webhook`
- raw `application/json` body
- `x-line-signature` header
- buffered body limit: 1 MiB (`1048576` bytes); declared or streamed overflow returns `413` before signature processing/downstream forwarding
- non-POST requests are rejected with `405` before request-body collection

Success:
- verify signature
- forward exact body unchanged
- append only downstream authentication transport required by Apps Script
- return an appropriate 2xx response after downstream acceptance

Rejected request:
- never forward to Apps Script

Public response boundary:
- never reflect Apps Script/downstream response bodies through the public webhook ingress
- downstream 2xx acceptance returns only a stable gateway-owned success payload
- downstream response bodies are not buffered for public response construction
- downstream non-2xx remains fail-closed

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

## Deployment Contract Drift Rule

The runtime names and path above are canonical for the current release candidate.

- do not introduce alternate/legacy environment aliases in the gateway
- do not document a different public webhook path without a controlled runtime + test + SSOT change
- Apps Script uses its own downstream-side `WEBHOOK_SECRET`; this is not a gateway environment variable
- Webhook Ingress CI must fail if this standard drifts from the runtime deployment contract

## Container Supply-Chain Rule

The production gateway base image must be reproducible from source review evidence.

- pin the Dockerfile base image by immutable `sha256` digest while retaining the human-readable Node 24 Alpine tag
- do not use an unpinned mutable base tag for a release candidate
- base-image upgrades require a controlled source change, CI pass and a newly published immutable gateway image
- image publication evidence must record the gateway image digest separately from the base-image digest
