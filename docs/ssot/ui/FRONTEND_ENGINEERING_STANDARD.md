# FRONTEND_ENGINEERING_STANDARD

Status: ACCEPTED / MANDATORY  
Scope: Web App + LIFF UI  
Authority: ADR-0002 / ADR-0003 / TEAM_DEVELOPMENT_PIPELINE

## Non-Negotiable Security Rule — Never Trust the Client

Client/UI is an untrusted delivery surface.

The client must never be authoritative for:
- identity
- roles/permissions
- membership status
- financial values
- eligibility
- activation/renewal policy
- business dates
- audit decisions
- data ownership

Client-provided identifiers, flags, totals, roles, or calculated business results are input only and must be validated/re-derived server-side.

Protected operations must use a server-verified Principal and server-side authorization.

## Non-Negotiable Architecture Rule — No Business Logic in UI

Vue components, Router and Pinia must not own domain/business policy.

Allowed UI responsibilities:
- presentation
- local interaction state
- loading/error/empty state
- form/input collection
- navigation
- calling application/API contracts
- formatting presentation values

Not allowed:
- loan/financial formulas
- membership validity policy
- authorization decisions
- activation/renewal date policy
- eligibility/rule evaluation
- duplicate domain calculations

Business logic belongs in backend Domain Engines/Application Use Cases.

Pinia is a client state-management layer, not a business/domain authority.

## Frontend Stack

Preferred stable stack:
- Vue.js 3
- Vue Router 5
- Pinia
- Tailwind CSS 4
- daisyUI 5
- Vite

Version policy:
- prefer latest stable
- upgrade via dedicated dependency PR
- CI/build/test must pass
- breaking upgrades require migration review
- package-lock must stay synchronized

## Component Policy — daisyUI First

Before creating a custom component/style:
1. check daisyUI component
2. use native semantic HTML + daisyUI
3. compose daisyUI components
4. use Tailwind utilities for layout/spacing
5. create custom CSS/component only when requirements cannot be met cleanly

Examples:
- button → `btn`
- form controls → `input`, `select`, `textarea`, `checkbox`
- messages → `alert`
- containers → `card`
- modal → `modal`
- navigation → `navbar`, `menu`, `tabs`
- data → `table`
- loading → `loading`
- status → `badge`
- confirmation → daisyUI modal/alert patterns

Avoid duplicating daisyUI component CSS.

## Typography

Canonical application font:
**Chakra Petch** — Google Fonts

Fallback:
`"Chakra Petch", system-ui, sans-serif`

Apply consistently to:
- Web App
- LIFF
- UI components
- forms
- tables
- navigation

Exceptions:
- code/technical identifiers may use monospace.

## Vue Standard

Prefer:
- Composition API
- `<script setup>`
- small focused components
- composables for reusable UI/application-client behavior

Components should not directly know infrastructure details when an API/client abstraction exists.

## Vue Router Standard

Router owns:
- route definitions
- navigation metadata
- navigation guards for UX

Router guards are **not server authorization**.

Backend authorization remains authoritative.

## Pinia Standard

Pinia stores may own:
- UI-facing state
- cached server data
- loading/error state
- session presentation state

Pinia stores must not become a second backend/domain layer.

Store actions may orchestrate API-client calls but must not reimplement server business policy.

## API Client Standard

Use one shared API-client boundary per delivery application.

Requirements:
- explicit request/response contracts
- fail closed
- standardized errors
- no mock production fallback
- protected credentials not in query strings
- no client API key treated as authentication
- do not trust client-supplied identity/role/member values

## UI State Standard

Every remote-data surface must explicitly handle:
- loading
- success
- empty
- error
- unauthorized/forbidden where relevant

Never convert backend/system error into believable fake business data.

## Testing

Frontend changes require, where applicable:
- pure policy/composable tests
- Pinia store tests
- router/RBAC UX tests
- API contract tests
- forbidden business-logic/mock scan
- production build
- critical E2E

## Review Checklist

A frontend PR fails review if:
- client is treated as identity/authorization authority
- business rule duplicated from backend
- custom component duplicates available daisyUI component without reason
- Chakra Petch is bypassed without reason
- protected data falls back to mock values
- server errors are hidden as valid business state
