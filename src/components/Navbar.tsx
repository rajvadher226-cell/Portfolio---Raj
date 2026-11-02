import React, { useState, useEffect } from 'react';
import { Menu, X, FileText } from 'lucide-react';
import { PROFILE_DATA } from '../data/portfolioData';

interface NavbarProps {
  onOpenDossier: () => void;
}

const NAV_ITEMS = [
  { id: 'about', label: 'About', href: '#about' },
  { id: 'experience', label: 'Experience', href: '#experience' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'expertise', label: 'Expertise', href: '#expertise' },
  { id: 'credentials', label: 'Credentials', href: '#credentials' },
] as const;

export const Navbar: React.FC<NavbarProps> = ({ onOpenDossier }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('about');

  useEffect(() => {
    const sectionIds = ['about', 'experience', 'projects', 'expertise', 'credentials', 'insights', 'contact'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const matchedId = visible[0].target.id;
          if (NAV_ITEMS.some((item) => item.id === matchedId)) {
            setActiveSection(matchedId);
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0.1, 0.25, 0.5] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-[#10192D]/95 backdrop-blur-md border-b border-[#243B67]/80 shadow-lg shadow-[#10192D]/15">
      <div className="max-w-[1220px] mx-auto flex items-center justify-between gap-4 lg:gap-8 px-5 sm:px-6 lg:px-8 h-16">
        {/* Zone 1: Wordmark with RV Monogram Crest */}
        <a
          href="#top"
          className="text-base font-semibold tracking-tight text-[#F5F6F8] whitespace-nowrap shrink-0 flex items-center gap-2.5 lg:gap-3 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4776FF]"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-[#D7AE68]/70 bg-gradient-to-br from-[#172C50] to-[#10192D] text-[#D7AE68] font-editorial text-sm font-semibold tracking-wider group-hover:border-[#4776FF] group-hover:text-[#F5F6F8] group-hover:bg-[#4776FF] transition-all">
            {PROFILE_DATA.monogram}
          </span>
          <div className="flex flex-col">
            <span className="leading-none">{PROFILE_DATA.name}</span>
            <span className="text-[10px] font-mono-num text-[#19B7A5] tracking-wider mt-0.5 hidden sm:inline">
              IIM KOZHIKODE · CFA L1
            </span>
          </div>
        </a>

        {/* Zone 2: 5 concise single-line text navigation links with active-section indication */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-5 lg:gap-7 text-xs lg:text-sm font-medium text-[#F5F6F8]/70"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setActiveSection(item.id)}
                aria-current={isActive ? 'location' : undefined}
                className={`transition-all whitespace-nowrap shrink-0 py-1.5 border-b-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4776FF] ${
                  isActive
                    ? 'text-[#F5F6F8] font-semibold border-[#19B7A5]'
                    : 'text-[#F5F6F8]/70 border-transparent hover:text-[#F5F6F8] hover:border-[#4776FF]/60'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenDossier}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#F5F6F8] bg-gradient-to-r from-[#4776FF] to-[#365EE0] hover:from-[#3A66EB] hover:to-[#19B7A5] rounded-md shadow-md shadow-[#4776FF]/25 transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4776FF]"
          >
            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Executive Dossier</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-[#F5F6F8] border border-[#243B67] bg-[#172C50]/70 hover:bg-[#172C50] transition-colors focus-visible:outline-2 focus-visible:outline-[#4776FF]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#243B67] bg-[#10192D] px-6 py-5 space-y-4">
          <nav aria-label="Mobile Navigation" className="flex flex-col space-y-2.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  aria-current={isActive ? 'location' : undefined}
                  className={`text-sm py-1.5 border-b border-[#243B67]/60 ${
                    isActive
                      ? 'font-semibold text-[#19B7A5]'
                      : 'font-medium text-[#F5F6F8]/85 hover:text-[#4776FF]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <a
              href="#insights"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-[#F5F6F8]/85 hover:text-[#4776FF] py-1.5 border-b border-[#243B67]/60"
            >
              Insights (Sample Layout)
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-[#F5F6F8]/85 hover:text-[#4776FF] py-1.5"
            >
              Contact & Resume
            </a>
          </nav>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenDossier();
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-xs font-semibold text-[#F5F6F8] bg-[#4776FF] hover:bg-[#3A66EB] transition-colors"
          >
            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Open Executive Dossier</span>
          </button>
        </div>
      )}
    </header>
  );
};

