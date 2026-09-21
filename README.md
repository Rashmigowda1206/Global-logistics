# Global Logistics Control Tower & European Banking Churn Intelligence

**Author & Lead Engineer**: [panchaksharayya12](https://github.com/panchaksharayya12)  
**Repository**: [https://github.com/panchaksharayya12/Global-logistic-control.git](https://github.com/panchaksharayya12/Global-logistic-control.git)  
**Stack**: React 18 • TypeScript • Vite 6 • Tailwind CSS • Recharts • Supabase (PostgreSQL) • Vercel Cloud  

---

## 🌟 Executive Platform Overview

This enterprise repository provides a dual-suite decision command center designed for executive operational control and financial risk management:

1. **🏦 EuroBank Intelligence — Customer Segmentation & Churn Analytics**:
   - Quantitative empirical research study analyzing **10,000 retail banking accounts** across France, Germany, and Spain.
   - Comprehensive multi-factor segmentation uncovering structural churn drivers, high-value deposit flight, demographic vulnerability cohorts, and policy intervention modeling.
   - Verified Baseline Metrics: **20.37% overall churn** (2,037 accounts), **€185.6M total capital at risk**, and **€110.8M high-balance exposure** (> €100k).
   - Conversational **EuroBank AI Copilot** (ChatGPT-style interface with Markdown rendering, customer dossiers, and isolated country analysis).

2. **🌐 TRANSITIQ — Global Logistics Control Tower**:
   - Real-time multimodal supply chain monitoring across **128 global terminals** and trade corridors.
   - Delay diagnostics, carrier bottleneck tracking, maritime waypoint maps, and fast-track rerouting simulation.

---

## 📁 Academic Deliverables & Research Documentation

All submission documents are located in `public/` and the project root:

| Deliverable | Format | File Name |
| :--- | :---: | :--- |
| **Executive & Academic Slide Deck** | `.pptx` | `Customer_Segmentation_Churn_Analytics_European_Banking.pptx` |
| **Complete Research Paper (12 Sections)** | `.docx` | `Customer_Segmentation_Churn_Analytics_European_Banking_Research_Paper.docx` |
| **Technical Project Report** | `.docx` | `Customer_Segmentation_Churn_Analytics_Technical_Report.docx` |
| **Academic Literature Review Paper** | `.docx` | `Customer_Segmentation_Churn_Analytics_Literature_Review_Paper.docx` |
| **Government Stakeholder Summary** | `.docx` | `Executive_Summary_Government_Stakeholders.docx` |
| **Verified European Bank Dataset** | `.csv` | `European_Bank.csv` (10,000 verified accounts) |

---

## 📊 Core Empirical Findings Summary

- **Geographic Concentration**:
  - **Germany 🇩🇪**: **32.44% churn rate** | **1.59x Risk Index** | **€81.14M capital at risk** (accounts for 39.96% of all churn volume despite having only 25% of customers).
  - **Spain 🇪🇸**: **16.67% churn rate** | **0.82x Risk Index** | **€39.81M at risk**.
  - **France 🇫🇷**: **16.15% churn rate** | **0.79x Risk Index** | **€64.64M at risk**.
- **The Wealth Paradox**:
  - Churned customers maintain significantly higher balances (**€91,108.54**) than retained customers (**€72,745.30**), an **+€18,363.24 premium**.
  - High-balance depositors (> €100,000) account for **€110,812,478** in deposit flight (**81.3%** of all churned capital).
- **Critical Demographic Cohort**:
  - Customers aged **46–60** exhibit an extreme **54.21%** churn rate overall, reaching an acute peak of **67.33% in Germany**.
- **The Product Holdings Paradox**:
  - 1 product: 27.71% churn
  - 2 products: **7.58% churn (OPTIMAL RETENTION)**
  - 3 products: **82.71% churn (CRITICAL COLLAPSE)**
  - 4 products: **100.00% churn (TOTAL DEFECTION)**

---

## 🛠️ Technology Stack & Architecture

- **Frontend**: React 18, TypeScript, Vite 6, Tailwind CSS, Recharts, Lucide-React, `react-markdown`, `remark-gfm`.
- **Backend & Database**: Supabase (PostgreSQL), Row Level Security (RLS), performance indexing.
- **Cloud Hosting**: Vercel Edge Network with SPA rewrite routing (`vercel.json`).

---

## 🚀 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/panchaksharayya12/Global-logistic-control.git
cd Global-logistic-control

# 2. Install dependencies
npm install

# 3. Start the local development server
npm run dev
```

App runs locally at: **http://localhost:5173/**

---

## ☁️ Deployment Guide

### Vercel Deployment
1. Import this repository into [Vercel](https://vercel.com/).
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. The included `vercel.json` ensures all client-side routes resolve without 404 errors.

### Supabase Setup
1. Create a project at [Supabase](https://supabase.com/).
2. Run the SQL statements in `supabase/schema.sql` via the Supabase SQL Editor.
3. Copy your project URL and anon public key to `.env`.

---

## 👤 Author & Ownership

**Author**: panchaksharayya12  
**GitHub**: [@panchaksharayya12](https://github.com/panchaksharayya12)  
**License**: MIT
