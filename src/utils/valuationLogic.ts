export interface ValuationSensitivityCell {
  wacc: number;
  terminalGrowth: number;
  impliedEnterpriseValueCr: number;
  variancePct: number;
}

/**
 * Calculates implied enterprise value (in ₹ Crore) around the Ferns N Petals
 * baseline (~₹1,900Cr at 12.5% WACC and 4.5% terminal growth) using a Gordon Growth
 * + 5-year explicit FCFF present value formulation.
 */
export function calculateImpliedValuationCr(
  waccPct: number,
  terminalGrowthPct: number,
  baseFcffCr = 99.14
): number {
  const wacc = Math.max(waccPct / 100, 0.06);
  const g = Math.min(terminalGrowthPct / 100, wacc - 0.015);

  // 5-year explicit stage with 14% CAGR on FCFF
  const explicitGrowth = 0.14;
  let pvExplicit = 0;
  let currentFcff = baseFcffCr;

  for (let yr = 1; yr <= 5; yr++) {
    currentFcff = currentFcff * (1 + explicitGrowth);
    pvExplicit += currentFcff / Math.pow(1 + wacc, yr);
  }

  const terminalFcff = currentFcff * (1 + g);
  const terminalValue = terminalFcff / (wacc - g);
  const pvTerminal = terminalValue / Math.pow(1 + wacc, 5);

  return Math.round(pvExplicit + pvTerminal);
}

export function buildSensitivityMatrix(
  centerWaccPct: number,
  centerGrowthPct: number,
  baselineEvCr = 1900
): ValuationSensitivityCell[][] {
  const waccSteps = [
    Number((centerWaccPct - 1.0).toFixed(1)),
    Number((centerWaccPct - 0.5).toFixed(1)),
    Number(centerWaccPct.toFixed(1)),
    Number((centerWaccPct + 0.5).toFixed(1)),
    Number((centerWaccPct + 1.0).toFixed(1)),
  ];

  const growthSteps = [
    Number((centerGrowthPct - 1.0).toFixed(1)),
    Number((centerGrowthPct - 0.5).toFixed(1)),
    Number(centerGrowthPct.toFixed(1)),
    Number((centerGrowthPct + 0.5).toFixed(1)),
    Number((centerGrowthPct + 1.0).toFixed(1)),
  ];

  return waccSteps.map((wacc) =>
    growthSteps.map((terminalGrowth) => {
      const impliedEnterpriseValueCr = calculateImpliedValuationCr(wacc, terminalGrowth);
      const variancePct = Number(
        (((impliedEnterpriseValueCr - baselineEvCr) / baselineEvCr) * 100).toFixed(1)
      );
      return {
        wacc,
        terminalGrowth,
        impliedEnterpriseValueCr,
        variancePct,
      };
    })
  );
}

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  category: 'Valuation & M&A' | 'Venture & IPO' | 'Business Finance';
  projectClassification: string;
  headlineMetric: string;
  metricContext: string;
  period: string;
  affiliation: string;
  summary: string;
  analyticalApproach: string;
  assumptions: string[];
  methodology: string[];
  deliverables: string[];
  keyFindings: string[];
  chartType: 'dcf-bridge' | 'ma-accretion' | 'ipo-distribution' | 'venture-funnel' | 'exit-matrix' | 'working-capital';
}

export function filterProjectsByCategory(
  projects: ProjectItem[],
  category: string
): ProjectItem[] {
  if (!category || category === 'All') {
    return projects;
  }
  return projects.filter((p) => p.category === category);
}

export function formatResumePlainText(params: {
  name: string;
  headline: string;
  tagline: string;
  email: string;
  linkedinUrl: string;
}): string {
  return [
    `${params.name.toUpperCase()}`,
    `${params.headline}`,
    `${params.tagline}`,
    `Email: ${params.email} | LinkedIn: ${params.linkedinUrl}`,
    ``,
    `EDUCATION & CREDENTIALS`,
    `- MBA, Finance & Strategy | Indian Institute of Management (IIM) Kozhikode (2024–2026)`,
    `- CFA Level I (Cleared, August 2025) | CFA Institute`,
    `- Bachelor of Commerce (B.Com) | H.L. College of Commerce (HLCC)`,
    ``,
    `PROFESSIONAL EXPERIENCE (3 YEARS)`,
    `- Allcargo Global | Management Trainee, Finance – North Asia (May 2026–Present)`,
    `  North Asia profitability diagnostics, trade-lane margin analysis, and working-capital optimisation.`,
    `- Inflection Point Ventures | Investment Strategy Intern (April–June 2025)`,
    `  Screened 41 startups across 15+ metrics; analysed 350+ SME IPOs; conducted exit screening across 250 companies.`,
    `- Deloitte Haskins & Sells | Audit Analyst (August 2022–June 2024)`,
    `  Statutory audit engagements, Ind AS financial statement verification, and IFCoFR internal control testing.`,
    ``,
    `KEY ANALYTICAL & VALUATION PROJECTS`,
    `- Ferns N Petals Corporate Valuation (~₹1,900Cr implied EV; Academic DCF & Relative Valuation)`,
    `- JPMorgan / Forage M&A Valuation Simulation ($500M target enterprise valuation)`,
    `- Empirical Analysis of 350+ SME IPOs & 250-Company Startup Exit Screening`,
    ``,
    `LEADERSHIP`,
    `- Captain, Inter-IIM Volleyball Contingent (IIM Kozhikode)`,
    `- Head Boy, Student Council Leadership`,
  ].join('\n');
}

/**
 * Formats an animated metric string (e.g. "~₹1,900Cr", "$500M", "350+", "250")
 * for a given progress in [0, 1]. At progress >= 1, returns the exact source string.
 */
export function formatAnimatedMetric(rawMetric: string, progress: number): string {
  const clamped = Math.max(0, Math.min(1, progress));
  if (clamped >= 1) return rawMetric;

  const match = rawMetric.match(/^([^0-9]*)([0-9,]+)(.*)$/);
  if (!match) return rawMetric;

  const [, prefix, numPart, suffix] = match;
  const targetValue = parseInt(numPart.replace(/,/g, ''), 10);
  if (Number.isNaN(targetValue)) return rawMetric;

  const currentVal = Math.max(1, Math.round(targetValue * clamped));
  const formattedNum = numPart.includes(',')
    ? currentVal.toLocaleString('en-IN')
    : String(currentVal);

  return `${prefix}${formattedNum}${suffix}`;
}

