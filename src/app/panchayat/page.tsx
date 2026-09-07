'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n/context';
import { VILLAGE_INFO } from '@/data/villageInfoData';
import { VoiceAssistButton } from '@/components/VoiceAssistButton';
import {
  Building2,
  AlertTriangle,
  Droplets,
  Lightbulb,
  Truck,
  CheckCircle2,
  Copy,
  Check,
  Send,
  Calendar,
  MessageCircle,
  Printer
} from 'lucide-react';
import { GrievanceTicket, GrievanceCategory } from '@/types';
import { printAcknowledgmentReceipt } from '@/lib/printReceipt';

export default function PanchayatPage() {
  const { language } = useI18n();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<GrievanceCategory>('drinking_water');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdGrievance, setCreatedGrievance] = useState<GrievanceTicket | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const audioIntro =
    language === 'ta'
      ? 'பெரியாக்கோட்டை கிராம ஊராட்சி மற்றும் குறை தீர்ப்பு பக்கம். குடிநீர், தெருவிளக்கு, சாலை மற்றும் கழிவுநீர் பிரச்சனைகளை பதிவு செய்து தீர்வு காணலாம்.'
      : 'Periyakottai Gram Panchayat and Civic Grievance Portal. Report drinking water, streetlight, road, or sanitation issues directly.';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !description.trim()) {
      setError(language === 'ta' ? 'அனைத்து விவரங்களையும் பூர்த்தி செய்யவும்.' : 'Please fill all required fields.');
      return;
    }

    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      setError(language === 'ta' ? 'சரியான 10 இலக்க செல்போன் எண்ணை உள்ளிடவும்.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizenName: name.trim(),
          phoneNumber: phone.trim(),
          village: 'பெரியாக்கோட்டை',
          location: location.trim() || 'பெரியாக்கோட்டை',
          category,
          description: description.trim(),
          status: 'Received'
        })
      });

      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setCreatedGrievance(data);
    } catch {
      setError(
        language === 'ta'
          ? 'புகாரை பதிவு செய்வதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.'
          : 'Could not register grievance. Please retry.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const copyId = () => {
    if (!createdGrievance) return;
    navigator.clipboard.writeText(createdGrievance.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-4 border-2 border-emerald-600">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 bg-emerald-700 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
            <Building2 className="w-4 h-4" />
            <span>{VILLAGE_INFO.block[language]}</span>
          </div>
          <VoiceAssistButton textToSpeak={audioIntro} size="sm" />
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
          {VILLAGE_INFO.name[language]}
        </h1>

        <p className="text-xs sm:text-sm text-emerald-100 max-w-3xl leading-relaxed">
          {language === 'ta'
            ? 'பெரியாக்கோட்டை கிராம ஊராட்சி, நால்ரோடு சந்திப்பு, குடிநீர் வசதி, தெருவிளக்கு பராமரிப்பு மற்றும் பொது பிரச்சனைகளை தீர்ப்பதற்கான குடிமக்கள் குறைதீர்ப்பு மையம்.'
            : 'Periyakottai Gram Panchayat citizen portal for community notices, public utilities, and civic grievance resolution.'}
        </p>
      </div>

      {/* 2-Column: Village Information & Civic Grievance Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Panchayat Profile & Public Amenities */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-950">
              {language === 'ta' ? 'ஊராட்சி விவரங்கள் (Village Profile)' : 'Gram Panchayat Details'}
            </h2>

            <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{language === 'ta' ? 'ஊராட்சி ஒன்றியம்:' : 'Block:'}</span>
                <span className="font-bold text-slate-900">{VILLAGE_INFO.block[language]}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{language === 'ta' ? 'தாலுகா & மாவட்டம்:' : 'Taluk & District:'}</span>
                <span className="font-bold text-slate-900">ஒட்டன்சத்திரம், திண்டுக்கல்</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{language === 'ta' ? 'அஞ்சல் குறியீடு (PIN):' : 'PIN Code:'}</span>
                <span className="font-bold font-mono text-emerald-800">624614</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{language === 'ta' ? 'சட்டமன்றத் தொகுதி:' : 'Assembly Constituency:'}</span>
                <span className="font-bold text-slate-900">ஒட்டன்சத்திரம் (128)</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold text-slate-900 block mb-2">
                {language === 'ta' ? 'ஊராட்சிக்குட்பட்ட சிற்றூர்கள் (Hamlets):' : 'Hamlets under Panchayat:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {VILLAGE_INFO.hamlets.map((hamlet, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-emerald-50 text-emerald-900 font-semibold px-3 py-1 rounded-xl border border-emerald-200"
                  >
                    {hamlet[language]}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Grama Sabha Information */}
          <div className="bg-emerald-50 rounded-3xl p-6 sm:p-7 border-2 border-emerald-200 space-y-3">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
              <Calendar className="w-5 h-5 text-emerald-700" />
              <span>{language === 'ta' ? 'கிராம சபை கூட்ட நாட்கள்' : 'Grama Sabha Schedule'}</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {language === 'ta'
                ? 'தமிழ்நாடு அரசின் ஆணைப்படி ஆண்டுக்கு 6 முறை கிராம சபை கூட்டங்கள் நடைபெறும்: ஜனவரி 26 (குடியரசு தினம்), மே 1 (தொழிலாளர் தினம்), ஆகஸ்ட் 15 (சுதந்திர தினம்), அக்டோபர் 2 (காந்தி ஜெயந்தி), மார்ச் 22 (உலக தண்ணீர் தினம்) மற்றும் நவம்பர் 1 (உள்ளாட்சிகள் தினம்).'
                : 'Mandated Grama Sabha meetings: Jan 26, Mar 22, May 1, Aug 15, Oct 2, and Nov 1.'}
            </p>
          </div>
        </div>

        {/* Right Column: Civic Grievance Form */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-xl space-y-6">
            <div>
              <span className="inline-block bg-amber-100 text-amber-950 text-xs font-bold px-3 py-1 rounded-full mb-2">
                {language === 'ta' ? 'கிராம குறை தீர்ப்பு' : 'Public Grievance'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950">
                {language === 'ta' ? 'ஊராட்சிக்கு குறை தெரிவிக்க' : 'Report a Civic Issue'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {language === 'ta'
                  ? 'குடிநீர், தெருவிளக்கு, சாலை மற்றும் கழிவுநீர் பிரச்சனைகளை இங்கே பதிவு செய்யவும். நால்ரோடு மையம் வாயிலாக ஊராட்சி ஒன்றிய பி.டி.ஓ மற்றும் செயலாளருக்கு அனுப்பப்படும்.'
                  : 'Report drinking water, streetlight, drainage, or road issues for resolution tracking.'}
              </p>
            </div>

            {createdGrievance ? (
              <div className="text-center py-6 space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <h3 className="text-xl font-black text-slate-950">
                  {language === 'ta' ? 'புகார் பதிவு செய்யப்பட்டது!' : 'Grievance Registered!'}
                </h3>

                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  {language === 'ta'
                    ? 'உங்கள் புகார் எண் உருவாக்கப்பட்டுள்ளது. ஒட்டன்சத்திரம் ஊராட்சி ஒன்றிய அலுவலர்களுக்கு அனுப்பப்பட்டுள்ளது.'
                    : 'Grievance logged. Forwarded to Panchayat Union authorities.'}
                </p>

                <div className="bg-amber-50 border-2 border-dashed border-amber-400 rounded-2xl p-4 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-xs text-amber-900 font-bold block">
                      {language === 'ta' ? 'புகார் எண் (Grievance ID):' : 'Grievance ID:'}
                    </span>
                    <span className="font-mono font-black text-lg text-slate-950">
                      {createdGrievance.id}
                    </span>
                  </div>
                  <button
                    onClick={copyId}
                    className="flex items-center gap-1 bg-white border border-amber-300 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'நகலெடுக்கப்பட்டது' : 'Copy'}</span>
                  </button>
                </div>

                <div className="pt-2 flex flex-col gap-2.5">
                  <button
                    onClick={() =>
                      printAcknowledgmentReceipt({
                        id: createdGrievance.id,
                        citizenName: createdGrievance.citizenName,
                        phoneNumber: createdGrievance.phoneNumber,
                        serviceName: `கிராம பஞ்சாயத்து குறை (${createdGrievance.category})`,
                        village: createdGrievance.village,
                        createdAt: createdGrievance.createdAt,
                        status: createdGrievance.status,
                        description: createdGrievance.description
                      })
                    }
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl shadow transition-colors text-xs sm:text-sm"
                  >
                    <Printer className="w-4 h-4 text-amber-300" />
                    <span>{language === 'ta' ? 'மனு ஒப்புதல் ரசீது அச்சிடுக (Print 1-Page Slip)' : 'Print Acknowledgment Slip'}</span>
                  </button>

                  <a
                    href={`https://wa.me/919790382437?text=${encodeURIComponent(
                      `வணக்கம் முருகேசன் அவர்களே,\nஎன் பெயர்: ${createdGrievance.citizenName}\nமனு எண்: ${createdGrievance.id}\nபுகார் வகை: ${createdGrievance.category}\nவிவரம்: ${createdGrievance.description}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-xl shadow transition-colors text-xs sm:text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{language === 'ta' ? 'வாட்ஸ்அப்பில் முருகேசனுக்கு அனுப்ப' : 'Send via WhatsApp'}</span>
                  </a>

                  <Link
                    href={`/track?id=${createdGrievance.id}`}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm shadow transition-colors text-center"
                  >
                    {language === 'ta' ? 'புகாரின் நிலையை கண்காணிக்க' : 'Track Grievance Status'}
                  </Link>

                  <button
                    onClick={() => {
                      setCreatedGrievance(null);
                      setName('');
                      setPhone('');
                      setDescription('');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 font-semibold pt-1"
                  >
                    {language === 'ta' ? 'மற்றொரு புகாரை பதிவு செய்ய' : 'Report another issue'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'ta' ? 'உங்கள் பெயர் (Name) *' : 'Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={language === 'ta' ? 'விண்ணப்பதாரர் முழு பெயர்' : 'Full Name'}
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
                      {language === 'ta' ? 'பிரச்சனை வகை (Category)' : 'Issue Category'}
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as GrievanceCategory)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm text-slate-900 bg-white"
                    >
                      <option value="drinking_water">குடிநீர் பிரச்சனை (Drinking Water)</option>
                      <option value="street_light">தெருவிளக்கு எரியவில்லை (Street Light)</option>
                      <option value="road_repair">சாலை பழுது (Road Damage)</option>
                      <option value="sanitation">கழிவுநீர் / சுகாதாரம் (Sanitation)</option>
                      <option value="ration_shop">ரேஷன் கடை குறை (Ration Shop)</option>
                      <option value="agriculture">விவசாய பிரச்சனை (Agri Issue)</option>
                      <option value="other">மற்றவை (Other)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ta' ? 'தெரு / பகுதி (Street / Area)' : 'Street / Area'}
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={language === 'ta' ? 'எ.கா: மேற்கு தெரு / நால்ரோடு' : 'e.g., West Street / Nalroad'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'ta' ? 'பிரச்சனையின் முழு விவரம் (Description) *' : 'Detailed Description *'}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={
                      language === 'ta'
                        ? 'எத்தனை நாட்களாக பிரச்சனை உள்ளது, எங்கு பழுது ஏற்பட்டுள்ளது போன்ற விவரங்களை குறிப்பிடவும்...'
                        : 'Explain the issue clearly with exact location...'
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm text-slate-900"
                  ></textarea>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 leading-tight">
                  {language === 'ta'
                    ? 'மறுப்புரை: இங்கு புகார் பதிவு செய்வது உள்ளூர் இ-சேவை ஒருங்கிணைப்புக்கானது. அதிகாரப்பூர்வ விசாரணைக்கு ஒட்டன்சத்திரம் ஊராட்சி ஒன்றிய பி.டி.ஓ அலுவலகத்திற்கு அனுப்பப்படும்.'
                    : 'Notice: Grievance logged here will be forwarded to Oddanchatram Panchayat Union BDO office for official resolution.'}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black text-sm py-3.5 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {submitting
                      ? (language === 'ta' ? 'பதிவாகிறது...' : 'Submitting...')
                      : (language === 'ta' ? 'புகாரை சமர்ப்பிக்க' : 'Submit Civic Grievance')}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
