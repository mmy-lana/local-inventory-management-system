# Local Inventory Management System

An enterprise-grade, offline-first inventory management application built with React, Ant Design, and Dexie.js (IndexedDB). Designed for high-density tabular workflows, warehouse tracking, and real-time ledger accounting.

- Live Demo: https://local-inventory-management-system-flame.vercel.app

## Features

- Offline Persistence: Zero cloud latency using IndexedDB via Dexie.js with reactive live queries.
- Enterprise Layout: High-density data grid with compact row toggles, sorting, search debounce, and CSV export.
- Real-Time Valuation: Dynamic KPI tracking for SKUs, on-hand units, inventory cost valuation, and retail worth.
- Threshold Monitoring: Visual capacity and reorder meters flagging items as In Stock, Low Stock, or Out of Stock.
- Stock Ledger: Immutable transaction ledger recording every inbound intake, outbound disbursement, and manual correction.
- Category Management: Taxonomy grouping with automatic item association constraints.
- Mobile Responsive: Slide-over navigation drawer and responsive layout for warehouse handhelds and tablets.

## Tech Stack

- Framework: React 19 + TypeScript + Vite
- UI Library: Ant Design (Custom enterprise dense theme token overrides)
- Persistence: Dexie.js + dexie-react-hooks (IndexedDB wrapper)
- Routing: React Router v7
- Formatting: Intl native currency and tabular number utilities

## Architecture

The project adheres to Atomic Design principles combined with Domain-Driven Design (DDD):

```text
src/
|-- components/
|   |-- atoms/          # Reusable primitives (DenseCell, MoneyText, StatusBadge, StockLevelIndicator)
|   |-- molecules/      # Composite units (SearchBar, MetricStatCard, DenseFilterBar)
|   |-- organisms/      # Structural units (AppHeader, AppSidebar)
|   `-- templates/      # Layout containers (DashboardLayoutTemplate)
|-- config/             # Theme tokens and configuration
|-- features/           # Domain business logic, schemas, repositories, hooks, and modals
|   |-- categories/
|   |-- inventory/
|   `-- transactions/
|-- layouts/            # Persistent shell layout
|-- pages/              # Routed operational views
|-- routes/             # Client-side router configuration
`-- services/db/        # Dexie database instance, table schemas, and initial seeds
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+

### Installation

1. Clone the repository:
   ```bash
   git clone <REPOSITORY_URL>
   cd local-inventory-management-system
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run development server:
   ```bash
   pnpm dev
   ```

4. Build for production:
   ```bash
   pnpm build
   ```

5. Preview production build locally:
   ```bash
   pnpm preview
   ```

## Deployment

Configured for automated deployments on Vercel with single-page application route rewrites defined in `vercel.json`.

- Framework Preset: Vite
- Build Command: `pnpm build`
- Output Directory: `dist`
