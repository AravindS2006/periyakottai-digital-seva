'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useI18n } from '@/i18n/context';
import { NewsCard } from '@/components/NewsCard';
import { NewsCategory, NewsItem } from '@/types';
import {
  Newspaper,
  Search,
  Radio,
  Sparkles,
  RefreshCw,
  Filter,
  CheckCircle2,
  Building2,
  PhoneCall,
  Volume2,
  AlertCircle
} from 'lucide-react';
import { speakText } from '@/lib/tts';

const CATEGORIES: { id: NewsCategory; label: { ta: string; en: string }; icon: string }[] = [
  { id: 'all', label: { ta: 'அனைத்து செய்திகள்', en: 'All News' }, icon: '🌐' },
  { id: 'vision', label: { ta: 'தமிழ்நாடு அரசு திட்டங்கள்', en: 'TN Govt Vision' }, icon: '🏛️' },
  { id: 'agri', label: { ta: 'விவசாயம் & சந்தை', en: 'Agriculture & Market' }, icon: '🌾' },
  { id: 'jobs', label: { ta: 'வேலைவாய்ப்பு & கல்வி', en: 'Jobs & Skills' }, icon: '🎓' },
  { id: 'district', label: { ta: 'திண்டுக்கல் & ஒட்டன்சத்திரம்', en: 'Dindigul & Oddanchatram' }, icon: '📍' },
  { id: 'national', label: { ta: 'மத்திய அரசுத் திட்டங்கள்', en: 'National Schemes' }, icon: '🇮🇳' },
];

export default function NewsPage() {
  const { language } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isPending, startTransition] = useTransition();

  const fetchNews = async (category: NewsCategory, query: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (query) params.append('q', query);

      const res = await fetch(`/api/news?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setNewsList(data.items);
        setLastUpdated(new Date(data.lastUpdated || Date.now()).toLocaleTimeString());
      }
    } catch (err) {
      console.error('Failed to fetch news:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews(selectedCategory, searchQuery);
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNews(selectedCategory, searchQuery);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNews(selectedCategory, searchQuery);
  };

  const breakingNews = newsList.find(n => n.important) || newsList[0];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breaking News Marquee / Banner */}
        {breakingNews && (
          <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-2xl p-4 shadow-md flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <span className="flex items-center gap-1.5 bg-white text-red-700 font-extrabold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 shadow-xs">
                <Radio className="w-3.5 h-3.5 animate-pulse text-red-600" />
                {language === 'ta' ? 'முக்கிய செய்தி' : 'Breaking News'}
              </span>
              <p className="text-xs sm:text-sm font-bold break-words line-clamp-2 md:line-clamp-1">
                {breakingNews.title[language] || breakingNews.title.ta}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                onClick={() =>
                  speakText(
                    breakingNews.title[language] || breakingNews.title.ta,
                    language
                  )
                }
                className="text-xs bg-red-800/80 hover:bg-red-800 text-white px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                title="செய்தியைக் கேட்க"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'ta' ? 'கேட்க' : 'Listen'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Hero Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {language === 'ta'
                    ? 'தமிழ்நாடு அரசு தொலைநோக்கு & நேரடி தகவல் தளம்'
                    : 'TN Govt Vision & Real-time Citizen News'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                {language === 'ta'
                  ? 'அரசு திட்டங்கள் & முக்கிய செய்திகள்'
                  : 'Tamil Nadu Govt Vision & News Hub'}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
                {language === 'ta'
                  ? 'தமிழ்நாடு அரசின் தொலைநோக்குத் திட்டங்கள் (கலைஞர் கனவு இல்லம், மக்களைத் தேடி மருத்துவம், காலை உணவு திட்டம்), ஒட்டன்சத்திரம் வேளாண் சந்தை நிலவரம் மற்றும் நேரடி அரசு செய்திகள் உடனுக்குடன்.'
                  : 'Up-to-date notifications on flagship Tamil Nadu government policies, agricultural alerts, Oddanchatram mandi updates, and live verified public news.'}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-emerald-700' : ''}`} />
                <span>{language === 'ta' ? 'செய்திகளைப் புதுப்பிக்க' : 'Refresh Live Feeds'}</span>
              </button>

              <a
                href="tel:9790382437"
                className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-emerald-200" />
                <span>{language === 'ta' ? 'மைய உதவி: 97903 82437' : 'e-Seva: 97903 82437'}</span>
              </a>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-6 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'ta'
                    ? 'செய்தி அல்லது திட்டப் பெயரைத் தேடுங்கள் (எ.கா: கனவு இல்லம், PM-கிசான், மார்க்கெட், TNPSC)...'
                    : 'Search news, schemes, or alerts (e.g. Kanavu Illam, PM-KISAN, Market, TNPSC)...'
                }
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors shrink-0"
            >
              {language === 'ta' ? 'தேடுக' : 'Search'}
            </button>
          </form>

          {/* Category Tabs */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label[language]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* News Feed Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {language === 'ta'
                  ? `${newsList.length} தகவல்கள் கண்டறியப்பட்டன`
                  : `${newsList.length} items found`}
              </span>
              {lastUpdated && (
                <span className="text-xs text-slate-400 hidden sm:inline">
                  ({language === 'ta' ? 'புதுப்பிக்கப்பட்டது' : 'Updated'}: {lastUpdated})
                </span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4"
                >
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-6 bg-slate-200 rounded w-5/6"></div>
                  <div className="h-16 bg-slate-100 rounded"></div>
                  <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : newsList.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">
                {language === 'ta' ? 'செய்திகள் எதுவும் கிடைக்கவில்லை' : 'No news items found'}
              </h3>
              <p className="text-sm text-slate-500">
                {language === 'ta'
                  ? 'தேடல் சொல்லை மாற்றி முயற்சிக்கவும் அல்லது அனைத்து செய்திகள் பகுதியை தேர்வு செய்யவும்.'
                  : 'Try adjusting your search terms or switch back to All News.'}
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  fetchNews('all', '');
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                {language === 'ta' ? 'அனைத்து செய்திகளையும் பார்க்க' : 'View All News'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsList.map((item) => (
                <NewsCard key={item.id} news={item} variant="full" />
              ))}
            </div>
          )}
        </section>

        {/* Bottom Local Help Callout */}
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>{language === 'ta' ? 'நால்ரோடு மக்கள் இ-சேவை மையம்' : 'Nalroad Makkal e-Seva Centre'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              {language === 'ta'
                ? 'செய்தியில் உள்ள திட்டங்களுக்கு உடனடியாக விண்ணப்பிக்க வேண்டுமா?'
                : 'Need to apply for any scheme mentioned in the news?'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl leading-relaxed">
              {language === 'ta'
                ? 'கலைஞர் கனவு இல்லம், மகளிர் உரிமைத் திட்டம், PM கிசான் e-KYC மற்றும் புதிய குடும்ப அட்டைக்கு தேவையான ஆவணங்களுடன் நால்ரோடு சந்திப்பில் உள்ள நமது இ-சேவை மையத்திற்கு நேரில் வரவும்.'
                : 'Visit Nalroad e-Seva Centre with your documents for hassle-free online applications for Kalaignar Kanavu Illam, Magalir Urimai Thogai, PM-KISAN, and smart ration cards.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
              href="tel:9790382437"
              className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold px-6 py-3.5 rounded-xl text-sm transition-all shadow"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{language === 'ta' ? 'அழைக்க: 97903 82437' : 'Call: 97903 82437'}</span>
            </a>
            <a
              href="https://wa.me/919790382437?text=வணக்கம்,%20செய்தியில்%20பார்த்த%20அரசு%20திட்டத்திற்கு%20விண்ணப்பிக்க%20விரும்புகிறேன்."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-colors border border-emerald-700"
            >
              <span>WhatsApp உதவி</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
