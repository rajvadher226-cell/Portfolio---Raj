/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutExperienceSection } from './components/AboutExperienceSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ExpertiseCredentialsSection } from './components/ExpertiseCredentialsSection';
import { InsightsContactSection } from './components/InsightsContactSection';

export default function App() {
  const [dossierOpen, setDossierOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F6F8] text-[#192438] overflow-x-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#10192D] focus:text-[#F5F6F8] focus:text-xs focus:font-semibold focus:outline-2 focus:outline-[#4776FF]"
      >
        Skip to main content
      </a>
      <Navbar onOpenDossier={() => setDossierOpen(true)} />
      <main id="main-content" className="flex-1">
        <HeroSection onOpenDossier={() => setDossierOpen(true)} />
        <AboutExperienceSection />
        <ProjectsSection />
        <ExpertiseCredentialsSection />
        <InsightsContactSection
          dossierOpen={dossierOpen}
          onOpenDossier={() => setDossierOpen(true)}
          onCloseDossier={() => setDossierOpen(false)}
        />
      </main>
    </div>
  );
}

