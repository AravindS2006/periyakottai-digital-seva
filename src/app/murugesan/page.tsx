'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n/context';
import {
  Phone,
  PhoneCall,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Award,
  FileText,
  UserCheck,
  Building2,
  Lock,
  ChevronRight,
  HeartHandshake,
  Sparkles
} from 'lucide-react';

export default function MurugesanProfilePage() {
  const { language } = useI18n();

  const services = [
    {
      name: { ta: 'பட்டா பெயர் மாற்றம் & சிட்டா/அடங்கல் நகல்', en: 'Patta Transfer & Chitta/Adangal' },
      time: { ta: '15 முதல் 30 நாட்கள்', en: '15 - 30 Days' },
      fee: '₹60'
    },
    {
      name: { ta: 'வருமானம், சாதி, இருப்பிடம் & வாரிசு சான்றிதழ்கள்', en: 'Income, Community, Nativity & Legal Heir' },
      time: { ta: '7 முதல் 15 நாட்கள்', en: '7 - 15 Days' },
      fee: '₹60'
    },
    {
      name: { ta: 'PM கிசான் பதிவு, e-KYC கைரேகை & NPCI வங்கி இணைப்பு', en: 'PM-KISAN e-KYC & NPCI Bank Seeding' },
      time: { ta: 'உடனடி ஒப்புதல்', en: 'Instant' },
      fee: '₹30'
    },
    {
      name: { ta: 'புதிய ஸ்மார்ட் குடும்ப அட்டை & பெயர் சேர்த்தல்/நீக்கல்', en: 'Smart Ration Card & Member Changes' },
      time: { ta: '15 முதல் 30 நாட்கள்', en: '15 - 30 Days' },
      fee: '₹60'
    },
    {
      name: { ta: 'கலைஞர் மகளிர் உரிமைத் திட்டம் (KMUT) மனு & மேல்முறையீடு', en: 'Magalir Urimai Thogai Appeals' },
      time: { ta: 'அரசு வழிகாட்டுதல்படி', en: 'Per Govt Schedule' },
      fee: 'அரசு சேவை'
    },
    {
      name: { ta: 'ஆதார் முகவரி திருத்தம் & PVC பிளாஸ்டிக் ஸ்மார்ட் கார்டு', en: 'Aadhaar Address Update & PVC Card' },
      time: { ta: 'உடனடி பதிவு', en: 'Instant Processing' },
      fee: '₹50'
    },
    {
      name: { ta: 'தோட்டக்கலை 100% சொட்டு நீர் பாசன மானிய பதிவு', en: '100% Drip Irrigation Subsidy Reg' },
      time: { ta: 'வட்டார தோட்டக்கலை ஒப்புதல்', en: 'Block Approval' },
      fee: 'இலவச வழிகாட்டல்'
    },
    {
      name: { ta: 'புதிய பான் கார்டு (PAN Card) விண்ணப்பம் & திருத்தம்', en: 'New PAN Card & Corrections' },
      time: { ta: '3 முதல் 7 நாட்கள் (e-PAN)', en: '3 - 7 Days' },
      fee: '₹107 + சேவைக்கட்டணம்'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-emerald-800">
            {language === 'ta' ? 'முகப்பு' : 'Home'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/csc-centre" className="hover:text-emerald-800">
            {language === 'ta' ? 'இ-சேவை மையம்' : 'e-Seva Centre'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-bold">முருகேசன் கே (Murugesan K)</span>
        </nav>

        {/* Hero Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-emerald-500 shadow-lg relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
            {/* Real Photograph with Badges */}
            <div className="relative shrink-0 text-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-4 border-emerald-600 shadow-xl bg-slate-100">
                <img
                  src="/images/murugesan.jpg"
                  alt="முருகேசன் கே - நால்ரோடு மக்கள் இ-சேவை மையம்"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>e-Seva: EFADGL0636</span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-black">
                <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  {language === 'ta'
                    ? 'நால்ரோடு மக்கள் இ-சேவை மையம் — பெரியாக்கோட்டை'
                    : 'Nalroad Makkal e-Seva Centre — Periyakottai'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                {language === 'ta' ? 'முருகேசன் கே' : 'Murugesan K'}
              </h1>

              <p className="text-sm sm:text-base font-bold text-emerald-800">
                {language === 'ta'
                  ? 'அங்கீகரிக்கப்பட்ட இ-சேவை ஆபரேட்டர் & கிராம பொது சேவை ஒருங்கிணைப்பாளர்'
                  : 'Authorized e-Sevai CSC Operator & Village Digital Coordinator'}
              </p>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                {language === 'ta'
                  ? 'பெரியாக்கோட்டை, நால்ரோடு, தேவத்தூர் மற்றும் ஒட்டன்சத்திரம் வட்டார பொதுமக்களுக்கும், விவசாயிகளுக்கும் அரசு சேவைகளை துல்லியமாகவும், குறைந்த செலவிலும், இடைத்தரகர்கள் இன்றியும் பெற்றுத்தரும் மக்கள் சேவை.'
                  : 'Dedicated to serving the citizens and farming community of Periyakottai, Nalroad, and Oddanchatram taluk by providing transparent, error-free digital government services without middlemen.'}
              </p>

              {/* Verified Contact Chips */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs text-slate-700">
                <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl font-bold">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>+91 97903 82437</span>
                </span>
                <a
                  href="https://maps.app.goo.gl/kDxy1NXkBNCYcAZEA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-xl font-medium border border-emerald-200 transition-colors"
                  title="Google மேப்பில் இருப்பிடம் பார்க்க"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>நால்ரோடு சந்திப்பு, 624614 (Google Map ↗)</span>
                </a>
                <a
                  href="https://www.facebook.com/murugesan.odc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-xl font-bold border border-blue-200 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>facebook.com/murugesan.odc</span>
                </a>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <a
                  href="tel:9790382437"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-300 animate-pulse" />
                  <span>{language === 'ta' ? 'உடனே அழைக்க: 97903 82437' : 'Call: 97903 82437'}</span>
                </a>

                <a
                  href="https://maps.app.goo.gl/kDxy1NXkBNCYcAZEA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-sky-200" />
                  <span>{language === 'ta' ? 'Google மேப் வழி' : 'Get Directions'}</span>
                </a>

                <a
                  href="https://wa.me/919790382437?text=வணக்கம்%20முருகேசன்%20அவர்களே,%20பெரியாக்கோட்டை%20டிஜிட்டல்%20சேவை%20வழியாக%20தொடர்பு%20கொள்கிறேன்."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp உதவி</span>
                </a>

                <Link
                  href="/operator"
                  className="bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs sm:text-sm px-4 py-3 rounded-xl shadow transition-all flex items-center gap-2 border border-slate-700"
                >
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>{language === 'ta' ? 'ஆபரேட்டர் போர்டல்' : 'Operator Portal'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Centre Details & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              {language === 'ta' ? 'இயங்கும் நேரம்' : 'Working Hours'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>{language === 'ta' ? 'திங்கள் - சனி:' : 'Mon - Sat:'}</strong> {language === 'ta' ? 'காலை 9:30 முதல் மாலை 5:00 வரை' : '9:30 AM - 5:00 PM'}<br />
              <strong className="text-rose-700">{language === 'ta' ? 'ஞாயிறு:' : 'Sunday:'}</strong> {language === 'ta' ? 'விடுமுறை' : 'Holiday'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              {language === 'ta' ? 'முதியோர் & மாற்றுத்திறனாளி உதவி' : 'Elderly Doorstep Help'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ta'
                ? 'நேரில் வர முடியாத முதியோர்கள் மற்றும் மாற்றுத்திறனாளிகளுக்கு அவர்களின் இல்லத்திற்கே சென்று கைரேகை e-KYC மற்றும் ஆவண சரிபார்ப்பு செய்யப்படுகிறது.'
                : 'Home biometric authentication and document verification assistance for elderly pensioners and persons with disabilities.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              {language === 'ta' ? 'அரசு அங்கீகாரம் & கட்டண வெளிப்படைத்தன்மை' : 'Transparent Govt Rates'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ta'
                ? 'தமிழ்நாடு அரசு e-Sevai மற்றும் மத்திய CSC விதிமுறைகளின்படி வெளிப்படையான கட்டண ரசீதுடன் சேவைகள் வழங்கப்படுகின்றன.'
                : 'Transparent official billing and receipts for every service as mandated by Tamil Nadu e-Governance Agency.'}
            </p>
          </div>
        </div>

        {/* Services & Tariff Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-slate-950 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-700" />
              <span>{language === 'ta' ? 'மையத்தில் வழங்கப்படும் முக்கிய சேவைகள்' : 'Services & Government Fees'}</span>
            </h2>
            <span className="text-xs text-slate-500 font-bold">TNeGA அங்கீகாரம்</span>
          </div>

          <div className="divide-y divide-slate-100">
            {services.map((s, idx) => (
              <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{s.name[language]}</h4>
                    <p className="text-[11px] text-slate-500">
                      {language === 'ta' ? 'மதிப்பிடப்பட்ட நேரம்: ' : 'Time Estimate: '}{s.time[language]}
                    </p>
                  </div>
                </div>
                <div className="sm:text-right pl-6 sm:pl-0">
                  <span className="inline-block bg-emerald-50 text-emerald-900 border border-emerald-200 font-extrabold text-xs px-2.5 py-1 rounded-lg">
                    {s.fee}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location & Map Card */}
        <div className="bg-gradient-to-r from-emerald-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-black">
              {language === 'ta' ? 'மையத்திற்கு நேரில் வருகிறீர்களா?' : 'Visiting the Centre in Person?'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200 max-w-xl leading-relaxed">
              {language === 'ta'
                ? 'நால்ரோடு பேருந்து நிறுத்தம் மற்றும் பெரியாக்கோட்டை சந்திப்பு அருகில் நமது மையம் அமைந்துள்ளது. அசல் ஆவணங்களுடன் (ஆதார், குடும்ப அட்டை, நிலப் பத்திரம்) வரவும்.'
                : 'Conveniently situated next to Nalroad bus stop & Periyakottai junction. Bring original documents (Aadhaar, ration card, land deed) for instant processing.'}
            </p>
            <p className="text-xs font-semibold text-amber-300 flex items-center justify-center md:justify-start gap-1 pt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>நால்ரோடு சந்திப்பு, பெரியாக்கோட்டை அஞ்சல், ஒட்டன்சத்திரம் தாலுகா, திண்டுக்கல் மாவட்டம் - 624614</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <a
              href="https://maps.app.goo.gl/kDxy1NXkBNCYcAZEA"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-slate-100 text-slate-950 font-black px-5 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow"
            >
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>{language === 'ta' ? 'Google மேப்பில் வழித்தடம்' : 'Open in Google Maps'}</span>
            </a>
            <a
              href="tel:9790382437"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{language === 'ta' ? 'வழிகாட்ட அழைக்க' : 'Call for Directions'}</span>
            </a>
            <Link
              href="/operator"
              className="bg-emerald-950 hover:bg-emerald-800 text-emerald-100 font-bold px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-emerald-700 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'ta' ? 'ஆபரேட்டர் மேலாண்மை' : 'Operator Portal'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
