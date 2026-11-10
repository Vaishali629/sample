import React from 'react';
import { Terminal, Github, Linkedin, Shield, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenTerminal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTerminal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800/80 bg-[#090D16] py-10 text-xs font-mono text-slate-400">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>OBSIDIAN_CORE PLATFORM</span>
            </div>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="text-slate-500">© {new Date().getFullYear()} All rights reserved.</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="text-slate-500">SHA-256: 8f9b2d9a</span>
          </div>

          {/* Links & Affordances */}
          <div className="flex items-center gap-5">
            <button
              onClick={onOpenTerminal}
              className="hover:text-emerald-400 text-slate-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>&gt;_ CLI</span>
            </button>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-200 text-slate-400 transition-colors flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-200 text-slate-400 transition-colors flex items-center gap-1"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>

            <button
              onClick={scrollToTop}
              className="p-1.5 rounded bg-slate-900 border border-slate-800 hover:text-emerald-400 text-slate-400 transition-colors cursor-pointer"
              title="Return to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
