'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TextScale } from '@/types';
import taTranslations from './ta.json';
import enTranslations from './en.json';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  textScale: TextScale;
  setTextScale: (scale: TextScale) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ta');
  const [textScale, setTextScaleState] = useState<TextScale>('normal');
  const [highContrast, setHighContrastState] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    // Load saved preferences
    try {
      const savedLang = localStorage.getItem('pds_lang') as Language;
      if (savedLang === 'ta' || savedLang === 'en') {
        setLanguageState(savedLang);
      }

      const savedScale = localStorage.getItem('pds_scale') as TextScale;
      if (savedScale) {
        setTextScale(savedScale);
      }

      const savedContrast = localStorage.getItem('pds_contrast') === 'true';
      if (savedContrast) {
        setHighContrastState(true);
        document.documentElement.classList.add('high-contrast');
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('pds_lang', lang);
      document.cookie = `pds_lang=${lang}; path=/; max-age=31536000`;
    } catch {}
  };

  const setTextScale = (scale: TextScale) => {
    setTextScaleState(scale);
    try {
      localStorage.setItem('pds_scale', scale);
    } catch {}
    
    // Update CSS variable
    const factor = scale === 'huge' ? '1.25' : scale === 'large' ? '1.12' : '1';
    document.documentElement.style.setProperty('--font-scale', factor);
  };

  const toggleHighContrast = () => {
    setHighContrastState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('pds_contrast', String(next));
      } catch {}
      if (next) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
      return next;
    });
  };

  const t = (key: string, fallback?: string): string => {
    const dict = language === 'ta' ? (taTranslations as Record<string, string>) : (enTranslations as Record<string, string>);
    return dict[key] || fallback || key;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        textScale,
        setTextScale,
        highContrast,
        toggleHighContrast,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
