import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Compass,
  Building2,
  Calendar,
  MapPin,
  CheckCircle2,
  Award,
  Briefcase,
  Layers,
} from 'lucide-react';
import { PHILOSOPHY_PILLARS, EXPERIENCE_DATA } from '../data/portfolioData';
import { ScrollReveal } from './ScrollReveal';

const PILLAR_ICONS = [ShieldCheck, TrendingUp, Compass];

const CAREER_FACT_HIGHLIGHTS = [
  {
    value: '3 Years',
    label: 'Institutional Finance Tenure',
    detail: 'Allcargo Global · IPV · Deloitte',
    accent: 'border-l-[#4776FF]',
  },
  {
    value: 'IIM Kozhikode',
    label: 'MBA, Finance & Strategy',
    detail: '2024–2026 Cohort · Inter-IIM Captain',
    accent: 'border-l-[#D7AE68]',
  },
  {
    value: 'CFA Level I',
    label: 'Cleared August 2025',
    detail: 'Valuation, Fixed Income & Corporate Issuers',
    accent: 'border-l-[#19B7A5]',
  },
  {
    value: 'Tri-Sector Lens',
    label: 'Audit · Venture · Business Finance',
    detail: 'Statutory rigor to commercial FP&A',
    accent: 'border-l-[#4776FF]',
  },
];

export const AboutExperienceSection: React.FC = () => {
  const [selectedExpId, setSelectedExpId] = useState<string>(EXPERIENCE_DATA[0].id);

  const activeExperience =
    EXPERIENCE_DATA.find((e) => e.id === selectedExpId) || EXPERIENCE_DATA[0];

  return (
    <>
      {/* SECTION 01: COMPACT TWO-COLUMN ABOUT & HIGHLIGHTED CAREER FACTS */}
      <section
        id="about"
        className="py-14 lg:py-20 border-b border-[#DCE2EC] bg-[#F5F6F8] bg-architectural-grid"
      >
        <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10 space-y-10 lg:space-y-12">
          {/* Section Header */}
          <ScrollReveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-7 border-b border-[#DCE2EC]">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono-num font-semibold tracking-wider text-[#4776FF]">
                <Layers className="w-3.5 h-3.5 text-[#19B7A5]" aria-hidden="true" />
                <span>01. EXECUTIVE PROFILE & ANALYTICAL PHILOSOPHY</span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#10192D] leading-[1.12]">
                Bridging Statutory Assurance,{' '}
                <span className="text-[#4776FF]">Venture Strategy</span> & Global Business Finance.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5E6D87] max-w-md leading-relaxed">
              Every sound investment or operational decision rests on verifiable historical numbers, disciplined forward valuation models, and on-the-ground commercial execution.
            </p>
          </ScrollReveal>

          {/* Two-Column Layout: Left Narrative + Fact Grid (6 cols) | Right Philosophy Cards (6 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Column: Professional Introduction + 2x2 Career Facts Grid */}
            <ScrollReveal className="lg:col-span-6 flex flex-col justify-between space-y-6 bg-white border border-[#DCE2EC] rounded-xl p-6 sm:p-8 shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-[#10192D] flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#4776FF]" aria-hidden="true" />
                    <span>The Institutional Trajectory</span>
                  </h3>
                  <span className="text-[11px] font-mono-num font-semibold px-2.5 py-0.5 rounded bg-[#10192D] text-[#D7AE68]">
                    B.COM · CFA L1 · MBA
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#192438] leading-relaxed">
                  Beginning my career in Statutory Audit at <strong>Deloitte Haskins & Sells</strong> (August 2022 – June 2024) after graduating with a B.Com from <strong>H.L. College of Commerce</strong>, I spent nearly two years examining how complex enterprises recognise revenue, manage working capital, and govern internal financial controls.
                </p>
                <p className="text-xs sm:text-sm text-[#5E6D87] leading-relaxed">
                  At <strong>IIM Kozhikode</strong> (MBA in Finance & Strategy, 2024–2026) and alongside clearing <strong>CFA Level I</strong> (August 2025), I expanded that accounting foundation into intrinsic corporate valuation (~₹1,900Cr Ferns N Petals valuation; $500M M&A target simulation) and empirical capital-markets research at <strong>Inflection Point Ventures</strong>.
                </p>
                <p className="text-xs sm:text-sm text-[#5E6D87] leading-relaxed">
                  Today, as <strong>Management Trainee, Finance – North Asia at Allcargo Global</strong>, I apply this end-to-end lens to regional profitability diagnostics and working-capital optimisation across international trade lanes.
                </p>
              </div>

              {/* 2x2 Highlighted Career Facts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 border-t border-[#DCE2EC]">
                {CAREER_FACT_HIGHLIGHTS.map((fact) => (
                  <div
                    key={fact.label}
                    className={`p-4 rounded-lg bg-[#F5F6F8] border border-[#DCE2EC] border-l-4 ${fact.accent}`}
                  >
                    <div className="font-mono-num text-sm sm:text-base font-semibold text-[#10192D]">
                      {fact.value}
                    </div>
                    <div className="text-xs font-semibold text-[#192438] mt-0.5">
                      {fact.label}
                    </div>
                    <div className="text-[11px] text-[#5E6D87] mt-0.5">
                      {fact.detail}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Right Column: 3 Philosophy Pillar Cards with Staggered Entry */}
            <div className="lg:col-span-6 flex flex-col justify-between gap-5">
              {PHILOSOPHY_PILLARS.map((pillar, idx) => {
                const IconComponent = PILLAR_ICONS[idx % PILLAR_ICONS.length];
                const topBorderColors = [
                  'border-l-[#4776FF]',
                  'border-l-[#19B7A5]',
                  'border-l-[#D7AE68]',
                ];
                const iconBgColors = [
                  'bg-[#4776FF]/10 text-[#4776FF]',
                  'bg-[#19B7A5]/10 text-[#19B7A5]',
                  'bg-[#D7AE68]/15 text-[#10192D]',
                ];
                return (
                  <ScrollReveal
                    key={pillar.index}
                    delayMs={idx * 100}
                    className={`card-interactive p-6 sm:p-7 bg-white rounded-xl border border-[#DCE2EC] border-l-4 ${topBorderColors[idx]} flex items-start gap-4`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconBgColors[idx]}`}
                    >
                      <IconComponent className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[11px] font-mono-num font-semibold text-[#4776FF]">
                        <span>PILLAR {pillar.index}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#5E6D87]">CORE PRINCIPLE</span>
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-[#10192D]">
                        {pillar.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#5E6D87] leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 02: PREMIUM VERTICAL CAREER TIMELINE & MANDATE DOSSIER */}
      <section
        id="experience"
        className="py-14 lg:py-20 border-b border-[#243B67] bg-navy-atmosphere bg-architectural-grid-dark text-[#F5F6F8]"
      >
        <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10 space-y-10 lg:space-y-12">
          {/* Header + Role Switcher */}
          <ScrollReveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-[#243B67]">
            <div className="space-y-2 max-w-2xl">
              <div className="text-xs font-mono-num font-semibold tracking-wider text-[#19B7A5]">
                02. CAREER CHRONOLOGY & INSTITUTIONAL MANDATES
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#F5F6F8] leading-[1.12]">
                Progressive Experience Across{' '}
                <span className="text-[#4776FF]">Corporate Finance</span>,{' '}
                <span className="text-[#19B7A5]">Venture Capital</span> &{' '}
                <span className="text-[#D7AE68]">Big-4 Audit</span>.
              </h2>
            </div>

            {/* Interactive Role Switcher */}
            <div
              role="tablist"
              aria-label="Select organization mandate to inspect"
              className="flex flex-wrap items-center gap-1.5 bg-[#10192D] p-1.5 rounded-lg border border-[#243B67]"
            >
              {EXPERIENCE_DATA.map((exp) => {
                const isSelected = exp.id === selectedExpId;
                return (
                  <button
                    key={exp.id}
                    role="tab"
                    aria-selected={isSelected}
                    type="button"
                    onClick={() => setSelectedExpId(exp.id)}
                    className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4776FF] ${
                      isSelected
                        ? 'bg-[#4776FF] text-[#F5F6F8] shadow-md shadow-[#4776FF]/25'
                        : 'text-[#F5F6F8]/70 hover:text-[#F5F6F8] hover:bg-[#172C50]/60'
                    }`}
                  >
                    {exp.index}. {exp.organization.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </ScrollReveal>

          {/* Vertical Career Timeline Rail + Active Mandate Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Connected Vertical Timeline Rail (5 cols) */}
            <div className="lg:col-span-5 relative pl-6 border-l-2 border-[#243B67] space-y-4">
              {EXPERIENCE_DATA.map((exp, idx) => {
                const isSelected = exp.id === selectedExpId;
                const nodeColors = ['bg-[#4776FF]', 'bg-[#19B7A5]', 'bg-[#D7AE68]'];
                return (
                  <ScrollReveal key={exp.id} delayMs={idx * 100} className="relative">
                    {/* Timeline Node Dot */}
                    <span
                      className={`absolute -left-[31px] top-6 w-3.5 h-3.5 rounded-full border-2 border-[#10192D] transition-transform ${
                        isSelected
                          ? `${nodeColors[idx % nodeColors.length]} scale-125 ring-4 ring-[#4776FF]/25`
                          : 'bg-[#5E6D87]'
                      }`}
                      aria-hidden="true"
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedExpId(exp.id)}
                      className={`w-full text-left p-5 rounded-xl border transition-all cursor-pointer block focus-visible:outline-2 focus-visible:outline-[#4776FF] ${
                        isSelected
                          ? 'bg-gradient-to-br from-[#172C50] to-[#132342] border-[#4776FF] shadow-lg shadow-[#080D18]/40'
                          : 'bg-[#10192D]/70 border-[#243B67] hover:border-[#4776FF]/60 hover:bg-[#172C50]/45'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs font-mono-num mb-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            isSelected
                              ? 'bg-[#4776FF]/20 text-[#19B7A5] border border-[#19B7A5]/40'
                              : 'bg-[#172C50] text-[#F5F6F8]/70'
                          }`}
                        >
                          {exp.period}
                        </span>
                        <span className="text-[#D7AE68] text-[11px]">
                          {exp.tenureType.split(' ')[0]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2
                          className={`w-4 h-4 shrink-0 ${
                            isSelected ? 'text-[#4776FF]' : 'text-[#F5F6F8]/50'
                          }`}
                          aria-hidden="true"
                        />
                        <h3 className="text-base sm:text-lg font-semibold text-[#F5F6F8]">
                          {exp.organization}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-[#19B7A5] mt-1 font-medium">
                        {exp.role}
                      </p>
                      <p className="text-xs text-[#F5F6F8]/70 mt-2 line-clamp-2 leading-relaxed">
                        {exp.mandateSummary}
                      </p>
                    </button>
                  </ScrollReveal>
                );
              })}
            </div>

            {/* Right Column: Active Role Dossier Card (7 cols) */}
            <ScrollReveal
              delayMs={150}
              className="lg:col-span-7 rounded-xl bg-gradient-to-b from-[#172C50]/95 to-[#10192D] border border-[#243B67] p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#243B67]">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 text-xs font-mono-num text-[#19B7A5]">
                    <Calendar className="w-3.5 h-3.5 text-[#4776FF]" aria-hidden="true" />
                    <span>MANDATE DOSSIER · {activeExperience.period}</span>
                  </div>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#F5F6F8]">
                    {activeExperience.role}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#D7AE68] font-medium">
                    {activeExperience.organization} · {activeExperience.division}
                  </p>
                </div>
                <div className="text-xs font-mono-num text-[#F5F6F8]/80 sm:text-right space-y-1">
                  <div className="inline-flex items-center gap-1 text-[#F5F6F8]">
                    <MapPin className="w-3.5 h-3.5 text-[#19B7A5]" aria-hidden="true" />
                    <span>{activeExperience.location}</span>
                  </div>
                  <div className="text-[#F5F6F8]/60 text-[11px]">{activeExperience.tenureType}</div>
                </div>
              </div>

              {/* Mandate Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono-num uppercase tracking-wider text-[#D7AE68]">
                  Executive Mandate & Scope
                </h4>
                <p className="text-xs sm:text-sm text-[#F5F6F8]/90 leading-relaxed">
                  {activeExperience.mandateSummary}
                </p>
              </div>

              {/* Key Professional Contributions */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-mono-num uppercase tracking-wider text-[#19B7A5]">
                  Professional Contributions & Analytical Execution
                </h4>
                <ul className="space-y-2.5">
                  {activeExperience.keyHighlights.map((bullet, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-[#F5F6F8]/90 leading-relaxed"
                    >
                      <CheckCircle2
                        className="w-4 h-4 text-[#4776FF] mt-0.5 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Selective Metric Highlights Strip */}
              <div className="pt-5 border-t border-[#243B67] grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {activeExperience.quantifiedOutcomes.map((item, idx) => {
                  const borderAccents = [
                    'border-t-[#4776FF]',
                    'border-t-[#19B7A5]',
                    'border-t-[#D7AE68]',
                  ];
                  return (
                    <div
                      key={item.label}
                      className={`p-4 rounded-lg bg-[#10192D]/90 border border-[#243B67] border-t-2 ${borderAccents[idx % borderAccents.length]}`}
                    >
                      <div className="font-mono-num text-lg sm:text-xl font-semibold text-[#F5F6F8]">
                        {item.metric}
                      </div>
                      <div className="text-xs font-semibold text-[#19B7A5] mt-1">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-[#F5F6F8]/65 mt-1 leading-snug">
                        {item.context}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Analytical Pillars & Confidentiality Footnote */}
              <div className="pt-3 border-t border-[#243B67]/60 space-y-2">
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="font-semibold text-[#D7AE68] mr-1 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Analytical Focus:</span>
                  </span>
                  {activeExperience.analyticalPillars.map((pillar) => (
                    <span
                      key={pillar}
                      className="px-2.5 py-0.5 rounded bg-[#10192D] border border-[#243B67] text-[#F5F6F8]/85 text-[11px]"
                    >
                      {pillar}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-[#F5F6F8]/55 italic">
                  Note: {activeExperience.confidentialityNote}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
};
