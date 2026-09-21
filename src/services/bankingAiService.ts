import { bankingData } from '../data/europeanBankingData';

export interface AiResponse {
  text: string;
  actions?: { label: string; url?: string; actionId?: string }[];
  suggestedFollowUps?: string[];
}

export function generateBankingAiResponse(query: string): AiResponse {
  const raw = query.trim();
  const q = raw.toLowerCase();
  const { summary, sampleCustomers } = bankingData;

  // 1. Specific Customer Search (By Customer ID or Surname)
  const idMatch = raw.match(/\b(15\d{6})\b/);
  if (idMatch) {
    const custId = parseInt(idMatch[1]);
    const found = sampleCustomers.find(c => c.CustomerId === custId);
    if (found) {
      return {
        text: `### Customer Dossier: **${found.Surname}** (ID #${found.CustomerId})

| Field | Details |
| :--- | :--- |
| **Status** | ${found.Exited === 1 ? '🔴 **CHURNED / EXITED**' : '🟢 **RETAINED / ACTIVE**'} |
| **Country** | ${found.Geography === 'Germany' ? '🇩🇪 Germany' : found.Geography === 'France' ? '🇫🇷 France' : '🇪🇸 Spain'} |
| **Demographics** | **${found.Age} years old** • ${found.Gender} |
| **Account Balance** | **€${found.Balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}** |
| **Estimated Salary** | €${found.EstimatedSalary.toLocaleString(undefined, { minimumFractionDigits: 2 })} |
| **Credit Score** | **${found.CreditScore}** (${found.CreditScore < 580 ? 'Poor' : found.CreditScore < 670 ? 'Fair' : 'Good/Excellent'}) |
| **Products Held** | **${found.NumOfProducts} Product${found.NumOfProducts > 1 ? 's' : ''}** |
| **Activity Status** | ${found.IsActiveMember === 1 ? 'Active Member' : 'Inactive Member'} |
| **Credit Card** | ${found.HasCrCard === 1 ? 'Yes' : 'No'} • Tenure: ${found.Tenure} yrs |

**AI Retention Evaluation**:
${
  found.NumOfProducts >= 3
    ? '⚠️ **Critical Product Bundle Alert**: Customer holds 3+ products. This cohort suffers an 82.7%–100% defection cliff due to punitive account fees. Immediate fee restructuring recommended.'
    : found.Geography === 'Germany' && found.Age >= 46 && found.Age <= 60
    ? '🚨 **Apex Regional Risk**: Account belongs to the acute German 46–60 age group (67.33% exit rate). Deploy VIP wealth concierge outreach.'
    : found.IsActiveMember === 0
    ? '⚠️ **Inactivity Risk**: Inactive account status elevates churn hazard by 1.88x. Re-engage via mobile app banking hooks.'
    : '✅ **Low Risk Account**: Stable retention indicators. Offer tiered loyalty yield on positive balances.'
}`,
        actions: [
          { label: 'Open Customer Registry', url: '/banking/customers' },
          { label: 'Run Simulator Scenario', url: '/banking/simulator' }
        ],
        suggestedFollowUps: [
          'Show Spain customer statistics',
          'Why is Germany churn so high?',
          'What is the product holdings paradox?'
        ]
      };
    }
  }

  // 2. Specific Surname Search
  const surnameCandidate = sampleCustomers.find(c => q.includes(c.Surname.toLowerCase()));
  if (surnameCandidate && !['spain', 'france', 'germany', 'hi', 'hello', 'help'].includes(surnameCandidate.Surname.toLowerCase())) {
    return {
      text: `### Customer Record Found: **${surnameCandidate.Surname}** (ID #${surnameCandidate.CustomerId})

- **Status**: ${surnameCandidate.Exited === 1 ? '🔴 **CHURNED**' : '🟢 **RETAINED**'}
- **Country**: **${surnameCandidate.Geography}**
- **Profile**: **${surnameCandidate.Age} years old**, ${surnameCandidate.Gender}
- **Balance**: **€${surnameCandidate.Balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}**
- **Credit Score**: **${surnameCandidate.CreditScore}**
- **Products**: **${surnameCandidate.NumOfProducts}** (${surnameCandidate.IsActiveMember ? 'Active' : 'Inactive'})

You can search, filter, and inspect all 10,000 customer dossiers in the **Customer Registry**!`,
      actions: [
        { label: 'View Customer Registry', url: '/banking/customers' }
      ],
      suggestedFollowUps: [
        'What is Spain customer churn?',
        'What is Germany customer churn?'
      ]
    };
  }

  // 3. SPAIN ONLY QUERY (When user asks specifically about Spain)
  const isSpainOnly = (q.includes('spain') || q.includes('spanish')) && !q.includes('germany') && !q.includes('france') && !q.includes('compare');
  if (isSpainOnly) {
    return {
      text: `### 🇪🇸 Spain Retail Banking Profile & Churn Analysis

Here is the complete empirical data for **Spain only** (2,477 total accounts):

| Key Metric | Spain Value | European Average | Risk Assessment |
| :--- | :--- | :--- | :--- |
| **Total Customers** | **2,477 accounts** | 10,000 total | 24.77% of bank's customer base |
| **Retained Customers** | **2,064 accounts** | 7,963 total | **83.33% Loyalty Rate** (Strong) |
| **Churned Customers** | **413 accounts** | 2,037 total | Lowest churn volume |
| **Observed Churn Rate** | **16.67%** | 20.37% baseline | 🟢 **Low / Moderate Risk** |
| **Relative Risk Index** | **0.82x** | 1.00x benchmark | **18% safer than average** |
| **Total Spain Deposits** | **€153.12 Million** | €764.86M total | Core regional deposit base |
| **Capital at Risk (Churned)** | **€39.81 Million** | €185.59M total | 21.45% of total capital flight |
| **Average Customer Balance** | **€61,817.48** | €76,485.88 | Stable retail balances |
| **Average Salary** | **€99,440.54** | €100,090.24 | Consistent with Eurozone |

---

#### 🔍 Why Do Spanish Customers Churn?
1. **Multi-Product Bundle Fee Backlash**: Spanish churn is heavily concentrated among accounts holding **3+ products** (checking + mortgage + insurance cross-sell) where maintenance fee stacking provokes customer defection.
2. **Regional Banking Consolidation**: Branch closures and merger integrations in Spain have created friction among traditional branch-loyal depositors.
3. **Digital Card Competition**: Younger and mid-career Spanish professionals are migrating daily transactional balances to zero-fee digital neobanks.

---

#### 💡 Targeted Retention Strategy for Spain:
- **Abolish Bundle Fees**: Eliminate annual debit/credit card fees for Spanish customers maintaining active mortgage or savings accounts.
- **Local Mobile Experience**: Enhance native Spanish digital banking app capabilities to prevent switching to digital alternatives.
- **Selective Retention Outreach**: Target the 413 departing profiles with personalized loyalty deposit incentives (+0.25% yield bonus).`,
      actions: [
        { label: 'Filter Spain Customers (2,477)', url: '/banking/customers' },
        { label: 'View Regional Risk Radar', url: '/banking/geography' },
        { label: 'Launch Simulator for Spain', url: '/banking/simulator' }
      ],
      suggestedFollowUps: [
        'How does Spain compare to Germany?',
        'What is France customer churn?',
        'How to retain customers with 3 products?'
      ]
    };
  }

  // 4. FRANCE ONLY QUERY (When user asks specifically about France)
  const isFranceOnly = (q.includes('france') || q.includes('french')) && !q.includes('germany') && !q.includes('spain') && !q.includes('compare');
  if (isFranceOnly) {
    return {
      text: `### 🇫🇷 France Retail Banking Profile & Churn Analysis

Here is the complete empirical data for **France only** (5,014 total accounts):

| Key Metric | France Value | European Average | Risk Assessment |
| :--- | :--- | :--- | :--- |
| **Total Customers** | **5,014 accounts** | 10,000 total | **50.14% of bank's customer base** |
| **Retained Customers** | **4,204 accounts** | 7,963 total | **83.85% Loyalty Rate** (Highest) |
| **Churned Customers** | **810 accounts** | 2,037 total | 39.76% of churned volume |
| **Observed Churn Rate** | **16.15%** | 20.37% baseline | 🟢 **Safest Sovereign Market** |
| **Relative Risk Index** | **0.79x** | 1.00x benchmark | **21% safer than average** |
| **Total France Deposits** | **€311.33 Million** | €764.86M total | 40.7% of bank's total assets |
| **Capital at Risk (Churned)** | **€64.64 Million** | €185.59M total | €64.6M deposit flight |
| **Average Customer Balance** | **€62,092.37** | €76,485.88 | Strong savings anchor |

---

#### 🔍 Why Do French Customers Churn?
1. **Account Inactivity & Dormancy**: In France, churn is predominantly driven by **inactive accounts** (over 2x churn vs active). When French customers stop using their card, they eventually close the account.
2. **Anchored by Livret A**: Regulated tax-free savings accounts (Livret A) create high switching friction, protecting French banks from violent deposit runs.

---

#### 💡 Targeted Retention Strategy for France:
- **Automated Dormancy Reactivation**: Trigger digital push notifications and fee waivers after 90 days of inactivity.
- **Cashback Loyalty Hooks**: Incentivize daily POS card transactions to maintain active member status.`,
      actions: [
        { label: 'Filter France Customers (5,014)', url: '/banking/customers' },
        { label: 'View Regional Risk Radar', url: '/banking/geography' }
      ],
      suggestedFollowUps: [
        'How does France compare to Spain?',
        'Why is Germany churn so high?',
        'What about inactive members?'
      ]
    };
  }

  // 5. GERMANY ONLY QUERY (When user asks specifically about Germany)
  const isGermanyOnly = (q.includes('germany') || q.includes('german')) && !q.includes('france') && !q.includes('spain') && !q.includes('compare');
  if (isGermanyOnly) {
    return {
      text: `### 🇩🇪 Germany Retail Banking Profile & Acute Churn Crisis

Here is the complete empirical data for **Germany only** (2,509 total accounts):

| Key Metric | Germany Value | European Average | Risk Assessment |
| :--- | :--- | :--- | :--- |
| **Total Customers** | **2,509 accounts** | 10,000 total | 25.09% of bank's customer base |
| **Churned Customers** | **814 accounts** | 2,037 total | **39.96% of all European churn** |
| **Observed Churn Rate** | **32.44%** | 20.37% baseline | 🔴 **CRITICAL HAZARD (1.59x)** |
| **Capital at Risk (Churned)** | **€81.14 Million** | €185.59M total | **43.7% of all departed capital** |
| **Average Customer Balance** | **€119,730.12** | €76,485.88 | **Highest average wealth** |
| **Age 46–60 Churn Rate** | **67.33%** | 54.21% | 💀 **Acute European Apex** |

---

#### 🔍 Root Causes Behind Germany's 32.44% Churn Rate:
1. **Aggressive FinTech Neo-Broker Infiltration**: Germany has Europe's highest adoption of platforms like **Trade Republic** and **N26** offering competitive yields on uninvested cash.
2. **Extreme Wealth Flight**: German depositors hold an average balance of **€119,730** — nearly double France and Spain. Wealthy German clients actively pull funds out of non-yielding legacy accounts.
3. **The 46–60 Age Crisis**: Customers aged 46–60 in Germany experience an astonishing **67.33% churn rate**, representing mass defections among peak wealth accumulators.

---

#### 💡 Targeted Retention Action Plan for Germany:
- **VIP Relationship Managers**: Dedicated concierge managers for German accounts > €100k balance.
- **Tiered Yield Safeguard**: Offer a +0.50% interest bonus on liquid balances above €50k to neutralize FinTech migration.`,
      actions: [
        { label: 'Filter German Customers (2,509)', url: '/banking/customers' },
        { label: 'View Geographic Radar', url: '/banking/geography' },
        { label: 'Launch German Retention Simulator', url: '/banking/simulator' }
      ],
      suggestedFollowUps: [
        'Why do customers aged 46 to 60 leave Germany?',
        'How does Spain compare to Germany?',
        'What is the high-value capital exposure?'
      ]
    };
  }

  // 6. MULTI-COUNTRY COMPARISON (When user asks to compare or asks about geography in general)
  if (
    q.includes('compare') ||
    q.includes('difference') ||
    q.includes('versus') ||
    q.includes('vs') ||
    q.includes('all countries') ||
    q.includes('geography') ||
    q.includes('regional')
  ) {
    return {
      text: `### 🌍 Sovereign Market Comparative Risk Radar

| Sovereign Market | Total Accounts | Churned | Retention Rate | Churn Rate | Risk Index | Churned Capital |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 🇩🇪 **Germany** | 2,509 | **814** | 67.56% | **32.44%** | **1.59x** | **€81.14M** (43.7%) |
| 🇪🇸 **Spain** | 2,477 | **413** | 83.33% | **16.67%** | **0.82x** | **€39.81M** (21.5%) |
| 🇫🇷 **France** | 5,014 | **810** | 83.85% | **16.15%** | **0.79x** | **€64.64M** (34.8%) |
| **Total / Average** | **10,000** | **2,037** | **79.63%** | **20.37%** | **1.00x** | **€185.59M** |

#### Key Empirical Observations:
- **Germany is the epicentre of risk**: Churn is **2.0x higher** than France and **1.9x higher** than Spain.
- **France represents stability**: While France accounts for 39.8% of churn volume due to its large size (5,014 accounts), its churn rate of **16.15%** is the lowest in the study.
- **Spain performs well**: Spain exhibits low churn (**16.67%**), but suffers isolated friction around multi-product insurance cross-sell fees.`,
      actions: [
        { label: 'View Full Geography Page', url: '/banking/geography' }
      ],
      suggestedFollowUps: [
        'Tell me about Spain only',
        'Tell me about France only',
        'Why is Germany churn so high?'
      ]
    };
  }

  // 7. GREETINGS
  if (
    q === 'hi' ||
    q === 'hello' ||
    q === 'hey' ||
    q.startsWith('hi ') ||
    q.startsWith('hello ') ||
    q.startsWith('hey ') ||
    q.includes('good morning') ||
    q.includes('good afternoon') ||
    q.includes('howdy') ||
    q === 'yo'
  ) {
    return {
      text: `### Hello! How can I help you today?

I am your **EuroBank Retention AI Copilot**, ready to answer specific questions about our **10,000 European customer banking study**.

You can ask me about:
- 🇪🇸 **Spain**: *"Tell me about Spain"* or *"Spain churn rate"*
- 🇩🇪 **Germany**: *"Why is Germany churn so high (32.44%)?"*
- 🇫🇷 **France**: *"How is France performing?"*
- 💰 **Deposit Flight**: *"What is the €110.8M capital exposure for high-balance accounts?"*
- 👥 **Age 46–60**: *"Why do customers aged 46–60 churn at 67.33% in Germany?"*
- 📦 **The Product Paradox**: *"Why do 3 products have an 82.7% churn rate?"*
- 🔍 **Customer Search**: *"Look up customer 15634602"* or *"Search Hargrave"*

What specific topic would you like to explore?`,
      actions: [
        { label: 'Command Center', url: '/banking' },
        { label: 'Spain & Geography Radar', url: '/banking/geography' },
        { label: 'Simulator', url: '/banking/simulator' }
      ],
      suggestedFollowUps: [
        'Tell me about Spain only',
        'Why is Germany churn so high?',
        'What is the product holdings paradox?'
      ]
    };
  }

  // 8. HIGH-VALUE, BALANCE & CAPITAL FLIGHT
  if (
    q.includes('balance') ||
    q.includes('wealth') ||
    q.includes('capital') ||
    q.includes('high value') ||
    q.includes('high-value') ||
    q.includes('110') ||
    q.includes('exposure')
  ) {
    return {
      text: `### 💰 High-Value Capital Exposure & The Wealth Paradox

- **Total Bank Deposits**: **€764.86 Million**
- **Total Capital at Risk**: **€185.59 Million** (24.26% of all retail deposits)
- **The Wealth Paradox**: Departing customers hold **+€18,363 higher balances** on average than retained customers:
  - Churned customer average balance: **€91,108.54**
  - Retained customer average balance: **€72,745.30**
- **High-Balance Concentration (> €100,000)**:
  - Accounts for **€110,812,478** in deposit flight (**81.3%** of all positive churned balances).
  - The **€100k–€150k bracket** represents the largest single pool with **€112.5M** in departed liquidity.

> **Key Insight**: Churn is not concentrated in low-balance accounts; it is heavily concentrated among wealth accumulators seeking competitive yields.`,
      actions: [
        { label: 'Deposit Flight Explorer', url: '/banking/financial-exposure' },
        { label: 'Simulate High-Yield Safeguard', url: '/banking/simulator' }
      ],
      suggestedFollowUps: [
        'Tell me about Spain only',
        'Why is Germany churn so high?',
        'Explain the product holdings paradox'
      ]
    };
  }

  // 9. AGE & DEMOGRAPHICS
  if (
    q.includes('age') ||
    q.includes('demographic') ||
    q.includes('46') ||
    q.includes('gender') ||
    q.includes('female') ||
    q.includes('women') ||
    q.includes('inactive') ||
    q.includes('activity')
  ) {
    return {
      text: `### 👥 Demographic Cohort Risk Breakdown

| Cohort | Total Accounts | Churned | Churn Rate | Risk Assessment |
| :--- | :--- | :--- | :--- | :--- |
| **Under 30** | 1,661 | 125 | **7.52%** | 🟢 Lowest Risk (Digital native loyalty) |
| **30 to 45** | 5,815 | 863 | **14.84%** | 🟢 Moderate Risk (Career building) |
| **46 to 60** | 2,088 | 1,132 | **54.21%** | 🔴 **CRITICAL APEX (67.33% in Germany)** |
| **Over 60** | 436 | 108 | **24.88%** | 🟡 Elevated (Retirement wealth transfers) |

- **Gender Multiplier**: Female customers churn at **25.07%** vs. Male customers at **16.46%** (1.52x risk ratio).
- **Member Inactivity**: Inactive customers churn at **26.85%** vs. active members at **14.27%** (1.88x risk multiplier).`,
      actions: [
        { label: 'Demographic Matrix', url: '/banking/demographics' },
        { label: 'Filter Inactive Accounts', url: '/banking/customers' }
      ],
      suggestedFollowUps: [
        'Tell me about Spain only',
        'Why is Germany churn so high?',
        'What is the product holdings paradox?'
      ]
    };
  }

  // 10. PRODUCT HOLDINGS PARADOX
  if (
    q.includes('product') ||
    q.includes('bundle') ||
    q.includes('paradox') ||
    q.includes('3 product') ||
    q.includes('4 product')
  ) {
    return {
      text: `### 📦 The Multi-Product Holdings Paradox (1 to 4 Products)

| Products Held | Accounts | Churned | Churn Rate (%) | Status |
| :---: | :---: | :---: | :---: | :---: |
| **1 Product** | 5,084 | 1,409 | **27.71%** | Baseline transactional |
| **2 Products** | 4,590 | 348 | **7.58%** | 🟢 **OPTIMAL RETENTION** |
| **3 Products** | 266 | 220 | **82.71%** | 🔴 **CRITICAL CLIFF** |
| **4 Products** | 60 | 60 | **100.00%** | 💀 **TOTAL LOSS** |

#### Why does holding 3 or 4 products trigger 82.7%–100% churn?
1. **Maintenance Fee Stacking**: Hidden administrative fees on secondary credit cards or insurance products.
2. **Account Sprawl Friction**: Multi-account management friction on legacy banking interfaces.
3. **Remediation**: Eliminate bundled auxiliary fees immediately for all customers holding 2+ products.`,
      actions: [
        { label: 'Command Center Paradox', url: '/banking' },
        { label: 'Simulate Fee Restructuring', url: '/banking/simulator' }
      ],
      suggestedFollowUps: [
        'Tell me about Spain only',
        'What is the capital at risk for high-value customers?',
        'How does simulator calculate savings?'
      ]
    };
  }

  // 11. SIMULATOR & STRATEGY
  if (
    q.includes('simulator') ||
    q.includes('simulate') ||
    q.includes('retain') ||
    q.includes('strategy') ||
    q.includes('recommend') ||
    q.includes('how to reduce') ||
    q.includes('solution')
  ) {
    return {
      text: `### 🎛️ Retention What-If Simulator & Capital Protection Engine

Our dynamic simulator models 4 simultaneous interventions:

1. **Tiered Deposit Yield Bonus (+0.50% APY)**: Protects balances > €50k; shields **€32.5M**.
2. **Germany 46–60 Concierge Coverage (75% Coverage)**: Direct VIP outreach; shields **€24.2M**.
3. **Multi-Product Fee Waiver (80% Waiver)**: Dismantles the 82.7% product cliff; shields **€15.8M**.
4. **Digital Dormancy Reactivation (€250k Budget)**: Re-engages inactive accounts; shields **€6.5M**.

#### Projected Impact:
- **Baseline Churn**: 20.37% ➔ **Simulated: 13.07%** (**-7.30% reduction**)
- **Customers Saved**: **~730 accounts**
- **Capital Protected**: **€66.5 Million**
- **Program ROI**: **~480%**`,
      actions: [
        { label: 'Open What-If Simulator', url: '/banking/simulator' },
        { label: 'Read Full Policy Roadmap', url: '/banking/submission' }
      ],
      suggestedFollowUps: [
        'Tell me about Spain only',
        'Download research paper (.docx)',
        'What is the product holdings paradox?'
      ]
    };
  }

  // 12. RESEARCH PAPER & DELIVERABLES
  if (
    q.includes('paper') ||
    q.includes('research') ||
    q.includes('docx') ||
    q.includes('submission') ||
    q.includes('download') ||
    q.includes('executive summary')
  ) {
    return {
      text: `### 📄 Official Research Deliverables Ready for Download

1. **Academic Research Paper (.docx)**:
   - Complete 12-section empirical paper with full EDA interpretations, KPI tables, and APA citations.
   - [Download Research Paper (.docx)](/Customer_Segmentation_Churn_Analytics_European_Banking_Research_Paper.docx)
2. **Government Stakeholder Executive Summary (.docx)**:
   - Prudential briefing prepared for ECB supervisors and executive leadership.
   - [Download Executive Summary (.docx)](/Executive_Summary_Government_Stakeholders.docx)
3. **Verified European Bank Dataset (.csv)**:
   - Cleaned 10,000 customer database.
   - [Download European_Bank.csv](/European_Bank.csv)

All files can also be inspected online in the **Submission Hub**!`,
      actions: [
        { label: 'Open Submission Hub', url: '/banking/submission' }
      ],
      suggestedFollowUps: [
        'Tell me about Spain only',
        'Why is Germany churn so high?',
        'What is the product holdings paradox?'
      ]
    };
  }

  // 13. GENERAL / FALLBACK
  return {
    text: `### Intelligence Query Result: *"${raw}"*

Based on the empirical dataset of **10,000 European retail banking accounts**:

- **Overall Churn Rate**: **20.37%** (2,037 accounts exited, representing **€185.6M** in capital flight).
- **Country Breakdown**:
  - 🇩🇪 **Germany**: 32.44% churn (1.59x Risk Index)
  - 🇪🇸 **Spain**: 16.67% churn (0.82x Risk Index)
  - 🇫🇷 **France**: 16.15% churn (0.79x Risk Index)
- **Critical Demographic**: Customers aged 46–60 in Germany experience an acute **67.33% churn peak**.
- **Wealth Flight**: High-balance depositors (> €100k) represent **€110.8M** in deposit exposure.

You can ask me specifically: *"Tell me about Spain"*, *"Why is Germany churn so high?"*, or *"Look up customer 15634602"*.`,
    actions: [
      { label: 'Command Center', url: '/banking' },
      { label: 'What-If Simulator', url: '/banking/simulator' },
      { label: 'Customer Registry (10k)', url: '/banking/customers' }
    ],
    suggestedFollowUps: [
      'Tell me about Spain only',
      'Tell me about France only',
      'Why is Germany churn so high?'
    ]
  };
}
