'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/i18n/context';
import { SERVICES_DATA } from '@/data/servicesData';
import { DocumentChecklist } from '@/components/DocumentChecklist';
import { VoiceAssistButton } from '@/components/VoiceAssistButton';
import { RequestModal } from '@/components/RequestModal';
import {
  ShieldCheck,
  Clock,
  Coins,
  ArrowLeft,
  ExternalLink,
  PhoneCall,
  MessageCircle,
  Building2,
  CheckCircle2,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { language } = useI18n();
  const [modalOpen, setModalOpen] = useState(false);

  const service = SERVICES_DATA.find((s) => s.id === id);

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">
          {language === 'ta' ? 'சேவை விவரம் கிடைக்கவில்லை' : 'Service Not Found'}
        </h2>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ta' ? 'அனைத்து சேவைகளுக்கும் திரும்புக' : 'Back to All Services'}</span>
        </Link>
      </div>
    );
  }

  const audioText = `${service.name[language]}. ${service.description[language]}. தகுதி: ${service.eligibility[language].join(', ')}. தேவையான ஆவணங்கள்: ${service.documents[language].join(', ')}.`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb & Audio */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Link href="/" className="hover:text-emerald-800 font-medium">
            {language === 'ta' ? 'முகப்பு' : 'Home'}
          </Link>
          <span>/</span>
          <Link href="/services" className="hover:text-emerald-800 font-medium">
            {language === 'ta' ? 'சேவைகள்' : 'Services'}
          </Link>
          <span>/</span>
          <span className="font-bold text-slate-800 truncate max-w-[200px]">
            {service.name[language]}
          </span>
        </div>

        <VoiceAssistButton textToSpeak={audioText} size="sm" />
      </div>

      {/* Main Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-100 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>{service.department[language]}</span>
          </span>
          <span className="text-[11px] text-slate-400">
            {language === 'ta' ? 'கடைசியாக சரிபார்க்கப்பட்டது: ' : 'Verified on: '}
            {service.lastVerified}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
          {service.name[language]}
        </h1>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-4xl">
          {service.description[language]}
        </p>

        {/* Quick Facts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <Coins className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="block text-xs font-bold text-slate-500">
                {language === 'ta' ? 'அரசு நிர்ணயித்த கட்டணம்:' : 'Official Fee:'}
              </span>
              <span className="text-sm font-extrabold text-slate-900">
                {service.fee[language]}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="block text-xs font-bold text-slate-500">
                {language === 'ta' ? 'தோராயமான கால அவகாசம்:' : 'Estimated Turnaround:'}
              </span>
              <span className="text-sm font-extrabold text-slate-900">
                {service.timeEstimate[language]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (Content) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Eligibility Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-950 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span>{language === 'ta' ? 'யாரெல்லாம் விண்ணப்பிக்கலாம்? (தகுதிகள்)' : 'Who is Eligible?'}</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {service.eligibility[language].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Document Checklist */}
          <DocumentChecklist
            serviceTitle={service.name[language]}
            documents={service.documents[language]}
          />

          {/* Application Procedure (Online vs Centre) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-950">
              {language === 'ta' ? 'விண்ணப்பிக்கும் வழிமுறை' : 'Application Procedure'}
            </h2>

            {/* Offline Route (Murugesan's Centre) */}
            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-emerald-950">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>
                  {language === 'ta'
                    ? 'நால்ரோடு மக்கள் இ-சேவை மையம் வாயிலாக (நேரடி உதவி):'
                    : 'Via Nalroad Makkal e-Seva Centre (Assisted Route):'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-6">
                {service.offlineProcedure[language]}
              </p>
            </div>

            {/* Direct Government Online Route */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs sm:text-sm text-slate-800">
                  {language === 'ta' ? 'அதிகாரப்பூர்வ அரசு இணையதளம்:' : 'Official Government Portal:'}
                </span>
                <a
                  href={service.officialPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
                >
                  <span>{language === 'ta' ? 'இணையதளத்திற்கு செல்ல' : 'Visit Portal'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-xs text-slate-500 break-all">
                {service.officialPortal}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Local Centre Assistance Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-3xl p-6 sm:p-7 text-white shadow-lg space-y-5 sticky top-28">
            <div className="space-y-2">
              <span className="inline-block bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                {language === 'ta' ? 'நேரடி உதவி' : 'Direct Assistance'}
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                {language === 'ta' ? 'நால்ரோடு மையத்தில் விண்ணப்பிக்க வேண்டுமா?' : 'Apply with Centre Help?'}
              </h3>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                {language === 'ta'
                  ? 'ஆவணங்களை தயார் செய்து மையத்திற்கு கொண்டு வாருங்கள் அல்லது உதவி கோரிக்கையை இங்கேயே பதிவு செய்யுங்கள். ஆபரேட்டர் முருகேசன் கே உங்களை வழிநடத்துவார்.'
                  : 'Bring your documents to Nalroad centre or book assistance online. Operator Murugesan K will guide you.'}
              </p>
            </div>

            {/* Operator Details */}
            <div className="p-3.5 bg-emerald-900/80 rounded-2xl border border-emerald-700 text-xs space-y-1 text-emerald-100">
              <p className="font-bold text-white text-sm">
                முருகேசன் கே (Murugesan K)
              </p>
              <p>நால்ரோடு மக்கள் இ-சேவை மையம்</p>
              <p className="text-emerald-300">பெரியாக்கோட்டை (624614)</p>
            </div>

            {/* Direct Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={() => setModalOpen(true)}
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow transition-all flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-slate-950" />
                <span>{language === 'ta' ? 'உதவி கோரிக்கை பதிவு செய்க' : 'Submit Assistance Request'}</span>
              </button>

              <a
                href="tel:9790382437"
                className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm border border-emerald-500 transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-emerald-300" />
                <span>{language === 'ta' ? 'உடனே அழைக்க (97903 82437)' : 'Call 97903 82437'}</span>
              </a>

              <a
                href={`https://wa.me/919790382437?text=${encodeURIComponent(
                  `வணக்கம் முருகேசன் அவர்களே, பெரியாக்கோட்டை டிஜிட்டல் சேவை மூலம் ${service.name[language]} பற்றி உதவி தேவைப்படுகிறது.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>

            <div className="pt-2 text-[11px] text-emerald-300/80 text-center leading-tight">
              {language === 'ta'
                ? 'அரசு நிர்ணயித்த கட்டணங்கள் மட்டுமே வசூலிக்கப்படும்.'
                : 'Transparent and government-approved fee structure only.'}
            </div>
          </div>
        </div>
      </div>

      <RequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceId={service.id}
        serviceName={service.name[language]}
      />
    </div>
  );
}
