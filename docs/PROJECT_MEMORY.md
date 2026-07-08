# The Liquid Plus - Project Memory

This document tracks the operational state, Sprint progress, design decisions, and system constraints of **The Liquid Plus**. It serves as a persistent context log for both developers and AI assistants.

---

## 1. Project Health & Roadmap Status

We are currently in the **Initialization Phase** (Pre-Code).

### Sprint Progress Tracker
* **Total Timeline**: 6 Sprints (1.5 Months total, 1 week per sprint)
* **Current Cycle**: Sprint 1 (Planning & Project Scaffolding)

```
[S1: Setup] ──> [S2: Auth & DB] ──> [S3: Catalog & Search] ──> [S4: Cart & Order] ──> [S5: Admin Panel] ──> [S6: QA & Launch]
  (Active)       (Pending)             (Pending)              (Pending)          (Pending)          (Pending)
```

---

## 2. Module Registry & Progress

| Module Name | Layer | Status | Target Sprint | Notes / Subtasks |
| :--- | :--- | :--- | :---: | :--- |
| **Project Setup & Docs** | All | **In Progress** | Sprint 1 | Project rules, guardrails, folder creation. |
| **Prisma Schema & DB** | Db | **Pending** | Sprint 2 | Postgres connection, basic user/role models. |
| **Auth & RBAC** | Core/Auth | **Pending** | Sprint 2 | NextAuth session setup, role middleware checks. |
| **Catalog Feature** | Catalog | **Pending** | Sprint 3 | Product model, variant pricing, image handling. |
| **Cart & Checkout** | Checkout | **Pending** | Sprint 4 | Cart store (Zustand), Razorpay integration. |
| **Order Management** | Orders | **Pending** | Sprint 4 | Webhook handling, state flow transitions. |
| **Admin Analytics** | Admin | **Pending** | Sprint 5 | Admin charts (Recharts) and order lists. |
| **Deployment Setup** | Infra | **Pending** | Sprint 6 | Nginx config, PM2 orchestration script. |

---

## 3. Important Implementation Decisions

* **Architecture Choice**: Unified Next.js monolith with an internal Clean Architecture (Repository/Service/Presentation pattern) over a decoupled API server.
  - *Rationale*: Reduces operational complexity, minimizes deployment pipelines, and allows direct server components utilization for performance.
* **Database Choice**: PostgreSQL + Prisma.
  - *Rationale*: Ensures full transactional capability (ACID) necessary for cart operations, while Prisma offers high-speed type-safe schema transitions.
* **State Management**: Zustand.
  - *Rationale*: Lightweight, avoids boilerplate, and easily supports localStorage synchronization for shopping carts.

---

## 4. Known Limitations & Constraints

* **Self-Hosted Focus**: Setup assumes standard PM2 clustering on an Ubuntu server, which requires manual environment setups and connection pool tunings.
* **No Multi-lingual (Phase 1)**: Internationalization (i18n) is excluded from the initial release to speed up checkout iterations.
* **Stripe Disabled**: Stripe client integrations exist as stubs; payments route through Razorpay exclusively for Phase 1 launch.
