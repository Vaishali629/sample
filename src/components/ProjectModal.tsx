import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Play, GitBranch, Cpu, Activity, Database, Server, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { Project } from '../types/index.ts';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'simulation' | 'code' | 'benchmarks'>('architecture');
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  // Simulation states
  // KV store simulation
  const [kvKey, setKvKey] = useState('user:sessions:tokyo');
  const [kvVal, setKvVal] = useState('{"auth": true, "uid": 9482}');
  const [kvLogs, setKvLogs] = useState<{ id: string; msg: string; time: string; type: string }[]>([
    { id: '1', msg: 'Raft Leader node-01 elected for term 42', time: '00:00:01', type: 'info' },
    { id: '2', msg: 'MemTable SkipList initialized with 64MB buffer', time: '00:00:02', type: 'info' }
  ]);

  // Canary deployment simulation
  const [canaryWeight, setCanaryWeight] = useState(25);

  // Orderbook simulation
  const [orderbookTicks, setOrderbookTicks] = useState<{ price: number; size: number; side: 'bid' | 'ask' }[]>([
    { price: 68420.50, size: 2.45, side: 'ask' },
    { price: 68419.00, size: 1.82, side: 'ask' },
    { price: 68418.50, size: 5.10, side: 'bid' },
    { price: 68417.00, size: 3.65, side: 'bid' }
  ]);

  if (!project) return null;

  const currentCodeFile = project.codeFiles[selectedFileIdx] || project.codeFiles[0];

  const handleCopyCode = () => {
    if (!currentCodeFile) return;
    navigator.clipboard.writeText(currentCodeFile.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSimulateKvWrite = () => {
    const start = performance.now();
    const entryId = Math.random().toString(36).substring(2, 7);
    const latency = (Math.random() * 1.5 + 0.8).toFixed(2);
    setKvLogs(prev => [
      ...prev,
      {
        id: entryId,
        msg: `WAL write [${kvKey}] -> Quorum replicated to nodes 02, 03 in ${latency}ms (seq=${prev.length + 104})`,
        time: new Date().toLocaleTimeString(),
        type: 'write'
      }
    ]);
  };

  const handleSimulateTick = () => {
    const isBid = Math.random() > 0.5;
    const basePrice = 68418 + (Math.random() * 4 - 2);
    const newTick = {
      price: parseFloat(basePrice.toFixed(2)),
      size: parseFloat((Math.random() * 4 + 0.5).toFixed(2)),
      side: isBid ? ('bid' as const) : ('ask' as const)
    };
    setOrderbookTicks(prev => [newTick, ...prev.slice(0, 5)]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#090D16]/85 backdrop-blur-[8px] animate-in fade-in duration-200">
      <div
        className="w-full max-w-[840px] max-h-[90vh] flex flex-col bg-[#0F172A] border border-cyan-500/25 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* IDE Title Bar (strictly per design system) */}
        <div className="h-11 bg-[#090D16] border-b border-slate-800 px-4 flex items-center justify-between select-none shrink-0">
          {/* Status dots */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors cursor-pointer"
              title="Close modal (Esc)"
            />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 cursor-pointer" />
          </div>

          {/* IDE File Path in code-inline */}
          <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-slate-400">~/projects/</span>
            <span className="text-emerald-400 font-semibold">{project.ideFilePath}</span>
            <span className="text-slate-600 hidden sm:inline">·</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-indigo-400">
              <GitBranch className="w-3 h-3" /> main
            </span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1 hover:text-slate-200 text-slate-400 rounded hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Project Header Bar inside modal */}
        <div className="px-6 py-4 border-b border-slate-800/80 bg-[#0F172A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
              <span className="text-indigo-400">{project.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">Production Verified</span>
            </div>
            <h2 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">{project.title}</h2>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#090D16] border border-slate-800 rounded-lg shrink-0">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-slate-800 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Topology
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                activeTab === 'simulation'
                  ? 'bg-slate-800 text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Live Playground
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-slate-800 text-indigo-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Source Code
            </button>
            <button
              onClick={() => setActiveTab('benchmarks')}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                activeTab === 'benchmarks'
                  ? 'bg-slate-800 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Benchmarks
            </button>
          </div>
        </div>

        {/* Tab Content Panes */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0B1326]">
          {/* TAB 1: ARCHITECTURE TOPOLOGY */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              {/* Architecture narrative */}
              <div>
                <h3 className="text-sm font-mono text-cyan-400 font-semibold mb-2">SYSTEM SPECIFICATION & OBJECTIVES</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{project.description}</p>
              </div>

              {/* Interactive SVG Topology Diagram */}
              <div className="p-4 rounded-lg bg-[#090D16] border border-slate-800">
                <div className="text-xs font-mono text-slate-400 mb-3 flex items-center justify-between">
                  <span>DATA FLOW &amp; HIGH-LEVEL TOPOLOGY</span>
                  <span className="text-emerald-400 text-[11px]">Dynamic Node Graph</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {project.diagramNodes.map((node, i) => (
                    <div
                      key={node.id}
                      className="p-3 rounded border border-slate-800 bg-[#0F172A] hover:border-emerald-500/50 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
                        <span>STAGE 0{i + 1}</span>
                        <span className="capitalize text-indigo-400">{node.type}</span>
                      </div>
                      <div className="font-mono text-xs font-semibold text-slate-100">{node.label}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{node.sublabel}</div>
                    </div>
                  ))}
                </div>

                {/* Animated data flow vector */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>In-flight payload: 4 kB batch serialization</span>
                  </div>
                  <span className="text-cyan-400 font-semibold tabular-nums">p99 = {project.metrics[1]?.value}</span>
                </div>
              </div>

              {/* Architecture Highlights */}
              <div>
                <h3 className="text-sm font-mono text-emerald-400 font-semibold mb-3">KEY ARCHITECTURAL HIGHLIGHTS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {project.architectureHighlights.map((hl, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded bg-[#0F172A]/80 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5"
                    >
                      <span className="font-mono text-emerald-400 font-bold shrink-0">0{idx + 1}.</span>
                      <span className="leading-relaxed">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {project.metrics.map(m => (
                  <div key={m.label} className="p-3 rounded bg-[#0F172A] border border-slate-800">
                    <div className="text-[11px] font-mono text-slate-400 mb-1">{m.label}</div>
                    <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: LIVE SIMULATION / PLAYGROUND */}
          {activeTab === 'simulation' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-mono text-cyan-400 font-semibold mb-1">INTERACTIVE SYSTEM SIMULATOR</h3>
                <p className="text-xs text-slate-400">
                  Trigger state machine transitions and observe replication, latency, and throughput counters in real time.
                </p>
              </div>

              {/* Simulation by type */}
              {project.simulationType === 'kv-store' && (
                <div className="p-4 rounded-lg bg-[#090D16] border border-slate-800 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">KEY (STRING)</label>
                      <input
                        type="text"
                        value={kvKey}
                        onChange={e => setKvKey(e.target.value)}
                        className="w-full bg-[#0B1120] border border-slate-800 rounded px-3 py-2 text-xs font-mono text-[#F8FAFC] focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">VALUE (JSON BYTES)</label>
                      <input
                        type="text"
                        value={kvVal}
                        onChange={e => setKvVal(e.target.value)}
                        className="w-full bg-[#0B1120] border border-slate-800 rounded px-3 py-2 text-xs font-mono text-[#F8FAFC] focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSimulateKvWrite}
                      className="px-4 py-2 text-xs font-semibold font-mono text-[#090D16] bg-[#10B981] hover:bg-[#34D399] rounded transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Dispatch Quorum Write [Propose]</span>
                    </button>
                    <span className="text-[11px] font-mono text-slate-400">Linearizable consensus replication</span>
                  </div>

                  {/* WAL Log stream */}
                  <div className="mt-3 p-3 bg-[#060E20] border border-slate-800/80 rounded font-mono text-xs space-y-1.5 max-h-48 overflow-y-auto">
                    <div className="text-slate-500 text-[10px] border-b border-slate-800 pb-1">RAFT REPLICATION LOG</div>
                    {kvLogs.map(l => (
                      <div key={l.id} className="flex items-center gap-2 text-slate-300">
                        <span className="text-[10px] text-slate-600">{l.time}</span>
                        <span className="text-emerald-400">&gt;</span>
                        <span className="text-slate-200">{l.msg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.simulationType === 'cloud-deploy' && (
                <div className="p-4 rounded-lg bg-[#090D16] border border-slate-800 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                      <span>CANARY TRAFFIC RATIO</span>
                      <span className="text-cyan-400 font-bold">{canaryWeight}% Canary / {100 - canaryWeight}% Stable</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={canaryWeight}
                      onChange={e => setCanaryWeight(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 bg-[#0F172A] rounded border border-slate-800">
                      <div className="text-slate-400 text-[11px]">STABLE REVISION v2.3.9</div>
                      <div className="text-emerald-400 font-bold mt-1">100% HEALTHY</div>
                      <div className="text-slate-500 text-[10px] mt-0.5">Error rate: 0.001%</div>
                    </div>
                    <div className="p-3 bg-[#0F172A] rounded border border-cyan-500/30">
                      <div className="text-cyan-400 text-[11px]">CANARY REVISION v2.4.0</div>
                      <div className="text-cyan-300 font-bold mt-1">PASSING SLO GATES</div>
                      <div className="text-slate-500 text-[10px] mt-0.5">Automated rollback: ARMED</div>
                    </div>
                  </div>
                </div>
              )}

              {project.simulationType === 'orderbook' && (
                <div className="p-4 rounded-lg bg-[#090D16] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">L2 ORDERBOOK DEPTH STREAM</span>
                    <button
                      onClick={handleSimulateTick}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded text-xs font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Inject Tick Delta</span>
                    </button>
                  </div>

                  <div className="space-y-1 font-mono text-xs">
                    {orderbookTicks.map((tick, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-1.5 rounded ${
                          tick.side === 'ask' ? 'bg-rose-950/20 text-rose-300' : 'bg-emerald-950/20 text-emerald-300'
                        }`}
                      >
                        <span className="font-semibold">{tick.side.toUpperCase()}</span>
                        <span className="tabular-nums">${tick.price.toFixed(2)}</span>
                        <span className="tabular-nums text-slate-400">{tick.size} BTC</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fallback general simulation for others */}
              {project.simulationType !== 'kv-store' && project.simulationType !== 'cloud-deploy' && project.simulationType !== 'orderbook' && (
                <div className="p-4 rounded-lg bg-[#090D16] border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="text-slate-400">STREAMING PAYLOAD EMULATOR</div>
                  <div className="p-3 bg-[#060E20] rounded border border-slate-800 text-emerald-400">
                    &gt; [Session initialized] Handshake verified via TLS 1.3 <br />
                    &gt; Stream rate: 45,000 events/second <br />
                    &gt; Compression: ZSTD dictionary (ratio = 4.2:1) <br />
                    &gt; Anomaly score: 0.02 (Safe)
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SOURCE CODE EXPLORER */}
          {activeTab === 'code' && (
            <div className="space-y-3">
              {/* File switcher header */}
              <div className="flex items-center justify-between bg-[#090D16] p-2 rounded-t-lg border border-slate-800">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {project.codeFiles.map((file, idx) => (
                    <button
                      key={file.filename}
                      onClick={() => setSelectedFileIdx(idx)}
                      className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                        selectedFileIdx === idx
                          ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {file.filename}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 text-xs font-mono text-slate-300 hover:text-emerald-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Code block with line numbers */}
              <div className="p-4 bg-[#060E20] border border-slate-800 rounded-b-lg overflow-x-auto font-mono text-xs leading-relaxed text-slate-200">
                <pre className="tab-size-2">
                  <code>{currentCodeFile?.code}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: BENCHMARKS & LATENCY */}
          {activeTab === 'benchmarks' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-mono text-emerald-400 font-semibold mb-1">SLA &amp; LATENCY PERCENTILES</h3>
                <p className="text-xs text-slate-400">
                  Production telemetry collected across 100,000 continuous benchmark cycles under simulated peak loads.
                </p>
              </div>

              {/* Percentiles Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 px-3">METRIC PERCENTILE</th>
                      <th className="py-2.5 px-3">MEASURED VALUE</th>
                      <th className="py-2.5 px-3">SLA TARGET</th>
                      <th className="py-2.5 px-3">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-100">p50 (Median)</td>
                      <td className="py-2.5 px-3 text-emerald-400 font-bold tabular-nums">0.42 ms</td>
                      <td className="py-2.5 px-3 text-slate-400 tabular-nums">&lt; 2.0 ms</td>
                      <td className="py-2.5 px-3 text-emerald-400">PASS</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-100">p90</td>
                      <td className="py-2.5 px-3 text-emerald-400 font-bold tabular-nums">0.88 ms</td>
                      <td className="py-2.5 px-3 text-slate-400 tabular-nums">&lt; 4.0 ms</td>
                      <td className="py-2.5 px-3 text-emerald-400">PASS</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-100">p99</td>
                      <td className="py-2.5 px-3 text-cyan-400 font-bold tabular-nums">{project.metrics[1]?.value}</td>
                      <td className="py-2.5 px-3 text-slate-400 tabular-nums">&lt; 10.0 ms</td>
                      <td className="py-2.5 px-3 text-emerald-400">PASS</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-100">p99.9 (Tail)</td>
                      <td className="py-2.5 px-3 text-indigo-400 font-bold tabular-nums">3.85 ms</td>
                      <td className="py-2.5 px-3 text-slate-400 tabular-nums">&lt; 20.0 ms</td>
                      <td className="py-2.5 px-3 text-emerald-400">PASS</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Memory profile block */}
              <div className="p-3 rounded bg-[#090D16] border border-slate-800 text-xs font-mono space-y-1">
                <div className="text-slate-400 text-[11px]">RESOURCE FOOTPRINT &amp; GC BEHAVIOR</div>
                <div className="text-slate-200">Resident Set Size (RSS): 48.2 MB · Zero heap allocations in hot path</div>
                <div className="text-emerald-400">GC Pause time: &lt; 0.05ms (Off-heap byte buffers)</div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with IDE status bar */}
        <div className="px-6 py-3 bg-[#090D16] border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>UTF-8</span>
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline">LF</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-cyan-400">{project.techStack.join(' · ')}</span>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors cursor-pointer"
          >
            Close Inspector [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
