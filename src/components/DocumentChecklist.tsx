'use client';

import React, { useState } from 'react';
import { useI18n } from '@/i18n/context';
import { CheckSquare, Square, Share2, Printer, CheckCircle2, UserCheck } from 'lucide-react';
import { RequestModal } from './RequestModal';

interface DocumentChecklistProps {
  serviceTitle: string;
  documents: string[];
}

export function DocumentChecklist({ serviceTitle, documents }: DocumentChecklistProps) {
  const { language } = useI18n();
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const total = documents.length;
  const readyCount = Object.values(checkedItems).filter(Boolean).length;
  const isAllReady = readyCount === total && total > 0;

  const handleShareWhatsApp = () => {
    const text = `*${serviceTitle} - தேவையான ஆவணங்கள்:*\n` +
      documents.map((doc, idx) => `${checkedItems[idx] ? '✅' : '☐'} ${doc}`).join('\n') +
      `\n\nநால்ரோடு மக்கள் இ-சேவை மையம் (முருகேசன்: 9790382437)`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-emerald-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            {language === 'ta' ? 'தேவையான ஆவணங்கள் சரிபார்ப்பு பட்டியல்' : 'Required Documents Checklist'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'ta'
              ? 'உங்களிடம் உள்ள ஆவணங்களை கிளிக் செய்து சரிபார்க்கவும்'
              : 'Tick the documents you have ready before visiting the centre'}
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
            isAllReady ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-900'
          }`}>
            {readyCount} / {total} {language === 'ta' ? 'தயாராக உள்ளது' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Checklist items */}
      <div className="mt-4 space-y-2.5">
        {documents.map((doc, idx) => {
          const isChecked = !!checkedItems[idx];
          return (
            <div
              key={idx}
              onClick={() => toggleCheck(idx)}
              className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer select-none transition-all ${
                isChecked
                  ? 'bg-emerald-50/80 border-emerald-300 text-slate-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isChecked ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <span className={`text-xs sm:text-sm font-medium ${isChecked ? 'line-through text-slate-500' : ''}`}>
                {doc}
              </span>
            </div>
          );
        })}
      </div>

      {/* Completion Alert */}
      {isAllReady && (
        <div className="mt-4 p-3 bg-emerald-100 border border-emerald-300 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-950 font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>
            {language === 'ta'
              ? 'அனைத்து ஆவணங்களும் தயார்! இப்போது நால்ரோடு மக்கள் இ-சேவை மையத்திற்கு எடுத்துச் செல்லலாம்.'
              : 'All documents ready! You can now visit Nalroad e-Seva Centre for application.'}
          </span>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 text-xs font-bold text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-xl border border-green-200 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden xs:inline">{language === 'ta' ? 'அச்சிடுக' : 'Print'}</span>
          </button>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-xs transition-colors ml-auto"
        >
          <UserCheck className="w-4 h-4" />
          <span>{language === 'ta' ? 'விண்ணப்பிக்க மைய உதவி' : 'Book Centre Help'}</span>
        </button>
      </div>

      <RequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceName={serviceTitle}
      />
    </div>
  );
}
