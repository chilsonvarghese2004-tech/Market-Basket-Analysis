# Market Basket Intelligence 🛒⚡

> **Discover hidden relationships between products and turn transactions into actionable insights.**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-Latest-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)

---

## 📌 Table of Contents

- [Executive Summary](#-executive-summary)
- [Key Features](#-key-features)
- [Architecture & Repository Structure](#-architecture--repository-structure)
- [Dataset Details](#-dataset-details)
- [Machine Learning & Python Analytics](#-machine-learning--python-analytics)
- [Frontend SaaS Application](#-frontend-saas-application)
- [Association Rule Mining Mathematics](#-association-rule-mining-mathematics)
- [Installation & Quick Start](#-installation--quick-start)
- [API Integration & Backend Readiness](#-api-integration--backend-readiness)
- [License & Contributions](#-license--contributions)

---

## 📊 Executive Summary

**Market Basket Intelligence** is an enterprise-grade retail analytics platform combining:
1. **Unsupervised Machine Learning & Customer Segmentation** in Python (`scikit-learn`, `pandas`, `PCA`, `K-Means`).
2. **Association Rule Mining & Frequent Itemset Discovery** (Apriori and FP-Growth algorithms).
3. **A Modern SaaS Analytics Dashboard** built in React, TypeScript, and Tailwind CSS.

The platform transforms raw transactional records (e.g., invoices, line items, timestamps, prices, customer IDs) into high-converting product bundling strategies, personalized cross-sells, physical shelf layout recommendations, and dynamic cart value uplift simulations.

---

## ✨ Key Features

### 🖥️ 1. Executive Dashboard
- **Interactive Canvas Network Hero**: Real-time floating product nodes with particle physics reacting to cursor movement.
- **6 Animated KPI Cards**: Total Transactions, Unique Catalog Products, Frequent Itemsets, Association Rules, Average Support %, and Average Confidence % with count-up animations and trend indicators.
- **Automated Business Insights**: Highlights the highest lift association, the top anchor product driving basket penetrations, and immediate cross-sell revenue opportunities.

### 📂 2. Dataset Management & Dynamic Preview
- **Drag-and-Drop Ingestion**: Supports `.csv`, `.xlsx`, `.xls`, and `.tsv` files with auto-detection for delimiters (semicolons, commas, tabs).
- **One-Click Demo Loader**: Instantly loads the 522k-record `Assignment-1_Data.csv` retail dataset.
- **Dynamic Schema Column Mapper**: Automatically detects `TransactionID`, `ProductName`, `Quantity`, `Date`, `CustomerID`, and `Price`.
- **Dynamic Data Preview Table**: Search, multi-column sorting, pagination, and column visibility toggles.

### 🔄 3. Visual Data Preprocessing Pipeline
- **7-Stage Interactive Pipeline**:
  $$\text{Ingestion} \longrightarrow \text{Validation} \longrightarrow \text{Null Imputation} \longrightarrow \text{Deduplication} \longrightarrow \text{Basket Aggregation} \longrightarrow \text{One-Hot Encoding} \longrightarrow \text{Ready}$$
- Step-by-step metrics tracking execution duration, affected row counts, and pipeline health.

### ⚙️ 4. Mining Hyperparameter Tuning
- **Precision Sliders**:
  - Minimum Support ($0.01$ to $0.40$)
  - Minimum Confidence ($0.10$ to $0.95$)
  - Minimum Lift ($1.0\times$ to $6.0\times$)
- **Algorithm Selector**: **FP-Growth** (Frequent-Pattern Tree) vs. **Apriori** (Candidate Generation).
- **Maximum Itemset Size**: Configurable from 2 to 5 items.
- **Dynamic Estimation Engine**: Predicts generated rule count and execution runtime prior to launch.
- **Multi-Stage Loading Overlay**: Stepwise progress indicators with radial ambient lighting without freezing the UI.

### 🔗 5. Association Rules Explorer & Slide-Over Drawer
- **Comprehensive Rules Table**: Antecedent (IF) $\rightarrow$ Consequent (THEN), Support, Confidence, Lift, Leverage, Conviction, and quality badges (*Exceptional Lift*, *Strong Confidence*).
- **Multi-Parameter Filter Bar**: Live text search, minimum confidence slider, minimum lift slider, category filter, and metric sorting.
- **Slide-Over Rule Intelligence Drawer**:
  - Antecedent $\rightarrow$ Consequent visual flow
  - Detailed metrics grid
  - Plain-English natural language interpretation
  - Concrete retail placement advice and digital checkout bundling tactics
  - Related product affinity clusters

### 🕸️ 6. Interactive Product Relationship Network
- **60 FPS Force-Directed HTML5 Canvas Simulation**:
  - Nodes represent products (radius scaled to transaction frequency/support, color-coded by category).
  - Edges represent association rules (thickness scaled to lift factor).
  - Features: Mouse wheel zoom, drag-to-pan, interactive node dragging, live node search, minimum lift density slider, and **ego-network isolation** (clicking or hovering a node dims all unrelated items).

### 📈 7. Visual Product Analytics (Recharts)
- **Top 8 Products**: Vertical bar chart of highest volume items.
- **Category Breakdown**: Interactive donut chart showing merchandise distribution.
- **Strongest Co-Purchased Pairs**: Horizontal bar chart ranked by pairwise basket occurrences.
- **Support vs. Confidence Frontier**: 2D scatter plot with color-coded lift tiers.

### 🛍️ 8. Smart Recommendations & Basket Simulator
- **Single-Product Recommender**: Choose any item to display ranked complementary purchases with suggested bundle discounts.
- **Multi-Item Basket Uplift Simulator**: Add items to a simulated shopping cart to trigger active association rules and calculate projected basket revenue uplift ($+15\%$ to $+45\%$).

### 📄 9. Reports & Multi-Format Exports
- Instant export of rules and analytics in **CSV**, **Excel**, **JSON**, and printable **Executive Summary text reports**.
- Audit table tracking export history and file sizes.

---

## 🏗️ Architecture & Repository Structure

```text
Market Basket Analysis/
│
├── Assignment-1_Data.csv      # Primary retail transaction dataset (522k records)
├── customer_clusters.csv      # Output of customer segmentation modeling
│
├── preprocessing.py           # Python data cleaning & RFM feature engineering
├── model.py                   # K-Means clustering, Elbow Method & PCA 2D visualization
├── interface.py               # Standalone customer segmentation execution script
│
└── frontent/                  # Production-Ready React + TypeScript Web Application
     ├── public/
     │    └── logo.svg         # SVG Brand Vector
     ├── src/
     │    ├── types/           # Strict TypeScript domain interfaces
     │    ├── data/            # Curated demo datasets & rule matrices
     │    ├── utils/           # Client Apriori engine, formatters, and export helpers
     │    ├── services/        # Service layer (dataset, analysis, recommendations, reports)
     │    ├── context/         # AppContext & ToastContext providers
     │    ├── hooks/           # Custom React hooks
     │    ├── components/
     │    │    ├── common/     # Sidebar, Topbar, MetricCard, Badge, Modal, Drawer, EmptyState
     │    │    ├── dashboard/  # HeroSection, AnimatedNetworkHero, KPIGrid, QuickInsights
     │    │    ├── dataset/    # FileUploadZone, DatasetStats, ColumnMapper, DataTable
     │    │    ├── preprocessing/ # PipelineVisualizer
     │    │    ├── analysis/   # ConfigPanel, LoadingOverlay
     │    │    ├── rules/      # RulesTable, RuleFilters, RuleDetailModal
     │    │    ├── graph/      # ProductNetworkGraph (Canvas Force-Directed)
     │    │    ├── insights/   # Recharts components (Bar, Donut, Scatter, Pairs)
     │    │    ├── recommendations/ # ProductSelector, RecommendationCards, BasketSimulator
     │    │    └── reports/    # ExportActions, RecentReportsTable
     │    ├── pages/           # 9 Dedicated Views
     │    ├── App.tsx          # Shell layout with responsive navigation & modals
     │    ├── index.css        # Dark theme styling, custom scrollbars & grid pattern
     │    └── main.tsx         # React DOM root mount
     ├── package.json
     ├── tsconfig.json
     ├── vite.config.ts
     └── tailwind.config.js
```

---

## 📁 Dataset Details

The default dataset used by this project is **`Assignment-1_Data.csv`**:

- **Size**: ~41.2 MB
- **Total Records**: 522,065 transactions
- **Delimiter**: Semicolon (`;`)
- **Schema**:
  | Column Name | Type | Description |
  |---|---|---|
  | `BillNo` | String | Unique 6-digit invoice/transaction identifier |
  | `Itemname` | String | Product name/SKU description |
  | `Quantity` | Integer | Quantity of items purchased per line item |
  | `Date` | Timestamp | Transaction date (`DD.MM.YYYY HH:MM`) |
  | `Price` | Float | Unit price in local currency (comma decimal separator) |
  | `CustomerID`| String | Unique customer identifier |
  | `Country` | String | Customer country of residence |

---

## 🧠 Machine Learning & Python Analytics

The root directory contains Python scripts for customer-level feature engineering and unsupervised clustering:

### 1. Preprocessing (`preprocessing.py`)
- Removes duplicates and rows with missing `CustomerID`.
- Cleans categorical text (uppercasing, trimming whitespace).
- Casts dates (`dayfirst=True`) and sanitizes quantities $\le 0$ and prices $< 0$.
- Groups records by `CustomerID` to engineer behavioral RFM features:
  - `TotalTransactions`: Unique bill numbers per customer
  - `TotalItems`: Total line items purchased
  - `UniqueItems`: Distinct product variety
  - `TotalQuantity` & `AverageQuantity`: Total and mean basket unit sizes
  - `TotalSpend` & `AverageSpend`: Monetary volume metrics
  - `CustomerActivityDays`: Recency-to-first-purchase lifespan $(\text{LastPurchase} - \text{FirstPurchase})$

### 2. K-Means Modeling & PCA (`model.py` & `interface.py`)
- Normalizes customer features with `StandardScaler`.
- Runs the **Elbow Method** across $k \in [2, 10]$ plotting inertia to detect optimal cluster counts.
- Fits final `KMeans(n_clusters=4, random_state=42, n_init=10)`.
- Evaluates clustering quality via `silhouette_score`.
- Reduces features into 2 principal components via `PCA(n_components=2)` and plots customer segments.
- Exports clustered customer profiles to `customer_clusters.csv`.

---

## 💻 Frontend SaaS Application

The frontend located in **`frontent/`** is a standalone, commercial-grade Single Page Application (SPA) designed to interface with any MBA backend or function fully in-browser:

- **Theme**: Layered dark modern palette (`#070A11`, `#0B111E`, `#0F172A`), electric cyan (`#06B6D4`), and royal violet (`#8B5CF6`).
- **Responsive Layout**: Desktop collapsible sidebar with tooltips + mobile sliding drawer navigation.
- **In-Browser Client Mining Engine**: Includes an optimized TypeScript implementation of Association Rule Mining in `src/utils/aprioriEngine.ts`, allowing users to upload custom CSV files and mine rules directly in their browser without a live backend server!

---

## 📐 Association Rule Mining Mathematics

Association rule mining seeks to uncover relationships of the form:
$$\text{Antecedent } (A) \Longrightarrow \text{Consequent } (B)$$

Let $D$ be the set of $N$ total transactions, and let $A, B$ be itemsets:

### 1. Support
The proportion of transactions in the dataset containing itemset $A$:
$$\text{Support}(A) = \frac{|\{t \in D \mid A \subseteq t\}|}{N}$$
$$\text{Support}(A \Rightarrow B) = \text{Support}(A \cup B) = \frac{|\{t \in D \mid A \cup B \subseteq t\}|}{N}$$

### 2. Confidence
The conditional probability that a basket contains $B$ given that it contains $A$:
$$\text{Confidence}(A \Rightarrow B) = P(B \mid A) = \frac{\text{Support}(A \cup B)}{\text{Support}(A)}$$

### 3. Lift
The ratio of observed joint support to expected support if $A$ and $B$ were statistically independent:
$$\text{Lift}(A \Rightarrow B) = \frac{\text{Support}(A \cup B)}{\text{Support}(A) \times \text{Support}(B)} = \frac{\text{Confidence}(A \Rightarrow B)}{\text{Support}(B)}$$
- $\text{Lift} = 1$: $A$ and $B$ are independent.
- $\text{Lift} > 1$: Positive association (items co-occur significantly more than chance).
- $\text{Lift} < 1$: Negative association (substitutes or competing items).

### 4. Leverage
The difference between observed frequency and expected frequency under independence:
$$\text{Leverage}(A \Rightarrow B) = \text{Support}(A \cup B) - \big(\text{Support}(A) \times \text{Support}(B)\big)$$

### 5. Conviction
The ratio of expected incorrect prediction frequency if $A$ and $B$ were independent to actual incorrect predictions:
$$\text{Conviction}(A \Rightarrow B) = \frac{1 - \text{Support}(B)}{1 - \text{Confidence}(A \Rightarrow B)}$$

---

## 🚀 Installation & Quick Start

### Prerequisites
- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher
- **Python**: v3.10+ (for Python modeling scripts)

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/market-basket-intelligence.git
cd "market-basket-intelligence"
```

### Step 2: Run the Frontend Web Application
```bash
cd frontent
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

To build the production bundle:
```bash
npm run build
```

### Step 3: Run the Python ML Scripts (Optional)
```bash
# In the root directory:
pip install pandas numpy scikit-learn matplotlib seaborn

# Run data preprocessing:
python preprocessing.py

# Run customer segmentation & PCA visualization:
python model.py
```

---

## 🔌 API Integration & Backend Readiness

The frontend is architected with a decoupled service layer. When running with a backend, configure your environment file in `frontent/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

The frontend service layer automatically routes calls to the following endpoints (with seamless client-side fallback if the API is offline):

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/dataset/upload` | `POST` | Upload and validate raw transaction file |
| `/api/dataset/preview` | `GET` | Retrieve sampled records and schema metadata |
| `/api/analysis/run` | `POST` | Execute Apriori/FP-Growth with custom hyperparameters |
| `/api/rules` | `GET` | Fetch filtered association rules with statistical metrics |
| `/api/recommendations` | `GET` | Fetch ranked cross-sells for a given item |
| `/api/reports/generate` | `POST` | Generate PDF, CSV, or Excel report |

---

## 🛡️ License & Contributions

This project is licensed under the **MIT License**. Contributions, bug reports, and feature suggestions are welcome!

Created with modern data science and frontend engineering principles.

