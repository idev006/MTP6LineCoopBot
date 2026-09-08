# SEQ-MEMBER-RENEW

Status: ACCEPTED / PRIMARY SELF-SERVICE PATH VERIFIED

```mermaid
sequenceDiagram
    actor Member
    participant LIFF
    participant API as Protected API
    participant Identity as LineIdentityAdapter
    participant Verify as LineIdTokenVerifier
    participant Authz as AuthorizationEngine
    participant UC as RenewMemberUseCase
    participant Clock as ClockPort
    participant Rules as Core.MemberRules
    participant Repo as MemberRepositoryPort
    participant Sheets as Sheets Adapter

    Member->>LIFF: Confirm renewal
    LIFF->>LIFF: liff.getIDToken()
    LIFF->>API: POST /api/member/me/renew {idToken}
    API->>Identity: authenticate(idToken)
    Identity->>Verify: verify raw token
    Verify-->>Identity: verified subject/claims
    Identity-->>API: Principal
    API->>UC: execute(principal)
    UC->>Authz: requireAuthenticated + member binding
    Authz-->>UC: allow
    UC->>Repo: findByMemberCode(principal.memberCode)
    Repo->>Sheets: read member
    Sheets-->>Repo: member
    Repo-->>UC: member
    UC->>Clock: now()
    Clock-->>UC: server time
    UC->>Rules: computeRenewal(member, now)
    Rules-->>UC: newExpDt/fromDt
    UC->>Repo: saveRenewal(precomputed values)
    Repo->>Sheets: persist
    Sheets-->>Repo: persisted result
    UC-->>API: renewal result
    API-->>LIFF: {ok:true,data}
    LIFF-->>Member: renewal outcome
```

## Security Rule

Client never chooses authoritative member identity, expiry date, or membership status.

Staff/Admin renewal-on-behalf requires a separate RBAC-controlled application path and must not reuse client-selected identity as authority.
