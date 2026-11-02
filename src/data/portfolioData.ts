import type { ProjectItem } from '../utils/valuationLogic';

export interface ExperienceItem {
  id: string;
  index: string;
  organization: string;
  role: string;
  division: string;
  period: string;
  location: string;
  tenureType: string;
  confidentialityNote: string;
  mandateSummary: string;
  keyHighlights: string[];
  analyticalPillars: string[];
  quantifiedOutcomes: {
    metric: string;
    label: string;
    context: string;
  }[];
}

export interface ExpertiseCluster {
  id: string;
  index: string;
  domain: string;
  subtitle: string;
  description: string;
  capabilities: string[];
  frameworksAndTools: string[];
}

export interface EducationCredential {
  id: string;
  index: string;
  institution: string;
  credential: string;
  period: string;
  distinction: string;
  focusAreas: string[];
}

export interface LeadershipRole {
  id: string;
  index: string;
  title: string;
  institution: string;
  context: string;
  impactSummary: string;
  highlights: string[];
}

export interface InsightArticle {
  id: string;
  index: string;
  statusTag: string;
  category: string;
  title: string;
  subtitle: string;
  readTime: string;
  date: string;
  abstract: string;
  keyTakeaways: string[];
  fullSections: {
    heading: string;
    body: string;
  }[];
}

export const PROFILE_DATA = {
  name: 'Rajkumar Vadher',
  monogram: 'RV',
  credentialsBadge: 'MBA · IIM Kozhikode  |  CFA Level I  |  Ex-Deloitte',
  headline: 'Business Finance | Valuation & Financial Modelling | Investment Analysis',
  tagline: 'Understanding Businesses. Analysing Investments. Creating Financial Insights.',
  positioningLead:
    'MBA graduate from IIM Kozhikode and finance professional with 3 years of progressive experience across Business Finance, FP&A, Investment Analysis, Corporate Valuation, and Statutory Audit.',
  positioningBody:
    'Combining rigorous accounting foundations established at Deloitte Haskins & Sells with venture capital investment strategy at Inflection Point Ventures and regional business finance ownership at Allcargo Global (North Asia). Focused on translating operational mechanics and financial statements into high-conviction capital allocation and strategic decisions.',
  currentStatus: 'Management Trainee, Finance – North Asia · Allcargo Global',
  location: 'Mumbai / APAC Corridor',
  email: 'rajvadher226@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/in/rajkumar-vadher',
  phonePolicyNote:
    'Direct telephone number is kept private on the public web and shared directly upon institutional or recruitment correspondence via email or LinkedIn.',
  heroKpis: [
    {
      value: '3 Yrs',
      label: 'Cross-Functional Finance Tenure',
      detail: 'Business Finance · Venture Strategy · Statutory Audit',
    },
    {
      value: '~₹1,900Cr',
      label: 'Flagship Valuation Modelling',
      detail: 'Ferns N Petals DCF & Relative Valuation + $500M M&A Target',
    },
    {
      value: '350+',
      label: 'SME IPOs & 250 Exits Studied',
      detail: 'Empirical capital markets & venture liquidity screening',
    },
    {
      value: 'CFA L1',
      label: 'Cleared August 2025 · IIM Kozhikode',
      detail: 'MBA in Finance & Strategy (2024–2026) · B.Com HLCC',
    },
  ],
};

export const PHILOSOPHY_PILLARS = [
  {
    index: '01',
    title: 'Accounting Integrity Meets Forward Strategy',
    description:
      'Nearly two years of statutory audit at Deloitte Haskins & Sells instilled an uncompromising eye for revenue recognition, working-capital mechanics, and balance-sheet quality before building any forward projection.',
  },
  {
    index: '02',
    title: 'Empirical Rigor in Capital Allocation',
    description:
      'Whether screening 41 early-stage ventures across 15+ parameters or evaluating 350+ SME IPOs and 250 startup exit trajectories, conviction is grounded in structured cohorts and unit-economics discipline.',
  },
  {
    index: '03',
    title: 'Operational Partnership Across Geographies',
    description:
      'In Business Finance and FP&A for Allcargo Global’s North Asia operations, financial insights serve as an operational compass—optimising trade-lane profitability, cash conversion cycles, and regional working capital.',
  },
];

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: 'allcargo',
    index: '01',
    organization: 'Allcargo Global',
    role: 'Management Trainee, Finance – North Asia',
    division: 'International Supply Chain & Regional FP&A',
    period: 'May 2026 – Present',
    location: 'Regional Finance · North Asia Mandate',
    tenureType: 'Corporate & Business Finance',
    confidentialityNote: 'Proprietary regional entity figures and commercial rate cards are anonymised in accordance with corporate confidentiality.',
    mandateSummary:
      'Driving regional business finance, trade-lane profitability diagnostics, and working-capital optimisation across the North Asia operational corridor.',
    keyHighlights: [
      'Conducting granular North Asia profitability analysis across key freight corridors, trade lanes, and operating entities to isolate margin expansion levers.',
      'Monitoring and optimising regional working-capital cycles, evaluating DSO/DPO dynamics, credit exposure, and cash-conversion efficiency.',
      'Partnering with commercial and regional leadership to translate monthly financial variance bridges (Volume, Rate, Mix, FX) into actionable pricing and cost decisions.',
      'Standardising executive management reporting packs and forward rolling forecasts for senior finance stakeholders.',
    ],
    analyticalPillars: [
      'Regional P&L Ownership',
      'Working Capital & Cash Conversion',
      'Trade-Lane Profitability',
      'Variance & Rolling Forecasts',
    ],
    quantifiedOutcomes: [
      {
        metric: 'North Asia',
        label: 'Regional P&L & WC Scope',
        context: 'Multi-entity profitability & working-capital tracking',
      },
      {
        metric: 'DSO / DPO',
        label: 'Liquidity Diagnostics',
        context: 'Receivables ageing & working-capital cycle optimisation',
      },
      {
        metric: 'P-V-M Bridge',
        label: 'Commercial Variance Rigor',
        context: 'Price-Volume-Mix attribution across freight lanes',
      },
    ],
  },
  {
    id: 'ipv',
    index: '02',
    organization: 'Inflection Point Ventures (IPV)',
    role: 'Investment Strategy Intern',
    division: 'Venture Capital · Deal Screening & Exit Research',
    period: 'April 2025 – June 2025',
    location: 'Gurugram / Investment Strategy Team',
    tenureType: 'Venture Capital & Investment Analysis',
    confidentialityNote: 'Individual portfolio company names and proprietary deal terms are anonymised.',
    mandateSummary:
      'Executed high-throughput startup screening, empirical SME IPO aftermarket research, and multi-company exit pathway modelling to inform institutional angel and venture deployment.',
    keyHighlights: [
      'Screened 41 early-stage and growth startups using a structured 15+ metric evaluation matrix covering unit economics, CAC/LTV, TAM depth, burn multiples, and governance.',
      'Conducted a comprehensive empirical analysis of 350+ SME IPOs in India to evaluate listing liquidity, valuation multiples, subscription trends, and post-listing institutional viability.',
      'Executed startup exit screening across 250 portfolio and market companies to map strategic M&A, secondary buyout, and public-market liquidity pathways.',
      'Synthesised sector investment notes and screening scorecards to accelerate investment committee decision velocity.',
    ],
    analyticalPillars: [
      '15+ Metric Venture Scorecard',
      'SME IPO Empirical Research',
      'Startup Exit Screening',
      'Unit Economics & Cohort Analysis',
    ],
    quantifiedOutcomes: [
      {
        metric: '41 Startups',
        label: 'Evaluated via 15+ Metrics',
        context: 'Structured multi-factor venture screening model',
      },
      {
        metric: '350+ IPOs',
        label: 'SME Public Listings Analysed',
        context: 'Valuation multiples & aftermarket liquidity study',
      },
      {
        metric: '250 Firms',
        label: 'Startup Exit Screening',
        context: 'Strategic M&A and secondary exit readiness mapping',
      },
    ],
  },
  {
    id: 'deloitte',
    index: '03',
    organization: 'Deloitte Haskins & Sells',
    role: 'Audit Analyst',
    division: 'Statutory Audit & Assurance',
    period: 'August 2022 – June 2024',
    location: 'Ahmedabad / Mumbai',
    tenureType: 'Statutory Audit & Financial Reporting (~2 Years)',
    confidentialityNote: 'Client identities and audit schedules are protected under statutory assurance confidentiality.',
    mandateSummary:
      'Delivered end-to-end statutory audit engagements, Ind AS financial statement verification, internal financial controls (IFCoFR) testing, and substantive analytical procedures for enterprise clients.',
    keyHighlights: [
      'Executed substantive testing and analytical review of revenue recognition, inventory valuation, trade receivables, fixed assets, and operating expenses under Ind AS and Indian GAAP.',
      'Evaluated Internal Financial Controls over Financial Reporting (IFCoFR), identifying process gaps in procure-to-pay (P2P), order-to-cash (O2C), and financial statement close.',
      'Performed detailed financial ratio diagnostics, working-capital reconciliation, and audit schedule verification in coordination with client CFO offices and senior management.',
      'Built foundational mastery in dissecting complex notes to accounts, contingent liabilities, and cash-flow quality.',
    ],
    analyticalPillars: [
      'Ind AS Financial Reporting',
      'Internal Controls (IFCoFR)',
      'Revenue & Working Capital Audit',
      'Financial Statement Forensics',
    ],
    quantifiedOutcomes: [
      {
        metric: 'Aug 22–Jun 24',
        label: 'Big-4 Assurance Tenure',
        context: 'Nearly 2 years of full-cycle statutory audit execution',
      },
      {
        metric: 'O2C · P2P',
        label: 'Core Process & Control Audits',
        context: 'Substantive analytical & internal control verification',
      },
      {
        metric: 'Ind AS',
        label: 'Accounting Standards Rigor',
        context: 'Financial statement schedules & notes verification',
      },
    ],
  },
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'fnp-valuation',
    index: '01',
    title: 'Ferns N Petals (FNP) Comprehensive Corporate Valuation',
    subtitle: 'Intrinsic DCF, Relative Comps & Omnichannel Unit-Economics Modelling',
    category: 'Valuation & M&A',
    projectClassification: 'Academic Valuation Case Study · IIM Kozhikode',
    headlineMetric: '~₹1,900Cr',
    metricContext: 'Implied Enterprise Valuation',
    period: '2025 · Academic Valuation Research',
    affiliation: 'IIM Kozhikode · Corporate Valuation',
    summary:
      'Constructed a ground-up 3-statement financial projection and intrinsic Discounted Cash Flow (DCF) model for Ferns N Petals, triangulated against specialty retail and D2C gifting comparables to arrive at an implied valuation of ~₹1,900 Crore.',
    analyticalApproach:
      'Combined bottom-up unit economics (order frequency, AOV, dark-store/franchise contribution margins) with a 5-year explicit FCFF forecast and relative valuation multiples across listed specialty consumer platforms.',
    assumptions: [
      'Base-case WACC calibrated around 12.5% using bottom-up unlevered beta from consumer discretionary & specialty retail comparables.',
      'Terminal growth rate (g) anchored at 4.5%, reflecting steady-state organised gifting penetration.',
      'Working-capital intensity modelled on perishable inventory velocity offset by structured vendor credit terms.',
    ],
    methodology: [
      'Deconstructed revenue drivers across dark-store / franchise network expansion, average order value (AOV), occasion-led seasonality, and international vertical scaling.',
      'Modelled working-capital intensity (perishable inventory turns vs. vendor payables) and reinvestment rate requirements across a 5-year explicit forecast horizon.',
      'Derived Cost of Capital (WACC) using bottom-up unlevered beta and executed 2D sensitivity matrices across WACC and terminal growth.',
    ],
    deliverables: [
      'Integrated 3-Statement Financial Model & FCFF Schedule',
      'WACC Derivation & Bottom-Up Beta Benchmarking',
      'Relative Valuation Football Field (EV/Revenue & EV/EBITDA)',
    ],
    keyFindings: [
      'Implied enterprise valuation converged near ~₹1,900Cr under base-case operating margin normalisation and disciplined franchise working-capital management.',
      'Sensitivity analysis demonstrated high valuation elasticity to repeat customer retention and dark-store contribution margin stability.',
    ],
    skills: ['DCF Valuation', 'Relative Comps', 'Financial Modelling', 'Sensitivity Analysis'],
    chartType: 'dcf-bridge',
  },
  {
    id: 'jpmorgan-ma',
    index: '02',
    title: 'JPMorgan / Forage M&A Valuation & Deal Simulation',
    subtitle: 'Buy-Side Target Valuation, Synergy Quantification & Deal Structuring',
    category: 'Valuation & M&A',
    projectClassification: 'Industry Simulation · JPMorgan Chase / Forage',
    headlineMetric: '$500M',
    metricContext: 'Simulated M&A Target Enterprise Value',
    period: '2025 · Investment Banking Simulation',
    affiliation: 'JPMorgan Chase / Forage',
    summary:
      'Executed a buy-side M&A valuation and strategic screening simulation centered on a $500M acquisition target, evaluating standalone DCF value, precedent transaction multiples, and revenue/cost synergy thresholds.',
    analyticalApproach:
      'Structured a two-stage valuation separating standalone target cash flows from risk-adjusted operational synergies to establish a disciplined walk-away bid ceiling.',
    assumptions: [
      'Simulated $500M enterprise value target evaluated on a cash-free, debt-free basis.',
      'Synergy realisation phased over a 24-month post-merger integration window with explicit integration one-off costs.',
      'Precedent transaction multiples benchmarked across mid-market strategic acquisitions.',
    ],
    methodology: [
      'Screened strategic acquisition candidates against mandate criteria including geographic adjacency, EBITDA margin profile, and balance-sheet capacity.',
      'Built standalone and synergy-adjusted DCF schedules alongside trading and transaction multiples for a $500M target enterprise.',
      'Prepared an institutional executive briefing deck outlining valuation football field ranges, key execution risks, and negotiation guardrails.',
    ],
    deliverables: [
      '$500M Target Standalone & Pro-Forma Valuation Model',
      'Precedent Transactions & Trading Multiples Benchmarking',
      'Investment Committee M&A Recommendation Memorandum',
    ],
    keyFindings: [
      'Identified clear valuation headroom between standalone intrinsic value and maximum walk-away price after risk-adjusting integration synergies.',
      'Established structured deal-breaker thresholds around customer churn and post-merger working-capital lockup.',
    ],
    skills: ['M&A Valuation', 'Synergy Analysis', 'Precedent Comps', 'Deal Structuring'],
    chartType: 'ma-accretion',
  },
  {
    id: 'equirus-semiconductor-research',
    index: '03',
    title: 'Equirus – Semiconductor Equity Research Project',
    subtitle: 'Industry Dynamics, Business Fundamentals & DCF / Relative Valuation',
    category: 'Equity Research',
    projectClassification: 'Equity Research & Valuation · Equirus',
    headlineMetric: 'Semiconductors',
    metricContext: 'Industry Analysis & Equity Valuation',
    period: 'Equity Research Mandate',
    affiliation: 'Equirus',
    summary:
      'Conducted an in-depth analysis of the semiconductor industry, evaluating market trends, growth drivers, competitive landscape, and key industry players. Assessed business fundamentals, financial performance, and valuation using DCF and relative valuation methodologies to identify potential investment opportunities.',
    analyticalApproach:
      'Evaluated semiconductor global supply chain architecture (fabless design, foundries, OSAT packaging, and capital equipment) alongside business fundamentals, forward margin expansion levers, and capital allocation discipline.',
    assumptions: [
      'Evaluated growth drivers across automotive electronics, AI/data center compute, industrial automation, and consumer silicon cycles.',
      'Built multi-stage DCF models factoring high cyclical reinvestment rates and semiconductor industry WACC benchmarks.',
      'Triangulated intrinsic DCF valuation against peer relative valuation multiples (EV/EBITDA, P/E, and EV/Sales).',
    ],
    methodology: [
      'Conducted sector-wide TAM and structural growth driver evaluation including supply-chain localization, wafer demand, and technology node transitions.',
      'Dissected corporate financial statements, examining gross margin defensibility, R&D intensity, and working-capital cycles across market leaders.',
      'Built comprehensive DCF financial projections and performed peer group relative valuation benchmarking.',
      'Synthesised competitive moats, cyclical risks, and valuation sensitivity to formulate actionable equity investment recommendations.',
    ],
    deliverables: [
      'Semiconductor Industry Comprehensive Research & Valuation Note',
      'Integrated DCF Valuation Model & Cyclical Sensitivity Matrix',
      'Peer Multiples Benchmarking & Equity Investment Thesis',
    ],
    keyFindings: [
      'Identified high-conviction investment opportunities supported by automotive silicon proliferation, AI compute infrastructure demand, and domestic semiconductor manufacturing incentives.',
      'Demonstrated that companies with differentiated intellectual property, high R&D reinvestment efficiency, and disciplined working capital deliver resilient multi-cycle equity returns.',
    ],
    skills: ['Equity Research', 'Financial Modelling', 'DCF Valuation', 'Industry Analysis', 'Investment Research'],
    chartType: 'equity-research',
  },
  {
    id: 'sme-ipo-analysis',
    index: '04',
    title: 'Empirical Analysis of 350+ Indian SME IPOs',
    subtitle: 'Public Market Liquidity, Valuation Multiples & Exit Viability Study',
    category: 'Venture & IPO',
    projectClassification: 'Venture Capital Research · Inflection Point Ventures',
    headlineMetric: '350+',
    metricContext: 'SME IPO Listings Evaluated',
    period: 'April – June 2025',
    affiliation: 'Inflection Point Ventures',
    summary:
      'Analyzed a dataset of over 350 SME IPO listings across NSE Emerge and BSE SME to evaluate whether SME public markets serve as a credible, liquid exit channel for institutional early-stage investors.',
    analyticalApproach:
      'Cross-sectional empirical study tracking primary issue pricing multiples, subscription demand, aftermarket trading liquidity, and balance-sheet cash conversion across 350+ SME issuers.',
    assumptions: [
      'Universe comprises 350+ historical SME listings across NSE Emerge and BSE SME platforms.',
      'Institutional exit realisability evaluated against post-lock-in average daily traded volume and minimum lot-size constraints.',
      'Company-specific proprietary investment committee recommendations remain anonymised.',
    ],
    methodology: [
      'Compiled and cleaned issue-level and aftermarket data across 350+ SME IPOs: issue size, P/E and EV/EBITDA bands, subscription oversubscription, and listing-day vs. 6-month returns.',
      'Segmented issuers by sector, pre-IPO revenue scale, working-capital health, and institutional anchor participation.',
      'Assessed secondary trading volume constraints, lot-size friction, and promoter lock-in dynamics affecting investor realisable IRR.',
    ],
    deliverables: [
      '350+ SME IPO Master Analytical Database & Sector Cohort Slices',
      'Valuation Multiple vs. Post-Listing Performance Distribution Matrix',
      'Venture Exit Viability Policy Note for Investment Leadership',
    ],
    keyFindings: [
      'Distinguished between fundamentally sound industrial/B2B issuers with healthy cash conversion vs. working-capital-heavy listings prone to post-listing illiquidity.',
      'Formulated quantitative benchmark filters for evaluating SME IPO readiness within venture portfolio companies.',
    ],
    skills: ['Capital Markets', 'IPO Analysis', 'Liquidity Diagnostics', 'Cohort Study'],
    chartType: 'ipo-distribution',
  },
  {
    id: 'startup-exit-screening',
    index: '05',
    title: 'Startup Exit Screening Model Across 250 Companies',
    subtitle: 'Liquidity Pathway Mapping, Secondary Readiness & Strategic Fit',
    category: 'Venture & IPO',
    projectClassification: 'Portfolio & Market Exit Study · Inflection Point Ventures',
    headlineMetric: '250',
    metricContext: 'Companies Screened for Exit Readiness',
    period: 'April – June 2025',
    affiliation: 'Inflection Point Ventures',
    summary:
      'Conducted systematic exit readiness screening across 250 companies to classify liquidity trajectories across strategic M&A, institutional secondary sales, and public market offerings.',
    analyticalApproach:
      'Multi-criteria exit readiness scoring model weighing revenue scale, contribution margin stability, cap-table cleanliness, and sector M&A consolidation velocity.',
    assumptions: [
      'Sample spans 250 early-to-growth stage companies across consumer, fintech, enterprise SaaS, and B2B supply chain sectors.',
      'Exit pathways categorised into Strategic M&A, Institutional Secondary Buyout, and Public Market IPO.',
      'Individual company names and cap-table specifics are anonymised to preserve confidentiality.',
    ],
    methodology: [
      'Evaluated 250 companies across scale milestones, EBITDA/cash-burn trajectory, cap-table structure, and sector consolidation activity.',
      'Mapped natural strategic acquirers and private equity roll-up appetites across core venture verticals.',
      'Prioritised high-probability exit candidates based on rule-of-40 proximity and clean statutory compliance.',
    ],
    deliverables: [
      '250-Company Exit Readiness Classification Matrix',
      'Sector-Wise Strategic Acquirer & Multiple Mapping',
      'Portfolio Liquidity Prioritisation Framework',
    ],
    keyFindings: [
      'Isolated key financial milestones (contribution margin positivity and audit readiness) that separate actionable M&A targets from capital-dependent extensions.',
      'Provided data-backed exit horizon visibility for venture portfolio monitoring.',
    ],
    skills: ['Venture Capital', 'Exit Modeling', 'M&A Screening', 'Cap-Table Analysis'],
    chartType: 'exit-matrix',
  },
  {
    id: 'venture-deal-screening',
    index: '06',
    title: 'Multi-Factor Screening of 41 Startups Across 15+ Metrics',
    subtitle: 'Quantitative Venture Scorecard & Unit-Economics Due Diligence',
    category: 'Venture & IPO',
    projectClassification: 'Deal Evaluation Framework · Inflection Point Ventures',
    headlineMetric: '41 / 15+',
    metricContext: 'Startups Screened / Quantitative Metrics',
    period: 'April – June 2025',
    affiliation: 'Inflection Point Ventures',
    summary:
      'Designed and applied a rigorous 15+ metric evaluation framework to screen 41 inbound and pipeline startups, filtering high-conviction investment opportunities for deep-dive diligence.',
    analyticalApproach:
      'Standardised quantitative rubric scoring market depth, unit economics (CM1/CM2/CM3), capital efficiency (burn multiple), and valuation ask relative to peer cohorts.',
    assumptions: [
      '41 pipeline ventures evaluated across 15+ quantitative and qualitative diligence metrics.',
      'Founder projections stress-tested against historical monthly run-rates and verified customer cohorts.',
      'Pipeline deal identities and proprietary scoring weights are anonymised.',
    ],
    methodology: [
      'Standardised 15+ evaluation metrics encompassing TAM/SAM/SOM realism, gross margin structure, LTV/CAC ratio, payback period, net revenue retention, and burn multiple.',
      'Cross-examined founder financial projections against historical run-rates and cohort retention tables.',
      'Benchmarked ask valuations against stage-adjusted revenue multiples and capital efficiency quartiles.',
    ],
    deliverables: [
      '15+ Parameter Quantitative Venture Screening Matrix (41 Companies)',
      'Unit-Economics Stress Test & Cohort Diagnostics',
      'Shortlist Investment Memos & Red-Flag Summaries',
    ],
    keyFindings: [
      'Created a repeatable screening funnel that rapidly eliminated fragile unit-economics models while highlighting capital-efficient compounders.',
      'Reduced initial deal-triage turnaround time while elevating quantitative consistency across sectors.',
    ],
    skills: ['Venture Screening', 'Unit Economics', 'Due Diligence', 'Scorecard Modeling'],
    chartType: 'venture-funnel',
  },
  {
    id: 'north-asia-fpa',
    index: '07',
    title: 'North Asia Profitability & Working-Capital Analysis',
    subtitle: 'Regional Business Finance, Trade-Lane Margin & Cash Conversion',
    category: 'Business Finance',
    projectClassification: 'Corporate Business Finance · Allcargo Global (Anonymised)',
    headlineMetric: 'North Asia',
    metricContext: 'Regional Profitability & Working-Capital Mandate',
    period: 'May 2026 – Present',
    affiliation: 'Allcargo Global',
    summary:
      'Driving ongoing business finance diagnostics for Allcargo Global’s North Asia operations, linking trade-lane gross margin performance with balance-sheet working-capital discipline.',
    analyticalApproach:
      'Integrated P&L and balance-sheet diagnostic framework connecting commercial yield per shipment with debtor collection velocity (DSO) and payable cycles (DPO).',
    assumptions: [
      'Covers regional North Asia freight corridors and operating entities.',
      'All proprietary entity financials, customer terms, and lane margins are strictly anonymised.',
      'Focuses on structural variance drivers (Volume, Rate, Mix, FX) and net working capital turns.',
    ],
    methodology: [
      'Segmenting regional P&L performance across ocean/air freight product lines, container utilisation, and regional entities.',
      'Decomposing net working capital across customer credit terms (DSO), vendor settlement cycles (DPO), and unbilled revenue ageing.',
      'Building variance bridges (Volume, Rate, Mix, and FX) to support commercial leadership during monthly operational reviews.',
    ],
    deliverables: [
      'North Asia Corridor Profitability & Variance Bridge Framework',
      'Receivables Ageing & Working-Capital Velocity Tracker',
      'Executive Commercial Finance Review Packs',
    ],
    keyFindings: [
      'Established transparent linkage between commercial yield decisions and actual cash-flow realisation after accounting for debtor collection cycles.',
      'Strengthened regional visibility into high-margin vs. working-capital-dilutive customer accounts.',
    ],
    skills: ['Business Finance', 'Working Capital', 'Variance Analysis', 'Regional FP&A'],
    chartType: 'working-capital',
  },
];

export const EXPERTISE_CLUSTERS: ExpertiseCluster[] = [
  {
    id: 'business-finance-fpa',
    index: '01',
    domain: 'Business Finance & FP&A',
    subtitle: 'Commercial Partnership, P&L Diagnostics & Working Capital',
    description:
      'Translating operational volumes, pricing yields, and cost structures into clear management intelligence and cash-conversion discipline.',
    capabilities: [
      'Regional & Segment P&L Profitability Analysis (North Asia Mandate)',
      'Working Capital Optimisation (DSO, DPO & Cash Conversion Cycle)',
      'Price-Volume-Mix & FX Variance Bridges',
      'Rolling Forecasts, Annual Operating Plans (AOP) & KPI Reporting',
      'Commercial Contract & Trade-Lane Margin Evaluation',
    ],
    frameworksAndTools: ['3-Statement Forecasting', 'Variance Bridge Architecture', 'Working Capital Analytics', 'Management Reporting'],
  },
  {
    id: 'valuation-modelling',
    index: '02',
    domain: 'Valuation & Financial Modelling',
    subtitle: 'Intrinsic DCF, Relative Multiples & Transaction Simulation',
    description:
      'Building institutional-grade, audit-ready financial models grounded in realistic unit economics, cost of capital rigor, and scenario sensitivity.',
    capabilities: [
      'Intrinsic Discounted Cash Flow (FCFF / FCFE) Modelling',
      'WACC Derivation, Bottom-Up Beta & Terminal Value Calibration',
      'Trading Comparables & Precedent M&A Transaction Benchmarking',
      'Buy-Side M&A Target Valuation & Synergy Sensitivity ($500M Simulation)',
      '2D Sensitivity Tables & Scenario Stress-Testing (~₹1,900Cr FNP Case)',
    ],
    frameworksAndTools: ['DCF / Multiples Triangulation', 'M&A Deal Structuring', 'Scenario & Sensitivity Grids', 'Advanced Financial Modelling'],
  },
  {
    id: 'investment-research',
    index: '03',
    domain: 'Investment Analysis & Venture Strategy',
    subtitle: 'Multi-Metric Deal Screening, Exit Pathways & Capital Markets',
    description:
      'Evaluating private and public market opportunities through empirical datasets, multi-factor scorecards, and exit liquidity analysis.',
    capabilities: [
      'Multi-Factor Startup Screening (41 Ventures Across 15+ Metrics)',
      'SME IPO Empirical Market & Liquidity Research (350+ Listings)',
      'Startup Exit Pathway & Secondary Readiness Mapping (250 Companies)',
      'Unit Economics Forensics (CAC/LTV, Burn Multiple, Cohort Retention)',
      'Investment Committee Memoranda & Sector Thesis Formulation',
    ],
    frameworksAndTools: ['15+ Metric Venture Scorecard', 'Empirical Cohort Analysis', 'Exit Multiples Mapping', 'Capital Markets Research'],
  },
  {
    id: 'statutory-audit',
    index: '04',
    domain: 'Statutory Audit & Financial Forensics',
    subtitle: 'Big-4 Assurance Rigor, Ind AS Compliance & Internal Controls',
    description:
      'Nearly two years at Deloitte Haskins & Sells verifying financial statement integrity, accounting policies, and enterprise internal controls.',
    capabilities: [
      'Statutory Audit & Ind AS Financial Statement Verification',
      'Internal Financial Controls over Financial Reporting (IFCoFR)',
      'Revenue Cut-Off, Inventory Valuation & Receivables Provisioning',
      'Order-to-Cash (O2C) and Procure-to-Pay (P2P) Process Assurance',
      'Quality of Earnings & Balance-Sheet Risk Identification',
    ],
    frameworksAndTools: ['Ind AS / IFRS Standards', 'IFCoFR Control Matrix', 'Substantive Analytical Procedures', 'Financial Statement Analysis'],
  },
];

export const EDUCATION_CREDENTIALS: EducationCredential[] = [
  {
    id: 'iimk',
    index: '01',
    institution: 'Indian Institute of Management (IIM) Kozhikode',
    credential: 'Master of Business Administration (MBA) — Finance & Strategy',
    period: '2024 – 2026',
    distinction: 'Premier Management Institution · Finance & Strategy Concentration',
    focusAreas: [
      'Corporate Valuation & Financial Modelling',
      'Investment Analysis & Portfolio Management',
      'Corporate Finance, M&A & Strategic Management',
      'Financial Statement Analysis & Derivatives',
    ],
  },
  {
    id: 'cfa',
    index: '02',
    institution: 'CFA Institute (USA)',
    credential: 'Chartered Financial Analyst — CFA Level I (Cleared)',
    period: 'Cleared · August 2025',
    distinction: 'Global Standard in Investment Analysis & Portfolio Ethics',
    focusAreas: [
      'Fixed Income, Equity Investments & Corporate Issuers',
      'Financial Statement Analysis & Quantitative Methods',
      'Alternative Investments, Derivatives & Ethical Standards',
    ],
  },
  {
    id: 'hlcc',
    index: '03',
    institution: 'H.L. College of Commerce (HLCC), Ahmedabad',
    credential: 'Bachelor of Commerce (B.Com)',
    period: 'Undergraduate Foundation',
    distinction: 'Distinguished Commerce & Accounting Alma Mater',
    focusAreas: [
      'Advanced Corporate Accounting & Auditing',
      'Cost & Management Accounting',
      'Business Economics, Taxation & Commercial Law',
    ],
  },
];

export const LEADERSHIP_ROLES: LeadershipRole[] = [
  {
    id: 'volleyball-captain',
    index: '01',
    title: 'Captain — Inter-IIM Volleyball Contingent',
    institution: 'IIM Kozhikode',
    context: 'Competitive Institutional Athletics & Team Stewardship',
    impactSummary:
      'Led the IIM Kozhikode men’s volleyball squad in Inter-IIM tournaments, balancing high-intensity training regimens, tactical court leadership, and rigorous MBA academic commitments.',
    highlights: [
      'Directed team selection, rotational strategy, and high-pressure match execution across premier Inter-IIM sporting meets.',
      'Fostered a culture of resilience, accountability, and composure under tight point-by-point tournament margins.',
    ],
  },
  {
    id: 'head-boy',
    index: '02',
    title: 'Head Boy — Student Council Leadership',
    institution: 'School Institutional Governance',
    context: 'Elected Apex Student Representative',
    impactSummary:
      'Served as Head Boy representing the student body across academic, cultural, and disciplinary forums, coordinating cross-cohort initiatives and institutional events.',
    highlights: [
      'Chaired student prefect council operations, liaisoning between faculty administration and student cohorts.',
      'Established early foundations in public speaking, conflict resolution, and structured organisational execution.',
    ],
  },
];

export const INSIGHTS_ARTICLES: InsightArticle[] = [
  {
    id: 'sme-ipo-liquidity-paradox',
    index: '01',
    statusTag: 'Sample Article Placeholder · Editorial Preview',
    category: 'Capital Markets Research',
    title: 'The SME IPO Liquidity Paradox: Analytical Framework from 350+ Listings',
    subtitle: 'Sample research monograph preview exploring why primary subscription multiples diverge from institutional exit liquidity.',
    readTime: 'Sample · 6 min read',
    date: 'Editorial Placeholder · Research Series',
    abstract:
      '[Sample Editorial Placeholder] Structured around empirical SME IPO research, this article template demonstrates how forthcoming long-form notes on listing liquidity, working-capital intensity, and lot-size friction will be published.',
    keyTakeaways: [
      'Sample Thesis 01: Evaluating post-lock-in daily traded volume relative to institutional shareholding blocks.',
      'Sample Thesis 02: Linking debtor collection cycles (DSO) to 12-month post-listing multiple stability.',
      'Sample Thesis 03: Comparing SME public listings against strategic M&A and secondary buyout pathways.',
    ],
    fullSections: [
      {
        heading: 'Editorial Note — Sample Article Placeholder',
        body: 'This section is an intentional editorial layout placeholder reserved for forthcoming long-form financial research notes by Rajkumar Vadher. The topic reflects real analytical work completed on 350+ SME IPOs and 250 startup exit screenings without publishing confidential employer datasets.',
      },
      {
        heading: '1. Analytical Structure: Primary Demand vs. Secondary Depth',
        body: 'In evaluating small-cap public offerings, primary oversubscription ratios must be separated from secondary market depth. Institutional exit modelling requires stress-testing slippage and lot-size constraints.',
      },
      {
        heading: '2. Working Capital Hygiene as a Listing Filter',
        body: 'Issuers utilising IPO proceeds primarily to fund elongated receivable cycles face structural cash-conversion headwinds compared to high-ROCE industrial and B2B peers.',
      },
    ],
  },
  {
    id: 'consumer-gifting-valuation',
    index: '02',
    statusTag: 'Sample Article Placeholder · Editorial Preview',
    category: 'Valuation & Modelling',
    title: 'Valuing Occasion-Led Consumer Platforms: DCF & Relative Triangulation',
    subtitle: 'Sample valuation note preview examining dark-store unit economics, perishable inventory turns, and terminal value sensitivity.',
    readTime: 'Sample · 5 min read',
    date: 'Editorial Placeholder · Valuation Series',
    abstract:
      '[Sample Editorial Placeholder] Based on the ~₹1,900Cr Ferns N Petals academic valuation methodology, this article layout previews upcoming technical write-ups on DCF calibration and two-dimensional WACC sensitivity.',
    keyTakeaways: [
      'Sample Thesis 01: Modelling negative or tight working-capital cycles in perishable gifting networks.',
      'Sample Thesis 02: Calibrating bottom-up beta and terminal growth rates across specialty retail peers.',
      'Sample Thesis 03: Using 2D WACC vs. terminal growth sensitivity matrices to bound valuation corridors.',
    ],
    fullSections: [
      {
        heading: 'Editorial Note — Sample Article Placeholder',
        body: 'This research note layout is a structured sample placeholder illustrating how academic valuation studies (~₹1,900Cr Ferns N Petals valuation at IIM Kozhikode) are formatted for executive reading.',
      },
      {
        heading: '1. Unit Economics & Reinvestment Rate',
        body: 'Intrinsic DCF valuation of omnichannel consumer platforms requires linking store/franchise expansion directly to incremental working capital and maintenance capex.',
      },
    ],
  },
  {
    id: 'regional-fpa-working-capital',
    index: '03',
    statusTag: 'Sample Article Placeholder · Editorial Preview',
    category: 'Business Finance & FP&A',
    title: 'Trade-Lane Profitability & Working Capital Velocity in Cross-Border Logistics',
    subtitle: 'Sample operational finance essay preview on connecting commercial freight yields with balance-sheet cash conversion.',
    readTime: 'Sample · 5 min read',
    date: 'Editorial Placeholder · FP&A Series',
    abstract:
      '[Sample Editorial Placeholder] Inspired by regional business finance responsibilities across North Asia, this placeholder previews forthcoming commentary on Price-Volume-Mix variance bridges and DSO/DPO discipline.',
    keyTakeaways: [
      'Sample Thesis 01: Attributing monthly P&L variance across Volume, Rate, Mix, and FX components.',
      'Sample Thesis 02: Integrating debtor ageing and credit terms into commercial lane profitability reviews.',
      'Sample Thesis 03: Aligning commercial pricing authority with net working-capital velocity.',
    ],
    fullSections: [
      {
        heading: 'Editorial Note — Sample Article Placeholder',
        body: 'This article preview is a sample placeholder designed for future publication of general FP&A and working-capital frameworks. No proprietary employer data is disclosed.',
      },
      {
        heading: '1. Bridging Commercial P&L and Balance Sheet Cash Flow',
        body: 'High gross margin per shipment only translates into economic value when supported by disciplined billing and receivable collection cycles.',
      },
    ],
  },
];
