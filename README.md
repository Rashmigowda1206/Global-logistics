# TRANSITIQ — Global Logistics Control Tower

**Delivery Performance, Delay Risk, and Logistics Efficiency Analysis in Global Supply Chain Operations**

- **Author & Lead Engineer**: [panchaksharayya12](https://github.com/panchaksharayya12)
- **GitHub Repository**: [https://github.com/panchaksharayya12/Global-logistic-control.git](https://github.com/panchaksharayya12/Global-logistic-control.git)
- **Local Deliverables Directory**: `C:\2026 A-Z\Global logistics`
- **Technology Stack**: React 18 • TypeScript • Vite 6 • Tailwind CSS • Recharts • Supabase (PostgreSQL) • Vercel Cloud

---

## 🌟 Executive Platform Overview

**TRANSITIQ** is an enterprise-grade autonomous Logistics Control Tower designed for modern global supply chain operations. It integrates real-time telemetry from ocean, air, road, and rail carriers into a centralized operational HUD to detect bottlenecks, predict late delivery risk, and execute corrective freight rerouting.

### Core Capabilities:
1. **🌐 Live Network Operations**: Real-time interactive tracking across **128 worldwide ports, air cargo hubs, and inland intermodal terminals**.
2. **⚡ Delivery Performance Analytics**: Granular scheduled vs. actual transit variance analysis, carrier SLA compliance scoring, and delay gap histograms.
3. **🧠 Delay Intelligence & ML Risk Modeling**: Root-cause diagnostic engine evaluating terminal dwell, customs inspection bottlenecks, and weather friction points.
4. **🚢 Multimodal Transport Benchmarking**: Comparative speed, cost per ton-mile, and late risk matrices across Air Express, Rail Freight, Road Haulage, and Ocean Container lines.
5. **🇪🇸 Regional Operations (Europe, Asia-Pacific, Americas)**: In-depth corridor analytics, including dedicated operational views for key hubs such as Spain (Port of Valencia, Madrid Hub), Germany, France, and East Asia.
6. **🎛️ What-If Scenario Simulator**: Monte Carlo simulation engine testing modal shifts, buffer time adjustments, and port bypass corridors.
7. **🤖 TransitAI Operational Copilot**: ChatGPT-style conversational assistant delivering real-time shipment telemetry lookups, corridor diagnostics, and strategic mitigation advice.
8. **📄 Enterprise Report Center**: Audit-ready CSV/JSON exports and one-click access to official academic publications and presentation decks.

---

## 📁 Official Project Deliverables & Academic Publications

All official project documentation is stored in the dedicated local directory:  
📂 **`C:\2026 A-Z\Global logistics\`**  
and available for direct download via the web application's **Report Center**:

| Deliverable | Format | File Name | Description |
| :--- | :---: | :--- | :--- |
| **Executive Presentation Deck** | `.pptx` | `Global_Logistics_Control_Tower_Presentation.pptx` | 16 executive slides covering system architecture, ML models, and ROI |
| **Comprehensive Project Report** | `.docx` & `.pdf` | `Global_Logistics_Control_Tower_Project_Report.docx` | 25+ page exhaustive specification covering data models and algorithms |
| **Academic Research Paper** | `.docx` & `.pdf` | `Global_Logistics_Control_Tower_Research_Paper.docx` | IEEE/ACM format paper on late delivery risk modeling and empirical results |
| **Literature Review Paper** | `.docx` & `.pdf` | `Global_Logistics_Control_Tower_Literature_Review_Paper.docx` | Systematic survey of modern AI control towers and supply chain visibility |

---

## 🗄️ Backend Integration (Supabase)

The platform is configured with an enterprise PostgreSQL backend via Supabase:
- **Database Schema**: Located in `supabase/schema.sql`.
- **Core Tables**: `shipments`, `routes`, `network_nodes`, `carrier_slas`, `delay_incidents`, `simulations`.
- **Client Configuration**: `src/services/supabaseClient.ts` with local mock fallback for resilience.
- **Environment Variables**: See `.env.example` for `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

---

## 🚀 Cloud Deployment (Vercel)

The application is fully configured for deployment on **Vercel**:
- **Routing Configuration**: `vercel.json` provides SPA fallback rewrites for seamless client-side routing.
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

---

## 💻 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/panchaksharayya12/Global-logistic-control.git
cd Global-logistic-control

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

---

## 👤 Author & Copyright

- **Lead Engineer & Author**: [panchaksharayya12](https://github.com/panchaksharayya12)
- **Repository**: [https://github.com/panchaksharayya12/Global-logistic-control.git](https://github.com/panchaksharayya12/Global-logistic-control.git)
- All rights reserved.
