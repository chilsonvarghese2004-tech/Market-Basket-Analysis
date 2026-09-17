# Market Basket Intelligence - Enterprise Analytics Platform

A modern, production-ready frontend for **Market Basket Analysis / Association Rule Mining**.

Built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, **Framer Motion**, **Recharts**, and **Lucide Icons**.

---

## Key Features

1. **Executive Dashboard**:
   - Animated Canvas Product Network Hero with floating nodes and mouse attraction
   - 6 Animated KPI Cards with count-up animations and trend indicators
   - Automated Strategic Business Insights (Highest Lift, Anchor Product, Cross-Selling)
   - Recharts visual widgets (Product frequency, Category distribution donut, Top co-occurrences)

2. **Dataset Management & Upload**:
   - Drag-and-drop file upload supporting `.csv`, `.xlsx`, `.xls`, `.tsv`
   - Client-side streaming parser (PapaParse) with auto-detection for delimiters (`;`, `,`, `\t`)
   - Dataset health statistics: row count, column count, unique catalog items, missing value count, duplicates
   - Smart column schema mapper with auto-detection for `TransactionID`, `ProductName`, `Quantity`, `Date`, `CustomerID`, `Price`
   - Dynamic transaction preview table with search, multi-column sorting, pagination, and column visibility toggles

3. **Data Preprocessing Pipeline**:
   - End-to-end visual pipeline (7 stages from Ingestion, Schema Detection, Data Validation, Null Imputation, Duplicate Removal, Basket Aggregation to One-Hot Matrix Encoding)
   - Animated connectors, execution durations, rows impacted, and status badges

4. **Mining Hyperparameter Configuration**:
   - Minimum Support slider ($0.01$ to $0.40$)
   - Minimum Confidence slider ($0.10$ to $0.95$)
   - Minimum Lift ratio slider ($1.0\times$ to $6.0\times$)
   - Algorithm selection: **FP-Growth** (Frequent-Pattern Tree) vs. **Apriori**
   - Maximum Itemset Size selector ($2$ to $5$ items)
   - Dynamic estimation calculator for predicted rules and execution runtime

5. **Multi-Stage Analysis Loading Experience**:
   - Animated progress overlay simulating sparse matrix construction, frequent itemset mining, rule generation, lift calculation, and insight synthesis

6. **Association Rules Explorer**:
   - Rules table with Antecedent (IF), Consequent (THEN), Support, Confidence, Lift, Leverage, Conviction, and Quality badges
   - Filter bar: search, category selector, min lift/confidence sliders, and ranking metric dropdown
   - Slide-over Rule Detail Drawer featuring natural language interpretation, store placement advice, cross-sell tactics, and related product clusters

7. **Interactive Product Relationship Network**:
   - HTML5 Canvas force-directed graph with 60fps physics simulation
   - Node size scaled by item frequency/support; edge thickness scaled by lift factor
   - Pan, zoom, node drag-and-drop, search filter, min-lift slider, and ego-network node isolation on click/hover

8. **Product Insights & Visual Analytics**:
   - Top 8 Most Frequent Products (Bar Chart)
   - Product Category Breakdown (Donut Chart with custom legend)
   - Strongest Co-Purchased Pairs (Horizontal Bar Chart)
   - Support vs. Confidence Frontier (Scatter Plot with lift-based color encoding)

9. **Smart Recommendations & Basket Simulator**:
   - Select any anchor product from the catalog to see ranked cross-sell recommendations with bundle discount suggestions
   - Interactive shopping cart uplift simulator: add items to cart and see real-time matching association rules and estimated basket revenue expansion

10. **Reports & Exports**:
    - One-click export to **CSV**, **Excel**, **JSON**, and printable **Executive Summary Report**
    - Audit table of recent generated reports

11. **Backend Readiness**:
    - Service layer architecture (`datasetService`, `analysisService`, `recommendationService`, `reportService`)
    - Configured for `VITE_API_BASE_URL` with automatic fallback to client-side in-browser mining engine

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```

---

## Project Structure

```text
frontent/
  ├── public/
  │    └── logo.svg
  ├── src/
  │    ├── types/                 # TypeScript interfaces (Dataset, Rule, Results, etc.)
  │    ├── data/                  # Realistic sample datasets matching Assignment-1_Data.csv
  │    ├── utils/                 # Formatters, Apriori calculation engine, Export utilities
  │    ├── services/              # API and Computation service layer
  │    ├── context/               # AppContext and ToastContext
  │    ├── components/
  │    │    ├── common/           # Sidebar, Topbar, MetricCard, Badge, Modal, Drawer, EmptyState
  │    │    ├── dashboard/        # HeroSection, AnimatedNetworkHero, KPIGrid, QuickInsights
  │    │    ├── dataset/          # FileUploadZone, DatasetStats, ColumnMapper, DataTable
  │    │    ├── preprocessing/    # PipelineVisualizer
  │    │    ├── analysis/         # ConfigPanel, LoadingOverlay
  │    │    ├── rules/            # RulesTable, RuleFilters, RuleDetailModal
  │    │    ├── graph/            # ProductNetworkGraph
  │    │    ├── insights/         # Charts (Frequency, Donut, Scatter, Pairs)
  │    │    ├── recommendations/  # ProductSelector, RecommendationCards, BasketSimulator
  │    │    └── reports/          # ExportActions, RecentReportsTable
  │    ├── pages/                 # Route/View controllers
  │    ├── App.tsx                # Shell layout with responsive navigation & modals
  │    ├── index.css              # Dark theme CSS, grid pattern, custom scrollbars
  │    └── main.tsx               # Root React DOM mount
  ├── package.json
  ├── tsconfig.json
  ├── vite.config.ts
  └── tailwind.config.js
```

