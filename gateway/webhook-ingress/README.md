# Verified LINE Webhook Ingress

Security boundary for `SEC-WEBHOOK-001` / ADR-0005.

## Contract

`POST /webhook` receives the exact raw LINE webhook body and `x-line-signature`.

Before any JSON parsing, the gateway:
1. reads the signature header case-insensitively
2. verifies HMAC-SHA256 using `CHANNEL_SECRET`
3. rejects missing/malformed/mismatched signatures
4. only after verification parses enough JSON to count events
5. forwards the exact original bytes to Apps Script with the independent downstream secret

The gateway never logs raw webhook bodies or secret values.

## Required environment

- `CHANNEL_SECRET` — LINE Messaging API channel secret
- `DOWNSTREAM_URL` — Apps Script `/exec` URL
- `DOWNSTREAM_SECRET` — independent high-entropy secret matching Apps Script `WEBHOOK_SECRET`
- `PORT` — optional, default 8080
- `DOWNSTREAM_TIMEOUT_MS` — optional, default 8000

## Local verification

```sh
npm test
npm run check
```

## Deployment

The service is provider-neutral Node 24 HTTP and includes a Dockerfile. See the project deployment runbook before staging/production cutover.

Do not configure LINE Developers to point directly to Apps Script after production cutover.


## Staging deployment verification

After deploying the gateway and configuring its secrets:

```sh
GATEWAY_URL=https://<staging-host> \
CHANNEL_SECRET=<read-from-secure-secret-source> \
npm run verify:deployment
```

The verifier:
- checks `GET /healthz`
- proves a missing signature is rejected
- proves an invalid signature is rejected
- sends a valid signed synthetic `events:[]` webhook and requires a 2xx downstream response

It never prints the channel secret. Use only against an environment whose downstream Apps Script endpoint is intentionally configured for verification.
