import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center text-center py-12 md:py-20 space-y-8">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium">
        <span>FE-05 Spec: Production Foundation Live</span>
      </div>

      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-3xl">
        Qualify High-Intent Leads with <span className="text-blue-500">Conversational AI</span>
      </h1>

      <p className="text-slate-400 text-base sm:text-lg max-w-2xl">
        LeadPulse automatically engages website visitors, extracts qualification criteria (budget, timeline, scope), and routes qualified leads directly to your CRM.
      </p>

      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <Link
          href="/chat"
          className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition shadow-lg shadow-blue-600/20"
        >
          Test Live Assistant
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 font-medium text-sm transition"
        >
          View Pipeline Dashboard
        </Link>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-16 text-left">
        <div className="p-6 rounded-xl border border-slate-800/80 bg-slate-900/30 space-y-2">
          <h3 className="font-semibold text-slate-200">24/7 Smart Ingestion</h3>
          <p className="text-xs text-slate-400">Captures client intent with context-aware streaming dialogue.</p>
        </div>
        <div className="p-6 rounded-xl border border-slate-800/80 bg-slate-900/30 space-y-2">
          <h3 className="font-semibold text-slate-200">Structured Tool Calling</h3>
          <p className="text-xs text-slate-400">Extracts validated JSON schemas directly into CRM tables.</p>
        </div>
        <div className="p-6 rounded-xl border border-slate-800/80 bg-slate-900/30 space-y-2">
          <h3 className="font-semibold text-slate-200">Production Reliability</h3>
          <p className="text-xs text-slate-400">Resilient fallback states, automated timeouts, and health probes.</p>
        </div>
      </div>
    </div>
  );
}