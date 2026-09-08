# USE_CASE_DIAGRAM

Status: ACCEPTED

```mermaid
flowchart LR
    M[Member]
    S[Staff]
    A[Admin]
    U[Auditor]
    SYS[System/Scheduler]

    subgraph MemberUC[Member Use Cases]
      UC1[Activate Membership]
      UC2[Renew Membership]
      UC3[View Own Profile]
      UC4[View Savings]
      UC5[View Loans]
      UC6[View Dividends]
      UC7[Loan Calculator]
    end

    subgraph StaffUC[Staff/Admin Use Cases]
      UC8[Search Member]
      UC9[View Member Detail]
      UC10[Activate/Renew on Behalf]
      UC11[Manage Staff]
      UC12[Manage Roles]
      UC13[Manage Settings]
      UC14[View Reports]
      UC15[Review Audit Log]
    end

    subgraph SystemUC[System Use Cases]
      UC16[Expiry Scan]
      UC17[Notice Broadcast]
      UC18[Loan Reminder]
    end

    M --> UC1
    M --> UC2
    M --> UC3
    M --> UC4
    M --> UC5
    M --> UC6
    M --> UC7

    S --> UC2
    S --> UC7
    S --> UC8
    S --> UC9
    S --> UC10
    S --> UC14

    A --> UC2
    A --> UC7
    A --> UC8
    A --> UC9
    A --> UC10
    A --> UC11
    A --> UC12
    A --> UC13
    A --> UC14
    A --> UC15

    U --> UC14
    U --> UC15

    SYS --> UC16
    SYS --> UC17
    SYS --> UC18
```

## Security Boundary

All protected human use cases must receive an authenticated `Principal` and pass server-side authorization.

System use cases execute with a controlled system Principal.
