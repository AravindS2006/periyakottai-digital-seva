'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useI18n } from '@/i18n/context';
import { ServiceCard } from '@/components/ServiceCard';
import { SERVICES_DATA } from '@/data/servicesData';
import { ServiceCategory } from '@/types';
import { searchFilter } from '@/lib/search';
import { Search, Filter, ShieldCheck, X } from 'lucide-react';

function ServicesContent() {
  const { language } = useI18n();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = (searchParams.get('category') as ServiceCategory) || 'all';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  useEffect(() => {
    if (initialQuery) setSearchQuery(initialQuery);
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialQuery, initialCategory]);

  const categories: { id: string; label: { ta: string; en: string } }[] = [
    { id: 'all', label: { ta: 'அனைத்து சேவைகள்', en: 'All Services' } },
    { id: 'revenue', label: { ta: 'வருவாய்த் துறை (சான்றிதழ்கள்)', en: 'Revenue (Certificates)' } },
    { id: 'land', label: { ta: 'நிலம் & பட்டா', en: 'Land & Patta' } },
    { id: 'civil_supplies', label: { ta: 'ரேஷன் அட்டை (TNPDS)', en: 'Ration Card (TNPDS)' } },
    { id: 'social_security', label: { ta: 'ஓய்வூதியம் (Pensions)', en: 'Pensions & Social Security' } },
    { id: 'agriculture', label: { ta: 'விவசாயம் & பாசனம்', en: 'Agriculture & Irrigation' } },
    { id: 'women_welfare', label: { ta: 'மகளிர் நலம் (Women)', en: 'Women Welfare' } },
    { id: 'identity', label: { ta: 'ஆதார் & பான் (Identity)', en: 'Aadhaar & PAN' } },
    { id: 'health_education', label: { ta: 'மருத்துவம் & கல்வி', en: 'Health & Education' } },
  ];

  const filteredServices = useMemo(() => {
    let result = SERVICES_DATA;

    if (selectedCategory !== 'all') {
      result = result.filter((s) => s.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      result = searchFilter(result, searchQuery, (s) => [
        s.name.ta,
        s.name.en,
        s.description.ta,
        s.description.en,
        s.department.ta,
        s.department.en,
        ...s.keywords
      ]);
    }

    return result;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>{language === 'ta' ? 'அதிகாரப்பூர்வ இ-சேவை அடைவு' : 'Official Service Directory'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950">
          {language === 'ta' ? 'அரசு சேவைகள் மற்றும் சான்றிதழ்கள்' : 'Government Services & Certificates'}
        </h1>
        <p className="text-xs sm:text-base text-slate-600 max-w-3xl">
          {language === 'ta'
            ? 'பெரியகோட்டை கிராம மக்கள் பெறக்கூடிய அனைத்து அரசு சான்றிதழ்கள், நில ஆவணங்கள், குடும்ப அட்டை மற்றும் நலத்திட்ட சேவைகளின் முழு விவரம்.'
            : 'Comprehensive directory of verified Tamil Nadu e-Sevai, revenue, land, and citizen documentation services.'}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'ta'
                ? 'சேவை பெயர் அல்லது ஆவணத்தைத் தேடுங்கள் (எ.கா: பட்டா, வருமானம், சாதி)...'
                : 'Search by service name or document (e.g., Patta, Income, Community)...'
            }
            className="w-full pl-10 pr-10 py-3.5 bg-white border-2 border-slate-300 focus:border-emerald-600 rounded-2xl text-sm sm:text-base text-slate-900 shadow-2xs focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'வகை:' : 'Category:'}</span>
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat.label[language]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-3">
        <span>
          {language === 'ta'
            ? `${filteredServices.length} சேவைகள் கண்டறியப்பட்டன`
            : `Showing ${filteredServices.length} services`}
        </span>
        {(searchQuery || selectedCategory !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-emerald-700 hover:underline font-bold"
          >
            {language === 'ta' ? 'அனைத்து வடிகட்டிகளையும் நீக்கு' : 'Reset filters'}
          </button>
        )}
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-slate-200 space-y-3">
          <p className="text-base font-bold text-slate-800">
            {language === 'ta' ? 'பொருத்தமான சேவைகள் கிடைக்கவில்லை' : 'No matching services found'}
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {language === 'ta'
              ? 'வேறு வார்த்தைகளை பயன்படுத்தி தேடவும் அல்லது நால்ரோடு மக்கள் இ-சேவை மையத்தை (9790382437) நேரடியாக தொடர்பு கொள்ளவும்.'
              : 'Try using different keywords or contact Nalroad e-Seva Centre (9790382437) directly.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            {language === 'ta' ? 'அனைத்து சேவைகளையும் காட்டுக' : 'Show all services'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">ஏற்றப்படுகிறது... (Loading...)</div>}>
      <ServicesContent />
    </Suspense>
  );
}
