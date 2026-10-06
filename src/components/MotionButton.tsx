'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Send, Check, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

export type ButtonStatus = 'idle' | 'loading' | 'success' | 'error';

interface MotionButtonProps {
  onClick?: () => Promise<void>;
  simulateFailureRate?: number; // 0.20 = 20% hata simülasyonu
  forcedOutcome?: 'success' | 'error' | null;
  label?: string;
  className?: string;
}

export function MotionButton({
  simulateFailureRate = 0.2,
  forcedOutcome = null,
  label = 'Send Message',
  className = '',
}: MotionButtonProps) {
  const [status, setStatus] = useState<ButtonStatus>('idle');
  const shouldReduceMotion = useReducedMotion();

  const handleClick = async () => {
    if (status === 'loading') return; // Spam tıklamayı engeller

    setStatus('loading');

    // Sahte asenkron işlem (1200ms - 1800ms arası)
    const delay = Math.floor(Math.random() * 600) + 1200;
    await new Promise((resolve) => setTimeout(resolve, delay));

    let isSuccess = Math.random() >= simulateFailureRate;
    if (forcedOutcome === 'success') isSuccess = true;
    if (forcedOutcome === 'error') isSuccess = false;

    if (isSuccess) {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
      }, 1800);
    } else {
      setStatus('error');
    }
  };

  // Titreme (Shake) animasyonu: prefers-reduced-motion açıksa animasyon pasif
  const shakeAnimation =
    status === 'error' && !shouldReduceMotion
      ? { x: [0, -6, 6, -4, 4, -2, 2, 0] }
      : { x: 0 };

  const getThemeColors = () => {
    switch (status) {
      case 'loading':
        return 'bg-blue-700/80 border-blue-500/40 text-blue-100 shadow-md';
      case 'success':
        return 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-500/20 shadow-lg';
      case 'error':
        return 'bg-rose-600 border-rose-400 text-white shadow-rose-500/20 shadow-lg';
      case 'idle':
      default:
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-blue-400/30 text-white shadow-blue-500/25 shadow-md';
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      animate={shakeAnimation}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      whileHover={status === 'idle' && !shouldReduceMotion ? { scale: 1.02 } : {}}
      whileTap={status === 'idle' && !shouldReduceMotion ? { scale: 0.98 } : {}}
      aria-live="polite"
      aria-busy={status === 'loading'}
      aria-label={status === 'idle' ? label : `${label} is ${status}`}
      className={`relative inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-xl border text-xs sm:text-sm font-medium tracking-wide transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${getThemeColors()} ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {status === 'idle' && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2"
          >
            <span>{label}</span>
            <Send className="w-4 h-4 opacity-90" />
          </motion.span>
        )}

        {status === 'loading' && (
          <motion.span
            key="loading"
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 font-mono text-xs"
          >
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Processing...</span>
          </motion.span>
        )}

        {status === 'success' && (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
            transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex items-center gap-2 font-semibold"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Completed!</span>
          </motion.span>
        )}

        {status === 'error' && (
          <motion.span
            key="error"
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 font-medium"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Failed. Retry?</span>
            <RefreshCw className="w-3.5 h-3.5 opacity-80" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}