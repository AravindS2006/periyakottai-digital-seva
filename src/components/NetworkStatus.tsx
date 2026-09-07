'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, PhoneCall, X } from 'lucide-react';
import { useI18n } from '@/i18n/context';

export function NetworkStatus() {
  const { language } = useI18n();
  const [isOnline, setIsOnline] = useState(true);
  const [showRestored, setShowRestored] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine);
    }

    const handleOnline = () => {
      setIsOnline(true);
      setShowRestored(true);
      setDismissed(false);
      const timer = setTimeout(() => setShowRestored(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showRestored) return null;
  if (dismissed && !showRestored) return null;

  if (showRestored) {
    return (
      <div className="bg-emerald-700 text-white text-xs py-1.5 px-4 flex items-center justify-between shadow-md transition-all animate-in slide-in-from-top duration-300">
        <div className="max-w-7xl mx-auto flex items-center gap-2 font-semibold">
          <Wifi className="w-4 h-4 text-emerald-200" />
          <span>
            {language === 'ta'
              ? 'இணைய இணைப்பு மீண்டும் கிடைத்தது (Online)'
              : 'Internet connection restored (Online)'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="bg-amber-500 text-slate-950 text-xs py-2 px-3 sm:px-4 shadow-md transition-all border-b border-amber-600 animate-in slide-in-from-top duration-300"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-bold">
          <WifiOff className="w-4 h-4 text-slate-950 shrink-0 animate-pulse" />
          <span>
            {language === 'ta'
              ? 'ஆஃப்லைன் முறை: இணைய இணைப்பு இல்லை. ஏற்கனவே சேமிக்கப்பட்ட தகவல்கள் கிடைக்கும்.'
              : 'Offline Mode: No internet connection. Cached pages and contacts are available.'}
          </span>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <a
            href="tel:9790382437"
            className="inline-flex items-center gap-1.5 bg-slate-950 text-white hover:bg-slate-900 px-3 py-1 rounded-lg font-bold text-[11px] transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'ta' ? 'ஆபரேட்டரை அழைக்க: 97903 82437' : 'Call: 97903 82437'}</span>
          </a>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-900 hover:text-slate-950 hover:bg-amber-400 rounded transition-colors"
            aria-label="Dismiss offline banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
