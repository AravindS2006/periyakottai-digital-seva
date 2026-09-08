'use client';

import React, { useState } from 'react';
import { useI18n } from '@/i18n/context';
import { X, CheckCircle2, PhoneCall, Copy, Check, MessageSquare, Printer } from 'lucide-react';
import { RequestTicket } from '@/types';
import { printAcknowledgmentReceipt } from '@/lib/printReceipt';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId?: string;
  serviceName?: string;
}

export function RequestModal({
  isOpen,
  onClose,
  serviceId = 'general_assistance',
  serviceName = 'பொது இ-சேவை உதவி (General Assistance)'
}: RequestModalProps) {
  const { language } = useI18n();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('பெரியாக்கோட்டை (Periyakottai)');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Normal' | 'Urgent'>('Normal');
  const [submitting, setSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<RequestTicket | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

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
          serviceId,
          serviceName,
          description,
          priority,
          status: 'Submitted'
        })
      });

      if (!res.ok) throw new Error('Failed to create request');
      const data = await res.json();
      setCreatedTicket(data);
    } catch {
      setError(
        language === 'ta'
          ? 'கோரிக்கையை பதிவு செய்வதில் பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும் அல்லது மையத்தை நேரடியாக அழைக்கவும்.'
          : 'Could not register request. Please retry or contact the centre directly.'
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

  const whatsappUrl = createdTicket
    ? `https://wa.me/919790382437?text=${encodeURIComponent(
        `வணக்கம் முருகேசன் அவர்களே,\nஎன் பெயர்: ${createdTicket.citizenName}\nஊர்: ${createdTicket.village}\nவிண்ணப்ப எண்: ${createdTicket.id}\nகோரிக்கை: ${createdTicket.serviceName}`
      )}`
    : '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl border-2 border-emerald-500 w-full max-w-lg p-6 sm:p-8 animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {createdTicket ? (
          /* Success Screen */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-950">
              {language === 'ta' ? 'கோரிக்கை வெற்றிகரமாக பதிவு செய்யப்பட்டது!' : 'Assistance Request Submitted!'}
            </h3>

            <p className="text-sm text-slate-600">
              {language === 'ta'
                ? 'உங்கள் கோரிக்கை நால்ரோடு மக்கள் இ-சேவை மையத்திற்கு அனுப்பப்பட்டுள்ளது. முருகேசன் கு உங்களை விரைவில் தொடர்புகொள்வார்.'
                : 'Your request has been routed to Nalroad Makkal e-Seva Centre. Murugesan K will review it shortly.'}
            </p>

            {/* Generated Ticket Box */}
            <div className="bg-emerald-50 border-2 border-dashed border-emerald-400 rounded-2xl p-4 flex items-center justify-between">
              <div className="text-left">
                <span className="text-xs text-emerald-700 font-semibold block">
                  {language === 'ta' ? 'உங்கள் கண்காணிப்பு எண் (Request ID):' : 'Your Request ID:'}
                </span>
                <span className="font-mono font-extrabold text-lg sm:text-xl text-emerald-950">
                  {createdTicket.id}
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
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl shadow transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                <span>{language === 'ta' ? 'வாட்ஸ்அப்பில் முருகேசனுக்கு அனுப்ப' : 'Send to Murugesan via WhatsApp'}</span>
              </a>

              <a
                href="tel:9790382437"
                className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl shadow transition-colors"
              >
                <PhoneCall className="w-5 h-5" />
                <span>{language === 'ta' ? 'மையத்தை அழைக்க (97903 82437)' : 'Call Centre Directly'}</span>
              </a>

              <button
                onClick={() => printAcknowledgmentReceipt(createdTicket)}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-4 rounded-xl transition-colors text-xs sm:text-sm border border-slate-300"
              >
                <Printer className="w-4 h-4 text-slate-700" />
                <span>{language === 'ta' ? 'மனு ஒப்புதல் ரசீது அச்சிடுக (Print Slip)' : 'Print Acknowledgment Slip'}</span>
              </button>

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
              <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full mb-1.5">
                {language === 'ta' ? 'இ-சேவை மைய உதவி' : 'e-Seva Assistance'}
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                {serviceName}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'ta'
                  ? 'விவரங்களை பூர்த்தி செய்தால் நால்ரோடு இ-சேவை மையம் உங்களை அழைத்து ஆவணங்களை தயார் செய்யும்.'
                  : 'Submit your contact info and Murugesan K will guide you with documents and application.'}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'ta' ? 'விண்ணப்பதாரர் பெயர் (Full Name) *' : 'Applicant Full Name *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language === 'ta' ? 'விண்ணப்பதாரர் முழு பெயர்' : 'Applicant Full Name'}
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
                  {language === 'ta' ? 'கிராமம் / பகுதி (Village)' : 'Village / Area'}
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
                  {language === 'ta' ? 'முன்னுரிமை (Priority)' : 'Priority'}
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm text-slate-900 bg-white"
                >
                  <option value="Normal">{language === 'ta' ? 'சாதாரண (Normal)' : 'Normal'}</option>
                  <option value="Urgent">{language === 'ta' ? 'அவசரம் (Urgent)' : 'Urgent'}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'ta' ? 'விளக்கம் அல்லது குறிப்பு (Optional Note)' : 'Optional Note'}
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  language === 'ta'
                    ? 'உங்களிடம் உள்ள ஆவணங்கள் அல்லது கூடுதல் விவரங்கள்...'
                    : 'Any specific details or questions...'
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm text-slate-900"
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
                className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md transition-all"
              >
                {submitting
                  ? (language === 'ta' ? 'பதிவாகிறது...' : 'Submitting...')
                  : (language === 'ta' ? 'உதவி கோரிக்கை அனுப்பு' : 'Submit Assistance Request')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
