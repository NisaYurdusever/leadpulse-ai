'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Route Failure:', error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="h-12 w-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center font-bold text-lg">
        !
      </div>
      <div className="space-y-1 max-w-md">
        <h2 className="text-xl font-bold text-slate-100">Something went wrong</h2>
        <p className="text-xs text-slate-400">
          The view encountered an unhandled lifecycle exception. You can attempt to reload the boundary or return home.
        </p>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => reset()}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition"
        >
          Try Recovery
        </button>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}