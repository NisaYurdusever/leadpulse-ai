export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Bot & Webhook Configuration</h1>
        <p className="text-sm text-slate-400">Configure qualification criteria and external CRM endpoints.</p>
      </div>

      <div className="space-y-4 border border-slate-800 p-6 rounded-xl bg-slate-900/30">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Minimum Budget Threshold</label>
          <input 
            type="text" 
            disabled 
            value="$5,000 USD" 
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-400 cursor-not-allowed"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Target Webhook URL</label>
          <input 
            type="text" 
            disabled 
            value="https://api.crm.internal/v1/leads" 
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-400 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}