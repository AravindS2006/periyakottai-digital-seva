'use client';

import React from 'react';
import { useI18n } from '@/i18n/context';
import { Volume2, Sun, Moon, Type } from 'lucide-react';
import { speakText, stopSpeaking } from '@/lib/tts';

export function AccessibilityBar() {
  const { language, setLanguage, textScale, setTextScale, highContrast, toggleHighContrast } = useI18n();

  const handleAudioGuide = () => {
    const text = language === 'ta'
      ? 'பெரியகோட்டை டிஜிட்டல் சேவை தளத்திற்கு உங்களை வரவேற்கிறோம். அரசு சான்றிதழ்கள், விவசாய உதவிகள் மற்றும் நால்ரோடு மக்கள் இ-சேவை மையத்தின் நேரடி உதவிகளை நீங்கள் இங்கே எளிதாக பெறலாம்.'
      : 'Welcome to Periyakottai Digital Seva Platform. Discover government certificates, agricultural subsidies, and direct assistance from Nalroad Makkal e-Seva Centre.';
    speakText(text, language);
  };

  return (
    <div className="bg-emerald-900 text-white text-xs border-b border-emerald-800 py-1.5 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Village & Centre badge */}
        <div className="flex items-center gap-2 text-emerald-100">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium">
            {language === 'ta' ? 'ஒட்டன்சத்திரம் தாலுகா (624614)' : 'Oddanchatram Taluk (624614)'}
          </span>
          <span className="hidden sm:inline text-emerald-400">|</span>
          <span className="hidden sm:inline">
            {language === 'ta' ? 'நால்ரோடு மக்கள் இ-சேவை மையம்' : 'Nalroad Makkal e-Seva Centre'}
          </span>
        </div>

        {/* Right: Accessibility Controls */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          {/* Audio Quick Guide */}
          <button
            onClick={handleAudioGuide}
            className="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-700 px-2 py-1 rounded text-emerald-100 transition-colors"
            title={language === 'ta' ? 'குரல் வழிகாட்டி' : 'Voice Guide'}
            aria-label="Voice guide"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden xs:inline">{language === 'ta' ? 'குரல்' : 'Listen'}</span>
          </button>

          {/* Text Size Switcher */}
          <div className="flex items-center bg-emerald-800/80 rounded p-0.5" role="group" aria-label="Text size controls">
            <button
              onClick={() => setTextScale('normal')}
              className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                textScale === 'normal' ? 'bg-emerald-600 text-white' : 'text-emerald-200 hover:text-white'
              }`}
              title="இயல்பான எழுத்து (Normal)"
            >
              A-
            </button>
            <button
              onClick={() => setTextScale('large')}
              className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                textScale === 'large' ? 'bg-emerald-600 text-white' : 'text-emerald-200 hover:text-white'
              }`}
              title="பெரிய எழுத்து (Large)"
            >
              A
            </button>
            <button
              onClick={() => setTextScale('huge')}
              className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                textScale === 'huge' ? 'bg-emerald-600 text-white' : 'text-emerald-200 hover:text-white'
              }`}
              title="மிகப்பெரிய எழுத்து (Extra Large)"
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              highContrast ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100'
            }`}
            title={language === 'ta' ? 'வெளிச்ச பார்வை / மாறுபட்ட வண்ணம்' : 'High Contrast Mode'}
            aria-pressed={highContrast}
          >
            {highContrast ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {highContrast ? (language === 'ta' ? 'வெளிச்சம்' : 'High Contrast') : (language === 'ta' ? 'கான்ட்ராஸ்ட்' : 'Contrast')}
            </span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-emerald-950/70 rounded p-0.5 border border-emerald-700">
            <button
              onClick={() => setLanguage('ta')}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                language === 'ta' ? 'bg-amber-400 text-emerald-950 font-bold' : 'text-emerald-200 hover:text-white'
              }`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                language === 'en' ? 'bg-amber-400 text-emerald-950 font-bold' : 'text-emerald-200 hover:text-white'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
