import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { PROJECTS_DATA } from '../data/portfolioData';
import {
  filterProjectsByCategory,
  calculateImpliedValuationCr,
  buildSensitivityMatrix,
  type ProjectItem,
} from '../utils/valuationLogic';
import { ScrollReveal } from './ScrollReveal';

const CATEGORIES = ['All', 'Valuation & M&A', 'Venture & IPO', 'Business Finance'] as const;

export const ProjectsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({});

  // Interactive DCF Sensitivity state for FNP (~₹1,900Cr baseline at 12.5% WACC, 4.5% growth)
  const [waccPct, setWaccPct] = useState<number>(12.5);
  const [terminalGrowthPct, setTerminalGrowthPct] = useState<number>(4.5);

  const filteredProjects = filterProjectsByCategory(PROJECTS_DATA, activeCategory);
  const impliedEvCr = calculateImpliedValuationCr(waccPct, terminalGrowthPct);
  const sensitivityMatrix = buildSensitivityMatrix(waccPct, terminalGrowthPct, 1900);

  useEffect(() => {
    if (!selectedProject) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  const toggleExpandCard = (id: string) => {
    setExpandedCardIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const navigateSelectedProject = (direction: 'prev' | 'next') => {
    if (!selectedProject) return;
    const currentIndex = PROJECTS_DATA.findIndex((p) => p.id === selectedProject.id);
    if (currentIndex === -1) return;
    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % PROJECTS_DATA.length
        : (currentIndex - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length;
    setSelectedProject(PROJECTS_DATA[nextIndex]);
  };

  const renderProjectMotif = (chartType: ProjectItem['chartType']) => {
    switch (chartType) {
      case 'dcf-bridge':
        return (
          <svg
            viewBox="0 0 320 92"
            className="w-full h-20 transition-transform duration-300 group-hover:scale-105"
            aria-hidden="true"
          >
            <line x1="16" y1="78" x2="304" y2="78" stroke="#243B67" strokeWidth="1" />
            <rect x="28" y="48" width="36" height="30" rx="2" fill="#4776FF" fillOpacity="0.55" />
            <rect x="82" y="36" width="36" height="42" rx="2" fill="#4776FF" fillOpacity="0.75" />
            <rect x="136" y="28" width="36" height="50" rx="2" fill="#4776FF" />
            <rect x="190" y="18" width="36" height="60" rx="2" fill="#19B7A5" />
            <rect
              x="246"
              y="10"
              width="46"
              height="68"
              rx="2"
              fill="#10192D"
              stroke="#D7AE68"
              strokeWidth="1.5"
            />
            <text
              x="269"
              y="27"
              textAnchor="middle"
              fill="#D7AE68"
              fontSize="9"
              fontFamily="JetBrains Mono"
              fontWeight="600"
            >
              ₹1.9kCr
            </text>
          </svg>
        );
      case 'ma-accretion':
        return (
          <svg
            viewBox="0 0 320 92"
            className="w-full h-20 transition-transform duration-300 group-hover:scale-105"
            aria-hidden="true"
          >
            <line x1="16" y1="78" x2="304" y2="78" stroke="#243B67" strokeWidth="1" />
            <rect x="30" y="34" width="72" height="15" rx="2" fill="#4776FF" fillOpacity="0.7" />
            <rect x="48" y="54" width="94" height="15" rx="2" fill="#19B7A5" />
            <rect x="66" y="14" width="100" height="14" rx="2" fill="#D7AE68" fillOpacity="0.85" />
            <line
              x1="115"
              y1="8"
              x2="115"
              y2="78"
              stroke="#F5F6F8"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <text
              x="185"
              y="42"
              fill="#F5F6F8"
              fontSize="10"
              fontFamily="JetBrains Mono"
              fontWeight="600"
            >
              TARGET EV: $500M
            </text>
            <text x="185" y="58" fill="#19B7A5" fontSize="9" fontFamily="JetBrains Mono">
              FOOTBALL FIELD
            </text>
          </svg>
        );
      case 'ipo-distribution':
        return (
          <svg
            viewBox="0 0 320 92"
            className="w-full h-20 transition-transform duration-300 group-hover:scale-105"
            aria-hidden="true"
          >
            <line x1="16" y1="78" x2="304" y2="78" stroke="#243B67" strokeWidth="1" />
            {[18, 30, 50, 66, 46, 36, 26, 19, 13].map((h, i) => (
              <rect
                key={i}
                x={28 + i * 30}
                y={78 - h}
                width="20"
                height={h}
                rx="2"
                fill={i === 3 ? '#19B7A5' : i === 2 || i === 4 ? '#4776FF' : '#D7AE68'}
                opacity={i === 3 ? 1 : 0.75}
              />
            ))}
          </svg>
        );
      case 'exit-matrix':
        return (
          <svg
            viewBox="0 0 320 92"
            className="w-full h-20 transition-transform duration-300 group-hover:scale-105"
            aria-hidden="true"
          >
            <line x1="24" y1="76" x2="296" y2="76" stroke="#243B67" strokeWidth="1" />
            <line x1="24" y1="12" x2="24" y2="76" stroke="#243B67" strokeWidth="1" />
            <circle cx="72" cy="56" r="5" fill="#D7AE68" />
            <circle cx="115" cy="46" r="6" fill="#4776FF" />
            <circle cx="160" cy="36" r="7" fill="#4776FF" />
            <circle cx="212" cy="26" r="8" fill="#19B7A5" />
            <circle cx="258" cy="18" r="6" fill="#D7AE68" />
            <path
              d="M48 64 Q150 40 274 16"
              stroke="#19B7A5"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="3 3"
            />
          </svg>
        );
      case 'venture-funnel':
        return (
          <svg
            viewBox="0 0 320 92"
            className="w-full h-20 transition-transform duration-300 group-hover:scale-105"
            aria-hidden="true"
          >
            <rect x="24" y="14" width="272" height="15" rx="3" fill="#4776FF" fillOpacity="0.65" />
            <rect x="58" y="37" width="204" height="15" rx="3" fill="#19B7A5" fillOpacity="0.85" />
            <rect x="98" y="60" width="124" height="15" rx="3" fill="#D7AE68" />
          </svg>
        );
      case 'working-capital':
      default:
        return (
          <svg
            viewBox="0 0 320 92"
            className="w-full h-20 transition-transform duration-300 group-hover:scale-105"
            aria-hidden="true"
          >
            <line x1="16" y1="78" x2="304" y2="78" stroke="#243B67" strokeWidth="1" />
            <polyline
              fill="none"
              stroke="#19B7A5"
              strokeWidth="2.25"
              points="24,60 78,50 132,54 186,34 240,26 292,16"
            />
            <polyline
              fill="none"
              stroke="#D7AE68"
              strokeWidth="1.75"
              strokeDasharray="4 3"
              points="24,68 78,62 132,56 186,47 240,40 292,32"
            />
          </svg>
        );
    }
  };

  return (
    <section
      id="projects"
      className="py-14 lg:py-20 border-b border-[#DCE2EC] bg-[#F5F6F8] bg-architectural-grid"
    >
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10 space-y-10 lg:space-y-12">
        {/* Section Header + Category Filter Controls */}
        <ScrollReveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-7 border-b border-[#DCE2EC]">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono-num font-semibold tracking-wider text-[#4776FF]">
              <Layers className="w-3.5 h-3.5 text-[#19B7A5]" aria-hidden="true" />
              <span>03. SELECTED ANALYTICAL WORK & VALUATION CASE STUDIES</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#10192D] leading-[1.12]">
              Empirical Case Studies in{' '}
              <span className="text-[#4776FF]">Valuation, M&A</span>, Venture Screening & FP&A.
            </h2>
            <p className="text-xs sm:text-sm text-[#5E6D87] leading-relaxed">
              Each study clearly distinguishes between academic valuation models, industry simulations, and anonymised venture or corporate finance work.
            </p>
          </div>

          {/* Interactive Filter Controls */}
          <div
            role="group"
            aria-label="Filter analytical case studies by domain"
            className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-lg border border-[#DCE2EC] shadow-xs"
          >
            {CATEGORIES.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4776FF] ${
                    active
                      ? 'bg-[#10192D] text-[#F5F6F8] shadow-xs'
                      : 'text-[#5E6D87] hover:text-[#10192D] hover:bg-[#F5F6F8]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Case Studies Grid with Coloured Finance Cover Designs & Staggered Entry */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8 items-stretch">
          {filteredProjects.map((project, idx) => {
            const isExpanded = Boolean(expandedCardIds[project.id]);
            const coverGradients = [
              'from-[#10192D] via-[#172C50] to-[#1E3B70]',
              'from-[#10192D] via-[#152A4A] to-[#134E4A]',
              'from-[#172C50] via-[#10192D] to-[#273B69]',
            ];
            return (
              <ScrollReveal key={project.id} delayMs={idx * 90} className="flex">
                <article className="card-interactive group w-full rounded-xl border border-[#DCE2EC] hover:border-[#4776FF] bg-white overflow-hidden flex flex-col justify-between shadow-xs">
                  <div>
                    {/* Custom Abstract Finance-Inspired Coloured Cover Header */}
                    <div
                      className={`p-5 bg-gradient-to-br ${coverGradients[idx % coverGradients.length]} text-[#F5F6F8] border-b border-[#243B67] space-y-3`}
                    >
                      <div className="flex items-center justify-between gap-2 text-[11px] font-mono-num">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#4776FF]/25 border border-[#4776FF]/50 text-[#F5F6F8] font-semibold">
                          {project.index} · {project.category}
                        </span>
                        <span className="text-[#D7AE68]">
                          {project.period.split('·')[0].trim()}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between gap-2 pt-1">
                        <span className="font-mono-num text-2xl sm:text-3xl font-semibold text-[#F5F6F8] shrink-0">
                          {project.headlineMetric}
                        </span>
                        <span className="text-[11px] font-medium text-[#19B7A5] text-right leading-tight">
                          {project.metricContext}
                        </span>
                      </div>

                      {/* Abstract Financial Chart Cover Motif */}
                      <div className="pt-1 overflow-hidden">
                        {renderProjectMotif(project.chartType)}
                      </div>
                    </div>

                    {/* Card Body: Classification, Title & Summary */}
                    <div className="p-5 sm:p-6 space-y-3">
                      <div className="text-[11px] font-mono-num font-semibold uppercase tracking-wider text-[#4776FF]">
                        {project.projectClassification}
                      </div>
                      <h3 className="font-editorial text-xl sm:text-2xl font-semibold text-[#10192D] leading-snug group-hover:text-[#4776FF] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5E6D87] leading-relaxed">
                        {project.summary}
                      </p>

                      {/* Expandable Inline Case Study Details */}
                      {isExpanded && (
                        <div className="pt-4 mt-3 border-t border-[#DCE2EC] space-y-3.5 text-xs">
                          <div className="space-y-1">
                            <div className="font-mono-num font-semibold text-[#10192D]">
                              ANALYTICAL APPROACH
                            </div>
                            <p className="text-[#192438] leading-relaxed">
                              {project.analyticalApproach}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="font-mono-num font-semibold text-[#4776FF]">
                              KEY ASSUMPTIONS & SCOPE
                            </div>
                            <ul className="space-y-1 text-[#5E6D87]">
                              {project.assumptions.map((assumption, aIdx) => (
                                <li key={aIdx}>· {assumption}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-1">
                            <div className="font-mono-num font-semibold text-[#19B7A5]">
                              KEY OUTCOMES
                            </div>
                            <ul className="space-y-1 text-[#192438]">
                              {project.keyFindings.map((finding, fIdx) => (
                                <li key={fIdx}>· {finding}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Footer: Inline Expand + Dedicated Case Study Dossier */}
                  <div className="px-5 sm:px-6 py-4 bg-[#F5F6F8]/80 border-t border-[#DCE2EC] flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => toggleExpandCard(project.id)}
                      aria-expanded={isExpanded}
                      className="inline-flex items-center gap-1.5 py-1.5 text-xs font-semibold text-[#5E6D87] hover:text-[#10192D] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4776FF]"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5 text-[#4776FF]" aria-hidden="true" />
                          <span>Collapse Summary</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5 text-[#4776FF]" aria-hidden="true" />
                          <span>Expand Assumptions</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-md text-xs font-semibold text-[#F5F6F8] bg-[#10192D] hover:bg-[#4776FF] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4776FF]"
                    >
                      <span>Full Case Study</span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Interactive Valuation & WACC Sensitivity Workbench (Ferns N Petals ~₹1,900Cr Model) */}
        <ScrollReveal
          delayMs={90}
          className="rounded-xl overflow-hidden border border-[#243B67] bg-white shadow-lg"
        >
          {/* Midnight Navy Workbench Header Banner */}
          <div className="bg-gradient-to-r from-[#10192D] via-[#172C50] to-[#10192D] text-[#F5F6F8] p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#243B67]">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono-num font-semibold text-[#19B7A5]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#D7AE68]" aria-hidden="true" />
                <span>INTERACTIVE DCF WORKBENCH · FERNS N PETALS (~₹1,900CR CASE)</span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#F5F6F8]">
                Intrinsic DCF Valuation & Two-Dimensional WACC / Terminal Growth Grid
              </h3>
              <p className="text-xs sm:text-sm text-[#F5F6F8]/75 leading-relaxed">
                Adjust Discount Rate (WACC) and Terminal Growth Rate assumptions below to inspect how implied Enterprise Value behaves around the ~₹1,900 Crore base-case valuation.
              </p>
            </div>

            <div className="bg-[#10192D] text-[#F5F6F8] p-5 rounded-lg border border-[#D7AE68]/60 shrink-0 min-w-[240px] shadow-md">
              <div className="text-[11px] font-mono-num text-[#D7AE68]">
                IMPLIED ENTERPRISE VALUE
              </div>
              <div
                data-testid="implied-valuation-output"
                className="font-mono-num text-3xl font-semibold text-[#F5F6F8] mt-1"
              >
                ₹{impliedEvCr.toLocaleString('en-IN')} Cr
              </div>
              <div className="text-xs text-[#19B7A5] font-mono-num mt-1">
                WACC: {waccPct.toFixed(1)}% · g: {terminalGrowthPct.toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start bg-[#F5F6F8]">
            {/* Left Parameter Controls (4 cols) */}
            <div className="lg:col-span-4 space-y-5 bg-white p-5 rounded-lg border border-[#DCE2EC]">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#10192D]">
                  <label htmlFor="wacc-slider">Discount Rate (WACC %)</label>
                  <span className="font-mono-num text-[#4776FF]">{waccPct.toFixed(1)}%</span>
                </div>
                <input
                  id="wacc-slider"
                  type="range"
                  min="10.5"
                  max="14.5"
                  step="0.5"
                  value={waccPct}
                  onChange={(e) => setWaccPct(parseFloat(e.target.value))}
                  className="w-full accent-[#4776FF] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono-num text-[#5E6D87]">
                  <span>10.5%</span>
                  <span>Base: 12.5%</span>
                  <span>14.5%</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#10192D]">
                  <label htmlFor="growth-slider">Terminal Growth Rate (g %)</label>
                  <span className="font-mono-num text-[#19B7A5]">
                    {terminalGrowthPct.toFixed(1)}%
                  </span>
                </div>
                <input
                  id="growth-slider"
                  type="range"
                  min="3.0"
                  max="6.0"
                  step="0.5"
                  value={terminalGrowthPct}
                  onChange={(e) => setTerminalGrowthPct(parseFloat(e.target.value))}
                  className="w-full accent-[#19B7A5] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono-num text-[#5E6D87]">
                  <span>3.0%</span>
                  <span>Base: 4.5%</span>
                  <span>6.0%</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#DCE2EC] flex items-center justify-between">
                <span className="text-xs font-medium text-[#5E6D87]">
                  Base Benchmark: ~₹1,900 Cr
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setWaccPct(12.5);
                    setTerminalGrowthPct(4.5);
                  }}
                  className="text-xs font-semibold text-[#4776FF] hover:underline cursor-pointer"
                >
                  Reset Base Case
                </button>
              </div>
            </div>

            {/* Right 5x5 Sensitivity Table (8 cols) */}
            <div className="lg:col-span-8 overflow-x-auto bg-white rounded-lg border border-[#DCE2EC] p-5">
              <div className="text-xs font-mono-num font-semibold text-[#10192D] mb-3">
                2D SENSITIVITY MATRIX — IMPLIED ENTERPRISE VALUE (₹ CRORE) · WACC (ROWS) VS. TERMINAL GROWTH (COLS)
              </div>
              <table className="w-full text-left border-collapse font-mono-num text-xs">
                <thead>
                  <tr className="border-b border-[#DCE2EC] text-[#5E6D87]">
                    <th className="py-2.5 px-3 bg-[#F5F6F8] text-[#10192D]">WACC \ g</th>
                    {sensitivityMatrix[0].map((col) => (
                      <th key={col.terminalGrowth} className="py-2.5 px-3 text-right">
                        {col.terminalGrowth.toFixed(1)}%
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sensitivityMatrix.map((row, rIdx) => (
                    <tr key={row[0].wacc} className="border-b border-[#DCE2EC]/70">
                      <td className="py-2.5 px-3 font-semibold text-[#10192D] bg-[#F5F6F8]/70">
                        {row[0].wacc.toFixed(1)}%
                      </td>
                      {row.map((cell, cIdx) => {
                        const isCenter = rIdx === 2 && cIdx === 2;
                        return (
                          <td
                            key={cell.terminalGrowth}
                            className={`py-2.5 px-3 text-right ${
                              isCenter
                                ? 'bg-[#4776FF] text-[#F5F6F8] font-semibold rounded-xs'
                                : 'text-[#192438]'
                            }`}
                          >
                            ₹{cell.impliedEnterpriseValueCr.toLocaleString('en-IN')}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Dedicated Case Study View Modal */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-study-modal-title"
          className="fixed inset-0 z-50 bg-[#10192D]/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
        >
          <div className="bg-[#F5F6F8] rounded-xl border border-[#243B67] max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#DCE2EC]">
              <div className="space-y-1">
                <div className="text-xs font-mono-num text-[#4776FF] font-semibold">
                  CASE STUDY {selectedProject.index} · {selectedProject.projectClassification}
                </div>
                <h3
                  id="case-study-modal-title"
                  className="font-editorial text-2xl sm:text-3xl font-semibold text-[#10192D]"
                >
                  {selectedProject.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5E6D87]">{selectedProject.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Close case study dossier"
                className="p-2 rounded-md border border-[#DCE2EC] text-[#10192D] hover:bg-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#10192D] text-[#F5F6F8] p-4 rounded-lg border border-[#243B67]">
              <div>
                <div className="text-[11px] font-mono-num text-[#D7AE68]">HEADLINE METRIC</div>
                <div className="font-mono-num text-2xl font-semibold text-[#F5F6F8] mt-0.5">
                  {selectedProject.headlineMetric}
                </div>
                <div className="text-xs text-[#19B7A5]">{selectedProject.metricContext}</div>
              </div>
              <div>
                <div className="text-[11px] font-mono-num text-[#D7AE68]">INSTITUTION / CONTEXT</div>
                <div className="text-sm font-semibold text-[#F5F6F8] mt-0.5">
                  {selectedProject.affiliation}
                </div>
                <div className="text-xs text-[#F5F6F8]/70">{selectedProject.period}</div>
              </div>
              <div>
                <div className="text-[11px] font-mono-num text-[#D7AE68]">CLASSIFICATION</div>
                <div className="text-xs font-semibold text-[#4776FF] mt-1">
                  {selectedProject.projectClassification}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono-num uppercase tracking-wider text-[#10192D] font-semibold">
                1. Executive Summary & Analytical Approach
              </h4>
              <p className="text-sm text-[#192438] leading-relaxed">{selectedProject.summary}</p>
              <p className="text-xs sm:text-sm text-[#5E6D87] leading-relaxed">
                <strong className="text-[#10192D]">Analytical Approach:</strong>{' '}
                {selectedProject.analyticalApproach}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono-num uppercase tracking-wider text-[#10192D] font-semibold">
                2. Key Assumptions & Scope Boundaries
              </h4>
              <ul className="space-y-1.5">
                {selectedProject.assumptions.map((a, i) => (
                  <li
                    key={i}
                    className="text-xs sm:text-sm text-[#192438] flex items-start gap-2.5 leading-relaxed"
                  >
                    <span className="font-mono-num text-xs text-[#4776FF] font-semibold shrink-0">
                      A{i + 1}.
                    </span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono-num uppercase tracking-wider text-[#10192D] font-semibold">
                3. Methodology & Execution Steps
              </h4>
              <ul className="space-y-2">
                {selectedProject.methodology.map((step, i) => (
                  <li
                    key={i}
                    className="text-xs sm:text-sm text-[#192438] flex items-start gap-2.5 leading-relaxed"
                  >
                    <span className="font-mono-num text-xs text-[#19B7A5] font-semibold shrink-0">
                      0{i + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#DCE2EC]">
              <div className="space-y-2">
                <h4 className="text-xs font-mono-num uppercase tracking-wider text-[#10192D] font-semibold">
                  4. Deliverables Produced
                </h4>
                <ul className="space-y-1.5 text-xs text-[#5E6D87]">
                  {selectedProject.deliverables.map((d) => (
                    <li key={d}>· {d}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-mono-num uppercase tracking-wider text-[#10192D] font-semibold">
                  5. Outcomes & Analytical Findings
                </h4>
                <ul className="space-y-1.5 text-xs text-[#192438]">
                  {selectedProject.keyFindings.map((f, idx) => (
                    <li key={idx}>· {f}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer with Next/Prev Case Study Navigation */}
            <div className="pt-5 border-t border-[#DCE2EC] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigateSelectedProject('prev')}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-md text-xs font-semibold border border-[#DCE2EC] bg-white text-[#10192D] hover:border-[#4776FF] cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Previous Case</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateSelectedProject('next')}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-md text-xs font-semibold border border-[#DCE2EC] bg-white text-[#10192D] hover:border-[#4776FF] cursor-pointer"
                >
                  <span>Next Case</span>
                  <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2 rounded-md text-xs font-semibold bg-[#10192D] text-[#F5F6F8] hover:bg-[#4776FF] transition-colors cursor-pointer"
              >
                Close Case Study
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
