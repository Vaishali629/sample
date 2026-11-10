import React, { useState } from 'react';
import { ArrowUpRight, Cpu, Layers, GitBranch, Terminal, ExternalLink } from 'lucide-react';
import { PROJECTS } from '../data/portfolioData.ts';
import { Category, Project } from '../types/index.ts';

interface ProjectGridProps {
  onSelectProject: (p: Project) => void;
}

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all', label: 'All Systems' },
  { id: 'distributed', label: 'Distributed Systems' },
  { id: 'frontend', label: 'High-Perf Frontend' },
  { id: 'infra', label: 'Systems & Infra' },
  { id: 'realtime', label: 'Real-Time & AI' }
];

export const ProjectGrid: React.FC<ProjectGridProps> = ({ onSelectProject }) => {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const filteredProjects = activeCategory === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeCategory);

  return (
    <section id="projects" className="py-16 md:py-24 border-t border-slate-800/60 relative">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
              <span className="text-slate-500 font-bold">&gt;</span>
              <span>ENGINEERING SHOWCASE // ARCHITECTURE & SYSTEMS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F8FAFC]">
              Featured Production Platforms
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
              Production-tested distributed systems, real-time engines, and cloud control planes. Click any system to inspect architectural topologies, code files, and live benchmarks.
            </p>
          </div>

          {/* Category Filter Chips strictly conforming to design system */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-mono rounded transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'border border-[#10B981] text-[#10B981] bg-[#10B981]/10 font-medium'
                      : 'border border-slate-800 bg-[#1E293B]/70 text-[#94A3B8] hover:text-[#F8FAFC] hover:border-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group relative bg-[#0F172A]/70 backdrop-blur-[12px] border border-slate-800/80 rounded-lg p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_8px_30px_-8px_rgba(16,185,129,0.18)] cursor-pointer"
            >
              <div>
                {/* Header line: Category unboxed metadata with separator and file path */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span className="text-indigo-400">{project.categoryLabel}</span>
                    <span aria-hidden="true" className="text-slate-600">/</span>
                    <span className="text-slate-400">{project.metrics[0].label}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400/90 font-mono">
                    <span className="tabular-nums font-semibold">{project.metrics[0].value}</span>
                  </div>
                </div>

                {/* Project Title */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-[#F8FAFC] group-hover:text-emerald-300 transition-colors">
                    {project.title}
                  </h3>
                  <div className="w-7 h-7 rounded bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500/40 transition-colors shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs sm:text-[13px] text-slate-300 line-clamp-3 leading-relaxed mb-4">
                  {project.summary}
                </p>

                {/* Metrics 2-column strip */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded bg-[#090D16]/60 border border-slate-800/60 text-xs font-mono mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{project.metrics[1]?.label}</span>
                    <span className="text-cyan-400 font-semibold tabular-nums">{project.metrics[1]?.value}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{project.metrics[2]?.label}</span>
                    <span className="text-emerald-400 font-semibold tabular-nums">{project.metrics[2]?.value}</span>
                  </div>
                </div>
              </div>

              <div>
                {/* Tech Stack list in JetBrains Mono */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60 mb-3">
                  {project.techStack.map(tech => (
                    <span
                      key={tech}
                      className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1E293B]/60 text-slate-400 border border-slate-800 group-hover:border-slate-700 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Card Action footer */}
                <div className="flex items-center justify-between pt-1 text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1 text-[11px] truncate max-w-[200px]">
                    <Terminal className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{project.ideFilePath}</span>
                  </span>
                  <span className="text-emerald-400 font-medium group-hover:underline flex items-center gap-1 text-[11px] shrink-0">
                    Inspect Architecture &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
