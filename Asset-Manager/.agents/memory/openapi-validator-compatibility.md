---
name: OpenAPI validator compatibility
description: OpenAPI constraints that are safe for this workspace's generated Zod client and server schemas.
---

The generated Zod package currently uses a version where format and integer OpenAPI constraints can emit newer helpers that are unavailable at typecheck time. Prefer plain string/number schema fields in the shared OpenAPI contract unless the workspace Zod/codegen versions are upgraded together.

**Why:** A valid OpenAPI document can still fail the monorepo typecheck when Orval emits helpers from a newer Zod API than the installed package exposes.

**How to apply:** After changing `lib/api-spec/openapi.yaml`, run codegen and the full library typecheck before wiring generated schemas into server routes.