'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/context';
import { Search, Mic, MicOff, ArrowRight } from 'lucide-react';

interface HeroSearchProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
}

export function HeroSearch({ initialQuery = '', onSearch }: HeroSearchProps) {
  const { language, t } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    // Check speech recognition support
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setSpeechSupported(!!SpeechRecognition);
    }
  }, []);

  const handleVoiceSearch = () => {
    if (!speechSupported) {
      alert(
        language === 'ta'
          ? 'உங்கள் உலாவியில் குரல் தேடல் ஆதரவு இல்லை. தட்டச்சு செய்து தேடவும்.'
          : 'Voice search is not supported in this browser. Please type to search.'
      );
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
      executeSearch(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const executeSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    if (onSearch) {
      onSearch(trimmed);
    } else {
      router.push(`/services?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const popularTags = [
    { label: language === 'ta' ? 'பட்டா மாறுதல்' : 'Patta Transfer', q: 'patta' },
    { label: language === 'ta' ? 'வருமான சான்றிதழ்' : 'Income Certificate', q: 'income' },
    { label: language === 'ta' ? 'PM கிசான்' : 'PM Kisan', q: 'kisan' },
    { label: language === 'ta' ? 'மகளிர் உரிமைத் தொகை' : 'Magalir Urimai', q: 'magalir' },
    { label: language === 'ta' ? 'சொட்டு நீர் பாசனம்' : 'Drip Irrigation', q: 'drip' },
    { label: language === 'ta' ? 'குடும்ப அட்டை' : 'Smart Ration Card', q: 'ration' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative flex-1 flex items-center shadow-lg rounded-2xl bg-white border-2 border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-200 transition-all overflow-hidden">
          <div className="pl-4 text-emerald-700">
            <Search className="w-6 h-6" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(
              'search_placeholder',
              'சேவை அல்லது திட்டத்தைத் தேடுங்கள் (பட்டா, வருமானம், PM கிசான்)...'
            )}
            className="w-full py-4 pl-3 pr-24 text-base sm:text-lg text-slate-900 bg-transparent placeholder-slate-400 focus:outline-none"
            aria-label="Search government services or schemes"
          />

          {/* Voice Search Button */}
          {speechSupported && (
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`p-2.5 mr-2 rounded-xl transition-all ${
                isListening
                  ? 'bg-rose-500 text-white animate-bounce'
                  : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
              }`}
              title={isListening ? 'கேட்கிறது...' : 'பேசித் தேடுங்கள் (Voice Search)'}
              aria-label="Voice search microphone"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}

          {/* Submit Search Button */}
          <button
            type="submit"
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 sm:px-6 py-4 font-bold flex items-center gap-1.5 transition-colors"
          >
            <span className="hidden xs:inline">{language === 'ta' ? 'தேடு' : 'Search'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Voice feedback indicator */}
      {isListening && (
        <div className="mt-2 text-center text-xs text-rose-600 font-bold animate-pulse">
          🎙️ {language === 'ta' ? 'உங்கள் குரலை கேட்கிறது... இப்போது பேசுங்கள்' : 'Listening... Speak now'}
        </div>
      )}

      {/* Quick Suggestion Pills */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        <span className="text-xs text-slate-500 font-medium">
          {language === 'ta' ? 'அடிக்கடி தேடப்படுபவை:' : 'Popular:'}
        </span>
        {popularTags.map((tag) => (
          <button
            key={tag.q}
            type="button"
            onClick={() => {
              setQuery(tag.label);
              executeSearch(tag.q);
            }}
            className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full border border-emerald-200 font-medium transition-colors"
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
}
