interface SystemHealth {
  status: string;
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
}

// Server Component fetching dynamic live telemetry
async function getHealthData(): Promise<SystemHealth> {
  // Simulating an external live health probe or database heartbeat
  return {
    status: 'OPERATIONAL',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 1240),
    environment: process.env.NODE_ENV || 'production',
  };
}

export default async function HealthPage() {
  const health = await getHealthData();

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span>System Telemetry & Health</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {health.status}
          </span>
        </h1>
        <p className="text-sm text-slate-400">
          Server-rendered telemetry probe verifying dynamic data fetching on every request.
        </p>
      </div>

      <div className="border border-slate-800 rounded-xl bg-slate-900/40 p-6 space-y-4 font-mono text-xs">
        <div className="flex justify-between border-b border-slate-800/80 pb-3">
          <span className="text-slate-500">Service Status:</span>
          <span className="text-emerald-400 font-bold">{health.status}</span>
        </div>
        <div className="flex justify-between border-b border-slate-800/80 pb-3">
          <span className="text-slate-500">Checked At:</span>
          <span className="text-slate-300">{health.timestamp}</span>
        </div>
        <div className="flex justify-between border-b border-slate-800/80 pb-3">
          <span className="text-slate-500">Host Runtime:</span>
          <span className="text-slate-300">Node.js Serverless ({health.environment})</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Uptime:</span>
          <span className="text-slate-300">{health.uptimeSeconds}s</span>
        </div>
      </div>
    </div>
  );
}