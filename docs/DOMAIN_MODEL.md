# The Liquid Plus - Enterprise Domain Model

This document serves as the formal definition of the domain model, aggregate boundaries, entities, value objects, domain events, repository interfaces, state machines, and business invariants for **The Liquid Plus**.

---

## 1. Bounded Contexts

The system is partitioned into the following distinct Bounded Contexts to establish clean boundaries of responsibility:

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                               THE LIQUID PLUS SYSTEM                              │
└─────────────────────────────────────────┬─────────────────────────────────────────┘
                                          │
    ┌───────────────────┬─────────────────┼───────────────────┬───────────────────┐
    ▼                   ▼                 ▼                   ▼                   ▼
┌───────────┐     ┌───────────┐     ┌───────────┐       ┌───────────┐       ┌───────────┐
│ Identity  │     │  Catalog  │     │ Inventory │       │  Sales &  │       │Fulfillment│
│  Context  │     │  Context  │     │  Context  │       │ Checkout  │       │  Context  │
└───────────┘     └───────────┘     └───────────┘       └───────────┘       └───────────┘
```

### A. Identity & Access Management (IAM) Context
* **Ubiquitous Language Scope**: Defines authentication, authorization, registration, session management, roles, and resource permissions.
* **Key Vocabulary**: `User`, `Role`, `Permission`, `Session`, `Credentials`, `OAuthProvider`.
* **Upstream/Downstream**: Upstream to Checkout, Fulfillment, and Marketing Contexts (provides actor verification).

### B. Catalog Context
* **Ubiquitous Language Scope**: Governs products, categories, variants, and product collections available to buyers.
* **Key Vocabulary**: `Product`, `ProductVariant`, `Category`, `Collection`, `SKU`, `Brand`, `Review`, `Rating`.
* **Upstream/Downstream**: Upstream to Inventory, Checkout, and Fulfillment Contexts.

### C. Inventory Context
* **Ubiquitous Language Scope**: Manages physical warehouse stock, inventory adjustments, low-stock thresholds, and temporary check-out reservations.
* **Key Vocabulary**: `InventoryItem`, `StockCommitment`, `StockReservation`, `WarehouseLocation`, `AdjustmentLog`.
* **Upstream/Downstream**: Downstream to Catalog (depends on Variant ID mappings) and Checkout (listens to checkout start).

### D. Sales & Checkout Context
* **Ubiquitous Language Scope**: Coordinates the pricing calculation, discount applications, currency conversions, checkout session creation, and payment callbacks.
* **Key Vocabulary**: `Cart`, `CartItem`, `CheckoutSession`, `TaxCalculation`, `Price`, `TransactionReceipt`, `PaymentGateway`.
* **Upstream/Downstream**: Downstream to Catalog and IAM. Upstream to Fulfillment.

### E. Fulfillment Context
* **Ubiquitous Language Scope**: Manages the lifecycle of orders post-payment confirmation, carrier assignment, tracking code generation, return authorizations, and financial refunds.
* **Key Vocabulary**: `Order`, `OrderItem`, `Shipment`, `DeliveryPartner`, `TrackingCode`, `ReturnRequest`, `RefundTransaction`.
* **Upstream/Downstream**: Downstream to Sales & Checkout.

### F. Marketing & Promotions Context
* **Ubiquitous Language Scope**: Handles voucher creation, campaigns configuration, and user utilization limits.
* **Key Vocabulary**: `Coupon`, `Campaign`, `RedemptionLimit`, `VoucherEligibility`.
* **Upstream/Downstream**: Upstream to Sales & Checkout.

---

## 2. Aggregate Roots & Boundaries

An Aggregate Root is the boundary of transactional consistency. No object outside the aggregate boundary may reference internal entities directly; references must run through the Aggregate Root ID.

### A. User Aggregate Root
* **Root Entity**: `User` (Identity: UUID)
* **Aggregate Boundary**: Includes `User` (Root), `Address` (Entity), `WishlistItem` (Entity), `UserSession` (Entity).
* **Invariants Managed**:
  - A user must have exactly one primary email address.
  - A user cannot possess duplicate addresses marked as "default shipping".

### B. Product Aggregate Root
* **Root Entity**: `Product` (Identity: UUID)
* **Aggregate Boundary**: Includes `Product` (Root), `ProductVariant` (Entity), `ProductImage` (Entity), `ProductReview` (Entity).
* **Invariants Managed**:
  - A product must have at least one active variant to transition to the `ACTIVE` state.
  - Every variant must possess a unique system SKU code.

### C. Order Aggregate Root
* **Root Entity**: `Order` (Identity: UUID)
* **Aggregate Boundary**: Includes `Order` (Root), `OrderItem` (Entity), `PaymentDetails` (Entity), `ShipmentDetails` (Entity), `ReturnDetails` (Entity).
* **Invariants Managed**:
  - The sum of `OrderItem` values plus tax minus coupon discount must equal the Order `totalAmount`.
  - An Order cannot trigger a return request if its delivery status is not verified as `DELIVERED`.

### D. Coupon Aggregate Root
* **Root Entity**: `Coupon` (Identity: UUID)
* **Aggregate Boundary**: Includes `Coupon` (Root), `UserRedemptionLog` (Entity).
* **Invariants Managed**:
  - The aggregate ensures `currentUsageCount` never exceeds `maxUsageCount` in a concurrent environment.

---

## 3. Entities & Value Objects

### A. Entities (Identity-Driven Objects)

1. **User**:
   - Fields: `id: UUID`, `email: EmailAddress`, `passwordHash: PasswordHash`, `role: UserRole`, `isVerified: boolean`, `createdAt: DateTime`.
2. **Product**:
   - Fields: `id: UUID`, `slug: ProductSlug`, `title: string`, `description: string`, `status: ProductStatus`, `categoryId: UUID`.
3. **ProductVariant**:
   - Fields: `id: UUID`, `productId: UUID`, `sku: Sku`, `price: Price`, `attributes: Json` (e.g. Size/Color), `stockCount: number`.
4. **Order**:
   - Fields: `id: UUID`, `invoiceRef: string`, `customerId: UUID`, `status: OrderStatus`, `totalAmount: Price`, `createdAt: DateTime`.
5. **OrderItem**:
   - Fields: `id: UUID`, `orderId: UUID`, `variantId: UUID`, `sku: Sku`, `quantity: number`, `unitPrice: Price`.
6. **PaymentDetails**:
   - Fields: `id: UUID`, `orderId: UUID`, `gateway: string` (e.g. Razorpay), `transactionId: string`, `status: PaymentStatus`, `createdAt: DateTime`.
7. **ReturnDetails**:
   - Fields: `id: UUID`, `orderId: UUID`, `reason: string`, `status: ReturnStatus`, `requestedAt: DateTime`.

### B. Value Objects (Immutable Attribute Containers)

1. **Price (Multi-Currency Ready)**:
   - Attributes: `amount: Decimal`, `currency: String` (e.g. `INR`, `USD`).
   - Equality: Same currency and amount.
2. **Sku (Stock Keeping Unit)**:
   - Attributes: `rawSku: string` (conforming to regex `^[A-Z0-9]{2,4}-[A-Z0-9]{3,5}-[A-Z0-9]{3,4}-[A-Z0-9]{2,3}$`).
3. **ProductSlug**:
   - Attributes: `rawSlug: string` (lowercase, alphanumeric characters separated by hyphens).
4. **AddressDetails**:
   - Attributes: `street: string`, `city: string`, `state: string`, `country: string`, `postalCode: string`.
5. **EmailAddress**:
   - Attributes: `email: string` (validated syntax structure).

---

## 4. Domain Events

Domain Events report transactions across bounded contexts.

* **`UserRegisteredEvent`**:
  - Payload: `userId: UUID`, `email: string`, `timestamp: DateTime`.
* **`ProductPriceChangedEvent`**:
  - Payload: `productId: UUID`, `variantId: UUID`, `oldPrice: Price`, `newPrice: Price`.
* **`OrderPlacedEvent`**:
  - Payload: `orderId: UUID`, `customerId: UUID`, `items: { variantId: UUID, qty: number }[]`, `total: Price`.
* **`PaymentCapturedEvent`**:
  - Payload: `orderId: UUID`, `paymentId: UUID`, `amount: Price`, `gateway: string`.
* **`ShipmentDispatchedEvent`**:
  - Payload: `orderId: UUID`, `shipmentId: UUID`, `trackingNumber: string`, `carrier: string`.
* **`ReturnCreatedEvent`**:
  - Payload: `returnId: UUID`, `orderId: UUID`, `items: { variantId: UUID, qty: number }[]`.
* **`CouponDepletedEvent`**:
  - Payload: `couponId: UUID`, `code: string`.

---

## 5. Domain Services

Domain Services coordinate logic spanning multiple entities or aggregates.

1. **PricingService**:
   - Interface: `calculateFinalPrice(variant: ProductVariant, coupon?: Coupon, taxZone?: string): Price`
   - Purpose: Computes dynamic tax and discounts, returning a multi-currency Price object.
2. **StockReservationService**:
   - Interface: `reserveStock(variantId: UUID, quantity: number, durationMinutes: number): boolean`
   - Purpose: Places a temporary lock on inventory during checkout, ensuring stock is not double-allocated.
3. **FulfillmentEligibilityService**:
   - Interface: `canReturn(order: Order, windowDays: number): boolean`
   - Purpose: Evaluates order delivery timestamps against system-wide parameters to check refund eligibility.

---

## 6. Repository Interfaces

Repositories manage database access for Aggregate Roots.

### A. UserRepository Interface
```typescript
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<boolean>;
}
```

### B. ProductRepository Interface
```typescript
export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  findVariants(productId: string): Promise<ProductVariant[]>;
  save(product: Product): Promise<Product>;
}
```

### C. OrderRepository Interface
```typescript
export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  findByInvoiceRef(ref: string): Promise<Order | null>;
  save(order: Order): Promise<Order>;
}
```

### D. CouponRepository Interface
```typescript
export interface CouponRepository {
  findByCode(code: string): Promise<Coupon | null>;
  save(coupon: Coupon): Promise<Coupon>;
}
```

---

## 7. Business Invariants & Domain Policies

* **Invariant: Variant SKU Uniqueness**:
  - Enforced by: `ProductRepository` matching database unique indices.
* **Invariant: Stock Allocation Lock**:
  - Enforced by: `StockReservationService` transaction isolation locks.
* **Policy: Configurable Return Window**:
  - The return period eligibility defaults to 15 days, but is verified by querying `StoreSettings` database records dynamically inside the `FulfillmentEligibilityService` instead of hardcoding.
* **Policy: Auto-Account Setup for Guest Checkout**:
  - On checkout completion as a guest, a `User` account is automatically created using the guest email. A verification link is sent via the Resend API to set passwords.

---

## 8. State Machines

### A. Product State Machine
```
[DRAFT] ──(Publish)──> [REVIEW] ──(Approval)──> [ACTIVE] ──(Archive)──> [ARCHIVED]
```

### B. Order State Machine
```
[PENDING] ──(Payment Captured)──> [CONFIRMED] ──(Process)──> [PROCESSING] ──(Dispatch)──> [SHIPPED] ──(Delivery Verification)──> [DELIVERED]
   │                                  │                                  │                                    │
   └──(Timeout)──> [CANCELLED]        └──(Admin Cancel)──> [CANCELLED]   └──(Admin Cancel)──> [CANCELLED]    └──(Refund Request)──> [RETURNED] ──> [REFUNDED]
```

### C. Payment State Machine
```
[PENDING] ──(Gateway Webhook Success)──> [CAPTURED]
   │
   └──(Gateway Webhook Failure / Timeout)──> [FAILED]
```

### D. Return State Machine
```
[REQUESTED] ──(Admin Approval)──> [APPROVED] ──(Item Intake)──> [RECEIVED] ──(Fulfillment Complete)──> [COMPLETED]
   │
   └──(Admin Rejection)──> [REJECTED]
```

### E. Coupon State Machine
```
[DRAFT] ──(Start Date Met)──> [ACTIVE] ──(Limits Exhausted)──> [EXHAUSTED]
                                 │
                                 └──(Expiry Date Met)──> [EXPIRED]
```

---

## 9. Cross-Context Relationships

Context interactions are strictly asynchronous:

```
[Sales & Checkout] ──(PaymentCapturedEvent)──> [Inventory Context] : Update allocated stock
[Sales & Checkout] ──(PaymentCapturedEvent)──> [Fulfillment Context] : Initiate shipping process
[Fulfillment Context] ──(OrderShippedEvent)──> [Identity Context] : Update user profile timeline
```

---

## 10. Ubiquitous Language Glossary

* **Aggregate Root**: Entity that represents the gatekeeper for updates inside a transactional boundary.
* **Business Invariant**: A condition that must remain true at all times in a given business state.
* **Committed Stock**: Inventory allocated to checkouts that are pending payment completion.
* **Product Variant**: Specific configuration (e.g. White XL shirt) containing individual SKU and price settings.
* **Value Object**: Immutable domain item identified by properties rather than a database ID.
