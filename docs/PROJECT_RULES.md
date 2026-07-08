# The Liquid Plus - Engineering Rules

This document establishes the global engineering principles, architectural boundaries, folder ownership structures, and coding conventions for **The Liquid Plus**. All developers and AI agents must adhere strictly to these rules.

---

## 1. Global Engineering Principles

1. **Strict Decoupling**: Business logic must remain independent of database engines (handled by Prisma via the Repository Layer) and routing frameworks (handled by Next.js App Router Pages/Actions).
2. **Single Source of Truth**: Typings, database schemas, validation schemas, and constants must be defined exactly once.
3. **No Dead/Temporary Code**: Code must be fully typed, production-ready, and accompanied by correct error handling and structured logs on creation.

---

## 2. Folder Ownership & Structure

The repository follows a clean, layered architecture:

| Directory | Layer/Concern | Rules & Restraints |
| :--- | :--- | :--- |
| `src/app/` | **Presentation / Routing** | Page entry points, layouts, metadata exports, and Route Handlers only. No heavy business logic, calculations, or raw SQL. |
| `src/features/` | **Domain Modules** | Cohesive business features. Each folder contains its own self-sufficient layers (`services/`, `repositories/`, etc.). |
| `src/components/ui/` | **Design System** | Atomic, low-level component primitives (e.g. Buttons, Modals). Must be state-independent and pure. |
| `src/lib/` | **Infrastructure Adapters** | External API clients and wrapper classes (e.g., Stripe, Cloudinary, Resend). |
| `src/config/` | **Configuration** | Core setup files (environment validation). |
| `src/constants/` | **Global Constants** | Enums and lookup tables shared across multiple modules. |

---

## 3. Architecture Rules

* **Repository Access Rule**: Services must access data exclusively through a repository. Direct instantiation of the Prisma Client `db` within services, Server Actions, or pages is strictly prohibited.
* **State Flow Direction**: State flows downstream. Presentation components call Services/Actions, Services call Repositories, Repositories query Prisma.
* **Client/Server Component Split**: Mark files as `'use client'` only at the leaf nodes of the component tree (e.g. interactive buttons, forms).

---

## 4. Naming Conventions

* **Files & Directories**:
  - Folders and routing directories: `kebab-case` (e.g., `admin-dashboard`, `product-catalog`).
  - React Components: `PascalCase` (e.g., `ProductCard.tsx`).
  - Service/Repository classes: `PascalCase` (e.g., `ProductService.ts`, `ProductRepository.ts`).
  - Hooks, utils, actions: `camelCase` (e.g., `useProductQuery.ts`, `checkoutAction.ts`).
* **Variables & Functions**:
  - Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_CART_ITEMS`).
  - Functions, instances, and variables: `camelCase` (e.g., `calculateProductTax`).
  - Types & Interfaces: `PascalCase` (e.g., `ProductDetails`).

---

## 5. Import Rules

* **Path Aliases**: Always use absolute paths via the `@/` alias mapped in `tsconfig.json`. Relative paths (e.g., `../../components`) are forbidden.
  - Correct: `import { ProductCard } from '@/components/layout/ProductCard'`
  - Incorrect: `import { ProductCard } from '../../components/layout/ProductCard'`
* **Dependency Directions**:
  - A feature module may import types and utils from other modules.
  - A feature module must NOT import repositories, services, or internal components of another feature module directly. Use shared global boundaries if dependencies are cross-cutting.

---

## 6. TypeScript Rules

* **Strict Mode**: `strict: true` must be enabled.
* **No `any`**: Explicit typing is mandatory. If a type is unknown, use `unknown`.
* **Explicit Function Return Types**: Every exported service method, utility, and API route handler must define its return type explicitly.
* **Type-Safe Casts**: Prefer type assertions (`as Type`) only when interacting with legacy libraries; otherwise, use type guards or Zod validation schemas.
