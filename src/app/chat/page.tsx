'use client';

import React, { useState, useRef, useEffect } from 'react';

// Generative UI: Gerçek Görsel Skor Kartı Bileşeni (Brief Madde 3)
function LeadScoreCard({ result, args }: { result: any; args: any }) {
  const isHighFit = result.score >= 75;

  return (
    <div className="my-3 p-4 rounded-xl border border-blue-500/30 bg-slate-900/90 shadow-lg text-slate-100 space-y-3 max-w-md transition-all">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <h4 className="font-semibold text-xs tracking-wide uppercase text-slate-300">
            Lead Qualification Scorecard
          </h4>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
            isHighFit ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300'
          }`}
        >
          {result.tier}
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Mastery Fit Score:</span>
          <span className="font-bold text-white">{result.score} / 100</span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isHighFit ? 'bg-gradient-to-r from-blue-500 to-emerald-400' : 'bg-amber-400'
            }`}
            style={{ width: `${result.score}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
        <div>
          <span className="text-slate-500 block">Est. Budget:</span>
          <span className="font-medium text-slate-200">{result.estimatedBudget}</span>
        </div>
        <div>
          <span className="text-slate-500 block">Timeline:</span>
          <span className="font-medium text-slate-200 capitalize">{result.urgency}</span>
        </div>
      </div>

      <div className="pt-1 text-[11px] text-slate-400 flex items-start gap-1.5">
        <span className="text-blue-400 font-bold">↳ Next Action:</span>
        <span>{result.recommendation}</span>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toolState, setToolState] = useState<'idle' | 'input-streaming' | 'output-available' | 'output-error'>('idle');
  const [toolPayload, setToolPayload] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, toolState]);

  const handleSendMessage = async (textToSend?: string, sabotageType?: string) => {
    // Eğer tool_error simülasyonu yapılıyorsa boş prompt kontrolüne takılmasın:
    if (sabotageType === 'tool_error') {
      setIsLoading(true);
      setToolState('input-streaming');
      setTimeout(() => {
        setToolState('output-error');
        setToolPayload({
          toolName: 'scoreLead',
          error: 'Zod ValidationError: Invalid input. Field "budgetUsd" must be greater than 0 (received: -5000).',
        });
        setIsLoading(false);
      }, 700);
      return;
    }

    const prompt = (textToSend || input).trim();
    if (!prompt || isLoading) return;

    setInput('');
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', content: prompt }]);
    setIsLoading(true);

    // Tool çağrısı tetiklendiğinde önce input-streaming durumunu göster (Mentor Tip: lifecycle)
    if (prompt.includes('$') || prompt.toLowerCase().includes('budget')) {
      setToolState('input-streaming');
    } else {
      setToolState('idle');
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
      });

      const data = await res.json();

      if (data.toolInvocation) {
        setToolState('output-available');
        setToolPayload(data.toolInvocation);
      }

      if (data.message) {
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: 'assistant', content: data.message },
        ]);
      }
    } catch (err) {
      setToolState('output-error');
      setToolPayload({ error: 'Network interruption during tool execution.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-10 px-4 max-w-4xl mx-auto flex flex-col h-[90vh]">
     {/* Sabotage / Tool Tester Toolbar */}
      <div className="mb-3 p-3 rounded-xl border border-slate-700 bg-slate-900/90 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-200 font-semibold">
          <span className="text-base">⚙️</span>
          <span>Generative UI Tool Inspector:</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSendMessage('We have a $25,000 budget for Next.js app.')}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-sm transition"
          >
            Trigger scoreLead (Success)
          </button>
          <button
            onClick={() => handleSendMessage('', 'tool_error')}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-500 text-white font-medium shadow-sm transition"
          >
            Trigger Tool Error
          </button>
        </div>
      </div>
      <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <h3 className="font-semibold text-slate-200">Generative Tool Demonstration</h3>
              <p className="text-xs text-slate-400">
                Click "Trigger scoreLead" to see the full tool lifecycle render into a native UI card.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-sm ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm ${
                  msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-950 border border-slate-800 text-slate-200'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* 1. STATE: Input Streaming (Morphing Loading Skeleton) */}
          {toolState === 'input-streaming' && (
            <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 max-w-sm space-y-2 animate-pulse">
              <div className="flex items-center gap-2 text-xs text-blue-400 font-mono">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                <span>scoreLead() · Parsing parameters & computing tier...</span>
              </div>
              <div className="h-1.5 bg-blue-500/20 rounded w-3/4" />
            </div>
          )}

          {/* 2. STATE: Output Available -> Rendered UI Component */}
          {toolState === 'output-available' && toolPayload?.result && (
            <LeadScoreCard result={toolPayload.result} args={toolPayload.args} />
          )}

          {/* 3. STATE: Output Error -> Designed Error State (Brief Madde 2) */}
          {toolState === 'output-error' && (
            <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-950/20 max-w-md text-xs text-red-300 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-red-200">
                <span>⚠️ Tool Execution Exception</span>
              </div>
              <p className="text-[11px] text-red-400/90 font-mono">{toolPayload?.error}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., We have a $30,000 budget for a custom Next.js web application..."
              disabled={isLoading}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}