'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useI18n } from '@/i18n/context';
import { RequestTimeline } from '@/components/RequestTimeline';
import { RequestTicket, GrievanceTicket } from '@/types';
import { Search, CheckCircle2, PhoneCall, AlertCircle, Clock, FileText, ArrowRight } from 'lucide-react';

function TrackContent() {
  const { language } = useI18n();
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [searchId, setSearchId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<RequestTicket | null>(null);
  const [grievance, setGrievance] = useState<GrievanceTicket | null>(null);
  const [error, setError] = useState('');

  const fetchStatus = async (idToSearch: string) => {
    const trimmed = idToSearch.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');
    setTicket(null);
    setGrievance(null);

    try {
      const res = await fetch(`/api/track/${encodeURIComponent(trimmed)}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError(
            language === 'ta'
              ? 'இந்த எண்ணில் எந்த விண்ணப்பமும் காணப்படவில்லை. எண்களை சரிபார்த்து மீண்டும் உள்ளிடவும்.'
              : 'No ticket found with this ID or phone number. Please check and retry.'
          );
        } else {
          setError(language === 'ta' ? 'விவரங்களை பெறுவதில் பிழை ஏற்பட்டது.' : 'Failed to fetch status.');
        }
        return;
      }

      const data = await res.json();
      if (data.type === 'request') {
        setTicket(data.data);
      } else if (data.type === 'grievance') {
        setGrievance(data.data);
      } else if (data.type === 'phone') {
        if (data.grievances && data.grievances.length > 0) {
          setGrievance(data.grievances[0]);
        } else if (data.requests && data.requests.length > 0) {
          setTicket(data.requests[0]);
        } else if (data.data) {
          if (data.data.category || data.data.location) {
            setGrievance(data.data);
          } else {
            setTicket(data.data);
          }
        }
      }
    } catch {
      setError(language === 'ta' ? 'இணைப்பு பிழை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.' : 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchStatus(initialId);
    }
  }, [initialId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStatus(searchId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-bold">
          <Clock className="w-4 h-4 text-emerald-700" />
          <span>{language === 'ta' ? 'நிகழ்நேர கண்காணிப்பு' : 'Live Status Tracker'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950">
          {language === 'ta' ? 'விண்ணப்பத்தின் நிலை அறிதல்' : 'Track Your Request Status'}
        </h1>
        <p className="text-xs sm:text-base text-slate-600 max-w-xl mx-auto">
          {language === 'ta'
            ? 'உங்கள் விண்ணப்ப எண் (PDS-REQ...) அல்லது செல்போன் எண்ணை உள்ளிட்டு தற்போதைய நிலையை உடனே தெரிந்து கொள்ளுங்கள்.'
            : 'Enter your tracking ID or registered mobile number to view live processing status.'}
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-md">
        <form onSubmit={handleSearch} className="space-y-3">
          <label className="block text-xs font-bold text-slate-700">
            {language === 'ta'
              ? 'விண்ணப்ப எண் அல்லது 10 இலக்க செல்போன் எண் உள்ளிடவும்:'
              : 'Enter Ticket ID (PDS-REQ...) or Mobile Number:'}
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder={
                  language === 'ta'
                    ? 'மனு எண் (எ.கா: PDS-REQ-0001) அல்லது 10 இலக்க செல்போன் எண்'
                    : 'Application ID (e.g. PDS-REQ-0001) or 10-digit mobile number'
                }
                className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-300 focus:border-emerald-600 text-sm sm:text-base text-slate-900 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchId.trim()}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold px-8 py-3.5 rounded-xl text-sm shadow transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? (language === 'ta' ? 'தேடுகிறது...' : 'Searching...') : (language === 'ta' ? 'நிலை காண்க' : 'Check Status')}</span>
            </button>
          </div>
        </form>

        {/* Live Production Guidance Note */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            {language === 'ta'
              ? '💡 உங்கள் மனு ஒப்புதல் ரசீதில் உள்ள எண் அல்லது பதிவு செய்த செல்போன் எண்ணை உள்ளிட்டு நிலையை அறியலாம்.'
              : '💡 Track status using your Application/Grievance ID or registered 10-digit mobile number.'}
          </span>
          <a
            href="tel:9790382437"
            className="text-emerald-700 hover:text-emerald-900 font-bold inline-flex items-center gap-1"
          >
            <span>{language === 'ta' ? 'உதவிக்கு: 97903 82437' : 'Assistance: 97903 82437'}</span>
          </a>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* RESULT 1: SERVICE REQUEST TICKET */}
      {ticket && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-lg space-y-6 animate-in fade-in">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                {language === 'ta' ? 'சேவை விண்ணப்பம்' : 'Service Request'}
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-slate-950 font-mono">
                {ticket.id}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-extrabold px-3 py-1.5 rounded-full ${
                  ticket.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : ticket.status === 'Ready for Citizen'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-blue-100 text-blue-900 border border-blue-300'
                }`}
              >
                ● {ticket.status}
              </span>
            </div>
          </div>

          {/* Key Ticket Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-slate-500 block">{language === 'ta' ? 'விண்ணப்பதாரர்:' : 'Citizen Name:'}</span>
              <span className="font-extrabold text-sm text-slate-900">{ticket.citizenName}</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-slate-500 block">{language === 'ta' ? 'கோரிய சேவை:' : 'Service Requested:'}</span>
              <span className="font-extrabold text-sm text-emerald-900">{ticket.serviceName}</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-slate-500 block">{language === 'ta' ? 'கிராமம்:' : 'Village:'}</span>
              <span className="font-extrabold text-sm text-slate-900">{ticket.village}</span>
            </div>
          </div>

          {ticket.description && (
            <div className="p-3.5 bg-slate-50 rounded-2xl text-xs text-slate-700">
              <span className="font-bold text-slate-900 block mb-0.5">
                {language === 'ta' ? 'விண்ணப்ப குறிப்பு:' : 'Description:'}
              </span>
              <p>{ticket.description}</p>
            </div>
          )}

          {/* Interactive Progress Timeline */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-950 mb-3">
              {language === 'ta' ? 'விண்ணப்ப நிலவரம் (Status Timeline):' : 'Application Status Timeline:'}
            </h3>
            <RequestTimeline currentStatus={ticket.status} notes={ticket.notes} />
          </div>

          {/* Direct Centre Follow-up */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="font-bold text-xs sm:text-sm text-emerald-950">
                {language === 'ta' ? 'கூடுதல் விவரங்கள் அறிய நால்ரோடு மையத்தை அழைக்கவும்:' : 'Have questions about your request? Call centre:'}
              </p>
              <p className="text-xs text-emerald-700 font-medium">
                முருகேசன் (ஆபரேட்டர்) — 97903 82437
              </p>
            </div>
            <a
              href="tel:9790382437"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-colors flex items-center gap-1.5 shrink-0"
            >
              <PhoneCall className="w-4 h-4" />
              <span>97903 82437</span>
            </a>
          </div>
        </div>
      )}

      {/* RESULT 2: GRIEVANCE TICKET */}
      {grievance && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-lg space-y-6 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                {language === 'ta' ? 'பஞ்சாயத்து குறை புகார்' : 'Civic Grievance'}
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-slate-950 font-mono">
                {grievance.id}
              </h2>
            </div>
            <span className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              ● {grievance.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-slate-500 block">{language === 'ta' ? 'புகார்தாரர்:' : 'Complainant:'}</span>
              <span className="font-extrabold text-sm text-slate-900">{grievance.citizenName}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-slate-500 block">{language === 'ta' ? 'இடம்:' : 'Location:'}</span>
              <span className="font-extrabold text-sm text-slate-900">{grievance.location}</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl text-xs text-slate-700">
            <span className="font-bold text-slate-900 block mb-0.5">
              {language === 'ta' ? 'புகாரின் விவரம்:' : 'Grievance Description:'}
            </span>
            <p>{grievance.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-slate-950 mb-3">
              {language === 'ta' ? 'நடவடிக்கை நிலவரம்:' : 'Action Timeline:'}
            </h3>
            <RequestTimeline type="grievance" currentStatus={grievance.status} timelineEvents={grievance.timeline} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">ஏற்றப்படுகிறது...</div>}>
      <TrackContent />
    </Suspense>
  );
}
