import Link from 'next/link';

export default function ChatPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Client Qualification Assistant</h1>
        <p className="text-sm text-slate-400">Target interface for FE-06 Streaming AI integration.</p>
      </div>

      <div className="h-96 rounded-xl border border-dashed border-slate-800 bg-slate-900/20 flex flex-col items-center justify-center p-6 text-center space-y-3">
        <div className="h-10 w-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">
          AI
        </div>
        <h3 className="text-sm font-semibold text-slate-300">Streaming Engine Placeholder</h3>
        <p className="text-xs text-slate-500 max-w-md">
          This container will mount the Vercel AI SDK streaming chat interface connected to Google Gemini in milestone FE-06.
        </p>
        <Link href="/" className="text-xs text-blue-400 hover:underline">
          ← Return to overview
        </Link>
      </div>
    </div>
  );
}