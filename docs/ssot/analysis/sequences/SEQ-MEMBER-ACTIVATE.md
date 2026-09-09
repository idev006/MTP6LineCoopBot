# SEQ-MEMBER-ACTIVATE

Status: TARGET / ACCEPTED  
Authority: ADR-0004

## Secure Self-Activation

```mermaid
sequenceDiagram
    actor Member
    participant Chat as LINE Chat
    participant LIFF as LIFF Activation Surface
    participant Delivery as POST /api/member/me/activate
    participant Identity as LINE ID Token Verifier
    participant UC as ActivateCurrentLineMemberUseCase
    participant Policy as LineBindingEngine
    participant Repo as MemberRepositoryPort
    participant Audit as AuditPort

    Member->>Chat: activate intent / activation code
    Chat-->>Member: open secure LIFF activation handoff
    Member->>LIFF: confirm activation code
    LIFF->>LIFF: liff.getIDToken()
    LIFF->>Delivery: { idToken, activateCode }
    Delivery->>Identity: verify raw ID token
    Identity-->>Delivery: authenticated LINE Principal
    Delivery->>UC: execute(principal, activateCode)
    UC->>Repo: findByActivateCode(activateCode)
    Repo-->>UC: target member
    UC->>Policy: evaluate target + verified subject + existing binding
    Policy-->>UC: bind | idempotent | conflict
    alt bind
        UC->>Repo: saveActivation(...)
        UC->>Audit: record verified actor + target + success
        UC-->>Delivery: changed=true
    else same-subject retry
        UC->>Audit: record/no-op policy evidence
        UC-->>Delivery: changed=false, alreadyBound=true
    else conflict
        UC->>Audit: record denied outcome
        UC-->>Delivery: BINDING_CONFLICT / SUBJECT_ALREADY_BOUND
    end
    Delivery-->>LIFF: response envelope
    LIFF-->>Member: explicit success/error state
```

## Security Invariants

- activation code proves entitlement only
- raw LINE ID token is verified server-side
- authoritative LINE subject is derived from verified claims
- no client-provided `lineUserId`
- staff/admin cannot directly select another user's LINE identity
- same-subject retry is idempotent
- different-subject binding takeover fails closed
- secure audit must not persist raw activation code
