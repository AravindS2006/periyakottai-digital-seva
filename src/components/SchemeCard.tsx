'use client';

import React, { useState } from 'react';
import { useI18n } from '@/i18n/context';
import { Scheme } from '@/types';
import { Sparkles, ExternalLink, FileText, CheckCircle2, UserCheck } from 'lucide-react';
import { VoiceAssistButton } from './VoiceAssistButton';
import { RequestModal } from './RequestModal';

interface SchemeCardProps {
  scheme: Scheme;
}

export function SchemeCard({ scheme }: SchemeCardProps) {
  const { language } = useI18n();
  const [modalOpen, setModalOpen] = useState(false);

  const audioText = `${scheme.name[language]}. பலன்: ${scheme.benefit[language]}. யாருக்கு: ${scheme.targetAudience[language]}. விண்ணப்பிக்க நால்ரோடு மக்கள் இ-சேவை மையத்தை அணுகலாம்.`;

  return (
    <>
      <div className="bg-white rounded-3xl border-2 border-emerald-100/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all p-6 flex flex-col justify-between">
        <div>
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full">
              {scheme.sponsor}
            </span>
            <VoiceAssistButton textToSpeak={audioText} size="sm" />
          </div>

          {/* Scheme Title */}
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
            {scheme.name[language]}
          </h3>

          {/* Key Benefit Pill */}
          <div className="mt-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div className="flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-emerald-900 block">
                  {language === 'ta' ? 'திட்டப் பயன் / உதவித்தொகை:' : 'Key Benefit:'}
                </span>
                <span className="text-sm font-extrabold text-emerald-800">
                  {scheme.benefit[language]}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
            {scheme.description[language]}
          </p>

          {/* Target Audience */}
          <div className="mt-4 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900">
              {language === 'ta' ? 'யாருக்கு பொருந்தும்: ' : 'Target Audience: '}
            </span>
            <span>{scheme.targetAudience[language]}</span>
          </div>

          {/* Required Documents */}
          <div className="mt-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'ta' ? 'தேவையான முக்கிய ஆவணங்கள்:' : 'Required Documents:'}</span>
            </span>
            <ul className="space-y-1">
              {scheme.documents[language].slice(0, 3).map((doc, idx) => (
                <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <a
            href={scheme.officialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-slate-600 hover:text-emerald-800 inline-flex items-center gap-1 transition-colors"
          >
            <span>{language === 'ta' ? 'அரசு போர்ட்டல்' : 'Official Portal'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors ml-auto"
          >
            <UserCheck className="w-4 h-4" />
            <span>{language === 'ta' ? 'மைய உதவி பெற' : 'Apply with Centre Help'}</span>
          </button>
        </div>
      </div>

      <RequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceId={scheme.id}
        serviceName={scheme.name[language]}
      />
    </>
  );
}
