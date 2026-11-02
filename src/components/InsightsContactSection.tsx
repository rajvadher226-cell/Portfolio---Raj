import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  Copy,
  Check,
  Mail,
  FileText,
  X,
  Printer,
  Download,
  Phone,
  ArrowUp,
  BookOpen,
} from 'lucide-react';
import {
  PROFILE_DATA,
  INSIGHTS_ARTICLES,
  EXPERIENCE_DATA,
  PROJECTS_DATA,
  EDUCATION_CREDENTIALS,
  type InsightArticle,
} from '../data/portfolioData';
import { formatResumePlainText } from '../utils/valuationLogic';
import { ScrollReveal } from './ScrollReveal';

interface InsightsContactSectionProps {
  dossierOpen: boolean;
  onOpenDossier: () => void;
  onCloseDossier: () => void;
}

export const InsightsContactSection: React.FC<InsightsContactSectionProps> = ({
  dossierOpen,
  onOpenDossier,
  onCloseDossier,
}) => {
  const [selectedArticle, setSelectedArticle] = useState<InsightArticle | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showPhonePolicy, setShowPhonePolicy] = useState(false);
  const [resumeDownloaded, setResumeDownloaded] = useState(false);

  useEffect(() => {
    if (!selectedArticle && !dossierOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedArticle) setSelectedArticle(null);
        if (dossierOpen) onCloseDossier();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedArticle, dossierOpen, onCloseDossier]);

  const handleCopyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(PROFILE_DATA.email).catch(() => {});
    }
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleDownloadResume = () => {
    const resumeText = formatResumePlainText({
      name: PROFILE_DATA.name,
      headline: PROFILE_DATA.headline,
      tagline: PROFILE_DATA.tagline,
      email: PROFILE_DATA.email,
      linkedinUrl: PROFILE_DATA.linkedinUrl,
    });
    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Rajkumar_Vadher_Resume_IIM_Kozhikode.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setResumeDownloaded(true);
    setTimeout(() => setResumeDownloaded(false), 3000);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* SECTION 07: INSIGHTS (PREMIUM ARTICLE CARDS WITH COVER TREATMENTS) */}
      <section
        id="insights"
        className="py-14 lg:py-20 border-b border-[#DCE2EC] bg-[#F5F6F8]"
      >
        <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10 space-y-10 lg:space-y-12">
          <ScrollReveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-7 border-b border-[#DCE2EC]">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono-num font-semibold tracking-wider text-[#4776FF]">
                <BookOpen className="w-3.5 h-3.5 text-[#19B7A5]" aria-hidden="true" />
                <span>07. INSIGHTS & RESEARCH MONOGRAPHS (SAMPLE EDITORIAL PLACEHOLDERS)</span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#10192D] leading-[1.12]">
                Financial Research & <span className="text-[#4776FF]">Working Paper</span> Layout.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5E6D87] max-w-md leading-relaxed">
              Structured article architecture prepared for forthcoming long-form research notes. All entries below are clearly marked as sample editorial placeholders.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 lg:gap-8 items-stretch">
            {INSIGHTS_ARTICLES.map((article, idx) => {
              const coverBorders = [
                'from-[#10192D] to-[#172C50]',
                'from-[#172C50] to-[#10192D]',
                'from-[#10192D] via-[#172C50] to-[#1E3A6D]',
              ];
              return (
                <ScrollReveal key={article.id} delayMs={idx * 100} className="flex">
                  <article className="card-interactive group w-full rounded-xl bg-white border border-[#DCE2EC] hover:border-[#4776FF] overflow-hidden flex flex-col justify-between shadow-xs">
                    <div>
                      {/* Attractive Cover Header Treatment */}
                      <div
                        className={`p-5 bg-gradient-to-br ${coverBorders[idx % coverBorders.length]} text-[#F5F6F8] border-b border-[#243B67] space-y-3`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-num font-semibold bg-[#D7AE68]/20 text-[#D7AE68] border border-[#D7AE68]/40">
                            {article.statusTag}
                          </span>
                          <span className="text-xs font-mono-num text-[#19B7A5]">
                            {article.readTime}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs font-mono-num font-semibold text-[#4776FF]">
                            PAPER {article.index} · {article.category.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 space-y-3">
                        <h3 className="font-editorial text-xl sm:text-2xl font-semibold text-[#10192D] leading-snug group-hover:text-[#4776FF] transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#5E6D87] leading-relaxed">
                          {article.abstract}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 py-4 bg-[#F5F6F8]/80 border-t border-[#DCE2EC] flex items-center justify-between">
                      <span className="text-xs font-mono-num text-[#5E6D87]">{article.date}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedArticle(article)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#10192D] hover:text-[#4776FF] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4776FF]"
                      >
                        <span>Preview Layout</span>
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 08: STRONG DARK-BACKGROUND CLOSING CONTACT & RESUME SECTION */}
      <section
        id="contact"
        className="py-14 lg:py-20 bg-navy-atmosphere bg-architectural-grid-dark text-[#F5F6F8] border-b border-[#243B67]"
      >
        <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10 space-y-10 lg:space-y-12">
          <ScrollReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Positioning & Direct Institutional Correspondence (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="space-y-2.5">
                <div className="text-xs font-mono-num font-semibold tracking-wider text-[#19B7A5]">
                  08. CONTACT & CURRICULUM VITAE ACCESS
                </div>
                <h2 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#F5F6F8] leading-[1.12]">
                  Direct Channels for{' '}
                  <span className="text-[#4776FF]">Finance, Valuation</span> &{' '}
                  <span className="text-[#D7AE68]">Investment</span> Roles.
                </h2>
                <p className="text-xs sm:text-sm text-[#F5F6F8]/75 leading-relaxed">
                  Connect directly via institutional email or LinkedIn for discussions regarding Business Finance, FP&A, Corporate Valuation, and Investment Analysis opportunities.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#172C50]/85 border border-[#243B67] border-l-4 border-l-[#D7AE68] space-y-2.5">
                <div className="text-xs font-mono-num text-[#D7AE68]">
                  CURRENT POSITIONING
                </div>
                <div className="text-sm font-semibold text-[#F5F6F8]">
                  {PROFILE_DATA.currentStatus}
                </div>
                <div className="text-xs text-[#F5F6F8]/70 leading-relaxed">
                  MBA, Finance & Strategy — IIM Kozhikode (2024–2026) · CFA Level I (Cleared Aug 2025) · B.Com — H.L. College of Commerce
                </div>
              </div>
            </div>

            {/* Right Column: Actionable Channels, Optional Phone Privacy Control & Downloadable Resume (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Electronic Mail Channel */}
              <div className="sm:col-span-2 p-5 sm:p-6 rounded-xl bg-[#172C50]/85 border border-[#243B67] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[11px] font-mono-num text-[#19B7A5]">
                    DIRECT ELECTRONIC MAIL
                  </div>
                  <a
                    href={`mailto:${PROFILE_DATA.email}?subject=Finance%20%26%20Valuation%20Inquiry%20%E2%80%94%20Rajkumar%20Vadher`}
                    className="text-base font-mono-num font-semibold text-[#F5F6F8] hover:text-[#4776FF] transition-colors break-all"
                  >
                    {PROFILE_DATA.email}
                  </a>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-[#10192D] border border-[#243B67] text-[#F5F6F8] hover:border-[#4776FF] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#19B7A5]" aria-hidden="true" />
                        <span>Copied Address</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#4776FF]" aria-hidden="true" />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>
                  <a
                    href={`mailto:${PROFILE_DATA.email}?subject=Finance%20%26%20Valuation%20Inquiry%20%E2%80%94%20Rajkumar%20Vadher`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold bg-[#4776FF] text-[#F5F6F8] hover:bg-[#3865ED] transition-colors whitespace-nowrap shadow-md shadow-[#4776FF]/25"
                  >
                    <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Compose Email</span>
                  </a>
                </div>
              </div>

              {/* 2. LinkedIn Profile */}
              <a
                href={PROFILE_DATA.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 sm:p-6 rounded-xl bg-[#172C50]/85 border border-[#243B67] hover:border-[#4776FF] transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono-num text-[#D7AE68]">
                    PROFESSIONAL NETWORK
                  </span>
                  <ArrowUpRight
                    className="w-4 h-4 text-[#4776FF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <div className="text-base font-semibold text-[#F5F6F8]">
                    LinkedIn · Rajkumar Vadher
                  </div>
                  <div className="text-xs text-[#F5F6F8]/70 mt-1">
                    Connect for executive messaging & credentials verification
                  </div>
                </div>
              </a>

              {/* 3. Optional Phone Visibility Control (Privacy-First) */}
              <div className="p-5 sm:p-6 rounded-xl bg-[#172C50]/85 border border-[#243B67] flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono-num text-[#19B7A5]">
                    TELEPHONE VISIBILITY (OPTIONAL)
                  </span>
                  <Phone className="w-4 h-4 text-[#19B7A5]" aria-hidden="true" />
                </div>

                {showPhonePolicy ? (
                  <div className="space-y-2">
                    <p className="text-xs text-[#F5F6F8]/90 leading-relaxed">
                      {PROFILE_DATA.phonePolicyNote}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <a
                        href={`mailto:${PROFILE_DATA.email}?subject=Request%20for%20Direct%20Telephone%20Contact%20%E2%80%94%20Rajkumar%20Vadher`}
                        className="text-xs font-semibold text-[#19B7A5] hover:underline"
                      >
                        Request Callback via Email →
                      </a>
                      <button
                        type="button"
                        onClick={() => setShowPhonePolicy(false)}
                        className="text-[11px] text-[#F5F6F8]/65 hover:text-[#F5F6F8] cursor-pointer"
                      >
                        Hide
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="text-sm font-semibold text-[#F5F6F8]">
                      Protected Direct Line
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPhonePolicy(true)}
                      aria-expanded={showPhonePolicy}
                      className="text-xs font-semibold text-[#4776FF] hover:underline text-left cursor-pointer"
                    >
                      View Telephone Access Policy →
                    </button>
                  </div>
                )}
              </div>

              {/* 4. Resume Access & Downloadable File */}
              <div className="sm:col-span-2 p-5 sm:p-6 rounded-xl bg-gradient-to-r from-[#172C50] to-[#10192D] border border-[#D7AE68]/45 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[11px] font-mono-num text-[#D7AE68]">
                    CURRICULUM VITAE & DOSSIER
                  </div>
                  <div className="text-base font-semibold text-[#F5F6F8]">
                    Verified Resume Summary & Printable Executive Dossier
                  </div>
                  <p className="text-xs text-[#F5F6F8]/70">
                    Download the structured resume file or launch the interactive print/PDF dossier view.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={handleDownloadResume}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-semibold border border-[#243B67] bg-[#10192D] text-[#F5F6F8] hover:border-[#4776FF] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5 text-[#19B7A5]" aria-hidden="true" />
                    <span>{resumeDownloaded ? 'Resume Downloaded' : 'Download Resume (.txt)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenDossier}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-semibold bg-[#D7AE68] text-[#10192D] hover:bg-[#E2BD7B] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Open Print / PDF Dossier</span>
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* QUIET INSTITUTIONAL FOOTER WITH BACK-TO-TOP CONTROL */}
      <footer className="bg-[#0B1221] text-[#F5F6F8]/65 py-8 px-5 sm:px-6 lg:px-8">
        <div className="max-w-[1220px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded border border-[#D7AE68]/60 bg-[#172C50] text-[#D7AE68] font-editorial text-xs font-semibold">
              RV
            </span>
            <div className="text-xs">
              <span className="text-[#F5F6F8] font-semibold">Rajkumar Vadher</span>
              <span> · MBA (IIM Kozhikode) · CFA Level I · Business Finance & Valuation</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs">
            <a href="#about" className="hover:text-[#F5F6F8] transition-colors">
              About
            </a>
            <a href="#experience" className="hover:text-[#F5F6F8] transition-colors">
              Experience
            </a>
            <a href="#projects" className="hover:text-[#F5F6F8] transition-colors">
              Projects
            </a>
            <a href="#expertise" className="hover:text-[#F5F6F8] transition-colors">
              Expertise
            </a>
            <a href="#credentials" className="hover:text-[#F5F6F8] transition-colors">
              Credentials
            </a>
            <button
              type="button"
              onClick={onOpenDossier}
              className="text-[#19B7A5] hover:underline cursor-pointer"
            >
              Curriculum Vitae
            </button>
            <button
              type="button"
              onClick={handleScrollToTop}
              aria-label="Scroll back to top of page"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-[#243B67] bg-[#172C50] text-[#F5F6F8] hover:border-[#4776FF] transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5 text-[#4776FF]" aria-hidden="true" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </footer>

      {/* RESEARCH ARTICLE READER MODAL */}
      {selectedArticle && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="insight-modal-title"
          className="fixed inset-0 z-50 bg-[#10192D]/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
        >
          <div className="bg-[#F5F6F8] rounded-xl border border-[#243B67] max-w-2xl w-full max-h-[88vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#DCE2EC]">
              <div className="space-y-1">
                <div className="text-xs font-mono-num text-[#4776FF] font-semibold">
                  {selectedArticle.statusTag} · {selectedArticle.category}
                </div>
                <h3
                  id="insight-modal-title"
                  className="font-editorial text-2xl sm:text-3xl font-semibold text-[#10192D]"
                >
                  {selectedArticle.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5E6D87]">{selectedArticle.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                aria-label="Close research note"
                className="p-2 rounded-md border border-[#DCE2EC] text-[#10192D] hover:bg-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-lg bg-white border border-[#DCE2EC] space-y-2">
              <div className="text-xs font-mono-num font-semibold text-[#10192D]">
                SAMPLE THESIS OUTLINE (PLACEHOLDER)
              </div>
              <ul className="space-y-1.5 text-xs text-[#192438]">
                {selectedArticle.keyTakeaways.map((t, idx) => (
                  <li key={idx}>· {t}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-5">
              {selectedArticle.fullSections.map((sec) => (
                <div key={sec.heading} className="space-y-2">
                  <h4 className="text-sm font-semibold text-[#10192D]">{sec.heading}</h4>
                  <p className="text-xs sm:text-sm text-[#192438] leading-relaxed">{sec.body}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#DCE2EC] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 rounded-md text-xs font-semibold bg-[#10192D] text-[#F5F6F8] hover:bg-[#4776FF] cursor-pointer"
              >
                Close Sample Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXECUTIVE CURRICULUM VITAE / DOSSIER MODAL */}
      {dossierOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="executive-dossier-title"
          className="fixed inset-0 z-50 bg-[#10192D]/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
        >
          <div className="bg-[#F5F6F8] rounded-xl border border-[#243B67] max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-7 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#DCE2EC]">
              <div className="space-y-1">
                <div className="text-xs font-mono-num text-[#4776FF] font-semibold">
                  CURRICULUM VITAE · SOURCE OF TRUTH SUMMARY
                </div>
                <h2
                  id="executive-dossier-title"
                  className="font-editorial text-3xl font-semibold text-[#10192D]"
                >
                  {PROFILE_DATA.name}
                </h2>
                <p className="text-xs sm:text-sm text-[#5E6D87]">{PROFILE_DATA.headline}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadResume}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold border border-[#10192D] bg-white text-[#10192D] hover:border-[#4776FF] cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#4776FF]" aria-hidden="true" />
                  <span>Download .TXT</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-[#10192D] text-[#F5F6F8] hover:bg-[#4776FF] cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={onCloseDossier}
                  aria-label="Close executive dossier"
                  className="p-2 rounded-md border border-[#DCE2EC] text-[#10192D] hover:bg-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Education & Charter Summary */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono-num uppercase tracking-wider text-[#4776FF] font-semibold">
                01. Education & Professional Credentials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {EDUCATION_CREDENTIALS.map((edu) => (
                  <div key={edu.id} className="p-4 rounded-lg bg-white border border-[#DCE2EC]">
                    <div className="text-xs font-mono-num text-[#5E6D87]">{edu.period}</div>
                    <div className="text-sm font-semibold text-[#10192D] mt-1">
                      {edu.institution}
                    </div>
                    <div className="text-xs text-[#192438] mt-0.5">{edu.credential}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Summary */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono-num uppercase tracking-wider text-[#4776FF] font-semibold">
                02. Professional Experience (3 Years Total Tenure)
              </h3>
              <div className="space-y-3.5">
                {EXPERIENCE_DATA.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-5 rounded-lg border border-[#DCE2EC] bg-white space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-[#10192D]">
                        {exp.organization} — {exp.role}
                      </div>
                      <div className="text-xs font-mono-num text-[#4776FF]">{exp.period}</div>
                    </div>
                    <ul className="space-y-1 text-xs text-[#5E6D87]">
                      {exp.keyHighlights.map((h, i) => (
                        <li key={i}>· {h}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Analytical Work Summary */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono-num uppercase tracking-wider text-[#4776FF] font-semibold">
                03. Key Analytical & Valuation Benchmarks
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROJECTS_DATA.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-lg bg-white border border-[#DCE2EC] flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#10192D]">{p.title}</div>
                      <div className="text-[11px] text-[#5E6D87]">{p.projectClassification}</div>
                    </div>
                    <span className="font-mono-num text-sm font-semibold text-[#4776FF] shrink-0">
                      {p.headlineMetric}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#DCE2EC] flex items-center justify-between text-xs text-[#5E6D87]">
              <span>Leadership: Inter-IIM Volleyball Captain · Head Boy</span>
              <button
                type="button"
                onClick={onCloseDossier}
                className="px-5 py-2 rounded-md text-xs font-semibold bg-[#10192D] text-[#F5F6F8] hover:bg-[#4776FF] cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
