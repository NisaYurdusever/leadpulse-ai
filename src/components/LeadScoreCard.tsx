import React from 'react';

export interface ScoreCardProps {
  result: {
    score: number;
    tier: string;
    estimatedBudget: string;
    urgency: string;
    recommendation: string;
  };
}

export function LeadScoreCard({ result }: ScoreCardProps) {
  const isHighFit = result.score >= 75;

  return (
    <article aria-label="Lead Scorecard" className="p-4 rounded-xl border border-blue-500/30 bg-slate-900 text-slate-100">
      <header className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-sm">Lead Qualification Scorecard</h3>
        <span role="status" aria-label="Qualification Tier" className="px-2 py-0.5 rounded text-xs">
          {result.tier}
        </span>
      </header>

      <div className="mb-2">
        <span>Score: </span>
        <strong aria-label="Score Value">{result.score} / 100</strong>
        <div 
          role="progressbar" 
          aria-valuenow={result.score} 
          aria-valuemin={0} 
          aria-valuemax={100} 
          style={{ width: `${result.score}%` }} 
        />
      </div>

      <dl className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <dt>Est. Budget:</dt>
          <dd>{result.estimatedBudget}</dd>
        </div>
        <div>
          <dt>Timeline:</dt>
          <dd>{result.urgency}</dd>
        </div>
      </dl>

      <p className="mt-2 text-xs">
        <strong>Next Action:</strong> {result.recommendation}
      </p>
    </article>
  );
}