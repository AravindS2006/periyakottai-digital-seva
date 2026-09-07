'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n/context';
import { X, CheckCircle2, PhoneCall, Copy, Check, MessageSquare, Printer, Sprout, AlertCircle, ArrowRight } from 'lucide-react';
import { GrievanceTicket } from '@/types';
import { printAcknowledgmentReceipt } from '@/lib/printReceipt';

interface FarmerGrievanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

const AGRI_GRIEVANCE_TYPES = [
  { id: 'fertilizer', ta: 'உரம் & யூரியா தட்டுப்பாடு / கூடுதல் விலை', en: 'Fertilizer & Urea Shortage / Overpricing' },
  { id: 'crop_loss', ta: 'பயிர் இழப்பு & காப்பீட்டு இழப்பீடு கோரிக்கை', en: 'Crop Loss & Insurance Claim Support' },
  { id: 'irrigation', ta: 'பாசன வாய்க்கால் தூர்வாருதல் / தண்ணீர் தடை', en: 'Irrigation Canal Dredging / Water Block' },
  { id: 'pm_kisan', ta: 'PM-கிசான் 19வது தவணை வரவில்லை / e-KYC சிக்கல்', en: 'PM-KISAN Installment Not Credited / e-KYC Issue' },
  { id: 'electricity', ta: 'இலவச விவசாய மின்சாரம் / டிரான்ஸ்பார்மர் பழுது', en: 'Free Agri Power Outage / Transformer Fault' },
  { id: 'paccs_loan', ta: 'தொடக்க வேளாண்மை கூட்டுறவு வங்கி பயிர்க்கடன்', en: 'PACCS Cooperative Crop Loan Assistance' },
  { id: 'drip_subsidy', ta: 'சொட்டு நீர் பாசனம் 100% அரசு மானிய பதிவு', en: 'Micro-Irrigation 100% Subsidy Registration' },
  { id: 'other_agri', ta: 'பிற வேளாண்மை / தோட்டக்கலை பிரச்சனைகள்', en: 'Other Agricultural / Horticulture Grievances' }
];

export function FarmerGrievanceModal({
  isOpen,
  onClose,
  initialTopic
}: FarmerGrievanceModalProps) {
  const { language } = useI18n();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('பெரியாக்கோட்டை (Periyakottai)');
  const [selectedType, setSelectedType] = useState(initialTopic || AGRI_GRIEVANCE_TYPES[0].ta);
  const [surveyNo, setSurveyNo] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdGrievance, setCreatedGrievance] = useState<GrievanceTicket | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !description.trim()) {
      setError(language === 'ta' ? 'பெயர், செல்போன் எண் மற்றும் பிரச்சனையின் விவரம் அவசியம்.' : 'Name, phone and description are required.');
      return;
    }

    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      setError(language === 'ta' ? 'சரியான 10 இலக்க செல்போன் எண்ணை உள்ளிடவும்.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    setError('');

    const fullDescription = `[${selectedType}] ${description.trim()}${surveyNo.trim() ? ` (சர்வே / பட்டா எண்: ${surveyNo.trim()})` : ''}`;
    const farmLocation = `${village}${surveyNo.trim() ? ` - சர்வே எண்: ${surveyNo.trim()}` : ''}`;

    try {
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizenName: name.trim(),
          phoneNumber: phone.trim(),
          village: village,
          location: farmLocation,
          category: 'agriculture',
          description: fullDescription,
          status: 'Received'
        })
      });

      if (!res.ok) throw new Error('Failed to register grievance');
      const data = await res.json();
      setCreatedGrievance(data);
    } catch {
      setError(
        language === 'ta'
          ? 'மனுவை பதிவு செய்வதில் பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும் அல்லது மையத்தை நேரடியாக அழைக்கவும்.'
          : 'Could not register grievance. Please retry or contact the centre directly.'
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

  const whatsappUrl = createdGrievance
    ? `https://wa.me/919790382437?text=${encodeURIComponent(
        `வணக்கம் முருகேசன் அவர்களே,\nஎன் பெயர்: ${createdGrievance.citizenName}\nஊர்: ${createdGrievance.village}\nமனு எண்: ${createdGrievance.id}\nவிவசாய குறை: ${createdGrievance.description}`
      )}`
    : '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl border-2 border-emerald-500 w-full max-w-lg p-6 sm:p-8 animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {createdGrievance ? (
          /* Success Screen */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-950">
              {language === 'ta' ? 'உழவர் குறைதீர்ப்பு மனு பதிவு செய்யப்பட்டது!' : 'Farmer Grievance Registered!'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              {language === 'ta'
                ? 'உங்கள் மனு நால்ரோடு மக்கள் இ-சேவை மையத்திற்கு அனுப்பப்பட்டுள்ளது. வேளாண்மை / தோட்டக்கலைத்துறை மற்றும் ஊராட்சி அலுவலர்களுக்கு அனுப்பி விரைந்து தீர்வு காணப்படும்.'
                : 'Your agricultural grievance has been logged. Forwarded to Oddanchatram Agricultural & Panchayat authorities.'}
            </p>

            {/* Generated Ticket Box */}
            <div className="bg-emerald-50 border-2 border-dashed border-emerald-400 rounded-2xl p-4 flex items-center justify-between">
              <div className="text-left">
                <span className="text-xs text-emerald-800 font-semibold block">
                  {language === 'ta' ? 'மனு எண் (Grievance ID):' : 'Your Grievance ID:'}
                </span>
                <span className="font-mono font-black text-lg sm:text-xl text-emerald-950">
                  {createdGrievance.id}
                </span>
              </div>
              <button
                onClick={copyId}
                className="flex items-center gap-1 bg-white border border-emerald-300 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-900 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'நகலெடுக்கப்பட்டது' : 'Copy'}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={() =>
                  printAcknowledgmentReceipt({
                    id: createdGrievance.id,
                    citizenName: createdGrievance.citizenName,
                    phoneNumber: createdGrievance.phoneNumber,
                    serviceName: 'உழவர் குறைதீர்ப்பு மனு (Farmer Grievance)',
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
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-xl shadow transition-colors text-xs sm:text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{language === 'ta' ? 'வாட்ஸ்அப்பில் முருகேசனுக்கு அனுப்ப' : 'Send via WhatsApp'}</span>
              </a>

              <Link
                href={`/track?id=${createdGrievance.id}`}
                className="w-full flex items-center justify-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold py-2.5 px-4 rounded-xl transition-colors text-xs sm:text-sm"
              >
                <span>{language === 'ta' ? 'மனுவின் தற்போதைய நிலையை அறிய' : 'Track Grievance Live Status'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={onClose}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                {language === 'ta' ? 'சாளரத்தை மூடு' : 'Close'}
              </button>
            </div>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full mb-1.5">
                <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                <span>{language === 'ta' ? 'உழவர் குறைதீர்ப்பு மையம்' : 'Farmer Grievance Desk'}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                {language === 'ta' ? 'விவசாய பிரச்சனை அல்லது மனு பதிவு' : 'Register Agricultural Grievance'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'ta'
                  ? 'உரம் தட்டுப்பாடு, பயிர் காப்பீட்டு இழப்பீடு, பாசன கால்வாய் அல்லது PM-கிசான் பிரச்சனைகளை உடனே பதிவு செய்யுங்கள்.'
                  : 'Register issues related to crop loss, fertilizers, canal blocks, PM-KISAN, or electricity.'}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'ta' ? 'விவசாயி பெயர் (Farmer Name) *' : 'Farmer Name *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language === 'ta' ? 'விவசாயி முழு பெயர்' : 'Farmer Full Name'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 text-sm text-slate-900"
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 text-sm text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'தோட்டம் / கிராமம் (Village)' : 'Village'}
                </label>
                <select
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm text-slate-900 bg-white"
                >
                  <option value="பெரியாக்கோட்டை (Periyakottai)">பெரியாக்கோட்டை (Periyakottai)</option>
                  <option value="நால்ரோடு (Nalroad)">நால்ரோடு (Nalroad)</option>
                  <option value="சத்திரப்பட்டி (Chatrapatti)">சத்திரப்பட்டி (Chatrapatti)</option>
                  <option value="தேவத்தூர் (Devathur)">தேவத்தூர் (Devathur)</option>
                  <option value="கப்பலபட்டி (Kappalapatti)">கப்பலபட்டி (Kappalapatti)</option>
                  <option value="வீரலபட்டி (Veeralapatti)">வீரலபட்டி (Veeralapatti)</option>
                  <option value="விருப்பாச்சி (Virupatchi)">விருப்பாச்சி (Virupatchi)</option>
                  <option value="ஒட்டன்சத்திரம் (Oddanchatram)">ஒட்டன்சத்திரம் (Oddanchatram)</option>
                  <option value="மற்றவை (Other)">மற்றவை (Other)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'சர்வே / பட்டா எண் (விருப்பம்)' : 'Survey / Patta No (Optional)'}
                </label>
                <input
                  type="text"
                  value={surveyNo}
                  onChange={(e) => setSurveyNo(e.target.value)}
                  placeholder="எ.கா: 142/2A"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'ta' ? 'குறைதீர்ப்பு வகை (Agri Issue Category) *' : 'Issue Category *'}
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 text-xs sm:text-sm text-slate-900 bg-white font-medium"
              >
                {AGRI_GRIEVANCE_TYPES.map((t) => (
                  <option key={t.id} value={t.ta}>
                    {language === 'ta' ? t.ta : t.en}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'ta' ? 'பிரச்சனையின் முழு விவரம் (Detailed Description) *' : 'Detailed Description *'}
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  language === 'ta'
                    ? 'பயிர் வகை, பாதிக்கப்பட்ட பரப்பளவு அல்லது பிரச்சனை பற்றிய முழு விவரங்களை குறிப்பிடவும்...'
                    : 'Provide full details such as crop type, affected area, or issue description...'
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 text-xs text-slate-900"
              ></textarea>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
              >
                {language === 'ta' ? 'ரத்து' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md transition-all flex items-center gap-1.5"
              >
                <Sprout className="w-4 h-4" />
                <span>
                  {submitting
                    ? (language === 'ta' ? 'பதிவாகிறது...' : 'Submitting...')
                    : (language === 'ta' ? 'உழவர் மனு பதிவு செய்' : 'Submit Agri Grievance')}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
