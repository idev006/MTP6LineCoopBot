# ADR-0004 — Secure LINE Identity Binding for Member Activation

Status: ACCEPTED  
Date: 2026-09-08  
Authority: SEC-WEB-004 / ADR-0003

## Context

Member activation creates or confirms the binding between a cooperative member record and a LINE identity. The legacy flow accepts `lineUserId` from delivery context and therefore mixes entitlement proof with identity proof.

An activation code can prove entitlement to activate a member record, but it cannot prove ownership of a LINE identity.

The current Apps Script webhook ingress also cannot by itself be treated as the canonical identity-binding proof because the existing webhook compatibility path does not provide the same verified LINE Login ID-token boundary used by LIFF.

## Decision

### 1. Activation code is entitlement proof only

An activation code identifies the member record that may be activated.

It MUST NOT be treated as:
- proof of LINE identity ownership
- authorization to bind an arbitrary LINE user ID
- permission for staff/admin to select a LINE identity on behalf of another user

### 2. LINE identity proof comes only from verified provider claims

Canonical self-activation uses a raw LINE Login ID token obtained by LIFF and verified server-side.

The backend derives the LINE subject from verified claims and constructs the canonical `Security.Principal`.

The request must not contain an authoritative `lineUserId`.

### 3. Secure self-activation is the only binding write in this version

Supported:
- Member self-activation through verified LINE identity + activation code.

Not supported:
- direct staff/admin binding of a member record to an arbitrary LINE user ID.

Staff/admin may assist the user operationally, but assistance must hand the user into the verified self-activation flow.

A future assisted-binding design requires a separate user-presence/consent challenge and a controlled ADR.

### 4. Binding conflict and replay policy

Given verified LINE subject `S` and activation-code target member `M`:

- M unbound, S unbound → activate and bind.
- M already bound to S → idempotent success; do not rewrite identity.
- M already bound to another subject → `BINDING_CONFLICT`; no write.
- S already bound to another member → `SUBJECT_ALREADY_BOUND`; no write.
- invalid/reused code pointing to another binding → fail closed.
- malformed/expired/unverified token → `UNAUTHENTICATED`.

### 5. Idempotency

Retrying the same successful activation with the same verified subject and same target member must not create another binding or mutate dates unnecessarily.

The response may return `changed:false` / `already_bound:true` semantics.

### 6. Audit

Secure activation audit records:
- actor verified subject
- target member code
- outcome
- timestamp

Raw activation codes must not be written to new secure audit records.

### 7. Delivery

Canonical endpoint:

`POST /api/member/me/activate`

Request:
```json
{"idToken":"<raw LINE ID token>","activateCode":"<activation code>"}
```

The server must reject or ignore any client-supplied `lineUserId`; it can never alter the verified Principal.

### 8. Chat handoff

Legacy chat command `activate:CODE` must not remain a direct binding write after migration.

Target behavior:
1. chat receives activation intent
2. user is directed to LIFF secure activation surface
3. LIFF obtains raw ID token
4. server verifies token
5. secure self-activation use case performs binding

This avoids using the current webhook compatibility identity as the authority for creating a new binding.

## Consequences

- Legacy `POST /api/member/activate` remains only during migration.
- Existing `ActivateMemberUseCase` is legacy compatibility until callers switch.
- A new Principal-based self-activation use case is required.
- `renew:CODE` must be reviewed separately because legacy renewal can also mutate LINE binding.
- SEC-LEGACY-001 may retire activate/renew compatibility only after secure caller migration and CI evidence.

## Test Contract

Required:
1. verified unbound subject + valid unbound member
2. same subject retry is idempotent
3. target bound to different subject
4. subject already bound to different member
5. invalid activation code
6. invalid/expired ID token
7. client-supplied lineUserId mismatch cannot affect binding
8. no direct staff/admin arbitrary binding
9. secure audit contains no raw activation code
10. legacy route retirement only after caller evidence
