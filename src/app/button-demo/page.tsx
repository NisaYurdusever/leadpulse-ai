'use client';

import React, { useState } from 'react';
import { MotionButton } from '@/components/MotionButton';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function ButtonDemoPage() {
  const [overrideOutcome, setOverrideOutcome] = useState<'success' | 'error' | null>(null);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 antialiased selection:bg-blue-500 selection:text-white">
      <div className="max-w-xl w-full space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <Link href="/chat" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to LeadPulse Chat
          </Link>
          <div className="flex items-center gap-2 pt-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              State-Communicating Action Button
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            A lifecycle motion system handling <strong>idle → hover → loading → success / error → reset</strong> with zero abrupt swaps and layout-thrash-free compositor animations.
          </p>
        </div>

        {/* Demo Stage */}
        <div className="p-8 sm:p-12 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur shadow-2xl flex flex-col items-center justify-center gap-6">
          <div className="py-4">
            <MotionButton
              label="Send Lead Inquiry"
              simulateFailureRate={0.2}
              forcedOutcome={overrideOutcome}
            />
          </div>

          {/* Controller Triggers */}
          <div className="w-full pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400 font-mono">Test Simulator:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOverrideOutcome(null)}
                className={`px-2.5 py-1 rounded-md border text-[11px] transition ${
                  overrideOutcome === null
                    ? 'border-blue-500 bg-blue-500/20 text-blue-200'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                20% Random Fail
              </button>
              <button
                type="button"
                onClick={() => setOverrideOutcome('success')}
                className={`px-2.5 py-1 rounded-md border text-[11px] transition ${
                  overrideOutcome === 'success'
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-200'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                Force Success
              </button>
              <button
                type="button"
                onClick={() => setOverrideOutcome('error')}
                className={`px-2.5 py-1 rounded-md border text-[11px] transition ${
                  overrideOutcome === 'error'
                    ? 'border-rose-500 bg-rose-500/20 text-rose-200'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                Force Error
              </button>
            </div>
          </div>
        </div>

        {/* Motion Choreography Design Notes (Ödevin istediği açıklama) */}
        <section className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/40 text-xs space-y-3 leading-relaxed text-slate-300">
          <h3 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
            Motion Rationale & Choreography Notes
          </h3>
          <ul className="space-y-2 list-disc list-inside text-slate-400">
            <li>
              <strong className="text-slate-200">Idle / Hover / Press (150ms - 200ms easeOut):</strong> Hafif ölçeklenme (1.02) ve 0.98 tap geri bildirimi kullanıcının butonla fiziksel bağ hissini kuvvetlendirir.
            </li>
            <li>
              <strong className="text-slate-200">Loading State (220ms custom cubic-bezier):</strong> <code>y: -8</code> ve <code>opacity: 0</code> ile metin yukarı uçarken spinner merkezlenir; layout shifting'i önlemek için minimum yükseklik ve genişlik korunur.
            </li>
            <li>
              <strong className="text-slate-200">Success Morf (280ms spring-back curve):</strong> <code>[0.34, 1.56, 0.64, 1]</code> eğrisiyle checkmark ikonu hafif taşarak oturur (celebratory micro-bounce), 1.8s sonra kendiliğinden sakin bir şekilde idle haline geri döner.
            </li>
            <li>
              <strong className="text-slate-200">Error Shake & Accessibility:</strong> Hata durumunda 400ms süren yatay sarsılma (shake) ile dikkat çekilir. <code>prefers-reduced-motion</code> tespit edildiğinde sarsılma iptal edilir, yalnızca kırmızı durum rengi ve "Retry" ikonuyla erişilebilir görsel geri bildirim sunulur.
            </li>
          </ul>
        </section>

      </div>
    </main>
  );
}