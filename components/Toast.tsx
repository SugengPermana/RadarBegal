"use client";

import { useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = 'success', onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-4 fade-in">
      <div
        className={`flex items-center gap-3 px-5 py-3 rounded-xl border shadow-2xl backdrop-blur-md ${type === 'success'
            ? 'bg-teal-950/95 border-teal-500/40 text-teal-100'
            : 'bg-red-950/95 border-red-500/40 text-red-100'
          }`}
      >
        {type === 'success' ? (
          <CheckCircle2 className="w-5 h-5 shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 shrink-0" />
        )}
        <p className="text-sm font-medium max-w-xs">{message}</p>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
