import React, { useState, useRef } from 'react';
import {
  Upload,
  RotateCcw,
  Award,
  TrendingUp,
  Briefcase,
} from 'lucide-react';
import { PROFILE_DATA } from '../data/portfolioData';

const PORTRAIT_NAVY_UI = '/assets/aistudio/portrait_navy_ui.png';
const PORTRAIT_WHITE_STUDIO = '/assets/aistudio/portrait_white_studio.png';
const PORTRAIT_ORIGINAL =
  '/assets/aistudio/Screenshot_20261102_160450.jpg_7a4f8ff4.jpeg';

export const HeroSection: React.FC = () => {
  const [customPortraitUrl, setCustomPortraitUrl] = useState<string | null>(null);
  const [backdropStyle, setBackdropStyle] = useState<'navy' | 'white' | 'original'>('navy');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePortraitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomPortraitUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const activePhotoSrc = customPortraitUrl
    ? customPortraitUrl
    : backdropStyle === 'navy'
      ? PORTRAIT_NAVY_UI
      : backdropStyle === 'white'
        ? PORTRAIT_WHITE_STUDIO
        : PORTRAIT_ORIGINAL;

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-[#243B67] bg-navy-atmosphere bg-architectural-grid-dark text-[#F5F6F8]"
    >
      {/* Subtle Animated Atmospheric Lighting & Financial Curve Background Motif */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#4776FF]/20 blur-3xl animate-ambient-glow"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-16 right-8 w-80 h-80 rounded-full bg-[#19B7A5]/15 blur-3xl animate-ambient-glow"
        aria-hidden="true"
      />
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-56 opacity-20"
        viewBox="0 0 1440 220"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="heroCurveGrad" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4776FF" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#19B7A5" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#D7AE68" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <path
          d="M0 190 C 240 175, 420 120, 660 135 C 900 150, 1120 65, 1440 35"
          stroke="url(#heroCurveGrad)"
          strokeWidth="2"
          className="animate-chart-line"
        />
        <path
          d="M0 205 C 300 190, 540 160, 820 165 C 1060 170, 1240 110, 1440 85"
          stroke="#4776FF"
          strokeOpacity="0.35"
          strokeWidth="1.25"
          strokeDasharray="5 5"
        />
      </svg>

      <div className="relative z-10 max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10 pt-10 pb-12 md:pt-14 md:pb-16 lg:pt-16 lg:pb-20">
        {/* Balanced Two-Column Hero Composition from md (768px+) upward so right side is never blank */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-12 items-center">
          {/* Left Column: Credential Chips, Bold Highlighted Headline, Positioning & CTAs (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6 lg:space-y-7">
            <div className="space-y-5">
              {/* Elegant Credential Chips */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#172C50]/90 border border-[#D7AE68]/50 text-[#F5F6F8] shadow-xs">
                  <Award className="w-3.5 h-3.5 text-[#D7AE68]" aria-hidden="true" />
                  <span>MBA · IIM Kozhikode (2024–2026)</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#172C50]/90 border border-[#19B7A5]/50 text-[#F5F6F8] shadow-xs">
                  <TrendingUp className="w-3.5 h-3.5 text-[#19B7A5]" aria-hidden="true" />
                  <span>CFA Level I · Cleared Aug 2025</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#172C50]/90 border border-[#4776FF]/50 text-[#F5F6F8] shadow-xs">
                  <Briefcase className="w-3.5 h-3.5 text-[#4776FF]" aria-hidden="true" />
                  <span>3 Yrs · Allcargo · IPV · Deloitte</span>
                </span>
              </div>

              {/* Headline & Bold Highlighted Tagline */}
              <div className="space-y-3">
                <p className="text-xs sm:text-sm font-mono-num font-semibold uppercase tracking-wider text-[#D7AE68]">
                  {PROFILE_DATA.headline}
                </p>
                <h1
                  className="font-editorial text-[#F5F6F8] font-semibold tracking-tight leading-[1.08]"
                  style={{ fontSize: 'clamp(2.25rem, 3.7vw, 3.5rem)' }}
                >
                  Understanding Businesses.{' '}
                  <span className="text-[#4776FF]">Analysing Investments.</span>{' '}
                  Creating <span className="text-[#19B7A5]">Financial Insights.</span>
                </h1>
              </div>

              {/* Lead Positioning Prose */}
              <div className="space-y-3.5 max-w-[62ch]">
                <p className="text-sm sm:text-base text-[#F5F6F8]/95 leading-relaxed font-medium">
                  {PROFILE_DATA.positioningLead}
                </p>
                <p className="text-xs sm:text-sm text-[#F5F6F8]/75 leading-relaxed">
                  {PROFILE_DATA.positioningBody}
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Open, Breathable Circular Executive Portrait (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="relative flex flex-col items-center">
              {/* Outer Decorative Geometric Rings */}
              <div className="relative group flex items-center justify-center p-3 sm:p-4">
                <div
                  className="pointer-events-none absolute -inset-3 rounded-full bg-gradient-to-tr from-[#4776FF]/35 via-[#19B7A5]/25 to-[#D7AE68]/35 blur-xl opacity-80 group-hover:opacity-100 transition-opacity"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-0 rounded-full border border-dashed border-[#4776FF]/45"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-2 rounded-full border border-[#D7AE68]/40"
                  aria-hidden="true"
                />

                {/* Circular Portrait Frame */}
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full p-1.5 bg-gradient-to-tr from-[#D7AE68] via-[#4776FF] to-[#19B7A5] shadow-2xl shadow-[#080D18]/70">
                  <div
                    className={`w-full h-full rounded-full overflow-hidden border-4 border-[#10192D] relative ${
                      backdropStyle === 'white' ? 'bg-[#F5F6F8]' : 'bg-[#10192D]'
                    }`}
                  >
                    <img
                      src={activePhotoSrc}
                      alt="Rajkumar Vadher — MBA (IIM Kozhikode), CFA Level I & Finance Professional"
                      className="w-full h-full object-cover object-[center_14%] transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Floating Name & Charter Badge */}
                <div className="absolute -bottom-2 px-4 py-1.5 rounded-full bg-[#10192D]/95 border border-[#D7AE68]/70 shadow-xl text-xs font-mono-num text-[#F5F6F8] flex items-center gap-2 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-[#19B7A5]" aria-hidden="true" />
                  <span className="font-semibold">Rajkumar Vadher</span>
                  <span className="text-[#D7AE68]">· IIMK &apos;26</span>
                </div>
              </div>

              {/* Clean Studio Backdrop Switcher (UI Navy / White Studio / Custom Upload) */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <div
                  role="group"
                  aria-label="Portrait background style"
                  className="inline-flex items-center gap-1 bg-[#10192D]/90 p-1 rounded-full border border-[#243B67]"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setCustomPortraitUrl(null);
                      setBackdropStyle('navy');
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      !customPortraitUrl && backdropStyle === 'navy'
                        ? 'bg-[#4776FF] text-[#F5F6F8]'
                        : 'text-[#F5F6F8]/70 hover:text-[#F5F6F8]'
                    }`}
                  >
                    UI Navy Studio
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomPortraitUrl(null);
                      setBackdropStyle('white');
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      !customPortraitUrl && backdropStyle === 'white'
                        ? 'bg-[#4776FF] text-[#F5F6F8]'
                        : 'text-[#F5F6F8]/70 hover:text-[#F5F6F8]'
                    }`}
                  >
                    White Backdrop
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium text-[#D7AE68] hover:text-[#F5F6F8] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Upload className="w-3 h-3" aria-hidden="true" />
                    <span>Upload</span>
                  </button>
                  {customPortraitUrl && (
                    <button
                      type="button"
                      onClick={() => setCustomPortraitUrl(null)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-[#19B7A5] hover:text-[#F5F6F8] cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" aria-hidden="true" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePortraitUpload}
                  className="hidden"
                  aria-label="Upload executive portrait photograph"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
