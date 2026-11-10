import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { TerminalWindow } from './components/TerminalWindow.tsx';
import { ProjectGrid } from './components/ProjectGrid.tsx';
import { ProjectModal } from './components/ProjectModal.tsx';
import { SystemVisualizer } from './components/SystemVisualizer.tsx';
import { TechMatrix } from './components/TechMatrix.tsx';
import { ExperienceTimeline } from './components/ExperienceTimeline.tsx';
import { ContactTerminal } from './components/ContactTerminal.tsx';
import { Footer } from './components/Footer.tsx';
import { Project } from './types/index.ts';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [terminalOpen, setTerminalOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Sync dark class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.remove('bg-[#F8FAFC]', 'text-[#0F172A]');
      document.body.classList.add('bg-[#090D16]', 'text-[#F8FAFC]');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-[#090D16]', 'text-[#F8FAFC]');
      document.body.classList.add('bg-[#F8FAFC]', 'text-[#0F172A]');
    }
  }, [darkMode]);

  // Global hotkeys (e.g. `~` opens terminal, `Escape` closes modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setTerminalOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        if (selectedProject) setSelectedProject(null);
        if (terminalOpen) setTerminalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, terminalOpen]);

  const handleExploreProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark bg-[#090D16] text-[#F8FAFC]' : 'bg-[#F8FAFC] text-[#0F172A]'}`}>
      {/* Top Bar Navigation */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenTerminal={() => setTerminalOpen(true)}
        onOpenContact={handleOpenContact}
      />

      {/* Main Content Area */}
      <main>
        {/* Hero Section with Telemetry */}
        <Hero
          onOpenTerminal={() => setTerminalOpen(true)}
          onExploreProjects={handleExploreProjects}
          onOpenContact={handleOpenContact}
        />

        {/* Featured Projects Showcase with Filter Chips */}
        <ProjectGrid onSelectProject={p => setSelectedProject(p)} />

        {/* Interactive Architecture Flow Simulator */}
        <SystemVisualizer />

        {/* Tech Stack Matrix with Encapsulated Cells */}
        <TechMatrix />

        {/* Engineering Experience & ADRs */}
        <ExperienceTimeline />

        {/* Contact & Terminal Dispatcher */}
        <ContactTerminal />
      </main>

      {/* Footer */}
      <Footer onOpenTerminal={() => setTerminalOpen(true)} />

      {/* Interactive CLI Terminal Window */}
      <TerminalWindow
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        onSelectProject={p => {
          setTerminalOpen(false);
          setSelectedProject(p);
        }}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onOpenContact={() => {
          setTerminalOpen(false);
          handleOpenContact();
        }}
      />

      {/* Interactive Project IDE Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Global Terminal Quick Launch Floating Button */}
      {!terminalOpen && (
        <button
          onClick={() => setTerminalOpen(true)}
          className="fixed bottom-5 right-5 z-30 px-3.5 py-2 rounded-lg bg-[#0F172A]/90 backdrop-blur-md border border-slate-700/80 hover:border-emerald-400 text-slate-300 hover:text-emerald-300 shadow-xl font-mono text-xs flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
          title="Press ` (backtick) or click to open CLI Shell"
        >
          <span className="text-emerald-400">&gt;_</span>
          <span className="hidden sm:inline">Launch Shell</span>
          <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">`</span>
        </button>
      )}
    </div>
  );
}
