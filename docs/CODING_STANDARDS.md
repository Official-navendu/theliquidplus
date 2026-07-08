# The Liquid Plus - Coding Standards

This document outlines the coding standards, code patterns, and syntax constraints required for **The Liquid Plus**.

---

## 1. React Conventions

* **Functional Components**: Use standard function declarations rather than arrow functions.
  ```typescript
  // Correct
  export function ProductGrid({ items }: ProductGridProps) {
    return <div className="grid">...</div>;
  }
  ```
* **Props Typing**: Always declare an explicit type interface for component props directly above the component declaration.
* **Leaf Node Interactivity**: Add `'use client'` only to files containing React hooks (e.g. `useState`, `useEffect`) or click handlers. Keep wrappers and layout containers as Server Components.

---

## 2. Next.js Conventions

* **Page Directories**: Pages must serve strictly as routing endpoints. Retrieve route parameters, call the service layer, and pass clean props to presentational components.
* **Server Components Data Fetching**: Call services directly in Server Components instead of invoking internal Route Handlers via `fetch`.
* **SEO Metadata**: Export a typed `metadata` object or implement `generateMetadata` on all dynamic catalog and public pages.

---

## 3. Prisma Conventions

* **Snake Case Database Tables**: Always map model names to snake_case tables using the `@@map` directive.
  ```prisma
  model User {
    id        String   @id @default(uuid())
    email     String   @unique
    createdAt DateTime @default(now()) @map("created_at")

    @@map("users")
  }
  ```
* **Explicit Relations**: Always define relation keys explicitly and ensure database-level foreign key constraints are mapped cleanly.

---

## 4. API & Server Actions Conventions

* **Return Types**: API routes and Server Actions must return a standardized wrapper payload (e.g. `ApiResponse<T>`).
* **Validation at Entry**: Check action request Payloads immediately via Zod schemas.
* **State Mutation Rules**: Every data-mutating transaction must check roles and enforce permission checks before performing changes.

---

## 5. Error Handling

* **Use Standardized Custom Errors**: Throw domain-specific errors (e.g., `NotFoundError`, `UnauthorizedError`) from services/repositories.
* **Unified Error Catching**: Catch all uncaught boundary errors using Next.js `error.tsx` layouts. Do not let raw SQL exceptions bubble up to the client interface.

```typescript
// src/core/error/handler.ts
export function handleAppError(err: unknown): ApiResponse<never> {
  if (err instanceof AppError) {
    return {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    };
  }
  
  // Catch-all
  return {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected system error occurred. Please try again later.'
    }
  };
}
```

---

## 6. Logging

* **Correlation IDs**: Log every error alongside the request correlation ID (`requestId`) to enable trace lookups.
* **Pino Levels**:
  - `info`: Request hits, cron completions, successfully verified payments.
  - `warn`: Failed auth attempts, checkout validation failures.
  - `error`: DB connection failure, third-party API timeout, unhandled exceptions.

---

## 7. Validation

* **Strict Fields**: Set `.strict()` or `.nounknown()` on Zod forms validation schemas to prevent clients sending payload parameters that do not exist on the domain interface.
* **Coercion Safety**: Use `z.coerce` carefully. Ensure dates and currency values are parsed strictly.
