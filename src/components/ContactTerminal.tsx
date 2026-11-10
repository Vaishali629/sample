import React, { useState } from 'react';
import { Terminal, Send, Copy, Check, CheckCircle2, Mail, MessageSquare } from 'lucide-react';

export const ContactTerminal: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('Architecture Advisory');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  const copyCurlCmd = () => {
    const payload = JSON.stringify({
      from: email || 'user@example.com',
      type: inquiryType,
      text: message || 'Inquiry regarding Q2 architecture review.'
    });
    navigator.clipboard.writeText(`curl -X POST https://api.obsidian-core.dev/v1/dispatch \\
  -H "Content-Type: application/json" \\
  -d '${payload}'`);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2200);
  };

  return (
    <section id="contact" className="py-16 md:py-24 border-t border-slate-800/60 bg-[#0B1326] relative">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Context & CLI Dispatch Options */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
              <span className="text-slate-500 font-bold">&gt;</span>
              <span>INQUIRY DISPATCHER // DIRECT SECURE CHANNEL</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F8FAFC] mb-4">
              Deploy An Engineering Inquiry
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
              Available for staff-level architecture consultation, low-latency distributed systems contracts, and technical advisory for growth-stage engineering teams.
            </p>

            {/* Direct CLI alternative */}
            <div className="p-4 rounded-lg bg-[#090D16] border border-slate-800 mb-6">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>CLI DISPATCH PROTOCOL</span>
                </span>
                <button
                  onClick={copyCurlCmd}
                  className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCurl ? 'Copied curl' : 'Copy cURL'}</span>
                </button>
              </div>

              <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-2.5 bg-[#060E20] rounded border border-slate-800/80 leading-relaxed select-all">
{`curl -X POST https://api.obsidian-core.dev/v1/dispatch \\
  -H "Authorization: Bearer guest_token" \\
  -d '{"type": "${inquiryType}"}'`}
              </pre>
            </div>

            {/* Direct Contact Metadata */}
            <div className="space-y-3 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">dev@obsidian-core.dev</span>
                <span className="text-slate-600">·</span>
                <span className="text-cyan-400 font-semibold">PGP 0x9B4E21DF</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-200">Matrix: @lead:obsidian.matrix.org</span>
              </div>
            </div>
          </div>

          {/* Right Column: Terminal Input Form */}
          <div className="p-6 sm:p-8 rounded-xl bg-[#0F172A]/80 backdrop-blur-[12px] border border-slate-800/80 shadow-2xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-mono text-[#F8FAFC]">DISPATCH CONFIRMED [ACK 200]</h3>
                <p className="text-xs font-mono text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your inquiry has been successfully queued into the priority dispatch stream. A reply with calendar synchronization links will be sent within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="px-4 py-2 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    YOUR NAME OR HANDLE
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full bg-[#0B1120] border border-[rgba(148,163,184,0.15)] rounded px-3.5 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    WORK EMAIL / ENCRYPTED ENDPOINT
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full bg-[#0B1120] border border-[rgba(148,163,184,0.15)] rounded px-3.5 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    INQUIRY SCOPE
                  </label>
                  <select
                    value={inquiryType}
                    onChange={e => setInquiryType(e.target.value)}
                    className="w-full bg-[#0B1120] border border-[rgba(148,163,184,0.15)] rounded px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] focus:outline-none font-mono cursor-pointer"
                  >
                    <option value="Architecture Advisory">Architecture Advisory (Q2 Review)</option>
                    <option value="Full Stack Contract">Full Stack &amp; Systems Contract</option>
                    <option value="Performance Audit">Tail Latency / p99 Audit</option>
                    <option value="General Exploration">General Technical Discussion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    SYSTEM OBJECTIVES / MESSAGE
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Describe your architecture requirements, scale targets, or contract timeline..."
                    className="w-full bg-[#0B1120] border border-[rgba(148,163,184,0.15)] rounded px-3.5 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] focus:outline-none font-mono resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 text-xs font-semibold font-mono text-[#090D16] bg-[#10B981] hover:bg-[#34D399] transition-all rounded shadow-[0_0_16px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'DISPATCHING TO INBOX...' : 'DISPATCH INQUIRY [ENTER]'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
