import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, CornerDownLeft, Sparkles, RefreshCw } from 'lucide-react';
import { PROJECTS, TECH_ITEMS } from '../data/portfolioData.ts';
import { Project } from '../types/index.ts';

interface TerminalWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (p: Project) => void;
  onToggleTheme: () => void;
  onOpenContact: () => void;
}

interface CommandHistoryItem {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  isOpen,
  onClose,
  onSelectProject,
  onToggleTheme,
  onOpenContact
}) => {
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      id: 'init-1',
      command: 'systemctl status obsidian-core',
      output: (
        <div className="space-y-1 text-slate-300">
          <div className="text-emerald-400 font-semibold">● obsidian-core.service - Core Engineering Daemon v2.4</div>
          <div className="text-slate-400">   Loaded: loaded (/etc/systemd/system/obsidian-core.service; enabled)</div>
          <div className="text-slate-400">   Active: <span className="text-emerald-400 font-bold">active (running)</span> since 342 days ago</div>
          <div className="text-cyan-400">   Tasks: 42 threads across 8 worker clusters</div>
          <div className="text-slate-400 mt-2">Type <span className="text-emerald-400 font-bold">help</span> to view all interactive commands or tap quick commands below.</div>
        </div>
      ),
      timestamp: '00:00:01'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [commandList, setCommandList] = useState<string[]>(['systemctl status obsidian-core']);
  const [isMaximized, setIsMaximized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleRunCommand = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    setCommandList(prev => [...prev, trimmed]);
    setHistoryIdx(-1);
    const args = trimmed.split(' ');
    const mainCmd = args[0].toLowerCase();
    const arg1 = args[1]?.toLowerCase();

    let outputNode: React.ReactNode = null;

    switch (mainCmd) {
      case 'help':
        outputNode = (
          <div className="space-y-1.5 py-1 text-xs">
            <div className="text-emerald-400 font-semibold mb-2">AVAILABLE TERMINAL COMMANDS:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-slate-300">
              <div><span className="text-cyan-400 font-mono">projects</span> - List all production engineering systems</div>
              <div><span className="text-cyan-400 font-mono">open &lt;id&gt;</span> - Launch IDE inspector for a project</div>
              <div><span className="text-cyan-400 font-mono">stack</span> - View technical competency matrix</div>
              <div><span className="text-cyan-400 font-mono">cat bio.md</span> - Display engineer background & philosophy</div>
              <div><span className="text-cyan-400 font-mono">cat resume.json</span> - View structured career milestones</div>
              <div><span className="text-cyan-400 font-mono">ping &lt;region&gt;</span> - Ping distributed cluster edge nodes</div>
              <div><span className="text-cyan-400 font-mono">benchmark</span> - Run real in-browser CPU ops test</div>
              <div><span className="text-cyan-400 font-mono">theme</span> - Toggle between Dark & Light themes</div>
              <div><span className="text-cyan-400 font-mono">contact</span> - Dispatch communication inquiry</div>
              <div><span className="text-cyan-400 font-mono">clear</span> - Clear terminal screen buffer</div>
            </div>
          </div>
        );
        break;

      case 'projects':
      case 'ls':
        outputNode = (
          <div className="space-y-2 py-1 text-xs">
            <div className="text-slate-400 font-mono text-[11px] border-b border-slate-800 pb-1 flex justify-between">
              <span>ID</span>
              <span className="hidden sm:inline">CATEGORY</span>
              <span>METRIC</span>
              <span>ACTION</span>
            </div>
            {PROJECTS.map(p => (
              <div key={p.id} className="flex items-center justify-between text-slate-300 hover:text-emerald-300">
                <span className="font-mono text-cyan-400">{p.id}</span>
                <span className="hidden sm:inline text-slate-400">{p.categoryLabel}</span>
                <span className="font-mono text-emerald-400">{p.metrics[0].value}</span>
                <button
                  onClick={() => onSelectProject(p)}
                  className="px-2 py-0.5 text-[10px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded cursor-pointer"
                >
                  Inspect [open {p.id}]
                </button>
              </div>
            ))}
          </div>
        );
        break;

      case 'open':
      case 'inspect':
      case 'cat':
        if (mainCmd === 'cat' && arg1 === 'bio.md') {
          outputNode = (
            <div className="space-y-2 text-slate-300 text-xs leading-relaxed max-w-xl">
              <div className="text-emerald-400 font-semibold"># Full Stack Developer & Systems Architect</div>
              <p>
                Obsessed with high-throughput distributed systems, deterministic state machines, and micro-optimized browser experiences. I believe that performance is a foundational feature, not an afterthought.
              </p>
              <p>
                Specialized in zero-allocation Go/Rust backends, concurrent web platforms, and design systems with strict typographic integrity.
              </p>
              <div className="text-slate-400 text-[11px]">Key Philosophy: Simple data structures beat clever code. Measure p99, not p50.</div>
            </div>
          );
        } else if (mainCmd === 'cat' && arg1 === 'resume.json') {
          outputNode = (
            <pre className="text-emerald-400 font-mono text-[11px] overflow-x-auto p-2 bg-[#060E20] rounded border border-slate-800">
{JSON.stringify({
  developer: "Full Stack Engineer & Systems Architect",
  experienceYears: 8,
  focus: ["Distributed State", "Reactive 60FPS UI", "Edge Infrastructure"],
  languages: ["TypeScript", "Go", "Rust", "SQL"],
  cloud: ["GCP", "Kubernetes", "Docker", "Terraform"],
  openForOpportunities: true
}, null, 2)}
            </pre>
          );
        } else if (arg1) {
          const match = PROJECTS.find(p => p.id === arg1 || p.slug.includes(arg1));
          if (match) {
            onSelectProject(match);
            outputNode = (
              <div className="text-emerald-400">
                Opening IDE inspector for <span className="font-bold">{match.title}</span> ({match.ideFilePath})...
              </div>
            );
          } else {
            outputNode = <div className="text-rose-400">Error: Project &quot;{arg1}&quot; not found. Type &quot;projects&quot; to see IDs.</div>;
          }
        } else {
          outputNode = <div className="text-amber-400">Usage: open &lt;project-id&gt; (e.g. open hyperion-kv)</div>;
        }
        break;

      case 'stack':
        outputNode = (
          <div className="space-y-1.5 py-1 text-xs">
            <div className="text-emerald-400 font-semibold mb-1">TECHNICAL MATRIX PROFICIENCY:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
              {TECH_ITEMS.slice(0, 10).map(t => (
                <div key={t.name} className="flex items-center justify-between font-mono">
                  <span className="text-slate-300">{t.name}</span>
                  <span className="text-cyan-400 text-[11px]">{t.years} · {t.level}</span>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'ping':
        const target = arg1 || 'cluster-edge-tokyo';
        outputNode = (
          <div className="space-y-1 text-xs font-mono text-slate-300">
            <div className="text-slate-400">PING {target}.obsidian-net.io (104.28.14.92): 56 data bytes</div>
            <div>64 bytes from 104.28.14.92: icmp_seq=0 ttl=58 time=14.281 ms</div>
            <div>64 bytes from 104.28.14.92: icmp_seq=1 ttl=58 time=13.914 ms</div>
            <div>64 bytes from 104.28.14.92: icmp_seq=2 ttl=58 time=14.002 ms</div>
            <div className="text-emerald-400 pt-1">--- {target} ping statistics --- 3 packets transmitted, 0.0% packet loss, min/avg/max = 13.9/14.0/14.2 ms</div>
          </div>
        );
        break;

      case 'benchmark':
        const start = performance.now();
        let checksum = 0;
        for (let i = 0; i < 2_000_000; i++) {
          checksum += (i ^ (i >>> 3)) & 0xff;
        }
        const duration = performance.now() - start;
        const opsPerSec = Math.round((2_000_000 / duration) * 1000);
        outputNode = (
          <div className="space-y-1.5 text-xs font-mono">
            <div className="text-cyan-400 font-semibold">CLIENT BROWSER COMPUTATIONAL BENCHMARK:</div>
            <div className="text-slate-300">Operations: 2,000,000 synthetic state mutations</div>
            <div className="text-slate-300">Execution Time: <span className="text-emerald-400 font-bold">{duration.toFixed(2)} ms</span></div>
            <div className="text-emerald-400 font-bold">Throughput: {opsPerSec.toLocaleString()} ops/sec (PASS - Optimal)</div>
            <div className="text-slate-400 text-[11px]">Hardware concurrency: {navigator.hardwareConcurrency || 8} logical cores detected</div>
          </div>
        );
        break;

      case 'theme':
        onToggleTheme();
        outputNode = <div className="text-cyan-400">Theme state toggled successfully.</div>;
        break;

      case 'contact':
        onOpenContact();
        outputNode = (
          <div className="text-emerald-400">
            Launching inquiry dispatcher dialog... (or reach out via email: dev@obsidian-core.dev)
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        outputNode = (
          <div className="text-rose-400 text-xs">
            command not found: {mainCmd}. Type <span className="text-emerald-400 font-semibold">help</span> for available commands.
          </div>
        );
        break;
    }

    setHistory(prev => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        command: trimmed,
        output: outputNode,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRunCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandList.length === 0) return;
      const nextIdx = historyIdx === -1 ? commandList.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInputVal(commandList[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= commandList.length) {
        setHistoryIdx(-1);
        setInputVal('');
      } else {
        setHistoryIdx(nextIdx);
        setInputVal(commandList[nextIdx] || '');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Auto-complete suggestion
      const possibilities = ['help', 'projects', 'stack', 'cat bio.md', 'cat resume.json', 'benchmark', 'ping', 'theme', 'contact', 'clear'];
      const match = possibilities.find(p => p.startsWith(inputVal.trim()));
      if (match) setInputVal(match);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#090D16]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full ${
          isMaximized ? 'h-[94vh] max-w-6xl' : 'max-w-3xl h-[560px]'
        } flex flex-col bg-[#0B1326] border border-slate-700/80 rounded-lg shadow-2xl overflow-hidden transition-all duration-200`}
      >
        {/* IDE Title Bar */}
        <div className="h-10 bg-[#0F172A] border-b border-slate-800 px-4 flex items-center justify-between select-none">
          {/* Window control dots */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors cursor-pointer"
              title="Close terminal"
            />
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors cursor-pointer"
              title="Maximize window"
            />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 cursor-pointer" />
          </div>

          {/* Terminal File Path / Session */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>visitor@obsidian-core: ~/session</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-emerald-400/80 text-[11px]">pty0 (online)</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 text-slate-400">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors"
              title={isMaximized ? 'Restore size' : 'Maximize'}
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-200 space-y-3 cursor-text bg-[#090D16]"
        >
          {history.map(item => (
            <div key={item.id} className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-emerald-400 font-semibold">visitor@obsidian:~$</span>
                <span className="text-[#F8FAFC]">{item.command}</span>
                <span className="text-[10px] text-slate-600 ml-auto">{item.timestamp}</span>
              </div>
              <div className="pl-4 border-l border-slate-800/80 py-0.5">{item.output}</div>
            </div>
          ))}

          {/* Current Input Line */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-emerald-400 font-semibold shrink-0">visitor@obsidian:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="flex-1 bg-transparent text-[#F8FAFC] focus:outline-none caret-emerald-400 font-mono text-xs"
              placeholder="Type command ('help', 'projects', 'stack', 'benchmark')..."
            />
            <button
              onClick={() => handleRunCommand(inputVal)}
              className="px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Run</span>
              <CornerDownLeft className="w-3 h-3 text-emerald-400" />
            </button>
          </div>

          <div ref={bottomRef} />
        </div>

        {/* Quick Suggestion Chips Footer */}
        <div className="bg-[#0F172A] border-t border-slate-800 px-4 py-2.5 flex items-center gap-2 overflow-x-auto text-[11px] font-mono text-slate-400">
          <span className="text-slate-500 shrink-0">Quick run:</span>
          {['help', 'projects', 'stack', 'benchmark', 'ping', 'cat bio.md', 'clear'].map(cmd => (
            <button
              key={cmd}
              onClick={() => handleRunCommand(cmd)}
              className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 hover:text-emerald-300 text-slate-300 border border-slate-700/60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
