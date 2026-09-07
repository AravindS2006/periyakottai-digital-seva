'use client';

import React, { useState } from 'react';
import { useI18n } from '@/i18n/context';
import { CONTACTS_DATA } from '@/data/contactsData';
import { VoiceAssistButton } from '@/components/VoiceAssistButton';
import { Phone, PhoneCall, ShieldCheck, MapPin, Clock, Search } from 'lucide-react';

export default function ContactsPage() {
  const { language } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: { ta: 'அனைத்து தொடர்புகள்', en: 'All Contacts' } },
    { id: 'emergency', label: { ta: '🚨 அவசர எண்கள் (Emergency)', en: 'Emergency' } },
    { id: 'health', label: { ta: '🏥 மருத்துவமனைகள் (Health)', en: 'Hospitals & PHC' } },
    { id: 'administration', label: { ta: '🏛️ தாலுகா & பி.டி.ஓ (Admin)', en: 'Taluk & BDO' } },
    { id: 'police', label: { ta: '👮 காவல் நிலையம் (Police)', en: 'Police' } },
    { id: 'agriculture', label: { ta: '🌾 விவசாயத்துறை (Agri)', en: 'Agriculture' } },
    { id: 'centre', label: { ta: '🏢 இ-சேவை மையம் (CSC)', en: 'e-Seva Centre' } }
  ];

  const filteredContacts = CONTACTS_DATA.filter((contact) => {
    const matchCategory = selectedCategory === 'all' || contact.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      contact.title.ta.toLowerCase().includes(q) ||
      contact.title.en.toLowerCase().includes(q) ||
      contact.phone.includes(q);
    return matchCategory && matchQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-900 px-3 py-1 rounded-full text-xs font-bold">
          <PhoneCall className="w-4 h-4 text-rose-700" />
          <span>{language === 'ta' ? 'அதிகாரப்பூர்வ தொலைபேசி எண்கள்' : 'Official Helpline Directory'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950">
          {language === 'ta'
            ? 'பெரியாக்கோட்டை & ஒட்டன்சத்திரம் முக்கிய எண்கள்'
            : 'Important & Emergency Helplines'}
        </h1>
        <p className="text-xs sm:text-base text-slate-600 max-w-2xl">
          {language === 'ta'
            ? 'திண்டுக்கல் மாவட்ட நிர்வாகம் மற்றும் ஒட்டன்சத்திரம் தாலுகா அரசு அலுவலகங்களின் சரிபார்க்கப்பட்ட அதிகாரப்பூர்வ தொலைபேசி எண்கள்.'
            : 'Verified official public helplines, taluk offices, hospitals, police, and electricity board.'}
        </p>
      </div>

      {/* Filter and Search */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'ta'
                ? 'அலுவலகம் அல்லது எண் தேட (எ.கா: வட்டாட்சியர், காவல், 108)...'
                : 'Search by office or number (e.g., Tahsildar, Hospital, 108)...'
            }
            className="w-full pl-9 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat.label[language]}
            </button>
          ))}
        </div>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>{language === 'ta' ? 'சரிபார்க்கப்பட்டது' : 'Verified'}</span>
                </span>

                <VoiceAssistButton
                  textToSpeak={`${contact.title[language]}. எண்: ${contact.phone}. ${contact.address[language]}.`}
                  size="sm"
                />
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {contact.title[language]}
              </h2>

              <div className="space-y-1.5 text-xs text-slate-600">
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{contact.address[language]}</span>
                </p>

                {contact.timing && (
                  <p className="flex items-start gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{contact.timing[language]}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Direct Call & Map Buttons */}
            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
              <a
                href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-emerald-200" />
                <span>{contact.phone} ({language === 'ta' ? 'அழைக்க' : 'Call'})</span>
              </a>

              {contact.mapUrl && (
                <a
                  href={contact.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold py-2 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 border border-sky-200"
                >
                  <MapPin className="w-3.5 h-3.5 text-sky-700" />
                  <span>{language === 'ta' ? 'Google மேப்பில் வழித்தடம்' : 'Open in Google Maps'}</span>
                </a>
              )}

              {contact.alternatePhone && (
                <a
                  href={`tel:${contact.alternatePhone.replace(/[^0-9]/g, '')}`}
                  className="block text-center text-xs text-slate-500 hover:text-slate-800 font-semibold mt-1"
                >
                  {language === 'ta' ? 'மாற்று எண்: ' : 'Alt: '}
                  {contact.alternatePhone}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
