import React from 'react';
import {
  BarChart3,
  LineChart,
  Compass,
  ShieldCheck,
  GraduationCap,
  Award,
  BookOpen,
  Trophy,
  Users,
  CheckCircle2,
} from 'lucide-react';
import {
  EXPERTISE_CLUSTERS,
  EDUCATION_CREDENTIALS,
  LEADERSHIP_ROLES,
} from '../data/portfolioData';
import { ScrollReveal } from './ScrollReveal';

const EXPERTISE_ICONS = [BarChart3, LineChart, Compass, ShieldCheck];
const CREDENTIAL_ICONS = [GraduationCap, Award, BookOpen];
const LEADERSHIP_ICONS = [Trophy, Users];

export const ExpertiseCredentialsSection: React.FC = () => {
  return (
    <>
      {/* SECTION 04: CORE EXPERTISE & CAPABILITY TILES */}
      <section
        id="expertise"
        className="py-14 lg:py-20 border-b border-[#243B67] bg-navy-atmosphere bg-architectural-grid-dark text-[#F5F6F8]"
      >
        <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10 space-y-10 lg:space-y-12">
          <ScrollReveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-7 border-b border-[#243B67]">
            <div className="space-y-2.5 max-w-2xl">
              <div className="text-xs font-mono-num font-semibold tracking-wider text-[#19B7A5]">
                04. DOMAIN EXPERTISE & TECHNICAL CAPABILITIES
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#F5F6F8] leading-[1.12]">
                Four Integrated Pillars of{' '}
                <span className="text-[#4776FF]">Financial Execution</span>.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#F5F6F8]/75 max-w-md leading-relaxed">
              Structured across commercial FP&A, intrinsic valuation modelling, institutional investment screening, and Big-4 statutory audit compliance.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 lg:gap-8 items-stretch">
            {EXPERTISE_CLUSTERS.map((cluster, idx) => {
              const IconComponent = EXPERTISE_ICONS[idx % EXPERTISE_ICONS.length];
              const topBorders = [
                'border-t-[#4776FF]',
                'border-t-[#19B7A5]',
                'border-t-[#D7AE68]',
                'border-t-[#4776FF]',
              ];
              return (
                <ScrollReveal key={cluster.id} delayMs={idx * 100} className="flex">
                  <div
                    className={`card-interactive w-full rounded-xl bg-[#172C50]/85 border border-[#243B67] border-t-2 ${topBorders[idx]} p-6 sm:p-8 flex flex-col justify-between space-y-5`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[#243B67]">
                        <div className="flex items-center gap-2.5">
                          <span className="w-9 h-9 rounded-lg bg-[#10192D] border border-[#243B67] flex items-center justify-center text-[#19B7A5]">
                            <IconComponent className="w-4 h-4" aria-hidden="true" />
                          </span>
                          <div>
                            <div className="text-[11px] font-mono-num font-semibold text-[#D7AE68]">
                              PILLAR {cluster.index}
                            </div>
                            <div className="text-xs text-[#F5F6F8]/70">
                              {cluster.subtitle.split(',')[0]}
                            </div>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded text-[11px] font-mono-num bg-[#10192D] text-[#4776FF] border border-[#243B67]">
                          {cluster.capabilities.length} Capabilities
                        </span>
                      </div>

                      <h3 className="font-editorial text-2xl sm:text-[26px] font-semibold text-[#F5F6F8]">
                        {cluster.domain}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#F5F6F8]/75 leading-relaxed">
                        {cluster.description}
                      </p>

                      <ul className="space-y-2.5 pt-1">
                        {cluster.capabilities.map((cap) => (
                          <li
                            key={cap}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-[#F5F6F8]/90"
                          >
                            <CheckCircle2
                              className="w-4 h-4 text-[#19B7A5] shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Method & Tool Chips Footer */}
                    <div className="pt-4 border-t border-[#243B67] flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="font-semibold text-[#D7AE68] mr-1">Methods:</span>
                      {cluster.frameworksAndTools.map((tool) => (
                        <span
                          key={tool}
                          className="px-2.5 py-0.5 rounded bg-[#10192D] border border-[#243B67] text-[#F5F6F8]/85 text-[11px]"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 05 & 06: EDUCATION, CREDENTIALS & LEADERSHIP */}
      <section
        id="credentials"
        className="py-14 lg:py-20 border-b border-[#DCE2EC] bg-[#F5F6F8] bg-architectural-grid"
      >
        <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10 space-y-14">
          {/* Academic & Professional Credentials */}
          <div className="space-y-8">
            <ScrollReveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-7 border-b border-[#DCE2EC]">
              <div className="space-y-2.5 max-w-2xl">
                <div className="text-xs font-mono-num font-semibold tracking-wider text-[#4776FF]">
                  05. ACADEMIC PEDIGREE & PROFESSIONAL CHARTERS
                </div>
                <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#10192D] leading-[1.12]">
                  IIM Kozhikode, <span className="text-[#4776FF]">CFA Institute</span> & H.L. College of Commerce.
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#5E6D87] max-w-md leading-relaxed">
                Postgraduate management education in Finance & Strategy paired with globally benchmarked investment credentials and an undergraduate commerce foundation.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 lg:gap-8 items-stretch">
              {EDUCATION_CREDENTIALS.map((edu, idx) => {
                const IconComponent = CREDENTIAL_ICONS[idx % CREDENTIAL_ICONS.length];
                const isFeatured = idx === 0;
                return (
                  <ScrollReveal key={edu.id} delayMs={idx * 100} className="flex">
                    <div
                      className={`card-interactive w-full rounded-xl p-6 sm:p-7 flex flex-col justify-between space-y-5 border ${
                        isFeatured
                          ? 'bg-gradient-to-br from-[#10192D] via-[#172C50] to-[#10192D] text-[#F5F6F8] border-[#D7AE68]/60 shadow-lg'
                          : 'bg-white text-[#192438] border-[#DCE2EC] border-t-4 border-t-[#4776FF]'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs font-mono-num">
                          <span
                            className={`inline-flex items-center gap-1.5 font-semibold ${
                              isFeatured ? 'text-[#D7AE68]' : 'text-[#4776FF]'
                            }`}
                          >
                            <IconComponent className="w-4 h-4" aria-hidden="true" />
                            <span>{edu.index} / CREDENTIAL</span>
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded text-[11px] ${
                              isFeatured
                                ? 'bg-[#10192D] text-[#19B7A5] border border-[#243B67]'
                                : 'bg-[#F5F6F8] text-[#5E6D87]'
                            }`}
                          >
                            {edu.period}
                          </span>
                        </div>
                        <h3
                          className={`font-editorial text-2xl font-semibold leading-snug ${
                            isFeatured ? 'text-[#F5F6F8]' : 'text-[#10192D]'
                          }`}
                        >
                          {edu.institution}
                        </h3>
                        <p
                          className={`text-sm font-semibold ${
                            isFeatured ? 'text-[#19B7A5]' : 'text-[#192438]'
                          }`}
                        >
                          {edu.credential}
                        </p>
                        <p
                          className={`text-xs leading-relaxed ${
                            isFeatured ? 'text-[#F5F6F8]/75' : 'text-[#5E6D87]'
                          }`}
                        >
                          {edu.distinction}
                        </p>
                      </div>

                      <div
                        className={`pt-4 border-t space-y-2 ${
                          isFeatured ? 'border-[#243B67]' : 'border-[#DCE2EC]'
                        }`}
                      >
                        <div
                          className={`text-[11px] font-mono-num font-semibold ${
                            isFeatured ? 'text-[#D7AE68]' : 'text-[#4776FF]'
                          }`}
                        >
                          CORE CURRICULUM & FOCUS
                        </div>
                        <ul
                          className={`space-y-1 text-xs ${
                            isFeatured ? 'text-[#F5F6F8]/85' : 'text-[#192438]'
                          }`}
                        >
                          {edu.focusAreas.map((area) => (
                            <li key={area}>· {area}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>

          {/* Section 06: Compact Leadership & Institutional Stewardship */}
          <div className="space-y-8 pt-2">
            <ScrollReveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-[#DCE2EC]">
              <div className="space-y-2 max-w-2xl">
                <div className="text-xs font-mono-num font-semibold tracking-wider text-[#19B7A5]">
                  06. LEADERSHIP & ATHLETIC STEWARDSHIP
                </div>
                <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#10192D] leading-[1.12]">
                  Captaining High-Pressure Teams on the Court and Across Institutions.
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#5E6D87] max-w-md leading-relaxed">
                Leadership forged through competitive Inter-IIM athletics and elected student governance.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {LEADERSHIP_ROLES.map((role, idx) => {
                const IconComponent = LEADERSHIP_ICONS[idx % LEADERSHIP_ICONS.length];
                const accentBorder =
                  idx === 0 ? 'border-l-[#D7AE68]' : 'border-l-[#4776FF]';
                return (
                  <ScrollReveal key={role.id} delayMs={idx * 100} className="flex">
                    <div
                      className={`card-interactive w-full rounded-xl bg-white border border-[#DCE2EC] border-l-4 ${accentBorder} p-6 sm:p-7 space-y-4 shadow-xs`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono-num">
                        <span className="inline-flex items-center gap-2 text-[#10192D] font-semibold">
                          <span className="w-8 h-8 rounded-lg bg-[#10192D] text-[#D7AE68] flex items-center justify-center">
                            <IconComponent className="w-4 h-4" aria-hidden="true" />
                          </span>
                          <span>
                            {role.index} · {role.institution}
                          </span>
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-[#F5F6F8] text-[#4776FF] font-semibold">
                          {role.context}
                        </span>
                      </div>
                      <h3 className="font-editorial text-2xl font-semibold text-[#10192D]">
                        {role.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#192438] leading-relaxed">
                        {role.impactSummary}
                      </p>
                      <ul className="pt-3 border-t border-[#DCE2EC] space-y-1.5 text-xs text-[#5E6D87]">
                        {role.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-[#19B7A5] font-bold">·</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
