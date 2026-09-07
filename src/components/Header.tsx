'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/i18n/context';
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
  BookOpen,
  UserCheck
} from 'lucide-react';

export function Header() {
  const { language, t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Primary desktop navigation links (essential everyday services)
  const primaryNavLinks = [
    { href: '/services', label: t('nav_services', 'சேவைகள்'), icon: FileText },
    { href: '/schemes', label: t('nav_schemes', 'திட்டங்கள்'), icon: Layers },
    { href: '/farmer-hub', label: t('nav_farmer', 'விவசாய மையம்'), icon: Sprout },
    { href: '/csc-centre', label: t('nav_centre', 'இ-சேவை மையம்'), icon: Building2 },
    { href: '/track', label: t('nav_track', 'நிலை அறிய'), icon: CheckCircle },
  ];

  // Secondary links placed inside clean "More ▾" dropdown on desktop
  const moreNavLinks = [
    {
      href: '/news',
      label: t('nav_news', 'செய்திகள் & முகாம்கள்'),
      desc: language === 'ta' ? 'அரசு அறிவிப்புகள் & சிறப்பு முகாம்கள்' : 'Govt news & camp alerts',
      icon: Newspaper
    },
    {
      href: '/panchayat',
      label: t('nav_panchayat', 'பஞ்சாயத்து & குறைதீர்ப்பு'),
      desc: language === 'ta' ? 'குடிநீர், தெருவிளக்கு & பொது மனுக்கள்' : 'Civic issues & complaints',
      icon: HelpCircle
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

  // Combined links for mobile drawer
  const mobileNavLinks = [
    { href: '/', label: t('nav_home', 'முகப்பு'), icon: Sparkles },
    ...primaryNavLinks,
    ...moreNavLinks,
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
        <div className="flex items-center justify-between h-18 lg:h-20 gap-3">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0 shrink-0">
            <img
              src="/images/logo.png"
              alt="பெரியாக்கோட்டை அரசு இ-சேவை இலச்சினை"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shadow-xs border-2 border-emerald-600 group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="min-w-0">
              <div className="font-extrabold text-xs sm:text-base lg:text-lg xl:text-xl text-emerald-950 leading-tight whitespace-nowrap">
                {language === 'ta' ? 'பெரியாக்கோட்டை டிஜிட்டல் சேவை' : 'Periyakottai Digital Seva'}
              </div>
              <div className="text-[10px] xl:text-xs text-emerald-700 font-medium whitespace-nowrap">
                {language === 'ta'
                  ? 'நால்ரோடு மக்கள் இ-சேவை மையம் (624614)'
                  : 'Nalroad Makkal e-Seva Centre (624614)'}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation: Uncongested & Spacious */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink min-w-0">
            {primaryNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300/80 shadow-2xs'
                      : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${isActive ? 'text-emerald-800' : 'text-slate-500'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* "More" Dropdown Menu */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 xl:px-3 xl:py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all whitespace-nowrap ${
                  isMoreActive
                    ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300/80 shadow-2xs'
                    : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50/60'
                }`}
                aria-expanded={moreMenuOpen}
                aria-label="More menu options"
              >
                <span>{language === 'ta' ? 'மேலும்' : 'More'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 xl:w-4 xl:h-4 transition-transform duration-200 ${
                    moreMenuOpen ? 'rotate-180 text-emerald-800' : 'text-slate-500'
                  }`}
                />
                {isMoreActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                )}
              </button>

              {/* Dropdown Floating Panel */}
              {moreMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                    {language === 'ta' ? 'கூடுதல் சேவைகள் & தகவல்கள்' : 'Additional Services & Info'}
                  </div>
                  <div className="space-y-0.5">
                    {moreNavLinks.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMoreMenuOpen(false)}
                          className={`flex items-start gap-3 p-2 rounded-xl transition-colors ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-900'
                          }`}
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

          {/* Call Operator Button */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <a
              href="tel:9790382437"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white px-3 py-1.5 xl:px-4 xl:py-2 rounded-xl text-xs xl:text-sm font-bold shadow-xs hover:shadow transition-all shrink-0"
              title="முருகேசன் கே - நால்ரோடு இ-சேவை மையம்"
            >
              <PhoneCall className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-emerald-300 animate-pulse shrink-0" />
              <div className="text-left leading-tight">
                <span className="hidden xl:block text-[9px] text-emerald-200 uppercase tracking-wider font-semibold">
                  {language === 'ta' ? 'இ-சேவை உதவி' : 'e-Seva Help'}
                </span>
                <span className="tracking-wide">97903 82437</span>
              </div>
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href="tel:9790382437"
              className="p-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 sm:hidden flex items-center justify-center w-10 h-10 border border-emerald-200 transition-colors"
              aria-label="Call Centre"
            >
              <PhoneCall className="w-5 h-5 text-emerald-700" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 active:bg-emerald-100 transition-colors flex items-center justify-center w-10 h-10 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-800" />
              ) : (
                <Menu className="w-6 h-6 text-slate-800" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation & Backdrop */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop Overlay to close on tap */}
          <div
            className="fixed inset-0 top-18 sm:top-20 bg-slate-950/50 backdrop-blur-xs z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Menu Container */}
          <div className="absolute top-full left-0 right-0 z-40 bg-white border-b-2 border-emerald-600 shadow-2xl max-h-[calc(100dvh-5rem)] overflow-y-auto lg:hidden animate-in slide-in-from-top duration-200">
            {/* Operator Spotlight Card in Drawer */}
            <div className="p-4 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src="/images/murugesan.jpg"
                  alt="முருகேசன் கே"
                  className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400 shadow-md shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-white">முருகேசன் கே</span>
                    <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded">
                      EFADGL0636
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-200">
                    நால்ரோடு மக்கள் இ-சேவை மையம் (624614)
                  </p>
                </div>
              </div>

              <Link
                href="/murugesan"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-2.5 py-1.5 rounded-lg shrink-0 border border-emerald-500"
              >
                சுயவிவரம் →
              </Link>
            </div>

            {/* Navigation Links with Clean Dividers */}
            <nav className="p-3 space-y-1 divide-y divide-slate-100">
              {mobileNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <div key={link.href} className="pt-1 first:pt-0">
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-950 font-black shadow-xs'
                          : 'text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-800' : 'text-slate-500'}`} />
                        <span>{link.label}</span>
                      </div>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      )}
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* Operator Quick Access Link & Call Button */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-600 font-semibold px-1">
                <span>மைய மேலாண்மை:</span>
                <Link
                  href="/operator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-emerald-700 hover:text-emerald-900 font-extrabold flex items-center gap-1"
                >
                  <span>ஆபரேட்டர் போர்டல்</span>
                  <span>→</span>
                </Link>
              </div>

              <a
                href="tel:9790382437"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white py-3 rounded-xl font-extrabold shadow-sm transition-transform active:scale-98"
              >
                <PhoneCall className="w-4 h-4 text-emerald-300 animate-pulse" />
                <span>{language === 'ta' ? 'மையத்தை அழைக்க: 97903 82437' : 'Call Centre: 97903 82437'}</span>
              </a>
            </div>
          </div>
        </>
      )}
    </header>
  );
}


