# ADR-0003 — Canonical Target Architecture and Principal-based Security Boundary

Status: ACCEPTED  
Date: 2026-09-08

## Context

ADR-0002 established Engine-first/Ports-and-Adapters direction. Current code still has mixed application/delivery responsibilities and client-provided identity values flowing into protected API logic.

Project owner explicitly authorized redesign where beneficial before modifying legacy code.

## Decision

Adopt TARGET_SYSTEM_ARCHITECTURE.md as canonical target design.

Key decisions:
1. Modular monolith, not microservices
2. Delivery → Application → Domain → Ports → Adapters
3. Canonical Principal for authenticated identity
4. Authentication and authorization are separate
5. Protected use cases receive verified Principal
6. UI never owns business rules
7. Composition roots select concrete adapters
8. Test system uses fake/in-memory adapters
9. Migration is incremental, behavior-preserving unless separately approved

## Why Modular Monolith

Current scale does not justify distributed-service complexity. Logical isolation + contracts provide plug-ability without operational burden.

## Security Consequence

Client-provided `lineUserId` may be lookup data but never authentication evidence.

## Testing Consequence

Every application use case must be callable headless.

## Migration

Follow REDESIGN_MIGRATION_PLAN.md.

## Approval

- Product/Project: APPROVED — redesign authorization given 2026-09-08
- Engineering: APPROVED
- Test/Audit: APPROVED
