# SEQ-MEMBER-RENEW

Status: TARGET / MIGRATION

```mermaid
sequenceDiagram
    actor Actor as Member/Staff/Admin
    participant Delivery
    participant Identity
    participant Authz as AuthorizationEngine
    participant UC as RenewMemberUseCase
    participant Repo as MemberRepositoryPort
    participant Clock
    participant Audit

    Actor->>Delivery: request renewal
    Delivery->>Identity: authenticate
    Identity-->>Delivery: Principal
    Delivery->>Authz: authorize renewal
    Authz-->>Delivery: allow/deny
    Delivery->>UC: execute(principal, member)
    UC->>Repo: load member
    Repo-->>UC: member
    UC->>Clock: now()
    Clock-->>UC: timestamp
    UC->>Repo: renewMember()
    UC->>Audit: record renewal
    UC-->>Delivery: result
    Delivery-->>Actor: renewal outcome
```
