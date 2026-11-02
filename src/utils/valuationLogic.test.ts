import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateImpliedValuationCr,
  buildSensitivityMatrix,
  filterProjectsByCategory,
  formatResumePlainText,
  formatAnimatedMetric,
  type ProjectItem,
} from './valuationLogic';

test('calculateImpliedValuationCr produces ~1900Cr baseline at 12.5% WACC and 4.5% growth', () => {
  const baseline = calculateImpliedValuationCr(12.5, 4.5);
  assert.ok(
    baseline >= 1880 && baseline <= 1920,
    `Expected baseline near 1900Cr, got ${baseline}`
  );
  const lowerWaccEv = calculateImpliedValuationCr(11.5, 4.5);
  assert.ok(lowerWaccEv > baseline);
});

test('buildSensitivityMatrix generates a 5x5 WACC vs Terminal Growth matrix', () => {
  const matrix = buildSensitivityMatrix(12.5, 4.5);
  assert.equal(matrix.length, 5);
  assert.equal(matrix[0].length, 5);
  assert.equal(matrix[2][2].wacc, 12.5);
  assert.equal(matrix[2][2].terminalGrowth, 4.5);
});

test('filterProjectsByCategory filters projects accurately', () => {
  const sample: ProjectItem[] = [
    {
      id: 'fnp',
      index: '01',
      title: 'Ferns N Petals Valuation',
      subtitle: 'DCF & Relative Valuation',
      category: 'Valuation & M&A',
      projectClassification: 'Academic Valuation Case Study',
      headlineMetric: '~₹1,900Cr',
      metricContext: 'Implied Enterprise Valuation',
      period: '2025',
      affiliation: 'IIM Kozhikode',
      summary: 'Valuation study',
      analyticalApproach: 'Intrinsic DCF + Relative Comps',
      assumptions: ['12.5% WACC', '4.5% Terminal Growth'],
      methodology: [],
      deliverables: [],
      keyFindings: [],
      chartType: 'dcf-bridge',
    },
    {
      id: 'ipo',
      index: '02',
      title: '350+ SME IPOs Analysis',
      subtitle: 'Empirical Market Study',
      category: 'Venture & IPO',
      projectClassification: 'Institutional Venture Research',
      headlineMetric: '350+',
      metricContext: 'SME IPOs Analysed',
      period: '2025',
      affiliation: 'Inflection Point Ventures',
      summary: 'IPO study',
      analyticalApproach: 'Empirical cohort study',
      assumptions: ['NSE Emerge & BSE SME universe'],
      methodology: [],
      deliverables: [],
      keyFindings: [],
      chartType: 'ipo-distribution',
    },
    {
      id: 'equirus',
      index: '03',
      title: 'Equirus Semiconductor Equity Research',
      subtitle: 'Equity Research & Valuation',
      category: 'Equity Research',
      projectClassification: 'Equity Research',
      headlineMetric: 'Semiconductors',
      metricContext: 'Equity Research & Valuation',
      period: '2025',
      affiliation: 'Equirus',
      summary: 'Semiconductor equity research',
      analyticalApproach: 'DCF & Comps',
      assumptions: ['Industry drivers'],
      methodology: [],
      deliverables: [],
      keyFindings: [],
      chartType: 'equity-research',
    },
  ];

  assert.equal(filterProjectsByCategory(sample, 'All').length, 3);
  assert.equal(filterProjectsByCategory(sample, 'Valuation & M&A').length, 1);
  assert.equal(filterProjectsByCategory(sample, 'Equity Research').length, 1);
  assert.equal(filterProjectsByCategory(sample, 'Equity Research')[0].id, 'equirus');
  assert.equal(filterProjectsByCategory(sample, 'Venture & IPO')[0].id, 'ipo');
});

test('formatResumePlainText includes key source-of-truth milestones', () => {
  const text = formatResumePlainText({
    name: 'Rajkumar Vadher',
    headline: 'Business Finance | Valuation & Financial Modelling | Investment Analysis',
    tagline: 'Understanding Businesses. Analysing Investments. Creating Financial Insights.',
    email: 'rajvadher226@gmail.com',
    linkedinUrl: 'https://www.linkedin.com/in/rajkumar-vadher',
  });
  assert.ok(text.includes('IIM) Kozhikode'));
  assert.ok(text.includes('Allcargo Global'));
  assert.ok(text.includes('~₹1,900Cr'));
});

test('formatAnimatedMetric interpolates numerical metrics and preserves exact final format', () => {
  assert.equal(formatAnimatedMetric('~₹1,900Cr', 1), '~₹1,900Cr');
  assert.equal(formatAnimatedMetric('~₹1,900Cr', 0.5), '~₹950Cr');
  assert.equal(formatAnimatedMetric('$500M', 0.5), '$250M');
  assert.equal(formatAnimatedMetric('350+', 1), '350+');
});

