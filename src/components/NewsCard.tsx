'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n/context';
import { NewsItem } from '@/types';
import { speakText, stopSpeaking } from '@/lib/tts';
import {
  Volume2,
  VolumeX,
  Share2,
  ExternalLink,
  Calendar,
  Building2,
  Sparkles,
  Radio,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface NewsCardProps {
  news: NewsItem;
  variant?: 'compact' | 'featured' | 'full';
}

export function NewsCard({ news, variant = 'full' }: NewsCardProps) {
  const { language } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);

  const title = news.title[language] || news.title.ta;
  const summary = news.summary[language] || news.summary.ta;
  const categoryLabel = news.categoryLabel[language] || news.categoryLabel.ta;

  const handleToggleAudio = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const narrationText = `${title}. ${summary}`;
      speakText(narrationText, language, () => {
        setIsPlaying(false);
      });
    }
  };

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'vision':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'agri':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'jobs':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'district':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'national':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const shareText = encodeURIComponent(
    `*${title}*\n\n${summary}\n\n👉 மேலும் விவரங்களுக்கு: பெரியகோட்டை டிஜிட்டல் சேவை & நால்ரோடு இ-சேவை மையம் (9790382437)`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;

  // Compact variant for hot section ticker or sidebar
  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getCategoryStyles(news.category)}`}>
              {categoryLabel}
            </span>
            {news.isLiveRss && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                <Radio className="w-2.5 h-2.5 animate-pulse text-rose-600" />
                <span>Live</span>
              </span>
            )}
          </div>
          <h4 className="font-bold text-slate-900 text-sm line-clamp-2 mb-1 leading-snug">
            {title}
          </h4>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {summary}
          </p>
        </div>

        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px] flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {news.publishDate}
          </span>
          <Link
            href={news.isLiveRss && news.sourceUrl ? news.sourceUrl : `/news/${news.id}`}
            target={news.isLiveRss ? '_blank' : '_self'}
            rel={news.isLiveRss ? 'noopener noreferrer' : undefined}
            className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1"
          >
            <span>{language === 'ta' ? 'படிக்க' : 'Read'}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    );
  }

  // Full / Featured variant
  return (
    <article
      className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
        news.featured
          ? 'border-emerald-300 shadow-md ring-1 ring-emerald-200'
          : 'border-slate-200 shadow-xs hover:shadow-lg'
      }`}
    >
      <div className="p-5 sm:p-6">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getCategoryStyles(news.category)}`}>
              {categoryLabel}
            </span>

            {news.important && (
              <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>{language === 'ta' ? 'முக்கிய அறிவிப்பு' : 'High Priority'}</span>
              </span>
            )}

            {news.isLiveRss && (
              <span className="flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                <Radio className="w-3 h-3 animate-pulse text-rose-600" />
                <span>{language === 'ta' ? 'நேரடி செய்தி' : 'Live Update'}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>{news.publishDate}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug mb-2 hover:text-emerald-800 transition-colors">
          {news.isLiveRss && news.sourceUrl ? (
            <a href={news.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {title}
            </a>
          ) : (
            <Link href={`/news/${news.id}`} className="hover:underline">
              {title}
            </Link>
          )}
        </h3>

        {/* Summary */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
          {summary}
        </p>

        {/* Source info */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-fit">
          <Building2 className="w-3.5 h-3.5 text-emerald-700" />
          <span className="font-medium text-slate-700">{news.source}</span>
          {!news.isLiveRss && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-slate-50/80 px-5 sm:px-6 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        {/* Audio TTS Button */}
        <button
          onClick={handleToggleAudio}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isPlaying
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300'
          }`}
          title={language === 'ta' ? 'செய்தியைக் கேட்க' : 'Listen to News'}
        >
          {isPlaying ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>{language === 'ta' ? 'நிறுத்து' : 'Stop'}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-700" />
              <span>{language === 'ta' ? 'கேட்க' : 'Listen'}</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          {/* WhatsApp Share */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            title={language === 'ta' ? 'வாட்ஸ்அப்பில் பகிரவும்' : 'Share on WhatsApp'}
            aria-label="Share on WhatsApp"
          >
            <Share2 className="w-4 h-4" />
          </a>

          {/* Read Full Details */}
          {news.isLiveRss && news.sourceUrl ? (
            <a
              href={news.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <span>{language === 'ta' ? 'செய்தியைப் பார்க்க' : 'View Source'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <Link
              href={`/news/${news.id}`}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <span>{language === 'ta' ? 'முழு விவரம்' : 'Full Story'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
