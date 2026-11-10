import React, { useState } from 'react';
import { ArrowDown, Terminal, Copy, Check, Activity, Cpu, Server, Globe } from 'lucide-react';

interface HeroProps {
  onOpenTerminal: () => void;
  onExploreProjects: () => void;
  onOpenContact: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenTerminal,
  onExploreProjects,
  onOpenContact
}) => {
  const [copied, setCopied] = useState(false);

  const copyCurl = () => {
    navigator.clipboard.writeText('curl -sL https://obsidian-core.dev/api/v1/profile | jq');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background radial ambient glow - subtle, not hyper-saturated */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[300px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Availability Status Pill (strictly reserved for live status indicators) */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono tracking-wide mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Available for Q2 Architecture Advisory & Contract Engineering</span>
        </div>

        {/* Display Typography */}
        <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-[-0.03em] leading-[1.12] text-[#F8FAFC] max-w-4xl mb-6">
          Full Stack Web Developer <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            & Systems Architect
          </span>
        </h1>

        {/* Lead Narrative */}
        <p className="text-base sm:text-lg lg:text-[18px] text-slate-300 max-w-2xl leading-relaxed mb-8">
          Architecting resilient distributed platforms, ultra-responsive 60FPS reactive interfaces, and developer-first cloud infrastructures with end-to-end type safety and deterministic performance.
        </p>

        {/* Interactive Action Cluster */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
          {/* Primary Emerald Button */}
          <button
            onClick={onExploreProjects}
            className="px-5 py-2.5 text-sm font-semibold text-[#090D16] bg-[#10B981] hover:bg-[#34D399] transition-all rounded shadow-[0_0_16px_rgba(16,185,129,0.35)] flex items-center gap-2 cursor-pointer group"
          >
            <span>Explore Featured Systems</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* Secondary Outline Button */}
          <button
            onClick={onOpenTerminal}
            className="px-5 py-2.5 text-sm font-medium text-[#F8FAFC] bg-transparent border border-slate-700/80 hover:border-cyan-400 hover:bg-cyan-500/5 transition-all rounded flex items-center gap-2 font-mono cursor-pointer"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Launch CLI Shell</span>
          </button>

          {/* Monospaced curl snippet */}
          <div className="flex items-center gap-2 bg-[#0F172A]/80 border border-slate-800 rounded px-3 py-2 text-xs font-mono text-slate-300">
            <span className="text-emerald-400">$</span>
            <span className="text-slate-400 select-all">curl -sL obsidian-core.dev/api</span>
            <button
              onClick={copyCurl}
              aria-label="Copy curl command"
              className="ml-1 p-1 hover:text-emerald-400 text-slate-400 transition-colors cursor-pointer"
              title="Copy CLI command"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Telemetry Bar (JetBrains Mono tabular figures) */}
        <div className="w-full bg-[#0F172A]/70 backdrop-blur-md border border-slate-800/80 rounded-lg p-3 sm:p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[11px]">CORE COMMIT</div>
                <div className="text-slate-100 font-semibold tracking-wide">8f9b2d (main)</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Server className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[11px]">PLATFORM SLA</div>
                <div className="text-emerald-400 font-semibold tracking-wide tabular-nums">99.98% Uptime</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[11px]">RUNTIME FLEET</div>
                <div className="text-slate-100 font-semibold tracking-wide">Node 22 · Go 1.22</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[11px]">P99 EDGE LATENCY</div>
                <div className="text-cyan-400 font-semibold tracking-wide tabular-nums">14.2 ms</div>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[11px]">MESH REGIONS</div>
                <div className="text-slate-100 font-semibold tracking-wide">12 Anycast POPS</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
