# The Liquid Plus - AI & Engineering Guardrails

This document establishes the hard constraints and guardrails that must never be violated during the engineering and generation phases of **The Liquid Plus**.

---

## 1. Rules That AI Must Never Violate

* **No Placeholders**: Never generate functions containing comments like `// TODO: Implement later` or `// Add logic here`. Code must be fully implemented, syntactically correct, and production-ready.
* **No Direct DB Access in Views**: Never access the Prisma Database (`db` or `prisma`) inside Next.js pages or Server Components. All database reads/writes must go through the Repository layer and be orchestrated by the Service layer.
* **No Inline Type Casting**: Do not use `as any` or `@ts-ignore` to silence the TypeScript compiler. Fix the underlying type definition.
* **No Ad-Hoc Styling**: Do not introduce custom HEX colors or random sizing units in Tailwind classes. Utilize theme variables (`bg-primary`, `text-foreground`, `rounded-md`) to ensure consistent design language.

---

## 2. Component Reuse Policy

* **Check `components/ui` First**: Before creating any new UI element, verify if a suitable primitive already exists in `src/components/ui/`.
* **Extract Feature Components**: If a component is used in multiple views within a single feature module, place it in `src/features/[feature]/components/`. If it is used by *different* feature modules, migrate it to `src/components/` after refactoring.
* **State-Independent Primitives**: Primitives in `src/components/ui/` must remain pure (presentational). They should accept data/handlers via props and not track global state or query data services directly.

---

## 3. File Creation Policy

* **Strict Folder Compliance**: Never create files outside of the standardized folder hierarchy (e.g. do not put helper functions in `src/app` or create loose files under `src/`).
* **Feature Module Standardization**: Any new feature folder added under `src/features/` must implement the 11 subdirectories if relevant, maintaining folder consistency across the repository.
* **Naming Matching**: The filename must exactly match the default export or main export (e.g. `ProductCard.tsx` exports `ProductCard`).

---

## 4. Refactoring Policy

* **Zero Regressions**: Refactoring must not break existing interfaces, TypeScript typings, or database models. If an interface changes, update all references in the same commit.
* **No Structural Dilution**: When refactoring, do not bypass the clean architecture layers. Do not merge Repositories and Services to "save time."
* **Dry Principle Enforcement**: If identical code blocks appear more than twice, extract them into helper functions or hooks within the corresponding layer.

---

## 5. Performance Rules

* **Static First**: Always default to Server Components. Hydrate client bundles only when necessary.
* **Image Optimization**: All images must be rendered using the Next.js `Image` component and serve optimized formats (WebP/AVIF) from Cloudinary. Never use standard HTML `<img>` tags.
* **Database Query Safety**:
  - Never execute unbounded queries. All listings must use standardized pagination parameters.
  - Add database indexes on fields frequently used in filters or searches (e.g., `slug`, `categoryId`, `status`).

---

## 6. Security Rules

* **Input Validation**: Validate all inputs at the boundary using Zod (e.g., in Server Actions, form submit handlers, and API Route Handlers).
* **Sanitize Output**: Prevent XSS by sanitizing markdown or user-generated HTML before rendering (using libraries like DOMPurify).
* **RBAC Enforcement**: Check permissions at the top of every Server Action and Service method. Do not rely solely on middleware route protection.
* **Credentials Safety**: Never commit credentials, private keys, or API tokens. Reference them exclusively through validated `src/config/env.ts` variables.
