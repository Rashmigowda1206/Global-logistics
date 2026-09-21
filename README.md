# TRANSITIQ - Global Logistics Control Tower

**Delivery Performance, Delay Risk, and Logistics Efficiency Analysis in Global Supply Chain Operations**

---

## Quick Links and Live Application

- **Live Production Website (Vercel)**: [https://global-logistic-control.vercel.app](https://global-logistic-control.vercel.app)
- **Local Operational Dashboard**: [http://localhost:5173/](http://localhost:5173/)
- **Interactive Report and Deliverables Center**: [http://localhost:5173/reports](http://localhost:5173/reports)
- **Dedicated Local Documents Folder**: `C:\2026 A-Z\Global logistics\`
- **Author and Lead Engineer**: [Rashmigowda1206](https://github.com/Rashmigowda1206)
- **GitHub Repository**: [https://github.com/Rashmigowda1206/Global-logistics.git](https://github.com/Rashmigowda1206/Global-logistics.git)

---

## Official Project Deliverables and Academic Publications

All official project documentation and papers are stored in the dedicated local directory:  
**`C:\2026 A-Z\Global logistics\`**  
and are also checked into the repository's **[`deliverables/`](./deliverables/)** folder.

Click the direct links below to download or view each document:

| Deliverable | Format | Direct Download Links | Repository and Local Links | Description |
| :--- | :---: | :--- | :--- | :--- |
| **Global PPT** | `.pptx` (PowerPoint) | [Download Global_PPT.pptx](https://github.com/Rashmigowda1206/Global-logistics/raw/main/deliverables/Global_PPT.pptx) | - [View in Repository](./deliverables/Global_PPT.pptx)<br>- [Open Local File](file:///C:/2026%20A-Z/Global%20logistics/Global_PPT.pptx) | 16 executive slides covering system architecture, ML delay prediction, and operational ROI |
| **Global Project Report** | `.docx` and `.pdf` | [Download Word (.docx)](https://github.com/Rashmigowda1206/Global-logistics/raw/main/deliverables/Global_Project_Report.docx)<br>[Download PDF](https://github.com/Rashmigowda1206/Global-logistics/raw/main/deliverables/Global_Project_Report.pdf) | - [View in Repository (.docx)](./deliverables/Global_Project_Report.docx)<br>- [Open Local File](file:///C:/2026%20A-Z/Global%20logistics/Global_Project_Report.docx) | 25+ page exhaustive technical specification covering data models, algorithms, and Supabase integration |
| **Global Research Paper** | `.docx` and `.pdf` | [Download Word (.docx)](https://github.com/Rashmigowda1206/Global-logistics/raw/main/deliverables/Global_Research_Paper.docx)<br>[Download PDF](https://github.com/Rashmigowda1206/Global-logistics/raw/main/deliverables/Global_Research_Paper.pdf) | - [View in Repository (.docx)](./deliverables/Global_Research_Paper.docx)<br>- [Open Local File](file:///C:/2026%20A-Z/Global%20logistics/Global_Research_Paper.docx) | IEEE/ACM format paper on late delivery risk modeling, transit duration variance, and mitigation strategies |
| **Global Review Paper** | `.docx` and `.pdf` | [Download Word (.docx)](https://github.com/Rashmigowda1206/Global-logistics/raw/main/deliverables/Global_Review_Paper.docx)<br>[Download PDF](https://github.com/Rashmigowda1206/Global-logistics/raw/main/deliverables/Global_Review_Paper.pdf) | - [View in Repository (.docx)](./deliverables/Global_Review_Paper.docx)<br>- [Open Local File](file:///C:/2026%20A-Z/Global%20logistics/Global_Review_Paper.docx) | Systematic survey of modern AI control towers, real-time IoT cargo visibility, and dynamic rerouting |

---

## Executive Platform Architecture and Core Capabilities

TRANSITIQ is an enterprise-grade autonomous Logistics Control Tower designed for modern global supply chain operations. It integrates real-time telemetry from ocean, air, road, and rail carriers into a centralized operational HUD to detect bottlenecks, predict late delivery risk, and execute corrective freight rerouting.

### 11 Integrated Operational Modules:
1. **Live Network Operations (`/network`)**: Real-time interactive tracking across 128 worldwide ports, air cargo hubs, and inland intermodal terminals.
2. **Delivery Performance Analytics (`/performance`)**: Granular scheduled vs. actual transit variance analysis, carrier SLA compliance scoring, and delay gap histograms.
3. **Delay Intelligence and ML Risk Modeling (`/delay-intelligence`)**: Root-cause diagnostic engine evaluating terminal dwell, customs inspection bottlenecks, and weather friction points.
4. **Multimodal Transport Benchmarking (`/shipping-modes`)**: Comparative speed, cost per ton-mile, and late risk matrices across Air Express, Rail Freight, Road Haulage, and Ocean Container lines.
5. **Regional Operations (`/regions`)**: In-depth corridor analytics, including dedicated operational views for key hubs such as Spain (Port of Valencia, Madrid Hub), Germany, France, and East Asia.
6. **Shipment Explorer (`/shipments`)**: Granular consignment search, live status filters, risk scoring, and route inspection.
7. **Customer and Product Intelligence (`/customers-products`)**: Financial impact analysis, sales per customer segment, and shipment risk correlation.
8. **What-If Scenario Simulator (`/simulator`)**: Monte Carlo simulation engine testing modal shifts, buffer time adjustments, and port bypass corridors.
9. **Action Center (`/actions`)**: Task management and automated workflow dispatching for flagged delays.
10. **TransitAI Operational Copilot**: Conversational assistant delivering real-time shipment telemetry lookups, corridor diagnostics, and strategic mitigation advice.
11. **Enterprise Report Center (`/reports`)**: Audit-ready CSV/JSON exports and one-click direct access to official academic publications and presentation decks.

---

## Backend Integration (Supabase)

The platform is configured with an enterprise PostgreSQL backend via Supabase:
- **Database Schema**: Located in [`supabase/schema.sql`](./supabase/schema.sql).
- **Core Tables**: `shipments`, `trade_routes`, `network_nodes`, `what_if_simulations`.
- **Client Configuration**: [`src/services/supabaseClient.ts`](./src/services/supabaseClient.ts) with local fallback for offline resilience.
- **Environment Variables**: See [`.env.example`](./.env.example) for `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

---

## Cloud Deployment (Vercel)

The application is configured for deployment on Vercel:
- **Routing Configuration**: [`vercel.json`](./vercel.json) provides SPA fallback rewrites for seamless client-side routing.
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

---

## Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/Rashmigowda1206/Global-logistics.git
cd Global-logistics

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

The web dashboard will be available at: **`http://localhost:5173/`**

---

## Author and Copyright

- **Lead Engineer & Author**: [Rashmigowda1206](https://github.com/Rashmigowda1206)
- **Repository**: [https://github.com/Rashmigowda1206/Global-logistics.git](https://github.com/Rashmigowda1206/Global-logistics.git)
- **Local Deliverables Path**: `C:\2026 A-Z\Global logistics\`
- All rights reserved.
