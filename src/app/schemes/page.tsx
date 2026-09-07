'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useI18n } from '@/i18n/context';
import { SCHEMES_DATA } from '@/data/schemesData';
import { SchemeCard } from '@/components/SchemeCard';
import { Sparkles, Search, Filter, ArrowRight, ShieldCheck } from 'lucide-react';

function SchemesContent() {
  const { language } = useI18n();
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';

  const [filter, setFilter] = useState(initialFilter);
  const [query, setQuery] = useState('');

  const categories = [
    { id: 'all', label: { ta: 'அனைத்து திட்டங்கள்', en: 'All Schemes' } },
    { id: 'agri', label: { ta: 'விவசாயிகள் (Agriculture)', en: 'Farmers' } },
    { id: 'women', label: { ta: 'மகளிர் (Women)', en: 'Women' } },
    { id: 'student', label: { ta: 'மாணவர்கள் (Students)', en: 'Students' } },
    { id: 'senior', label: { ta: 'மூத்த குடிமக்கள் (Seniors)', en: 'Senior Citizens' } },
    { id: 'housing', label: { ta: 'வீட்டு வசதி (Housing)', en: 'Housing' } },
  ];

  const filteredSchemes = useMemo(() => {
    let list = SCHEMES_DATA;

    if (filter === 'agri') {
      list = list.filter((s) => s.category.includes('விவசாயம்'));
    } else if (filter === 'women') {
      list = list.filter((s) => s.category.includes('மகளிர்') || s.rules.gender === 'female');
    } else if (filter === 'student') {
      list = list.filter((s) => s.rules.studentOnly || s.category.includes('கல்வி'));
    } else if (filter === 'senior') {
      list = list.filter((s) => (s.rules.minAge || 0) >= 60);
    } else if (filter === 'housing') {
      list = list.filter((s) => s.category.includes('வீட்டு வசதி'));
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.ta.toLowerCase().includes(q) ||
          s.name.en.toLowerCase().includes(q) ||
          s.description.ta.toLowerCase().includes(q) ||
          s.description.en.toLowerCase().includes(q) ||
          s.benefit.ta.toLowerCase().includes(q)
      );
    }

    return list;
  }, [filter, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Guided Engine Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-slate-950 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-amber-400">
        <div className="space-y-2 text-center md:text-left">
          <span className="inline-block bg-slate-950 text-amber-300 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
            {language === 'ta' ? 'வழிகாட்டி இன்ஜின்' : 'Guided Discovery'}
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-950">
            {language === 'ta'
              ? 'உங்களுக்கு எந்த திட்டம் பொருந்தும் என்று தெரியவில்லையா?'
              : 'Not sure which scheme applies to you?'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-900 font-medium max-w-xl">
            {language === 'ta'
              ? 'சிக்கலான அரசாணைகளை படிக்க வேண்டியதில்லை. வெறும் 5 எளிய கேள்விகளுக்கு பதிலளித்து உங்களுக்கான திட்டங்களை உடனடியாக தெரிந்துகொள்ளுங்கள்!'
              : 'Answer 5 simple questions to automatically identify matching central and state welfare schemes.'}
          </p>
        </div>

        <Link
          href="/schemes/eligibility"
          className="shrink-0 bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-xl transition-all hover:scale-105 flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span>{language === 'ta' ? 'தகுதி கண்டறிய (5 கேள்விகள்)' : 'Start 5-Question Check'}</span>
        </Link>
      </div>

      {/* Header & Description */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950">
          {language === 'ta' ? 'அரசு நலத்திட்டங்கள் அடைவு' : 'Welfare Schemes Directory'}
        </h1>
        <p className="text-xs sm:text-base text-slate-600 max-w-3xl">
          {language === 'ta'
            ? 'தமிழ்நாடு அரசு மற்றும் மத்திய அரசின் முக்கிய விவசாய, மகளிர், முதியோர் மற்றும் கல்வி நலத்திட்டங்களின் முழுமையான வழிகாட்டி.'
            : 'Explore officially verified Central & Tamil Nadu government welfare programmes with eligibility guidelines.'}
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-4">
        <div className="relative max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === 'ta'
                ? 'திட்டத்தின் பெயரைத் தேடுங்கள் (PM கிசான், மகளிர் உரிமை, புதுமைப் பெண்)...'
                : 'Search schemes by name or benefit...'
            }
            className="w-full pl-10 pr-4 py-3.5 bg-white border-2 border-slate-300 focus:border-emerald-600 rounded-2xl text-sm sm:text-base text-slate-900 shadow-2xs focus:outline-none"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition-all ${
                filter === cat.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat.label[language]}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {filteredSchemes.map((scheme) => (
          <SchemeCard key={scheme.id} scheme={scheme} />
        ))}
      </div>
    </div>
  );
}

export default function SchemesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">ஏற்றப்படுகிறது... (Loading...)</div>}>
      <SchemesContent />
    </Suspense>
  );
}
