'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n/context';
import { VoiceAssistButton } from '@/components/VoiceAssistButton';
import {
  Building2,
  PhoneCall,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Calendar,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { RequestTicket } from '@/types';

export default function CSCCentrePage() {
  const { language } = useI18n();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('பெரியாக்கோட்டை (Periyakottai)');
  const [serviceName, setServiceName] = useState('வருமான / சாதி சான்றிதழ்');
  const [description, setDescription] = useState('');
  const [doorstep, setDoorstep] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<RequestTicket | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [centreStatus, setCentreStatus] = useState<string>('open');
  const [statusNote, setStatusNote] = useState<string>('');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          if (data.settings.centreStatus) setCentreStatus(data.settings.centreStatus);
          if (data.settings.statusNote?.[language]) setStatusNote(data.settings.statusNote[language]);
        }
      })
      .catch((err) => console.error('Error fetching settings in csc-centre:', err));
  }, [language]);

  const audioIntro =
    language === 'ta'
      ? 'நால்ரோடு மக்கள் இ-சேவை மையம், பெரியாக்கோட்டை. ஆபரேட்டர் முருகேசன் கே. செல்போன்: 97903 82437. பட்டா, சான்றிதழ்கள், குடும்ப அட்டை மற்றும் அனைத்து அரசு ஆன்லைன் சேவைகளும் அரசு நிர்ணயித்த கட்டணத்தில் செய்து தரப்படும்.'
      : 'Nalroad Makkal e-Seva Centre, Periyakottai. Operated by Murugesan K. Phone: 9790382437. All government certificates, patta transfer, and Aadhaar services assisted at transparent rates.';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError(language === 'ta' ? 'பெயர் மற்றும் மொபைல் எண் அவசியம்.' : 'Name and mobile number are required.');
      return;
    }

    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      setError(language === 'ta' ? 'சரியான 10 இலக்க செல்போன் எண்ணை உள்ளிடவும்.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizenName: name.trim(),
          phoneNumber: phone.trim(),
          village,
          serviceId: 'centre_appointment',
          serviceName: doorstep ? `${serviceName} (வீட்டுக்கே வந்து உதவி)` : serviceName,
          description,
          priority: doorstep ? 'Urgent' : 'Normal',
          status: 'Submitted'
        })
      });

      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setCreatedTicket(data);
    } catch {
      setError(
        language === 'ta'
          ? 'கோரிக்கை பதிவாகவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும் அல்லது மையத்தை நேரடியாக அழைக்கவும்.'
          : 'Could not submit request. Please retry or call the centre directly.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const copyId = () => {
    if (!createdTicket) return;
    navigator.clipboard.writeText(createdTicket.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-6 border-2 border-emerald-600">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 text-xs font-black uppercase px-3.5 py-1 rounded-full shadow-xs">
              <Building2 className="w-4 h-4" />
              <span>{language === 'ta' ? 'இ-சேவை மைய நேரடி வழிகாட்டி' : 'Local CSC Centre Hub'}</span>
            </div>
            <span className="bg-emerald-950 text-amber-300 border border-emerald-600 text-xs font-black px-3 py-0.5 rounded-full">
              e-Sevai ID: EFADGL0636
            </span>
            <span
              className={`text-xs font-black px-3 py-0.5 rounded-full border whitespace-nowrap ${
                centreStatus === 'open'
                  ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400'
                  : centreStatus === 'temp_closed'
                  ? 'bg-orange-500/20 text-orange-200 border-orange-400'
                  : centreStatus === 'camp'
                  ? 'bg-amber-500/20 text-amber-200 border-amber-400'
                  : 'bg-rose-500/20 text-rose-200 border-rose-400'
              }`}
            >
              {centreStatus === 'open'
                ? '🟢 திறந்துள்ளது (Open)'
                : centreStatus === 'temp_closed'
                ? '🟠 வெளியே சென்றுள்ளார் (Away)'
                : centreStatus === 'camp'
                ? '🟡 கள முகாம் (Field Camp)'
                : '🔴 மூடப்பட்டுள்ளது (Closed)'}
            </span>
          </div>

          <VoiceAssistButton textToSpeak={audioIntro} size="sm" />
        </div>

        {/* Operator Profile Row */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative shrink-0">
            <img
              src="/images/murugesan.jpg"
              alt="முருகேசன் கே - நால்ரோடு மக்கள் இ-சேவை மையம்"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-amber-400 shadow-xl"
            />
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {language === 'ta' ? 'நால்ரோடு மக்கள் இ-சேவை மையம்' : 'Nalroad Makkal e-Seva Maiyam'}
            </h1>
            <p className="text-sm sm:text-base text-emerald-200 font-bold">
              {language === 'ta'
                ? 'மைய நிறுவனர் & ஆபரேட்டர்: முருகேசன் குப்புசாமி (முருகேசன் கே)'
                : 'Founder & Centre Operator: Murugesan Kuppusamy (Murugesan K)'}
            </p>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
              {language === 'ta'
                ? 'பெரியாக்கோட்டை, நால்ரோடு, தேவத்தூர் மற்றும் ஒட்டன்சத்திரம் வட்டார பொதுமக்களுக்கு அரசு சேவைகளை இடைத்தரகர்கள் இன்றி, எளிய முறையில் நேரடியாகப் பெற்றுத் தரும் நம்பகமான சேவை மையம்.'
                : 'Dedicated local e-Seva / Common Service Centre assisting rural citizens in obtaining certificates, land records, welfare pensions, and digital identity documents.'}
            </p>
          </div>
        </div>

        {/* Quick Contacts & Links */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href="tel:9790382437"
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl shadow transition-all flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-emerald-200" />
            <span>{language === 'ta' ? 'அழைக்க: 97903 82437' : 'Call: 97903 82437'}</span>
          </a>

          <a
            href="https://wa.me/919790382437?text=வணக்கம்%20முருகேசன்%20அவர்களே,%20பெரியாக்கோட்டை%20டிஜிட்டல்%20சேவை%20தளம்%20மூலம்%20தொடர்பு%20கொள்கிறேன்."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl shadow transition-all flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp உதவி</span>
          </a>

          <a
            href="https://www.facebook.com/murugesan.odc"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold px-4 py-3 rounded-xl shadow transition-all flex items-center gap-1.5"
          >
            <span>Facebook சுயவிவரம்</span>
            <span>↗</span>
          </a>

          <Link
            href="/murugesan"
            className="bg-emerald-950 hover:bg-emerald-900 text-emerald-100 border border-emerald-600 text-xs sm:text-sm font-bold px-4 py-3 rounded-xl transition-all"
          >
            {language === 'ta' ? 'ஆபரேட்டர் சுயவிவரம்' : 'Operator Bio'} →
          </Link>
        </div>
      </div>

      {/* 2-Column Section: Operational Details & Appointment Booking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Centre Timings, Location & Service Catalog */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card: Location & Hours */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-700" />
              <span>{language === 'ta' ? 'மைய இருப்பிடம் & வேலை நேரம்' : 'Location & Timings'}</span>
            </h2>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  {language === 'ta' ? 'முகவரி:' : 'Address:'}
                </span>
                <p>நால்ரோடு சந்திப்பு, பெரியாக்கோட்டை அஞ்சல்,</p>
                <p>ஒட்டன்சத்திரம் தாலுகா, திண்டுக்கல் மாவட்டம் - 624614</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  (ஒட்டன்சத்திரம் - சத்திரப்பட்டி மெயின் ரோடு)
                </p>
                <a
                  href="https://maps.app.goo.gl/kDxy1NXkBNCYcAZEA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-200" />
                  <span>{language === 'ta' ? 'Google மேப்பில் வழிகாட்டுதல்' : 'View on Google Maps'}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>{language === 'ta' ? 'இயங்கும் நேரம்:' : 'Working Hours:'}</span>
                </span>
                <p className="font-semibold text-emerald-900">
                  {language === 'ta' ? 'திங்கள் முதல் சனி வரை: காலை 9:30 முதல் மாலை 5:00 வரை' : 'Monday to Saturday: 9:30 AM to 5:00 PM'}
                </p>
                <p className="font-semibold text-rose-800 mt-1">
                  {language === 'ta' ? 'ஞாயிற்றுக்கிழமை: விடுமுறை' : 'Sunday: Holiday'}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-emerald-700" />
                  <span>{language === 'ta' ? 'மின்னஞ்சல் முகவரி:' : 'Email Address:'}</span>
                </span>
                <p className="font-mono text-xs break-all">nalroadmakkalesevaimaiyam@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Card: Services Offered */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>{language === 'ta' ? 'மையத்தில் செய்து தரப்படும் சேவைகள்' : 'Services Catalog'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
              {[
                'சாதி & வருமான சான்றிதழ்',
                'இருப்பிட & வாரிசு சான்றிதழ்',
                'முதல் பட்டதாரி சான்றிதழ்',
                'சிறு/குறு விவசாயி சான்றிதழ்',
                'பட்டா மாறுதல் & சிட்டா நகல்',
                'வில்லங்கச் சான்றிதழ் (EC)',
                'PM கிசான் பதிவு & e-KYC',
                'ஸ்மார்ட் குடும்ப அட்டை திருத்தம்',
                'ஆதார் முகவரி திருத்தம் & PVC',
                'புதிய பான் கார்டு (PAN)',
                'வாக்காளர் அட்டை (Voter ID)',
                'மின் கட்டணம் செலுத்துதல்'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-800">{item}</span>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950">
              <p className="font-bold mb-1">
                {language === 'ta' ? 'முதியோர் & மாற்றுத்திறனாளிகளுக்கு இல்லம் தேடி உதவி:' : 'Doorstep Assistance:'}
              </p>
              <p className="leading-relaxed">
                {language === 'ta'
                  ? 'நடக்க இயலாத முதியோர்கள் அல்லது மாற்றுத்திறனாளிகள் மையத்திற்கு வர சிரமப்பட்டால், தொலைபேசியில் அழைத்தால் இல்லத்திற்கே வந்து ஆவணங்கள் பெற்று விண்ணப்பிக்க உதவி செய்யப்படும்.'
                  : 'Doorstep document pickup and assistance available for bedridden elderly or disabled citizens upon request.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Appointment & Request Booking Form */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-xl space-y-6">
            <div>
              <span className="inline-block bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full mb-2">
                {language === 'ta' ? 'ஆன்லைன் முன் பதிவு' : 'Online Appointment'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950">
                {language === 'ta' ? 'இ-சேவை மைய உதவிக்கு பதிவு செய்க' : 'Book Centre Assistance'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {language === 'ta'
                  ? 'விவரங்களை பதிவு செய்தால், தேவையான ஆவணங்களை முன்கூட்டியே சரிபார்த்து முருகேசன் கே உங்களை தொடர்புகொள்வார்.'
                  : 'Submit your request and Murugesan K will review your documents before your visit.'}
              </p>
            </div>

            {createdTicket ? (
              /* Success confirmation */
              <div className="text-center py-6 space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <h3 className="text-xl font-black text-emerald-950">
                  {language === 'ta' ? 'கோரிக்கை பதிவு செய்யப்பட்டது!' : 'Request Registered Successfully!'}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600">
                  {language === 'ta'
                    ? 'உங்கள் விண்ணப்பம் நால்ரோடு மையத்திற்கு வந்துள்ளது. முருகேசன் கே விரைவில் அழைப்பார்.'
                    : 'Your appointment is confirmed. Murugesan K will call you shortly.'}
                </p>

                {/* Ticket ID Box */}
                <div className="bg-emerald-50 border-2 border-dashed border-emerald-400 rounded-2xl p-4 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-xs text-emerald-700 font-bold block">
                      {language === 'ta' ? 'உங்கள் கண்காணிப்பு எண் (Request ID):' : 'Your Request ID:'}
                    </span>
                    <span className="font-mono font-black text-lg sm:text-xl text-emerald-950">
                      {createdTicket.id}
                    </span>
                  </div>
                  <button
                    onClick={copyId}
                    className="flex items-center gap-1 bg-white border border-emerald-300 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-900"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'நகலெடுக்கப்பட்டது' : 'Copy'}</span>
                  </button>
                </div>

                <div className="pt-2 flex flex-col gap-2.5">
                  <a
                    href={`https://wa.me/919790382437?text=${encodeURIComponent(
                      `வணக்கம் முருகேசன் அவர்களே,\nஎன் பெயர்: ${createdTicket.citizenName}\nஊர்: ${createdTicket.village}\nவிண்ணப்ப எண்: ${createdTicket.id}\nகோரிக்கை: ${createdTicket.serviceName}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl shadow transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp-ல் உறுதி செய்க</span>
                  </a>

                  <button
                    onClick={() => {
                      setCreatedTicket(null);
                      setName('');
                      setPhone('');
                      setDescription('');
                    }}
                    className="text-xs text-emerald-800 hover:underline font-bold pt-2"
                  >
                    {language === 'ta' ? 'மற்றொரு கோரிக்கையை பதிவு செய்க' : 'Submit another request'}
                  </button>
                </div>
              </div>
            ) : (
              /* Request Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'ta' ? 'விண்ணப்பதாரர் பெயர் (Full Name) *' : 'Applicant Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={language === 'ta' ? 'விண்ணப்பதாரர் முழு பெயர்' : 'Applicant Full Name'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'ta' ? 'செல்போன் எண் (Mobile Number) *' : 'Mobile Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ta' ? 'கிராமம் (Village)' : 'Village'}
                    </label>
                    <select
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm text-slate-900 bg-white"
                    >
                      <option value="பெரியாக்கோட்டை (Periyakottai)">பெரியாக்கோட்டை</option>
                      <option value="நால்ரோடு (Nalroad)">நால்ரோடு</option>
                      <option value="சத்திரப்பட்டி (Chatrapatti)">சத்திரப்பட்டி</option>
                      <option value="தேவத்தூர் (Devathur)">தேவத்தூர்</option>
                      <option value="கப்பலபட்டி (Kappalapatti)">கப்பலபட்டி</option>
                      <option value="வீரலபட்டி (Veeralapatti)">வீரலபட்டி</option>
                      <option value="விருப்பாச்சி (Virupatchi)">விருப்பாச்சி</option>
                      <option value="ஒட்டன்சத்திரம் (Oddanchatram)">ஒட்டன்சத்திரம்</option>
                      <option value="மற்றவை (Other)">மற்றவை</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ta' ? 'தேவையான சேவை (Service)' : 'Required Service'}
                    </label>
                    <select
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm text-slate-900 bg-white"
                    >
                      <option value="வருமான / சாதி சான்றிதழ்">வருமானம் / சாதி சான்றிதழ்</option>
                      <option value="பட்டா மாறுதல் / சிட்டா நகல்">பட்டா மாறுதல் / சிட்டா நகல்</option>
                      <option value="PM கிசான் e-KYC / புதிய பதிவு">PM கிசான் e-KYC / பதிவு</option>
                      <option value="சொட்டு நீர் பாசன மானியம்">சொட்டு நீர் பாசன மானியம்</option>
                      <option value="மகளிர் உரிமைத் தொகை மேல்முறையீடு">மகளிர் உரிமைத் தொகை</option>
                      <option value="ஸ்மார்ட் குடும்ப அட்டை திருத்தம்">ஸ்மார்ட் குடும்ப அட்டை</option>
                      <option value="ஆதார் / பான் கார்டு">ஆதார் / பான் கார்டு</option>
                      <option value="பொது உதவி (Other Assistance)">பொது உதவி (Other)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'ta' ? 'விளக்கம் / குறிப்புகள் (Optional Note)' : 'Notes'}
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={language === 'ta' ? 'கூடுதல் விவரங்கள்...' : 'Any specific details...'}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm text-slate-900"
                  ></textarea>
                </div>

                {/* Doorstep Assistance Checkbox */}
                <div className="flex items-start gap-2.5 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <input
                    type="checkbox"
                    id="doorstep-check"
                    checked={doorstep}
                    onChange={(e) => setDoorstep(e.target.checked)}
                    className="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <label htmlFor="doorstep-check" className="text-xs text-amber-950 cursor-pointer font-medium">
                    <span className="font-bold block">
                      {language === 'ta' ? 'முதியோர் / மாற்றுத்திறனாளி இல்லம் தேடி உதவி தேவை' : 'Doorstep assistance needed (Elderly / Disabled)'}
                    </span>
                    <span>
                      {language === 'ta'
                        ? 'மையத்திற்கு வர இயலாவிட்டால் இதைத் தேர்ந்தெடுக்கவும். முருகேசன் கே இல்லம் தேடி வருவார்.'
                        : 'Select if you cannot travel to the centre due to physical difficulties.'}
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-extrabold text-sm py-3.5 px-4 rounded-xl shadow-md transition-all"
                >
                  {submitting
                    ? (language === 'ta' ? 'பதிவாகிறது...' : 'Submitting...')
                    : (language === 'ta' ? 'மைய உதவிக்கு பதிவு செய்க' : 'Submit Assistance Request')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
