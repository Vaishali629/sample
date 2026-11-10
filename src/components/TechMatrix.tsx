import React, { useState } from 'react';
import { TECH_ITEMS } from '../data/portfolioData.ts';
import { TechItem } from '../types/index.ts';
import { Terminal, CheckCircle2, Layers, Cpu, Database, Cloud } from 'lucide-react';

export const TechMatrix: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState<TechItem>(TECH_ITEMS[0]);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const categories = ['All', 'Frontend & UI Engine', 'Backend & Distributed', 'Data & Storage', 'Cloud & DevOps'];

  const filteredItems = activeFilter === 'All'
    ? TECH_ITEMS
    : TECH_ITEMS.filter(t => t.category === activeFilter);

  return (
    <section id="tech-matrix" className="py-16 md:py-24 border-t border-slate-800/60 bg-[#0B1326]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-2">
              <span className="text-slate-500 font-bold">&gt;</span>
              <span>SYSTEM ARCHITECTURE MATRIX // TECH CAPABILITIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F8FAFC]">
              Engineering Stack &amp; Runtimes
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
              Encapsulated technical competencies across browser runtimes, systems programming, and high-concurrency cloud infrastructure. Click any cell to inspect production deployments.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#090D16] border border-slate-800 rounded-lg">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer whitespace-nowrap ${
                  activeFilter === cat
                    ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'All' ? 'All Stacks' : cat.split(' & ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column layout: Grid of cells on left/center, active tech inspection card on right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Tech Grid (Strictly conforming to design system: individual square cells with faint inner grid line) */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {filteredItems.map(tech => {
              const isSelected = selectedTech?.name === tech.name;
              return (
                <button
                  key={tech.name}
                  onClick={() => setSelectedTech(tech)}
                  className={`aspect-square p-4 rounded flex flex-col items-center justify-center text-center transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'border border-emerald-400/80 bg-[#171F33] shadow-[0_0_16px_rgba(16,185,129,0.2)]'
                      : 'border border-[rgba(148,163,184,0.08)] bg-[#0F172A]/70 hover:border-emerald-500/30 hover:bg-[#1E293B]/70'
                  }`}
                >
                  {/* Subtle category dot indicator */}
                  <span
                    className={`absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-emerald-400' : 'bg-slate-700 group-hover:bg-cyan-400'
                    }`}
                  />

                  {/* SVG Tech Symbol */}
                  <div className="w-10 h-10 mb-2 flex items-center justify-center text-slate-300 group-hover:text-emerald-400 transition-colors">
                    <span className="font-mono text-base font-bold tracking-tighter text-slate-300 group-hover:text-emerald-400">
                      {tech.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>

                  {/* JetBrains Mono Label underneath */}
                  <div className="font-mono text-xs font-medium text-slate-200 group-hover:text-slate-100 line-clamp-1">
                    {tech.name}
                  </div>
                  <div className="font-mono text-[10px] text-slate-500 mt-0.5">
                    {tech.years} · {tech.level}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Tech Inspection Card */}
          <div className="p-6 rounded-lg bg-[#0F172A]/85 backdrop-blur-[12px] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="text-indigo-400">{selectedTech.category}</span>
                <span className="text-emerald-400 font-semibold">{selectedTech.level}</span>
              </div>

              <h3 className="text-2xl font-bold text-[#F8FAFC] font-mono mb-2">
                {selectedTech.name}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                {selectedTech.description}
              </p>

              {/* Specs grid */}
              <div className="space-y-3 p-3 bg-[#090D16] rounded border border-slate-800 text-xs font-mono mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">PRODUCTION TENURE</span>
                  <span className="text-slate-200 font-semibold tabular-nums">{selectedTech.years}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">REPOSITORIES DEPLOYED</span>
                  <span className="text-cyan-400 font-semibold tabular-nums">{selectedTech.projectsCount}+ systems</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">TYPE SAFETY LEVEL</span>
                  <span className="text-emerald-400 font-semibold">Strict / StrictNullChecks</span>
                </div>
              </div>

              {/* Featured In */}
              <div>
                <div className="text-[11px] font-mono text-slate-400 mb-2">FEATURED IN CORE ARCHITECTURES:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTech.featuredIn.map(feat => (
                    <span
                      key={feat}
                      className="text-xs font-mono px-2.5 py-1 rounded bg-[#1E293B] text-slate-200 border border-slate-700/80"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified for mission-critical enterprise workloads</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
