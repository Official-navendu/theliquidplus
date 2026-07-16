# The Liquid Plus - Database Verification: ERD & Table Dependency Matrix

This document provides a conceptual Entity Relationship Diagram (ERD) and a detailed table dependency matrix for all 47 tables of **The Liquid Plus**, verifying relationships, foreign keys, and load ordering prior to Prisma schema implementation.

---

## 1. Complete Conceptual Entity Relationship Diagram (ERD)

The following Mermaid diagram maps all database modules and their relationships.

```mermaid
erDiagram
    %% IDENTITY MODULE
    users ||--|| customer_profiles : "1:1 user_id"
    users ||--oN user_sessions : "1:N user_id"
    users ||--oN api_keys : "1:N user_id"
    roles ||--oN role_permissions : "1:N role_id"
    permissions ||--oN role_permissions : "1:N permission_id"
    roles ||--oN users : "1:N role_id"
    roles ||--oN api_keys : "1:N role_id"

    %% CATALOG MODULE
    products ||--oN product_variants : "1:N product_id"
    categories ||--oN products : "1:N category_id"
    categories ||--oN categories : "1:N parent_id (Self-Ref)"
    brands ||--oN products : "1:N brand_id"
    products ||--oN product_reviews : "1:N product_id"
    users ||--oN product_reviews : "1:N user_id"
    attributes ||--oN attribute_values : "1:N attribute_id"
    product_variants ||--oN variant_attributes : "1:N variant_id"
    attribute_values ||--oN variant_attributes : "1:N attribute_value_id"

    %% INVENTORY MODULE
    product_variants ||--|| inventory_items : "1:1 variant_id"
    product_variants ||--oN stock_reservations : "1:N variant_id"

    %% CUSTOMERS MODULE
    users ||--oN shipping_addresses : "1:N user_id"
    users ||--oN wishlist_items : "1:N user_id"
    product_variants ||--oN wishlist_items : "1:N variant_id"
    users ||--|| carts : "1:1 user_id (Nullable)"
    carts ||--oN cart_items : "1:N cart_id"
    product_variants ||--oN cart_items : "1:N variant_id"

    %% ORDERS & FULFILLMENT MODULE
    users ||--oN orders : "1:N customer_id"
    orders ||--oN order_items : "1:N order_id"
    product_variants ||--oN order_items : "1:N variant_id"
    orders ||--oN order_statuses_log : "1:N order_id"
    orders ||--oN shipments : "1:N order_id"
    tax_rules ||--oN order_items : "1:N tax_rule_id"

    %% PAYMENTS MODULE
    orders ||--|| payment_transactions : "1:1 order_id"
    orders ||--oN refund_transactions : "1:N order_id"
    users ||--oN payment_methods : "1:N user_id"

    %% MARKETING MODULE
    coupons ||--oN user_coupon_redemptions : "1:N coupon_id"
    users ||--oN user_coupon_redemptions : "1:N user_id"
    campaigns ||--oN coupons : "1:N campaign_id"

    %% MEDIA MODULE
    media_folders ||--oN media_folders : "1:N parent_id (Self-Ref)"
    media_folders ||--oN media_assets : "1:N folder_id"
    media_assets ||--oN products : "1:N media_asset_id (via product_images)"

    %% NOTIFICATIONS MODULE
    notification_templates ||--oN notification_logs : "1:N template_id"
    users ||--oN notification_logs : "1:N user_id"

    %% ANALYTICS MODULE
    products ||--oN product_views : "1:N product_id"
    users ||--oN product_views : "1:N user_id"
    users ||--oN page_views : "1:N user_id"
    users ||--oN search_logs : "1:N user_id"

    %% SYSTEM MODULE
    users ||--oN audit_logs : "1:N user_id"
    users ||--oN activity_logs : "1:N user_id"
```

---

## 2. Table Dependency Matrix & Load Ordering

To prevent circular dependencies and enable safe, zero-downtime execution of seeding and migrations, database tables are classified into three levels of dependency heights:

* **Level 0 (Independent / Leaf Nodes)**: Have no foreign key dependencies. Can be loaded/created in any order.
* **Level 1 (Direct Dependencies)**: Depend exclusively on Level 0 tables.
* **Level 2+ (Complex / Transitively Dependent)**: Depend on Level 1 or other Level 2 tables.

### Dependency Matrix Table

| Table Name | Level | Direct Dependencies (Foreign Keys) | Dependent Tables (Referencing Keys) | Seeding Order Priority |
| :--- | :---: | :--- | :--- | :---: |
| `roles` | 0 | None | `users`, `api_keys` | **1** |
| `permissions` | 0 | None | `role_permissions` | **1** |
| `categories` | 0 | None (Self-Ref only) | `products`, `categories` | **1** |
| `brands` | 0 | None | `products` | **1** |
| `campaigns` | 0 | None | `coupons` | **1** |
| `tax_rules` | 0 | None | `order_items` | **1** |
| `notification_templates` | 0 | None | `notification_logs` | **1** |
| `media_folders` | 0 | None (Self-Ref only) | `media_assets`, `media_folders` | **1** |
| `cms_pages` | 0 | None | None | **1** |
| `store_settings` | 0 | None | None | **1** |
| `currency_configs` | 0 | None | None | **1** |
| `application_error_logs` | 0 | None | None | **1** |
| **`users`** | 1 | `roles` | `customer_profiles`, `user_sessions`, `api_keys`, `shipping_addresses`, `wishlist_items`, `carts`, `orders`, `payment_methods`, `user_coupon_redemptions`, `notification_logs`, `product_views`, `page_views`, `search_logs`, `audit_logs`, `activity_logs` | **2** |
| `role_permissions` | 1 | `roles`, `permissions` | None | **2** |
| `media_assets` | 1 | `media_folders` | `products` (via image joins), `blog_posts` | **2** |
| `coupons` | 1 | `campaigns` | `user_coupon_redemptions` | **2** |
| **`products`** | 2 | `categories`, `brands` | `product_variants`, `product_reviews`, `product_views` | **3** |
| `cms_blog_posts` | 2 | `media_assets` (featured image) | None | **3** |
| `customer_profiles` | 2 | `users` | None | **3** |
| `user_sessions` | 2 | `users` | None | **3** |
| `api_keys` | 2 | `users`, `roles` | None | **3** |
| `shipping_addresses` | 2 | `users` | `orders` (billing/shipping links) | **3** |
| `carts` | 2 | `users` (nullable) | `cart_items` | **3** |
| `payment_methods` | 2 | `users` | None | **3** |
| `user_coupon_redemptions` | 2 | `users`, `coupons` | None | **3** |
| `notification_logs` | 2 | `users`, `notification_templates` | None | **3** |
| `page_views` | 2 | `users` (nullable) | None | **3** |
| `search_logs` | 2 | `users` (nullable) | None | **3** |
| `audit_logs` | 2 | `users` | None | **3** |
| `activity_logs` | 2 | `users` (nullable) | None | **3** |
| **`product_variants`** | 3 | `products` | `inventory_items`, `stock_reservations`, `wishlist_items`, `cart_items`, `order_items` | **4** |
| `product_reviews` | 3 | `products`, `users` | None | **4** |
| `product_views` | 3 | `products`, `users` (nullable) | None | **4** |
| `attributes` | 0 | None | `attribute_values` | **1** |
| `attribute_values` | 1 | `attributes` | `variant_attributes` | **2** |
| `variant_attributes` | 4 | `product_variants`, `attribute_values` | None | **5** |
| `inventory_items` | 4 | `product_variants` | None | **5** |
| `stock_reservations` | 4 | `product_variants` | None | **5** |
| `wishlist_items` | 4 | `users`, `product_variants` | None | **5** |
| `cart_items` | 4 | `carts`, `product_variants` | None | **5** |
| **`orders`** | 3 | `users` (customer_id), `shipping_addresses` | `order_items`, `order_statuses_log`, `shipments`, `payment_transactions`, `refund_transactions` | **4** |
| `order_items` | 4 | `orders`, `product_variants`, `tax_rules` | None | **5** |
| `order_statuses_log` | 4 | `orders` | None | **5** |
| `shipments` | 4 | `orders` | None | **5** |
| `payment_transactions` | 4 | `orders` | None | **5** |
| `refund_transactions` | 4 | `orders` | None | **5** |
| `sales_daily_aggregates` | 0 | None | None | **1** |

---

## 3. Relationship Verification Analysis

1. **Circular Dependency Analysis**:
   - The recursive relationship on `categories` (parent-child) is resolved via a nullable `parent_id` foreign key.
   - The self-reference on `media_folders` (parent-child) is similarly resolved via a nullable `parent_id`.
   - The workflow `users` $\rightarrow$ `orders` $\rightarrow$ `shipping_addresses` has no back-references; `shipping_addresses` links back to `users` and `orders` refers to `shipping_addresses`. This contains no circular loops.
2. **Nullable Foreign Key Constraints**:
   - `carts.user_id` is nullable to allow anonymous shopping cart state retention.
   - `search_logs.user_id`, `product_views.user_id`, and `page_views.user_id` are nullable to log anonymous analytics traffic.
3. **Delete Cascades Policy**:
   - Deleting a parent `Product` cascades to delete its `ProductVariant` records.
   - Deleting a `ProductVariant` is blocked (`onDelete: Restrict`) if it has links inside `order_items`, protecting order invoices.
