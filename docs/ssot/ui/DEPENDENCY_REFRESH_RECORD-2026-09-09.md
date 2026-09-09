# DEPENDENCY_REFRESH_RECORD — 2026-09-09

Status: VERIFIED / MERGED  
Work Item: UI-DEPS-001  
Scope: `webapp/`

## Objective

Refresh the approved Vue frontend stack to the latest stable versions available at the controlled refresh checkpoint while preserving security, architecture, daisyUI-first composition, and Chakra Petch typography.

## Resolved Stack

| Package | Previous manifest / lock | Refreshed manifest / lock | Action |
|---|---|---|---|
| Vue | ^3.5.40 / 3.5.41 | ^3.5.42 / 3.5.42 | patch refresh |
| Vue Router | ^5.2.0 / 5.2.0 | ^5.3.1 / 5.3.1 | stable minor refresh |
| Pinia | ^4.0.3 / 4.0.3 | ^4.0.3 / 4.0.3 | already current |
| daisyUI | ^5.7.19 / 5.7.19 | ^5.7.32 / 5.7.32 | stable patch refresh |
| Tailwind CSS | ^4.3.3 / 4.3.3 | ^4.3.3 / 4.3.3 | already current |
| @tailwindcss/vite | ^4.3.3 / 4.3.3 | ^4.3.3 / 4.3.3 | already current |
| Vite | ^8.2.0 / 8.2.2 | ^8.2.2 / 8.2.2 | manifest aligned to resolved stable |
| @vitejs/plugin-vue | ^6.0.8 / 6.0.8 | ^6.0.8 / 6.0.8 | already current |

The package lock was regenerated from the npm registry on GitHub Actions using Node 24 and `npm install --package-lock-only --ignore-scripts`. No lockfile integrity values were edited manually.

## Compatibility Review

- Vue Router 5.3.1 peer range accepts Vue 3.5.x, Pinia 4.x and Vite 8.x.
- @vitejs/plugin-vue 6.0.8 accepts Vue 3.x and Vite 8.
- @tailwindcss/vite 4.3.3 accepts Vite 8.
- Vite 8.2.2 requires Node `^20.19.0 || >=22.12.0`; project CI uses Node 24.
- No framework major-line change is introduced by this work item.
- Vue 3.6 prerelease and Vite 8.3 beta are excluded because the project policy requires stable releases.

## Security / Architecture Invariants

This refresh must not change:
- server-verified Web session authority
- server-side RBAC
- LIFF raw-ID-token identity boundary
- no browser API-key authentication
- no production mock fallback
- no business/domain logic in Vue/Pinia/Router
- daisyUI-first component policy
- Chakra Petch canonical font

## Added Verification Gate

`webapp/tests/router-store-smoke.test.cjs` checks:
1. critical route inventory remains present
2. protected navigation calls `ensureServerSession()`
3. staff/admin/manager and admin-only route metadata remain present
4. Pinia auth requires `serverVerified`
5. client-authoritative auth persistence does not return
6. Vue app still installs Pinia and Router

## Merge Evidence

- merged commit: `49e656fca2ac5d7490984645469603474ed267fb`
- Webapp CI #27: PASS
- `npm ci`: PASS
- headless frontend tests: PASS
- router/store smoke: PASS
- security scan: PASS
- production build: PASS
- package.json/package-lock.json synchronized: VERIFIED
- one-time lock refresh workflow removed before merge

## Rollback

Rollback is a single dependency-refresh merge revert because no data/schema migration is part of this work item.
