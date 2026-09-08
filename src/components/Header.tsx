'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/i18n/context';
import { speakText } from '@/lib/tts';
import {
  Menu,
  X,
  PhoneCall,
  Sprout,
  FileText,
  Layers,
  Building2,
  Phone,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Newspaper,
  ChevronDown,
  ChevronRight,
  BookOpen,
  UserCheck,
  Sun,
  Moon,
  Volume2,
  MapPin,
  MessageCircle
} from 'lucide-react';

export function Header() {
  const {
    language,
    setLanguage,
    t,
    textScale,
    setTextScale,
    highContrast,
    toggleHighContrast
  } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const handleAudioGuide = () => {
    const text =
      language === 'ta'
        ? 'பெரியகோட்டை டிஜிட்டல் சேவை தளத்திற்கு உங்களை வரவேற்கிறோம். அரசு சான்றிதழ்கள், விவசாய உதவிகள், குடிமக்கள் குறைதீர்ப்பு மற்றும் நால்ரோடு மக்கள் இ-சேவை மையத்தின் நேரடி உதவிகளை நீங்கள் இங்கே எளிதாக பெறலாம்.'
        : 'Welcome to Periyakottai Digital Seva Platform. Access government certificates, agricultural subsidies, grievance redressal, and direct assistance from Nalroad Makkal e-Seva Centre.';
    speakText(text, language);
  };

  // Primary desktop navigation links (3 on standard desktop, 5 on wide screens)
  const coreDesktopLinks = [
    { href: '/services', label: t('nav_services', 'சேவைகள்'), icon: FileText },
    { href: '/schemes', label: t('nav_schemes', 'திட்டங்கள்'), icon: Layers },
    { href: '/farmer-hub', label: t('nav_farmer', 'விவசாய மையம்'), icon: Sprout },
  ];

  const extendedDesktopLinks = [
    { href: '/csc-centre', label: t('nav_centre', 'இ-சேவை மையம்'), icon: Building2 },
    { href: '/track', label: t('nav_track', 'நிலை அறிய'), icon: CheckCircle },
  ];

  // Secondary links placed inside "More ▾" dropdown on desktop
  const moreNavLinks = [
    {
      href: '/csc-centre',
      label: t('nav_centre', 'இ-சேவை மையம்'),
      desc: language === 'ta' ? 'நால்ரோடு மையம் & சேவைகள்' : 'Centre hours & services',
      icon: Building2,
      extraOnlyOnLg: true,
    },
    {
      href: '/track',
      label: t('nav_track', 'நிலை அறிய'),
      desc: language === 'ta' ? 'மனு & விண்ணப்ப நிலை நேரலை' : 'Track application status',
      icon: CheckCircle,
      extraOnlyOnLg: true,
    },
    {
      href: '/panchayat',
      label: t('nav_panchayat', 'பஞ்சாயத்து & குறைதீர்ப்பு'),
      desc: language === 'ta' ? 'குடிநீர், தெருவிளக்கு & பொது மனுக்கள்' : 'Civic issues & complaints',
      icon: HelpCircle
    },
    {
      href: '/news',
      label: t('nav_news', 'செய்திகள் & முகாம்கள்'),
      desc: language === 'ta' ? 'அரசு அறிவிப்புகள் & சிறப்பு முகாம்கள்' : 'Govt news & camp alerts',
      icon: Newspaper
    },
    {
      href: '/contacts',
      label: t('nav_contacts', 'முக்கிய தொடர்பு எண்கள்'),
      desc: language === 'ta' ? 'அவசர & வட்டார அரசு அலுவலர்கள்' : 'Emergency & directory',
      icon: Phone
    },
    {
      href: '/documents',
      label: language === 'ta' ? 'ஆவண வழிகாட்டி' : 'Documents Guide',
      desc: language === 'ta' ? 'தேவையான சான்றுகள் & படிவங்கள்' : 'Required docs & forms',
      icon: BookOpen
    },
    {
      href: '/operator',
      label: language === 'ta' ? 'ஆபரேட்டர் போர்டல்' : 'Operator Portal',
      desc: language === 'ta' ? 'மைய நிர்வாகம் & அமைப்புகள்' : 'Centre management',
      icon: UserCheck
    },
  ];

  // Combined navigation links for mobile drawer
  const drawerNavLinks = [
    { href: '/', label: t('nav_home', 'முகப்பு'), icon: Sparkles },
    ...coreDesktopLinks,
    ...extendedDesktopLinks,
    {
      href: '/panchayat',
      label: t('nav_panchayat', 'பஞ்சாயத்து & குறைதீர்ப்பு'),
      icon: HelpCircle
    },
    {
      href: '/news',
      label: t('nav_news', 'செய்திகள் & முகாம்கள்'),
      icon: Newspaper
    },
    {
      href: '/contacts',
      label: t('nav_contacts', 'முக்கிய தொடர்பு எண்கள்'),
      icon: Phone
    },
    {
      href: '/documents',
      label: language === 'ta' ? 'ஆவண வழிகாட்டி' : 'Documents Guide',
      icon: BookOpen
    },
    {
      href: '/operator',
      label: language === 'ta' ? 'ஆபரேட்டர் போர்டல்' : 'Operator Portal',
      icon: UserCheck
    },
  ];

  const isMoreActive = moreNavLinks.some((link) => pathname === link.href);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMoreMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // Close menus on page navigation
  useEffect(() => {
    setMoreMenuOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group min-w-0 shrink">
            <img
              src="/images/logo.png"
              alt="பெரியகோட்டை அரசு இ-சேவை இலச்சினை"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-xs border-2 border-emerald-600 group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="min-w-0">
              <div className="font-extrabold text-xs sm:text-sm lg:text-base text-slate-900 leading-tight truncate tracking-tight group-hover:text-emerald-900 transition-colors">
                {language === 'ta' ? 'பெரியகோட்டை டிஜிட்டல் சேவை' : 'Periyakottai Digital Seva'}
              </div>
              <div className="text-[10px] xl:text-xs text-emerald-700 font-semibold truncate hidden sm:block">
                {language === 'ta'
                  ? 'நால்ரோடு மக்கள் இ-சேவை மையம் (624614)'
                  : 'Nalroad Makkal e-Seva Centre (624614)'}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink min-w-0">
            {/* 3 Core links always visible on lg */}
            {coreDesktopLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-300/80 shadow-2xs'
                      : 'text-slate-700 hover:text-emerald-950 hover:bg-emerald-50/70'
                  }`}
                  style={{ minHeight: '36px' }}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-800' : 'text-slate-500'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Extended 2 links visible on xl screens to prevent header congestion */}
            {extendedDesktopLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-300/80 shadow-2xs'
                      : 'text-slate-700 hover:text-emerald-950 hover:bg-emerald-50/70'
                  }`}
                  style={{ minHeight: '36px' }}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-800' : 'text-slate-500'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* "More" Dropdown */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isMoreActive
                    ? 'bg-emerald-100 text-emerald-950 border border-emerald-300/80 shadow-2xs'
                    : 'text-slate-700 hover:text-emerald-950 hover:bg-emerald-50/70'
                }`}
                style={{ minHeight: '36px' }}
                aria-expanded={moreMenuOpen}
                aria-label="More navigation links"
              >
                <span>{language === 'ta' ? 'மேலும்' : 'More'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    moreMenuOpen ? 'rotate-180 text-emerald-800' : 'text-slate-500'
                  }`}
                />
                {isMoreActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                )}
              </button>

              {/* Floating Dropdown Panel */}
              {moreMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                    {language === 'ta' ? 'கூடுதல் சேவைகள் & தகவல்கள்' : 'Additional Services & Info'}
                  </div>
                  <div className="space-y-0.5">
                    {moreNavLinks.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      // On xl screens, hide the 2 links that are already visible in the top navbar
                      const isHiddenOnXl = item.extraOnlyOnLg;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMoreMenuOpen(false)}
                          className={`flex items-start gap-3 p-2 rounded-xl transition-colors ${
                            isHiddenOnXl ? 'xl:hidden' : ''
                          } ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-900'
                          }`}
                          style={{ minHeight: '40px' }}
                        >
                          <div
                            className={`p-2 rounded-lg shrink-0 ${
                              isActive ? 'bg-emerald-200/80 text-emerald-900' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold leading-tight">{item.label}</div>
                            <div className="text-[11px] text-slate-500 font-normal truncate mt-0.5">
                              {item.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action: Language Switcher on Desktop (Separated by clean border) */}
          <div className="hidden lg:flex items-center shrink-0 ml-2 xl:ml-4 pl-3 xl:pl-4 border-l border-slate-200">
            <div
              className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 shadow-2xs"
              role="group"
              aria-label="Language selection"
            >
              <button
                type="button"
                onClick={() => setLanguage('ta')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === 'ta'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                style={{ minHeight: '32px' }}
                title="தமிழ் மொழிக்கு மாற்றவும்"
              >
                தமிழ்
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                style={{ minHeight: '32px' }}
                title="Switch to English"
              >
                English
              </button>
            </div>
          </div>

          {/* Mobile Right Controls: Compact Language Switcher + Hamburger Button */}
          <div className="flex lg:hidden items-center gap-1.5 shrink-0">
            {/* Mobile Language Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLanguage('ta')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  language === 'ta'
                    ? 'bg-emerald-700 text-white shadow-xs font-black'
                    : 'text-slate-600'
                }`}
                style={{ minHeight: '30px' }}
              >
                தமிழ்
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-emerald-700 text-white shadow-xs font-black'
                    : 'text-slate-600'
                }`}
                style={{ minHeight: '30px' }}
              >
                EN
              </button>
            </div>

            {/* Hamburger Trigger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-xl text-slate-800 bg-slate-100 hover:bg-emerald-50 active:bg-emerald-100 border border-slate-200 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer shrink-0"
              style={{ minHeight: '40px' }}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-900" />
              ) : (
                <Menu className="w-5 h-5 text-slate-900" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu & Backdrop (100% responsive, zero horizontal overflow) */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop to tap outside to close */}
          <div
            className="fixed inset-0 top-16 sm:top-18 bg-slate-950/60 z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container: Attached neatly directly beneath the navbar, full width, zero overflow */}
          <div className="absolute top-full left-0 right-0 w-full z-40 bg-white border-b-2 border-emerald-600 shadow-2xl max-h-[calc(100dvh-4.5rem)] overflow-y-auto lg:hidden">
            {/* Drawer Header Badge */}
            <div className="px-4 py-3 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="/images/logo.png"
                  alt="இலச்சினை"
                  className="w-7 h-7 rounded-full object-cover border border-emerald-400 shrink-0"
                />
                <span className="font-bold text-xs text-white">
                  {language === 'ta' ? 'பெரியகோட்டை டிஜிட்டல் சேவை' : 'Periyakottai Digital Seva'}
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-200 bg-emerald-800/80 px-2 py-0.5 rounded-full border border-emerald-700">
                {language === 'ta' ? 'ஒட்டன்சத்திரம் தாலுகா (624614)' : 'Oddanchatram (624614)'}
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="p-3 space-y-1 divide-y divide-slate-100">
              {drawerNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <div key={link.href} className="pt-1 first:pt-0">
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-950 shadow-2xs border border-emerald-300'
                          : 'text-slate-800 hover:bg-slate-50'
                      }`}
                      style={{ minHeight: '44px' }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-800' : 'text-slate-500'}`} />
                        <span>{link.label}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-800' : 'text-slate-400'}`} />
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* Accessibility & Settings Controls Section */}
            <div className="p-3.5 m-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-black text-slate-800">
                  {language === 'ta' ? 'அணுகல்தன்மை & பார்வை அமைப்புகள்' : 'Display & Accessibility'}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                  {language === 'ta' ? 'அமைப்புகள்' : 'Settings'}
                </span>
              </div>

              {/* Text Size Scale */}
              <div>
                <div className="text-[11px] font-semibold text-slate-600 mb-1.5">
                  {language === 'ta' ? 'எழுத்து அளவு (Text Size):' : 'Text Size Scaling:'}
                </div>
                <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Text Size Controls">
                  <button
                    type="button"
                    onClick={() => setTextScale('normal')}
                    className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all text-center cursor-pointer border ${
                      textScale === 'normal'
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                    style={{ minHeight: '36px' }}
                  >
                    A- (இயல்பு)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextScale('large')}
                    className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all text-center cursor-pointer border ${
                      textScale === 'large'
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                    style={{ minHeight: '36px' }}
                  >
                    A (பெரியது)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextScale('huge')}
                    className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all text-center cursor-pointer border ${
                      textScale === 'huge'
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                    style={{ minHeight: '36px' }}
                  >
                    A+ (பெரிது)
                  </button>
                </div>
              </div>

              {/* Contrast Mode & Voice Assistant */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={toggleHighContrast}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    highContrast
                      ? 'bg-amber-400 text-slate-950 border-amber-500 font-black shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  style={{ minHeight: '38px' }}
                  aria-pressed={highContrast}
                >
                  {highContrast ? <Sun className="w-3.5 h-3.5 text-slate-950" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
                  <span>{highContrast ? (language === 'ta' ? 'வெளிச்சம்' : 'High Contrast') : (language === 'ta' ? 'கான்ட்ராஸ்ட்' : 'Contrast')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleAudioGuide}
                  className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                  style={{ minHeight: '38px' }}
                  title={language === 'ta' ? 'குரல் வழிகாட்டி கேட்க' : 'Listen to Voice Guide'}
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>{language === 'ta' ? 'குரல் உதவி' : 'Voice Guide'}</span>
                </button>
              </div>
            </div>

            {/* Operator Spotlight Card */}
            <div className="p-3.5 m-3 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-2xl shadow-md space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/images/murugesan.jpg"
                    alt="முருகேசன் கு"
                    className="w-10 h-10 rounded-xl object-cover border-2 border-amber-400 shadow shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-white">முருகேசன் கு</span>
                      <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded">
                        EFADGL0636
                      </span>
                    </div>
                    <div className="text-[10px] text-emerald-200 truncate">
                      நால்ரோடு மக்கள் இ-சேவை மையம்
                    </div>
                  </div>
                </div>

                <Link
                  href="/operator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[11px] bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold px-2 py-1 rounded-lg border border-emerald-700 shrink-0"
                  style={{ minHeight: '30px' }}
                >
                  போர்டல் →
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href="tel:9790382437"
                  className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 text-white py-2 px-2.5 rounded-xl text-xs font-bold shadow-xs active:scale-98 transition-all"
                  style={{ minHeight: '38px' }}
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
                  <span>97903 82437</span>
                </a>

                <a
                  href="https://wa.me/919790382437?text=வணக்கம்,%20பெரியகோட்டை%20டிஜிட்டல்%20சேவை%20வழியாக%20தொடர்பு%20கொள்கிறேன்."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 bg-emerald-800/90 hover:bg-emerald-800 text-white py-2 px-2.5 rounded-xl text-xs font-bold border border-emerald-600 transition-colors"
                  style={{ minHeight: '38px' }}
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
