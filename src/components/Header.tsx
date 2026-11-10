import React, { useState } from 'react';
import { Terminal, Moon, Sun, Shield, Menu, X } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenTerminal: () => void;
  onOpenContact: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onOpenTerminal,
  onOpenContact
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#090D16]/85 dark:bg-[#090D16]/85 border-b border-slate-800/60 transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            className="flex items-center gap-2.5 font-bold tracking-tight text-slate-100 hover:text-emerald-400 transition-colors whitespace-nowrap"
          >
            <div className="w-8 h-8 rounded bg-slate-900 border border-slate-700/80 flex items-center justify-center text-emerald-400 shadow-sm">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="text-base font-semibold tracking-tight text-[#F8FAFC]">
              OBSIDIAN<span className="text-emerald-400">_CORE</span>
            </span>
          </a>
          <span className="hidden sm:inline-block font-mono text-[11px] text-slate-400 border border-slate-800 bg-slate-900/60 px-2 py-0.5 rounded">
            v2.4.0
          </span>
        </div>

        {/* Zone 2: 4–5 Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a
            href="#projects"
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Projects
          </a>
          <a
            href="#simulator"
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Live Architecture
          </a>
          <a
            href="#tech-matrix"
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Tech Matrix
          </a>
          <a
            href="#experience"
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Experience & ADRs
          </a>
          <button
            onClick={onOpenTerminal}
            className="hover:text-cyan-400 transition-colors font-mono text-xs flex items-center gap-1.5 text-slate-400 hover:text-slate-200 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span className="text-emerald-400">&gt;_</span> Terminal
          </button>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Theme toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
            className="w-8 h-8 rounded border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center cursor-pointer"
            title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Obsidian'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenContact}
            className="px-4 py-2 text-xs font-semibold text-[#090D16] bg-[#10B981] hover:bg-[#34D399] transition-all rounded shadow-[0_0_16px_rgba(16,185,129,0.3)] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Deploy Inquiry
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#090D16]/95 backdrop-blur-lg px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-2 text-sm">
            <a
              href="#projects"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-slate-200 hover:text-emerald-400"
            >
              Projects
            </a>
            <a
              href="#simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-slate-200 hover:text-emerald-400"
            >
              Live Architecture
            </a>
            <a
              href="#tech-matrix"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-slate-200 hover:text-emerald-400"
            >
              Tech Matrix
            </a>
            <a
              href="#experience"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-slate-200 hover:text-emerald-400"
            >
              Experience & ADRs
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTerminal();
              }}
              className="text-left py-1.5 text-emerald-400 font-mono text-xs flex items-center gap-2"
            >
              <span>&gt;_ Open Terminal Console</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
