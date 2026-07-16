# The Liquid Plus - Enterprise Database Architecture Blueprint

This document establishes the production-grade database standards, schemas, performance indices, replication setups, and migration guidelines for **The Liquid Plus** PostgreSQL database.

---

## 1. Database Naming Standards

To ensure consistency, schema safety, and ease of automated tooling integrations, the database enforces strict snake_case naming conventions:

* **Tables**: Lowercase, pluralized snake_case (e.g. `users`, `product_variants`, `order_items`).
* **Columns**: Lowercase, singular snake_case (e.g. `first_name`, `email_verified_at`, `unit_price`).
* **Primary Keys**: Name the column `id` (UUID format).
* **Foreign Keys**: Named as `[singular_parent_table_name]_id` (e.g. `user_id` inside the `orders` table).
* **Constraints**:
  - Primary Key: `pk_[table_name]` (e.g. `pk_users`).
  - Foreign Key: `fk_[referencing_table]__[referenced_table]` (e.g. `fk_orders__users`).
  - Unique Key: `uq_[table_name]__[column_name]` (e.g. `uq_users__email`).
  - Check Constraint: `ck_[table_name]__[constraint_name]` (e.g. `ck_products__price_positive`).
* **Indexes**:
  - B-Tree index: `idx_[table_name]__[column_name]` (e.g. `idx_products__slug`).
  - Composite index: `idx_[table_name]__[col1]_[col2]` (e.g. `idx_order_items__order_id_variant_id`).
  - Unique index: `udx_[table_name]__[column_name]` (e.g. `udx_users__email`).
* **Enums**: Lowercase, singular snake_case ending with `_enum` (e.g. `order_status_enum`).
* **Timestamps**: Suffixed with `_at` (e.g. `created_at`, `updated_at`, `deleted_at`).
* **Audit Fields**: Prefix with `created_by_` or `updated_by_` referencing user IDs.

---

## 2. Authentication vs. Business Data Separation

To maximize security boundaries and comply with database design practices, user authentication data and customer business profile data are decoupled:

```
┌─────────────────────────────────┐           ┌─────────────────────────────────┐
│              users              │           │        customer_profiles        │
├─────────────────────────────────┤           ├─────────────────────────────────┤
│ - id (UUIDv7) [PK]              │ 1 ◄─────1 │ - id (UUIDv7) [PK]              │
│ - email (VARCHAR)               │           │ - user_id (UUIDv7) [FK] [UQ]    │
│ - password_hash (VARCHAR)       │           │ - first_name (VARCHAR)          │
│ - role (ENUM)                   │           │ - last_name (VARCHAR)           │
│ - email_verified_at (TIMESTAMP) │           │ - lifetime_spend (DECIMAL)      │
│ - is_active (BOOLEAN)           │           │ - total_orders_count (INT)      │
└─────────────────────────────────┘           └─────────────────────────────────┘
    [Authentication Layer]                         [Business / Retail Layer]
```

### A. Authentication Schema Layer (`users`)
* **Purpose**: Serves as the identity provider (IdP) containing credentials, multi-factor secrets, verification tokens, and role tags.
* **Access Rules**: Highly restricted. Queries against this table are limited to authentication, session validation, and password reset flows.

### B. Business Profile Schema Layer (`customer_profiles`)
* **Purpose**: Stores marketing details, customer preferences, billing defaults, lifetime spend computations, and order frequency counters.
* **Relationship**: Maps 1:1 via a unique foreign key constraint `user_id` referencing `users(id)`.
* **Access Rules**: Regularly queried by storefront layouts and admin dashboards for CRM analyses, bypassing sensitive security keys.

---

## 3. Database Modules & Domains

Tables are grouped into 14 distinct logical schema domains:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          DATABASE DOMAIN GROUPS                         │
└─────────────────────────────────────────────────────────────────────────┘
  ├── Identity       : users, roles, permissions, sessions, role_permissions, api_keys
  ├── Catalog        : products, product_variants, categories, brands, reviews,
  │                    attributes, attribute_values, variant_attributes
  ├── Inventory      : inventory_items, stock_reservations, warehouse_logs
  ├── Orders         : orders, order_items, order_statuses_log, shipments, tax_rules
  ├── Payments       : payment_transactions, refund_transactions, payment_methods
  ├── Customers      : customer_profiles, shipping_addresses, wishlist_items, carts, cart_items
  ├── Marketing      : coupons, user_coupon_redemptions, campaigns
  ├── SEO            : seo_metadata_records
  ├── Content        : blog_posts, cms_pages
  ├── Media          : media_assets, media_folders
  ├── Notifications  : notification_queues, notification_logs, notification_templates
  ├── Analytics      : sales_daily_aggregates, product_views, page_views, search_logs
  ├── Settings       : store_settings, currency_configs
  └── System         : audit_logs, activity_logs, application_error_logs
```

---

## 4. Complete Table Inventory

### A. Identity Domain
1. **`users`**: Authentication credentials, hashes, and identity flags.
2. **`roles`**: System role listings.
3. **`permissions`**: Granular security checks.
4. **`role_permissions`**: Link table mapping roles to permissions.
5. **`user_sessions`**: Session database stores mapping active auth sessions.
6. **`api_keys`**: Authenticates external services.
   - *Fields*: `id`, `key_hash` (unique), `name`, `is_active`, `role_id` (references roles), `expires_at`, `created_at`.

### B. Catalog Domain
7. **`products`**: Product info container.
8. **`product_variants`**: Variant attributes.
9. **`categories`**: Nested catalog categories.
10. **`brands`**: Manufacturer details.
11. **`product_reviews`**: Star count + numeric ratings.
12. **`attributes`**: Variant classification settings (e.g. Size, Color).
    - *Fields*: `id`, `name`, `code` (slug), `type` (e.g. color picker, dropdown).
13. **`attribute_values`**: Specific options mapping attributes (e.g. XL, White, #FFFFFF).
    - *Fields*: `id`, `attribute_id` (references attributes), `value`, `label`.
14. **`variant_attributes`**: Bridge mapping variants to option values.
    - *Fields*: `id`, `variant_id` (references product_variants), `attribute_value_id` (references attribute_values).

### C. Inventory Domain
15. **`inventory_items`**: Stock counts per variant.
16. **`stock_reservations`**: 15m commitments.

### D. Orders Domain
17. **`orders`**: Invoices.
18. **`order_items`**: Item rows.
19. **`order_statuses_log`**: History log.
20. **`shipments`**: Logistics tracking.
    - *Fields*: `id`, `order_id` (references orders), `carrier`, `tracking_number`, `status` (PENDING, DISPATCHED, IN_TRANSIT, DELIVERED), `shipped_at`, `delivered_at`.
21. **`tax_rules`**: Regional taxation rates.
    - *Fields*: `id`, `name`, `rate` (Decimal), `country`, `state`, `zip_code`.

### E. Payments Domain
22. **`payment_transactions`**: Financial transaction info.
23. **`refund_transactions`**: Reversal audits.
24. **`payment_methods`**: Customer saved payment cards.
    - *Fields*: `id`, `user_id` (references users), `provider` (Razorpay/Stripe), `type` (card, upi), `gateway_token`.

### F. Customers Domain
25. **`customer_profiles`**: 1:1 business profiles of users.
26. **`shipping_addresses`**: Client shipping addresses.
27. **`wishlist_items`**: User selections.
    - *Fields*: `id`, `user_id` (references users), `variant_id` (references product_variants), `created_at`.
28. **`carts`**: Customer active cart details.
    - *Fields*: `id`, `user_id` (nullable for guest carts), `session_id` (cookie identifier), `created_at`, `updated_at`.
29. **`cart_items`**: Quantity counters.
    - *Fields*: `id`, `cart_id` (references carts), `variant_id` (references product_variants), `quantity`, `created_at`, `updated_at`.

### G. Marketing Domain
30. **`coupons`**: Discount details.
31. **`user_coupon_redemptions`**: Usage limits.

### H. SEO Domain
32. **`seo_metadata_records`**: Metadata details.

### I. Content Domain
33. **`blog_posts`**: CMS blog posts.
34. **`cms_pages`**: Legal and Static page templates.

### J. Media Domain
35. **`media_assets`**: Asset data.
36. **`media_folders`**: Virtual folders for organization.
    - *Fields*: `id`, `name`, `parent_id` (self-reference).

### K. Notifications Domain
37. **`notification_logs`**: Logs delivery status.
38. **`notification_templates`**: Holds templates.
    - *Fields*: `id`, `name`, `subject`, `html_content`, `text_content`.

### L. Analytics Domain
39. **`sales_daily_aggregates`**: Aggregated performance metrics.
40. **`search_logs`**: Logs client searches.
    - *Fields*: `id`, `query`, `user_id` (nullable), `results_count`, `created_at`.
41. **`product_views`**: Logs catalog item lookups.
    - *Fields*: `id`, `product_id` (references products), `user_id` (nullable), `session_id`, `created_at`.
42. **`page_views`**: Page view trackers.
    - *Fields*: `id`, `path`, `user_id` (nullable), `session_id`, `created_at`.

### M. Settings Domain
43. **`store_settings`**: Key-value settings repository.
44. **`currency_configs`**: Conversion rates.

### N. System Domain
45. **`audit_logs`**: Changes made by administrators.
46. **`activity_logs`**: Logs customer interface activities (e.g. login updates, payment initiates).
    - *Fields*: `id`, `user_id` (nullable), `action`, `description`, `ip_address`, `created_at`.
47. **`application_error_logs`**: Trace logs.

---

## 5. Relationship Architecture

### A. One-to-One (1:1)
* **`users` $\leftrightarrow$ `customer_profiles`**: 1:1 relationship linking auth credentials to business metadata.

### B. One-to-Many (1:N)
* **`carts` $\rightarrow$ `cart_items`**: A cart has many item rows.
* **`orders` $\rightarrow$ `shipments`**: An order can map to multiple shipments.
* **`attributes` $\rightarrow$ `attribute_values`**: An attribute has multiple values.

### C. Many-to-Many (N:M)
* **`product_variants` $\leftrightarrow$ `attribute_values`**: Linked via the `variant_attributes` bridge table.

---

## 6. Conceptual Entity Relationship Diagram (ERD)

```
  ┌──────────────┐          ┌──────────────────────┐          ┌─────────────────┐
  │    users     │ 1 ──── 1 │  customer_profiles   │          │      carts      │
  └──────┬───────┘          └──────────────────────┘          └────────┬────────┘
         │                                                             │ 1
         │ 1                                                           │
         ▼ N                                                           ▼ N
  ┌──────────────┐                                            ┌─────────────────┐
  │  addresses   │                                            │   cart_items    │
  └──────────────┘                                            └────────┬────────┘
                                                                       │ N
                                                                       │
                                                                       ▼ 1
                                                              ┌─────────────────┐
                                                              │product_variants │
                                                              └─────────────────┘
```

---

## 7. Primary Keys Strategy: UUIDv7 vs. CUID

We choose **UUIDv7** for all primary keys.
* UUIDv7 features a millisecond timestamp at the beginning of the identifier.
* PostgreSQL sorts sequentially during inserts, preventing page splits and keeping index search trees flat and performant.

---

## 8. Index Strategy

* Composite Index on `cart_items` `(cart_id, variant_id)`.
* Unique Index on `api_keys` `(key_hash)`.
* B-Tree Index on `product_views` `(product_id, created_at)` to optimize popularity calculations.
* Partial Index on `user_sessions` where `expires_at > CURRENT_TIMESTAMP` for session audits.

---

## 9. Soft Delete Strategy

* Tables like `products` and `categories` implement a nullable `deleted_at: Timestamp` and `deleted_by: UUID` fields.
* Business reports require active items; queries must verify `deleted_at IS NULL`.

---

## 10. Audit & Versioning Strategy

* **Audit Logs Table**: Logs administrative configuration edits (e.g. price adjustments) with before/after state captures.
* **Activity Logs Table**: Tracks client security audits (failed log-in attempts, password changes).

---

## 11. Media Architecture

* Media documents reside inside `media_assets` with references linking to `media_folders`.
* The `media_folders` self-reference parent folders to build directory trees.

---

## 12. Settings Architecture

* Mapped as a flexible JSONB table `store_settings` grouping settings configurations.
* Return eligibility windows default to 15 days, loaded dynamically from `store_settings` under key `fulfillment.return_window_days`.

---
*The Database Architecture document is fully complete. We are waiting for your approval to proceed to the next phase.*
