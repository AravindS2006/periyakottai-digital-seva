'use client';

import React, { useState } from 'react';
import { useI18n } from '@/i18n/context';
import { PhoneCall, MessageCircle, HelpCircle, X, Check } from 'lucide-react';

export function FloatingHelpButton() {
  const { language } = useI18n();
  const [expanded, setExpanded] = useState(false);

  return (
    <aside aria-label={language === 'ta' ? 'உதவி தொடர்புகள்' : 'Help Contacts'} className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Expanded Menu */}
      {expanded && (
        <div className="mb-3 bg-white rounded-2xl shadow-2xl border-2 border-emerald-500 p-4 w-72 sm:w-80 text-slate-800 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <p className="font-extrabold text-sm text-emerald-950">
                {language === 'ta' ? 'உதவி வேண்டுமா?' : 'Need Assistance?'}
              </p>
              <p className="text-xs text-slate-500">
                {language === 'ta' ? 'நால்ரோடு மக்கள் இ-சேவை மையம்' : 'Nalroad Makkal e-Seva Centre'}
              </p>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Close help menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3 space-y-2.5">
            {/* Operator Info */}
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-xs">
              <p className="font-bold text-emerald-900">
                {language === 'ta' ? 'முருகேசன் கு (ஆபரேட்டர்)' : 'Murugesan K (Operator)'}
              </p>
              <p className="text-emerald-700">
                {language === 'ta' ? 'நேரம்: காலை 9:30 - மாலை 5:00 (ஞாயிறு விடுமுறை)' : 'Hours: 9:30 AM - 5:00 PM (Sun Holiday)'}
              </p>
            </div>

            {/* Action 1: Call */}
            <a
              href="tel:9790382437"
              className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 px-4 rounded-xl text-sm font-bold shadow-sm transition-all"
            >
              <PhoneCall className="w-4 h-4 text-emerald-200" />
              <span>{language === 'ta' ? 'உடனே அழைக்க (97903 82437)' : 'Direct Call (97903 82437)'}</span>
            </a>

            {/* Action 2: WhatsApp */}
            <a
              href="https://wa.me/919790382437?text=வணக்கம்%20முருகேசன்%20அவர்களே,%20எனக்கு%20அரசு%20சேவை%20தொடர்பான%20உதவி%20தேவைப்படுகிறது."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-xl text-sm font-bold shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>{language === 'ta' ? 'வாட்ஸ்அப் செய்தி அனுப்ப' : 'Chat on WhatsApp'}</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-3 rounded-full shadow-2xl border-2 border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all hover:scale-105"
        aria-expanded={expanded}
        aria-label="Direct help options"
      >
        {expanded ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <div className="relative">
              <PhoneCall className="w-6 h-6 text-emerald-200 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-emerald-700"></span>
            </div>
            <div className="text-left font-bold leading-tight">
              <span className="block text-xs text-emerald-200">
                {language === 'ta' ? 'உதவிக்கு அழைக்க' : 'Get Help'}
              </span>
              <span className="text-sm">97903 82437</span>
            </div>
          </>
        )}
      </button>
    </aside>
  );
}
