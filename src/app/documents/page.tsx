'use client';

import React, { useState } from 'react';
import { useI18n } from '@/i18n/context';
import { SERVICES_DATA } from '@/data/servicesData';
import { DocumentChecklist } from '@/components/DocumentChecklist';
import { VoiceAssistButton } from '@/components/VoiceAssistButton';
import { FileCheck, Search, ShieldCheck } from 'lucide-react';

export default function DocumentsPage() {
  const { language } = useI18n();
  const [selectedServiceId, setSelectedServiceId] = useState('income_certificate');

  const selectedService = SERVICES_DATA.find((s) => s.id === selectedServiceId) || SERVICES_DATA[0];

  const audioIntro =
    language === 'ta'
      ? 'ஆவண வழிகாட்டி. நீங்கள் பெற விரும்பும் சான்றிதழை தேர்வு செய்து, அதற்கு தேவையான அசல் ஆவணங்களை சரிபார்த்துக் கொள்ளுங்கள். இந்த பட்டியலை வாட்ஸ்அப்பிலும் சேமிக்கலாம்.'
      : 'Document checklist guide. Choose your desired certificate to review the verified list of required documents.';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-bold">
          <FileCheck className="w-4 h-4 text-emerald-700" />
          <span>{language === 'ta' ? 'ஆவண சரிபார்ப்பு வழிகாட்டி' : 'Document Assistant'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950">
          {language === 'ta' ? 'எனக்கு என்னென்ன ஆவணங்கள் தேவை?' : 'What Documents Do I Need?'}
        </h1>
        <p className="text-xs sm:text-base text-slate-600 max-w-xl mx-auto">
          {language === 'ta'
            ? 'இ-சேவை மையத்திற்கு செல்லும் முன் தேவையான ஆவணங்களை முன்கூட்டியே சரிபார்த்து ஒரே நடையில் வேலையை முடியுங்கள்.'
            : 'Select any certificate or service to see the verified checklist of required documents before visiting the centre.'}
        </p>

        <div className="pt-2 flex justify-center">
          <VoiceAssistButton textToSpeak={audioIntro} size="sm" />
        </div>
      </div>

      {/* Service Selector Grid */}
      <div className="space-y-3">
        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
          {language === 'ta' ? 'தேவையான சான்றிதழைத் தேர்ந்தெடுக்கவும்:' : 'Select Desired Certificate / Service:'}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {SERVICES_DATA.map((srv) => (
            <button
              key={srv.id}
              onClick={() => setSelectedServiceId(srv.id)}
              className={`p-3 rounded-2xl border-2 text-left text-xs font-bold transition-all ${
                selectedServiceId === srv.id
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs ring-2 ring-emerald-200'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
              }`}
            >
              <span className="line-clamp-2">{srv.name[language]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Checklist Box */}
      <div className="pt-4">
        <DocumentChecklist
          serviceTitle={selectedService.name[language]}
          documents={selectedService.documents[language]}
        />
      </div>

      {/* Note on official verification */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
        <span className="font-bold text-slate-800 block">
          {language === 'ta' ? 'அதிகாரப்பூர்வ தகவல்:' : 'Official Note:'}
        </span>
        <p>
          {language === 'ta'
            ? 'இந்த ஆவணப் பட்டியல் தமிழ்நாடு இ-சேவை மற்றும் வருவாய்த் துறையின் அதிகாரப்பூர்வ விதிமுறைகளின்படி தொகுக்கப்பட்டுள்ளது. விண்ணப்பிக்கும் போது அசல் ஆவணங்களை கொண்டு வருவது நல்லது.'
            : 'This document checklist reflects verified Tamil Nadu Revenue & e-Sevai department mandates. Bringing original documents enables instant scanning and verification.'}
        </p>
      </div>
    </div>
  );
}
