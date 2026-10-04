'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<{ message: string; lastFailedPrompt: string } | null>(null);
  const [sabotageType, setSabotageType] = useState<string>('none');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string, forcedSabotage?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || isLoading) return;

    const activeSabotage = forcedSabotage || sabotageType;

    setErrorState(null);
    setInput('');

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          sabotage: activeSabotage !== 'none' ? activeSabotage : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with HTTP ${response.status}`);
      }

      if (!response.body) throw new Error('ReadableStream not supported.');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantId = (Date.now() + 1).toString();

      setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: assistantContent } : msg
          )
        );
      }
    } catch (err: any) {
      console.error('Chat execution failed:', err);
      setErrorState({
        message: err.message || 'Stream connection interrupted.',
        lastFailedPrompt: prompt,
      });
      setMessages((prev) => prev.filter((msg) => msg.content.trim().length > 0));
    } finally {
      setIsLoading(false);
      setSabotageType('none');
    }
  };

  const handleRetry = () => {
    if (!errorState?.lastFailedPrompt) return;
    const retryPrompt = errorState.lastFailedPrompt;
    setErrorState(null);
    handleSendMessage(retryPrompt, 'none');
  };

  return (
    <div className="pt-20 pb-10 px-4 max-w-4xl mx-auto flex flex-col h-[90vh]">
      {/* Test / Sabotage Toolbar */}
      <div className="mb-3 p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-amber-300 font-medium">
          <span>🛠️ Sabotage Tests:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSendMessage('Test Rate Limit Ingestion', 'rate_limit')}
            disabled={isLoading}
            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-mono transition"
          >
            Trigger 429 Limit
          </button>
          <button
            onClick={() => handleSendMessage('Test Outage Ingestion', 'server_error')}
            disabled={isLoading}
            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-mono transition"
          >
            Trigger 503 Outage
          </button>
          <button
            onClick={() => handleSendMessage('Test Mid-stream Drop', 'mid_stream')}
            disabled={isLoading}
            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-mono transition"
          >
            Trigger Mid-Stream Drop
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg">
                LP
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="font-semibold text-slate-200 text-base">Start Client Discovery</h3>
                <p className="text-xs text-slate-400">
                  Select a scenario to verify happy path and response streaming.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full max-w-xl text-left">
                <button
                  onClick={() => handleSendMessage('We have a $25k budget and need Next.js 15 development.', 'none')}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-blue-500/40 hover:bg-slate-900 transition text-xs space-y-1 text-slate-300"
                >
                  <span className="font-medium text-white block">High Intent Lead</span>
                  <span className="text-[11px] text-slate-500 block">"$25k budget inquiry"</span>
                </button>
                <button
                  onClick={() => handleSendMessage('What qualification questions do you ask enterprise leads?', 'none')}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-blue-500/40 hover:bg-slate-900 transition text-xs space-y-1 text-slate-300"
                >
                  <span className="font-medium text-white block">Discovery Strategy</span>
                  <span className="text-[11px] text-slate-500 block">"Enterprise qualification"</span>
                </button>
                <button
                  onClick={() => handleSendMessage('Can we integrate custom CRM webhooks?', 'none')}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-blue-500/40 hover:bg-slate-900 transition text-xs space-y-1 text-slate-300"
                >
                  <span className="font-medium text-white block">Integration Scope</span>
                  <span className="text-[11px] text-slate-500 block">"Custom webhook sync"</span>
                </button>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 text-sm ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="h-7 w-7 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-950 border border-slate-800/80 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))
          )}

          {/* Skeleton Loader */}
          {isLoading && (
            <div className="flex gap-3 text-sm justify-start">
              <div className="h-7 w-7 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 animate-pulse">
                AI
              </div>
              <div className="w-[65%] rounded-2xl rounded-bl-none p-4 bg-slate-950 border border-slate-800/80 space-y-2.5 animate-pulse">
                <div className="h-2.5 bg-slate-800 rounded w-5/6" />
                <div className="h-2.5 bg-slate-800 rounded w-4/6" />
                <div className="h-2 bg-slate-800/60 rounded w-2/6" />
              </div>
            </div>
          )}

          {/* Designed Error State */}
          {errorState && (
            <div className="rounded-xl border border-red-500/30 bg-red-950/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold text-base leading-none">⚠️</span>
                <div>
                  <p className="font-semibold text-red-200">Execution Error (Handled)</p>
                  <p className="text-red-400/90 mt-0.5 font-mono text-[11px]">{errorState.message}</p>
                </div>
              </div>
              <button
                onClick={handleRetry}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/40 font-medium transition shrink-0"
              >
                ↻ Retry failed message
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 sm:p-4 border-t border-slate-800/80 bg-slate-950/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input, 'none');
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your qualification inquiry..."
              disabled={isLoading}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-xs sm:text-sm transition shrink-0"
            >
              {isLoading ? 'Streaming...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}