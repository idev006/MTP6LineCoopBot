# ARCHITECTURE_CONTRACT

สถานะ: PROPOSED

## Target Architecture

```
LINE / LIFF / Web Admin
        |
        v
Authentication + Authorization Boundary
        |
        v
API / Application Layer
        |
        v
Core Business Rules (pure/testable)
        |
        v
Repository Interface
        |
        v
Google Sheets (current)
```

## Component Ownership

| Component | Repository | Rule |
|---|---|---|
| LINE webhook/Rich Menu/Flex | MTLineCoopBot | UI adapter only, no duplicated core rules |
| API/Application | MTLineCoopBot | authoritative backend |
| Core business rules | MTLineCoopBot/app/Core | single implementation per business rule |
| Data schema | MTLineCoopBot/app/DataDict.js + SSOT data contract | header-driven |
| LIFF | MTP6LineCoopBot/liff | must authenticate server-side |
| Staff/Admin Web | MTP6LineCoopBot/webapp | must call API through shared client |
| Project governance | MTP6LineCoopBot/docs/ssot | authoritative project docs |

## Hard Architecture Rules

1. Authentication failure = deny, never mock success
2. Authorization enforced server-side
3. Client-supplied member/user identifiers are not trusted identity
4. Business formula may not be independently reimplemented in multiple UIs
5. External API/network errors must be explicit, not converted into fake production data
6. Direct Spreadsheet access must remain behind repository/data access boundary
7. New API endpoints require contract + tests
8. Breaking contract requires ADR + migration plan

## Environment Separation

Target:
- DEV
- STAGING
- PRODUCTION

แต่ละ environment ต้องมี config/data/deployment แยกตามความเหมาะสม และ production ห้ามใช้ seed/mock behavior
