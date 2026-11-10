import React, { useState } from 'react';
import { EXPERIENCES, ARCHITECTURE_DECISION_RECORDS } from '../data/portfolioData.ts';
import { Briefcase, FileCode2, ChevronDown, ChevronUp, Check, ArrowRight } from 'lucide-react';

export const ExperienceTimeline: React.FC = () => {
  const [viewMode, setViewMode] = useState<'experience' | 'adrs'>('experience');
  const [expandedAdr, setExpandedAdr] = useState<string>(ARCHITECTURE_DECISION_RECORDS[0].id);

  return (
    <section id="experience" className="py-16 md:py-24 border-t border-slate-800/60 bg-[#090D16]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
              <span className="text-slate-500 font-bold">&gt;</span>
              <span>ENGINEERING TRAJECTORY // PRODUCTION HISTORY &amp; ADRS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F8FAFC]">
              Experience &amp; Architectural Decisions
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
              Track record of engineering leadership, scaling multi-region cloud services, and formal Architectural Decision Records (ADRs).
            </p>
          </div>

          {/* Toggle between Career & ADRs */}
          <div className="flex items-center gap-1 p-1 bg-[#0F172A] border border-slate-800 rounded-lg shrink-0">
            <button
              onClick={() => setViewMode('experience')}
              className={`px-4 py-2 text-xs font-mono rounded transition-colors cursor-pointer flex items-center gap-2 ${
                viewMode === 'experience'
                  ? 'bg-slate-800 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Career Milestones</span>
            </button>
            <button
              onClick={() => setViewMode('adrs')}
              className={`px-4 py-2 text-xs font-mono rounded transition-colors cursor-pointer flex items-center gap-2 ${
                viewMode === 'adrs'
                  ? 'bg-slate-800 text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Architecture Decision Records (ADRs)</span>
            </button>
          </div>
        </div>

        {/* View Mode 1: Career Timeline */}
        {viewMode === 'experience' && (
          <div className="space-y-6">
            {EXPERIENCES.map((exp, idx) => (
              <div
                key={exp.role}
                className="p-6 rounded-lg bg-[#0F172A]/70 backdrop-blur-[12px] border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <span className="text-xs font-mono text-emerald-400 block mb-1">{exp.period}</span>
                    <h3 className="text-xl font-bold text-[#F8FAFC]">{exp.role}</h3>
                    <div className="text-sm text-indigo-400 font-medium">{exp.company} · <span className="text-slate-400 text-xs font-normal">{exp.location}</span></div>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-4">{exp.summary}</p>

                {/* Achievements list */}
                <div className="space-y-2 mb-5">
                  {exp.achievements.map((ach, aIdx) => (
                    <div key={aIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{ach}</span>
                    </div>
                  ))}
                </div>

                {/* Technologies used */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/80">
                  {exp.technologies.map(t => (
                    <span
                      key={t}
                      className="font-mono text-[11px] px-2.5 py-0.5 rounded bg-[#1E293B]/70 text-slate-400 border border-slate-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Mode 2: ADRs */}
        {viewMode === 'adrs' && (
          <div className="space-y-4">
            {ARCHITECTURE_DECISION_RECORDS.map(adr => {
              const isExpanded = expandedAdr === adr.id;
              return (
                <div
                  key={adr.id}
                  className="rounded-lg bg-[#0F172A]/70 border border-slate-800/80 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setExpandedAdr(isExpanded ? '' : adr.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400">
                        {adr.id}
                      </span>
                      <div>
                        <h4 className="text-base font-semibold text-[#F8FAFC]">{adr.title}</h4>
                        <div className="text-xs font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>Date: {adr.date}</span>
                          <span>·</span>
                          <span className="text-emerald-400 font-semibold">{adr.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-slate-400 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-5 pt-1 border-t border-slate-800/80 space-y-4 text-xs font-mono bg-[#090D16]/50">
                      <div>
                        <div className="text-cyan-400 font-semibold mb-1">CONTEXT &amp; PROBLEM STATEMENT:</div>
                        <p className="text-slate-300 leading-relaxed font-sans text-xs">{adr.context}</p>
                      </div>

                      <div>
                        <div className="text-emerald-400 font-semibold mb-1">DECISION OUTCOME:</div>
                        <p className="text-slate-300 leading-relaxed font-sans text-xs">{adr.decision}</p>
                      </div>

                      <div>
                        <div className="text-indigo-400 font-semibold mb-1">MEASURED CONSEQUENCES:</div>
                        <ul className="space-y-1 text-slate-300 font-sans text-xs">
                          {adr.consequences.map((c, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-emerald-400 font-mono font-bold">&gt;</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
