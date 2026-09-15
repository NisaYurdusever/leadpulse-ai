export default function DashboardPage() {
  const dummyLeads = [
    { id: 'LD-101', company: 'Apex Logistics', budget: '$15,000+', score: 'High Intent', date: '2026-09-15' },
    { id: 'LD-102', company: 'Nova Retail', budget: '$5,000 - $10k', score: 'Qualified', date: '2026-09-14' },
    { id: 'LD-103', company: 'Vanguard Studios', budget: 'Undisclosed', score: 'In Review', date: '2026-09-14' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Lead Management Pipeline</h1>
        <p className="text-sm text-slate-400">Structured outputs extracted via autonomous tool calling (FE-07).</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/30">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
            <tr>
              <th className="p-4">Lead ID</th>
              <th className="p-4">Client / Company</th>
              <th className="p-4">Est. Budget</th>
              <th className="p-4">Qualification Status</th>
              <th className="p-4">Captured Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {dummyLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-800/30">
                <td className="p-4 font-mono text-xs text-blue-400">{lead.id}</td>
                <td className="p-4 font-medium text-white">{lead.company}</td>
                <td className="p-4">{lead.budget}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {lead.score}
                  </span>
                </td>
                <td className="p-4 text-slate-500">{lead.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}