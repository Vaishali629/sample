import React, { useState, useEffect } from 'react';
import { Send, Zap, Shield, Database, Server, RefreshCw, Cpu, Activity, CheckCircle2, AlertTriangle } from 'lucide-react';

export const SystemVisualizer: React.FC = () => {
  const [packetStage, setPacketStage] = useState<number>(-1);
  const [cacheHit, setCacheHit] = useState<boolean>(true);
  const [highLoadMode, setHighLoadMode] = useState<boolean>(false);
  const [failoverMode, setFailoverMode] = useState<boolean>(false);

  // Live metrics that react to state
  const [reqCount, setReqCount] = useState<number>(142980);
  const [latency, setLatency] = useState<number>(12.4);

  useEffect(() => {
    const timer = setInterval(() => {
      setReqCount(prev => prev + (highLoadMode ? 420 : 18));
      if (!highLoadMode) {
        setLatency(cacheHit ? 11.8 + Math.random() * 1.2 : 28.5 + Math.random() * 3.5);
      } else {
        setLatency(cacheHit ? 18.2 + Math.random() * 2.8 : 46.0 + Math.random() * 5.0);
      }
    }, 1200);
    return () => clearInterval(timer);
  }, [cacheHit, highLoadMode]);

  const handleFirePacket = () => {
    if (packetStage !== -1) return;
    setPacketStage(0);

    const stepInterval = 450;
    setTimeout(() => setPacketStage(1), stepInterval);
    setTimeout(() => setPacketStage(2), stepInterval * 2);

    if (cacheHit) {
      setTimeout(() => setPacketStage(3), stepInterval * 3); // hits cache and returns
      setTimeout(() => setPacketStage(-1), stepInterval * 4.2);
    } else {
      setTimeout(() => setPacketStage(3), stepInterval * 3); // queries cache (miss)
      setTimeout(() => setPacketStage(4), stepInterval * 4); // queries DB
      setTimeout(() => setPacketStage(-1), stepInterval * 5.5);
    }
  };

  const NODES = [
    {
      id: 0,
      title: 'Edge Client',
      role: 'Web & Mobile App',
      icon: Cpu,
      subtext: 'HTTP/3 + TLS 1.3'
    },
    {
      id: 1,
      title: 'Anycast CDN',
      role: 'Cloudflare Mesh',
      icon: Activity,
      subtext: 'DDoS mitigation · WAF'
    },
    {
      id: 2,
      title: 'API Gateway',
      role: 'Envoy / Go Proxy',
      icon: Server,
      subtext: 'JWT Auth · Rate Limiting'
    },
    {
      id: 3,
      title: 'Distributed Cache',
      role: 'Redis In-Memory',
      icon: Zap,
      subtext: cacheHit ? 'Cache HIT (2.1ms)' : 'Cache MISS (Forward to DB)'
    },
    {
      id: 4,
      title: 'Primary Database',
      role: 'Cloud SQL / Postgres',
      icon: Database,
      subtext: failoverMode ? 'Replica Failover Active' : 'Read Replica Quorum'
    }
  ];

  return (
    <section id="simulator" className="py-16 md:py-24 border-t border-slate-800/60 bg-[#090D16]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
              <span className="text-slate-500 font-bold">&gt;</span>
              <span>LIVE ARCHITECTURE VISUALIZER // DISTRIBUTED PACKET TRACER</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F8FAFC]">
              Real-Time Request Pipeline
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
              Interact with a live topological simulation of a high-throughput edge architecture. Dispatch simulated packets, toggle cache hits/misses, and test system failover behaviors.
            </p>
          </div>

          {/* Interactive Control Panel */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleFirePacket}
              disabled={packetStage !== -1}
              className={`px-4 py-2 text-xs font-mono font-semibold rounded flex items-center gap-2 transition-all cursor-pointer ${
                packetStage !== -1
                  ? 'bg-slate-800 text-slate-500 border border-slate-700'
                  : 'bg-[#10B981] hover:bg-[#34D399] text-[#090D16] shadow-[0_0_16px_rgba(16,185,129,0.35)]'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{packetStage !== -1 ? 'Tracing Packet...' : 'Dispatch Request Packet'}</span>
            </button>

            <button
              onClick={() => setCacheHit(!cacheHit)}
              className={`px-3 py-2 text-xs font-mono rounded border transition-colors cursor-pointer ${
                cacheHit
                  ? 'bg-[#1E293B] border-emerald-500/40 text-emerald-400'
                  : 'bg-[#1E293B] border-amber-500/40 text-amber-400'
              }`}
            >
              {cacheHit ? 'Mode: Cache Hit (94%)' : 'Mode: Cache Miss (Simulated)'}
            </button>

            <button
              onClick={() => setHighLoadMode(!highLoadMode)}
              className={`px-3 py-2 text-xs font-mono rounded border transition-colors cursor-pointer ${
                highLoadMode
                  ? 'bg-cyan-950/40 border-cyan-400 text-cyan-400'
                  : 'bg-[#1E293B] border-slate-700 text-slate-400'
              }`}
            >
              {highLoadMode ? 'Load: 15k req/s (Spike)' : 'Load: Normal (3k req/s)'}
            </button>
          </div>
        </div>

        {/* Visual Topology Pipeline */}
        <div className="p-6 rounded-lg bg-[#0F172A]/70 backdrop-blur-[12px] border border-slate-800/80 mb-6 relative overflow-hidden">
          {/* Node columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 relative z-10">
            {NODES.map((node, idx) => {
              const isActive = packetStage === idx;
              const NodeIcon = node.icon;
              return (
                <div
                  key={node.id}
                  className={`p-4 rounded-lg border transition-all duration-300 relative flex flex-col justify-between ${
                    isActive
                      ? 'border-emerald-400 bg-emerald-950/20 shadow-[0_0_20px_rgba(16,185,129,0.25)] scale-[1.02]'
                      : 'border-slate-800 bg-[#0B1326] hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Stage badge */}
                    <div className="flex items-center justify-between text-[10px] font-mono mb-3">
                      <span className="text-slate-500">HOP 0{idx + 1}</span>
                      {isActive ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          PROCESSING
                        </span>
                      ) : (
                        <span className="text-slate-600">READY</span>
                      )}
                    </div>

                    {/* Icon + Title */}
                    <div className="w-9 h-9 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 mb-2">
                      <NodeIcon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-cyan-400'}`} />
                    </div>

                    <div className="font-semibold text-sm text-[#F8FAFC]">{node.title}</div>
                    <div className="text-xs text-indigo-400 font-mono mt-0.5">{node.role}</div>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                    {node.subtext}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Connection telemetry line across desktop */}
          <div className="hidden lg:block mt-6 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero-allocation serialization active across all inter-process boundaries</span>
              </span>
              <span className="text-slate-500">TLS session ticket reuse: 99.4%</span>
            </div>
          </div>
        </div>

        {/* Real-Time Telemetry Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-[#0F172A]/70 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 mb-1">TOTAL REQUEST INGESTION</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#F8FAFC] tabular-nums">
              {reqCount.toLocaleString()}
            </div>
            <div className="text-[10px] font-mono text-emerald-400 mt-1">Live streaming counter</div>
          </div>

          <div className="p-4 rounded-lg bg-[#0F172A]/70 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 mb-1">P99 LATENCY ENVELOPE</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 tabular-nums">
              {latency.toFixed(1)} ms
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-1">SLA guarantee: &lt; 50ms</div>
          </div>

          <div className="p-4 rounded-lg bg-[#0F172A]/70 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 mb-1">CACHE HIT RATIO</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {cacheHit ? '94.2%' : '48.1%'}
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-1">Redis cluster buffer</div>
          </div>

          <div className="p-4 rounded-lg bg-[#0F172A]/70 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 mb-1">CIRCUIT BREAKER STATE</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-indigo-400">
              CLOSED (OK)
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-1">Error budget: 99.98% intact</div>
          </div>
        </div>
      </div>
    </section>
  );
};
