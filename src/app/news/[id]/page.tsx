'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/context';
import { VERIFIED_NEWS_DATA } from '@/data/newsData';
import { NewsItem } from '@/types';
import { speakText, stopSpeaking } from '@/lib/tts';
import {
  ArrowLeft,
  Calendar,
  Building2,
  Share2,
  Volume2,
  VolumeX,
  ExternalLink,
  CheckCircle2,
  FileCheck,
  PhoneCall,
  MapPin,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { language } = useI18n();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [article, setArticle] = useState<NewsItem | null>(null);

  useEffect(() => {
    const found = VERIFIED_NEWS_DATA.find((n) => n.id === resolvedParams.id);
    if (found) {
      setArticle(found);
    }
  }, [resolvedParams.id]);

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {language === 'ta' ? 'செய்தி கிடைக்கவில்லை' : 'Article Not Found'}
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          {language === 'ta'
            ? 'நீங்கள் தேடும் செய்தி முகவரி மாற்றப்பட்டிருக்கலாம் அல்லது நீக்கப்பட்டிருக்கலாம்.'
            : 'The requested article may have been moved or updated.'}
        </p>
        <Link
          href="/news"
          className="inline-flex items-center gap-2 bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ta' ? 'செய்திகள் பக்கத்திற்குத் திரும்புக' : 'Back to News'}</span>
        </Link>
      </div>
    );
  }

  const title = article.title[language] || article.title.ta;
  const summary = article.summary[language] || article.summary.ta;
  const content = article.content[language] || article.content.ta;
  const categoryLabel = article.categoryLabel[language] || article.categoryLabel.ta;

  const handleToggleAudio = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const narrationText = `${title}. ${summary}. ${content}`;
      speakText(narrationText, language, () => {
        setIsPlaying(false);
      });
    }
  };

  const shareText = encodeURIComponent(
    `*${title}*\n\n${summary}\n\n👉 உதவிக்கு: நால்ரோடு மக்கள் இ-சேவை மையம் (9790382437)`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;

  // Related news
  const relatedNews = VERIFIED_NEWS_DATA.filter(
    (n) => n.id !== article.id && (n.category === article.category || n.important)
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-emerald-700">
            {language === 'ta' ? 'முகப்பு' : 'Home'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/news" className="hover:text-emerald-700">
            {language === 'ta' ? 'செய்திகள்' : 'News'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 truncate max-w-xs">{title}</span>
        </nav>

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ta' ? 'பின்செல்க' : 'Back'}</span>
        </button>

        {/* Article Main Card */}
        <article className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {categoryLabel}
              </span>
              {article.important && (
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{language === 'ta' ? 'முக்கிய அறிவிப்பு' : 'High Priority'}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{article.publishDate}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            {title}
          </h1>

          {/* Source Authority Box */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span className="font-bold">{article.source}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>

            {article.sourceUrl && (
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1"
              >
                <span>{language === 'ta' ? 'அதிகாரப்பூர்வ தளம்' : 'Official Portal'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Audio & Share toolbar */}
          <div className="flex flex-wrap items-center gap-3 py-3 border-y border-slate-100">
            <button
              onClick={handleToggleAudio}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isPlaying
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
              }`}
            >
              {isPlaying ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>{language === 'ta' ? 'நிறுத்து' : 'Stop Audio'}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-700" />
                  <span>{language === 'ta' ? 'செய்தியைக் கேட்க (Audio)' : 'Listen to Story'}</span>
                </>
              )}
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{language === 'ta' ? 'வாட்ஸ்அப்பில் பகிர' : 'Share on WhatsApp'}</span>
            </a>
          </div>

          {/* Lead Summary */}
          <div className="bg-emerald-50/70 p-5 rounded-2xl border-l-4 border-emerald-600 text-slate-800 text-sm sm:text-base font-semibold leading-relaxed">
            {summary}
          </div>

          {/* Body Content */}
          <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
            {content}
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-400 mr-2">
                {language === 'ta' ? 'குறிச்சொற்கள்:' : 'Tags:'}
              </span>
              <div className="inline-flex flex-wrap gap-1.5 mt-1">
                {article.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Villager Action Box */}
        <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-black">
              {language === 'ta'
                ? 'பெரியகோட்டை கிராம மக்களுக்கான விண்ணப்ப உதவி'
                : 'Application Assistance for Periyakottai Villagers'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed max-w-xl">
              {language === 'ta'
                ? 'இந்த செய்தி தொடர்பான அரசு திட்டத்திற்கு விண்ணப்பிக்க தேவையான ஆவணங்கள் மற்றும் வழிகாட்டுதல்களை நால்ரோடு மக்கள் இ-சேவை மையத்தில் உடனடியாக பெற்றுக்கொள்ளலாம்.'
                : 'Get step-by-step assistance, document verification, and direct online application processing for this scheme at Nalroad Makkal e-Seva Centre.'}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-300 pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>நால்ரோடு சந்திப்பு, பெரியகோட்டை</span>
              </span>
              <span>•</span>
              <span className="font-semibold text-white">முருகேசன்: 97903 82437</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <a
              href="tel:9790382437"
              className="flex items-center justify-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black px-5 py-3 rounded-xl text-sm transition-all shadow"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{language === 'ta' ? 'உடனே அழைக்க' : 'Call Now'}</span>
            </a>
            <Link
              href="/services"
              className="flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors border border-emerald-700"
            >
              <FileCheck className="w-4 h-4" />
              <span>{language === 'ta' ? 'சேவை பட்டியல்' : 'All Services'}</span>
            </Link>
          </div>
        </div>

        {/* Related Articles */}
        {relatedNews.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-extrabold text-slate-900">
              {language === 'ta' ? 'தொடர்புடைய முக்கிய செய்திகள்' : 'Related Stories'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedNews.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/news/${rel.id}`}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {rel.categoryLabel[language] || rel.categoryLabel.ta}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-800 transition-colors mt-2 line-clamp-2">
                      {rel.title[language] || rel.title.ta}
                    </h4>
                  </div>
                  <div className="pt-2 mt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{rel.publishDate}</span>
                    <span className="text-emerald-700 font-bold group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
