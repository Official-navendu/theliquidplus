# The Liquid Plus - Enterprise UI Foundation & Design System

This document defines the complete Design System, Visual Tokens, Layout Guidelines, and Component Specifications for **The Liquid Plus**.

---

## 1. Design Principles & Theme Architecture

The Liquid Plus uses **Geist** (Sans & Mono) as the primary font family across the storefront and admin panels.

### Visual Archetype Split

* **Storefront Theme (High Luxury)**: Monochrome, generous whitespace, sharp/minimalist radius, light text-shadows, and elegant typography.
* **Admin Theme (High-Density Command)**: Compact layouts, slate/zinc backdrops, high-contrast states, and status badges.

---

## 2. Figma-Compatible Design Tokens (W3C Format)

The following JSON schema represents the core visual tokens, structured to be compatible with Figma's token engines (e.g., Token Studio / W3C Design Tokens format).

```json
{
  "color": {
    "brand": {
      "black": { "value": "#09090b", "type": "color" },
      "white": { "value": "#ffffff", "type": "color" },
      "gold": { "value": "#c5a880", "type": "color" }
    },
    "storefront": {
      "light": {
        "background": { "value": "#faf9f6", "type": "color" },
        "foreground": { "value": "#18181b", "type": "color" },
        "primary": { "value": "#18181b", "type": "color" },
        "primary-foreground": { "value": "#faf9f6", "type": "color" },
        "border": { "value": "#e4e4e7", "type": "color" }
      },
      "dark": {
        "background": { "value": "#09090b", "type": "color" },
        "foreground": { "value": "#faf9f6", "type": "color" },
        "primary": { "value": "#faf9f6", "type": "color" },
        "primary-foreground": { "value": "#09090b", "type": "color" },
        "border": { "value": "#27272a", "type": "color" }
      }
    },
    "admin": {
      "light": {
        "background": { "value": "#f8fafc", "type": "color" },
        "foreground": { "value": "#0f172a", "type": "color" },
        "border": { "value": "#cbd5e1", "type": "color" }
      },
      "dark": {
        "background": { "value": "#020617", "type": "color" },
        "foreground": { "value": "#f8fafc", "type": "color" },
        "border": { "value": "#1e293b", "type": "color" }
      }
    }
  },
  "dimension": {
    "spacing": {
      "1": { "value": "4px", "type": "dimension" },
      "2": { "value": "8px", "type": "dimension" },
      "3": { "value": "12px", "type": "dimension" },
      "4": { "value": "16px", "type": "dimension" },
      "5": { "value": "20px", "type": "dimension" },
      "6": { "value": "24px", "type": "dimension" },
      "8": { "value": "32px", "type": "dimension" },
      "10": { "value": "40px", "type": "dimension" },
      "12": { "value": "48px", "type": "dimension" },
      "16": { "value": "64px", "type": "dimension" }
    },
    "radius": {
      "none": { "value": "0px", "type": "dimension" },
      "xs": { "value": "2px", "type": "dimension" },
      "sm": { "value": "4px", "type": "dimension" },
      "md": { "value": "6px", "type": "dimension" },
      "lg": { "value": "8px", "type": "dimension" },
      "xl": { "value": "12px", "type": "dimension" },
      "2xl": { "value": "16px", "type": "dimension" },
      "full": { "value": "9999px", "type": "dimension" }
    }
  }
}
```

---

## 3. Core Design Tokens (CSS Variables)

We define HSL tokens inside `src/app/globals.css` to allow dynamic opacity formatting.

### A. Color Palette
```css
:root {
  /* Storefront Theme - Warm Luxury Light */
  --storefront-background: 40 30% 98%;      /* Warm Off-White (#faf9f6) */
  --storefront-foreground: 240 5.9% 10%;    /* Dark Zinc */
  --storefront-primary: 240 5.9% 10%;
  --storefront-primary-foreground: 40 30% 98%;
  --storefront-border: 240 5.9% 90%;

  /* Admin Theme - Cool Tech Light */
  --admin-background: 210 40% 98%;         /* Cool Slate White */
  --admin-foreground: 222.2 84% 4.9%;       /* Dark Navy */
  --admin-primary: 221.2 83.2% 53.3%;       /* Royal Blue */
  --admin-primary-foreground: 210 40% 98%;
  --admin-border: 214.3 31.8% 91.4%;
}
```

### B. Typography tokens
* Heading Family: `Geist Sans`, sans-serif
* Body Family: `Geist Sans`, sans-serif
* Code Family: `Geist Mono`, monospace

| Token | Size | Line Height | Tracking | Weight |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `3rem` | `1.1` | `-0.02em` | `800` |
| **H1** | `2.25rem` | `1.2` | `-0.02em` | `700` |
| **H2** | `1.875rem` | `1.3` | `-0.01em` | `600` |
| **H3** | `1.5rem` | `1.4` | `-0.01em` | `600` |
| **H4** | `1.25rem` | `1.4` | `0` | `600` |
| **Body Large** | `1.125rem` | `1.6` | `0` | `400` |
| **Body** | `1rem` | `1.6` | `0` | `400` |
| **Small** | `0.875rem` | `1.5` | `0` | `400` |
| **Caption** | `0.75rem` | `1.4` | `0.01em` | `400` |
| **Button** | `0.875rem` | `1` | `0.02em` | `500` |

### C. Spacing Scale
All margins, paddings, and gap dimensions follow an **8px base unit grid** with a **4px sub-grid**:
- `4px` (`space-1`), `8px` (`space-2`), `12px` (`space-3`), `16px` (`space-4`), `20px` (`space-5`), `24px` (`space-6`), `32px` (`space-8`), `40px` (`space-10`), `48px` (`space-12`), `64px` (`space-16`).

### D. Z-Index Scale
- `z-hide`: `-1` | `z-base`: `0` | `z-dropdown`: `1000` | `z-sticky`: `1020` | `z-fixed`: `1030` | `z-modal`: `1040` | `z-popover`: `1050` | `z-toast`: `1060`.

### E. Grid System
* **Storefront Grid**: 12-column fluid grid. Responsive page wrapper constraints: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`. Catalog display defaults to:
  - Mobile: 1 Column
  - Tablet: 2 Columns
  - Laptop: 3 Columns
  - Desktop: 4 Columns (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`)
* **Admin Layout Grid**: Asymmetric panel layout:
  - Sidebar: Fixed `260px`
  - Content Area: `1fr` (fluid) with a standard grid gap of `24px` (`gap-6`).

---

## 4. Motion & Animation System (Framer Motion)

Transitions use spring-based physics instead of linear ease curves, providing a premium visual feel.

```typescript
export const MOTION_PRESETS = {
  springStiff: { type: "spring", stiffness: 350, damping: 25 },
  springSmooth: { type: "spring", stiffness: 220, damping: 30 }
};

export const MOTION_VARIANTS = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.15 }
  },
  modalEnter: {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 10 },
    transition: MOTION_PRESETS.springStiff
  },
  drawerEnterRight: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    transition: MOTION_PRESETS.springStiff
  }
};
```

---

## 5. Icon Guidelines

* **Library**: `lucide-react`.
* **Visual Constraints**:
  - Storefront: `1.5px` stroke-width for thin elegance.
  - Admin: `2px` stroke-width for readability.
* **Sizes**:
  - Small (`size-sm`): `14px` (Inside badges/inline buttons).
  - Medium (`size-md`): `16px` (Standard layout navigation triggers/inputs).
  - Large (`size-lg`): `20px` (Headers/KPI Cards).

---

## 6. Naming Conventions

* **UI Components**: `PascalCase` matching their file names (e.g. `src/components/ui/Button.tsx`).
* **BEM-like Class Ordering**: Utility classes are grouped logically in our JSX structure:
  ```
  [Layout/Positioning] [Spacing] [Typography] [Borders/Radius] [Color/Transitions] [Responsive states]
  ```
* **Variables & Handlers**: `camelCase` (e.g., `isSubmitting`, `onOpenChange`).

---

## 7. Storefront & Admin Layout Guidelines

### A. Storefront Layout
* **Header/Navigation**: Fixed sticky header (`h-16`) containing logo left, navigation center, search, profile, and cart drawer triggers right.
* **Hero Canvas**: Minimum height `70vh`. Large typographic display (`text-5xl lg:text-7xl`), description text, and primary outline button actions.
* **Checkout Layout**: Split 2-column layout:
  - Left Column (60%): Shipping, billing, and credit card/Razorpay integration forms.
  - Right Column (40%): Sticky order summary sidebar displaying product thumbnails and pricing.

### B. Admin Layout
* **Sidebar Nav**: Collapsible left rail (`260px` / `80px`). Lists dashboard links with badges (e.g. pending orders count).
* **Metric Cards Grid**: 4-column layout displaying key metrics (Gross Revenue, Total Orders, Average Order Value, Active Sessions) alongside Recharts visualizations.

---

## 8. Complete Component API Library

Every visual component implements the following unified interaction states:
- **Hover**: Class changes (e.g. `hover:bg-accent hover:text-accent-foreground`).
- **Focus**: Clear focus rings (`focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`).
- **Active**: Scale shrinkage (`active:scale-[0.98]`).
- **Disabled**: Pointer events blocked (`disabled:pointer-events-none disabled:opacity-50`).
- **Loading**: Children replaced with a loader spinner.

### A. Buttons (`src/components/ui/button.tsx`)
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}
```

### B. Form Controls
* **Input / Textarea**: Clean border fields. Error states show destructive border overrides (`border-destructive`).
* **Select**: Trigger displays chosen option; options list is wrapped inside a portal popover container.
* **Switch**: Toggle button using translate transitions to slide between on/off states.
* **OTP Input**: 6 separate box fields with focus moving forward automatically.
* **File & Image Dropzone**: Dash-border container (`border-dashed`) with drag-and-drop triggers, upload progress bars, and image cropping previews.

### C. Overlays & Modals
* **Dialog**: Modal overlay using a background backdrop blur (`backdrop-blur-sm`). Contains scrollable bodies and absolute-positioned close buttons.
* **Drawer / Sheet**: Slides out from viewport edges (right for cart overview, left for mobile nav layouts).
* **Tooltip**: Appears on hover with a slight delay, using the `z-popover` layer.

### D. Feedback & Skeletons
* **Alerts**: Inline notification boxes styled by level (success, warning, destructive, info).
* **Skeletons**: Flat zinc boxes (`bg-muted animate-pulse`) to preview layouts:
  - `ProductGridSkeleton`: 4-column card grid.
  - `ProductDetailSkeleton`: Image gallery placeholder left, form inputs right.
  - `DashboardMetricsSkeleton`: 4 metric cards with loaders.
  - `TableRowsSkeleton`: 5 rows with loading cells.
* **Product Rating Component**: Displays stars and values inline:
  - Format: `★★★★★ 4.8 (128 Reviews)`
  - Active stars use a gold fill (`text-yellow-500`), while inactive stars use a muted fill (`text-muted`).

### E. Tables (`src/components/ui/table.tsx`)
Responsive data grid supporting:
- Sorting: Column headers trigger sort state updates.
- Filtering: Search input left, view filters dropdown right.
- Pagination: Page counts, next/prev arrow triggers, row size selector.
- Row Actions: Popover dropdown menu at row edges.

---

## 9. Accessibility (WCAG AA Compliance)

1. **Aria Attributes**: Interactive items specify `aria-label` tags.
2. **Keyboard Traps**: Focus is trapped within active dialogs and released on close.
3. **Contrast Ratios**: Contrast matches or exceeds WCAG AA levels (`4.5:1` for regular text).
4. **Hydration Warning**: `<html lang="en" suppressHydrationWarning>` handles theme mismatches.
