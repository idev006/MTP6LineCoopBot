# WEBHOOK_INGRESS_DEPLOYMENT_RUNBOOK

Status: ACTIVE / PRE-PRODUCTION  
Authority: ADR-0005, WEBHOOK_INGRESS_SECURITY_STANDARD, RELEASE_GATES  
Work item: SEC-WEBHOOK-001

## Purpose

Deploy and cut over the verified LINE webhook ingress without exposing secrets, modifying signed request bytes, or silently falling back to direct Apps Script delivery.

## Target Flow

```text
LINE Platform
    |
    | HTTPS POST + x-line-signature + exact raw body
    v
Verified Webhook Ingress
    |
    | HMAC-SHA256 verified
    | exact raw body forwarded
    | independent downstream secret
    v
Apps Script /exec
    |
    | WEBHOOK_SECRET checked before JSON parse
    v
LineBot.EventHandler
```

## Required Components

- `gateway/webhook-ingress` container
- HTTPS/container hosting platform
- Apps Script deployment URL
- LINE Messaging API channel secret
- independent downstream secret matching Apps Script `WEBHOOK_SECRET`

## Secrets

### Gateway
- `CHANNEL_SECRET`
- `DOWNSTREAM_SECRET`

### Gateway non-secret config
- `DOWNSTREAM_URL`
- `PORT` (default 8080)
- `DOWNSTREAM_TIMEOUT_MS`

### Apps Script
- `WEBHOOK_SECRET`
- existing `CHANNEL_ACCESS_TOKEN`

Rules:
- never commit secrets
- never put LINE channel secret in Apps Script URL/query
- `DOWNSTREAM_SECRET` and Apps Script `WEBHOOK_SECRET` must match
- LINE channel secret and downstream secret must be independent values
- rotate downstream secret during cutover or suspected exposure
- do not log request URLs containing downstream secret

## Staging Deployment

1. Build the container from `gateway/webhook-ingress/Dockerfile`.
2. Deploy to a staging HTTPS endpoint.
3. Store `CHANNEL_SECRET` and `DOWNSTREAM_SECRET` in the platform secret store.
4. Configure `DOWNSTREAM_URL` to the staging Apps Script deployment.
5. Configure the same downstream secret in Apps Script `WEBHOOK_SECRET`.
6. Confirm gateway startup does not print secret values.
7. Confirm `POST /webhook` is publicly reachable over HTTPS.
8. Do not cut production LINE webhook URL yet.

## Staging Security Verification

Required evidence:

### Invalid / Missing Signature
- missing `x-line-signature` → rejected
- malformed Base64 → rejected
- wrong secret → rejected
- tampered body → rejected
- Apps Script must receive no request for these cases

### Valid Signature
- exact raw body + valid signature → forwarded
- Apps Script downstream secret check passes
- event reaches EventHandler
- response propagates successfully

### Privacy
- gateway logs contain no raw body
- Apps Script logs contain no raw body
- no channel/downstream secret in logs
- no full message/user payload in normal logs

### Downstream Failure
- timeout/error → gateway fails closed
- no success acknowledgment is fabricated

## LINE Developers Verification

Before production cutover:

1. Set a temporary staging webhook URL only if the staging channel/environment is isolated.
2. Use LINE Developers Console **Verify**.
3. Confirm an empty verification webhook succeeds.
4. Confirm gateway metrics/logs show a verified request and event count only.
5. Confirm Apps Script sees the request through the downstream gate.

## Production Cutover

Entry criteria:
- gateway code CI green
- Apps Script privacy CI green
- staging signature tests complete
- rollback endpoint recorded
- secrets stored outside source
- owner/on-call identified

Steps:
1. Deploy production gateway from the exact approved commit.
2. Configure production `CHANNEL_SECRET`.
3. Generate a new independent high-entropy downstream secret.
4. Set the same value as Apps Script `WEBHOOK_SECRET`.
5. Configure production `DOWNSTREAM_URL`.
6. Smoke-test gateway with a controlled signed test request.
7. Change LINE Developers webhook URL from direct Apps Script to:
   `https://<gateway-host>/webhook`
8. Use LINE Developers Console **Verify**.
9. Send a controlled real message/postback.
10. Confirm only one processing path executes.
11. Observe error/redelivery metrics.

## Rollback

Preferred rollback:
1. keep previous gateway revision deployable
2. rollback gateway revision/config while retaining signature verification
3. verify LINE webhook again

Emergency direct-to-Apps-Script rollback is **not security-equivalent** and requires explicit security exception because Apps Script cannot verify `x-line-signature`.

Do not silently restore direct Apps Script as normal production architecture.

## Rotation

### Downstream secret
Rotate when:
- gateway cutover
- URL/config exposure suspected
- operator access changes materially

Procedure:
1. generate new random value
2. update Apps Script `WEBHOOK_SECRET`
3. update gateway `DOWNSTREAM_SECRET`
4. deploy/config atomically as closely as possible
5. verify
6. invalidate old value

### LINE channel secret
If reissued in LINE Developers:
1. update gateway secret immediately
2. redeploy/reload secret
3. use LINE Verify
4. monitor signature failures

## Observability

Allowed:
- gateway request correlation ID
- signature result
- HTTP status
- event count after successful verification
- downstream status
- latency

Forbidden:
- raw webhook body
- LINE channel secret
- downstream secret
- message text/content by default
- complete user payloads by default

## Production Verification Evidence

Record:
- gateway release commit/image digest
- Apps Script release commit/deployment ID
- LINE Verify timestamp/result
- controlled message/postback result
- invalid signature negative test result
- logs/privacy review result
- rollback revision
- responsible operator

## Gate Status Vocabulary

- CODE_VERIFIED — code/tests/CI passed
- STAGING_VERIFIED — deployed staging + signature/downstream tests passed
- CUTOVER_READY — production config/rollback ready
- PRODUCTION_VERIFIED — LINE Console points to gateway and live verification passed

Never use `DONE` or `PRODUCTION_VERIFIED` based on code/CI alone.
