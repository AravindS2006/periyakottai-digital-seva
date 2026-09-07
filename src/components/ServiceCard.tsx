'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n/context';
import { Service } from '@/types';
import { ShieldCheck, Clock, FileCheck, ArrowRight, UserCheck } from 'lucide-react';
import { VoiceAssistButton } from './VoiceAssistButton';
import { RequestModal } from './RequestModal';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { language } = useI18n();
  const [modalOpen, setModalOpen] = useState(false);

  const audioText = `${service.name[language]}. ${service.description[language]}. தேவையான ஆவணங்கள்: ${service.documents[language].slice(0, 3).join(', ')}.`;

  return (
    <>
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all p-5 flex flex-col justify-between group">
        <div>
          {/* Badges & Audio */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>{service.department[language]}</span>
            </span>

            <VoiceAssistButton textToSpeak={audioText} size="sm" />
          </div>

          {/* Service Title */}
          <Link href={`/services/${service.id}`} className="block group-hover:text-emerald-700 transition-colors">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {service.name[language]}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {service.description[language]}
          </p>

          {/* Key Facts */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="whitespace-nowrap">{service.timeEstimate[language]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="whitespace-nowrap">
                {service.documents[language].length} {language === 'ta' ? 'ஆவணங்கள்' : 'Documents'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <Link
            href={`/services/${service.id}`}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 py-1.5"
          >
            <span>{language === 'ta' ? 'விவரம்' : 'Details'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'மைய உதவி' : 'Get Help'}</span>
          </button>
        </div>
      </div>

      <RequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceId={service.id}
        serviceName={service.name[language]}
      />
    </>
  );
}
