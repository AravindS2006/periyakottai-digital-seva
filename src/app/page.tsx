'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n/context';
import { HeroSearch } from '@/components/HeroSearch';
import { ServiceCard } from '@/components/ServiceCard';
import { SchemeCard } from '@/components/SchemeCard';
import { NewsCard } from '@/components/NewsCard';
import { SERVICES_DATA } from '@/data/servicesData';
import { SCHEMES_DATA } from '@/data/schemesData';
import { VERIFIED_NEWS_DATA } from '@/data/newsData';
import { ODDANCHATRAM_CROP_PRICES, ODDANCHATRAM_MARKET_WHATSAPP_LINK } from '@/data/farmerAdvisoryData';

import { RequestModal } from '@/components/RequestModal';
import { VoiceAssistButton } from '@/components/VoiceAssistButton';
import {
  Sprout,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  FileText,
  HelpCircle,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  ChevronDown,
  Building2,
  Calendar,
  Newspaper,
  Radio,
  Megaphone,
  AlertCircle
} from 'lucide-react';


export default function HomePage() {
  const { language, t } = useI18n();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<{ id: string; name: string }>({
    id: 'general_assistance',
    name: language === 'ta' ? 'பொது இ-சேவை உதவி' : 'General e-Seva Help'
  });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const popularServices = SERVICES_DATA.filter((s) => s.popular).slice(0, 6);
  const featuredSchemes = SCHEMES_DATA.filter((s) => s.featured).slice(0, 3);

  const [hotNews, setHotNews] = useState(() =>
    VERIFIED_NEWS_DATA.filter((n) => n.featured || n.important).slice(0, 3)
  );
  const [platformSettings, setPlatformSettings] = useState<{
    centreStatus?: 'open' | 'closed' | 'camp' | 'temp_closed';
    statusNote?: { ta: string; en: string };
    operatingHours?: { ta: string; en: string };
    primaryPhone?: string;
    marketWhatsAppUrl?: string;
    announcementBanner?: {
      enabled: boolean;
      text: { ta: string; en: string };
      type: 'info' | 'warning' | 'alert';
    };
  } | null>(null);

  useEffect(() => {
    fetch('/api/news?featured=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          setHotNews(data.items.slice(0, 3));
        }
      })
      .catch((err) => console.error('Error fetching hot news:', err));

    let lastFetched = Date.now();
    const loadSettings = () => {
      lastFetched = Date.now();
      fetch('/api/settings', { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.settings) {
            setPlatformSettings(data.settings);
          }
        })
        .catch((err) => console.error('Error fetching platform settings:', err));
    };

    loadSettings();

    // Re-check only when tab becomes visible after at least 2 minutes of inactivity (protects Vercel free limits)
    const onVisible = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastFetched > 120000) {
        loadSettings();
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);


  const roleCards = [
    {
      role: 'farmer',
      title: t('role_farmer', 'நான் ஒரு விவசாயி'),
      subtitle: t('role_farmer_sub', 'பயிர் காப்பீடு, சொட்டு நீர், PM-கிசான் & உர மானியம்'),
      icon: '👨‍🌾',
      href: '/farmer-hub',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
    },
    {
      role: 'woman',
      title: t('role_woman', 'பெண்களுக்கான திட்டங்கள்'),
      subtitle: t('role_woman_sub', 'மகளிர் உரிமைத் தொகை, புதுமைப் பெண் & பிரசவ உதவி'),
      icon: '👩',
      href: '/schemes?filter=women',
      bgColor: 'bg-rose-50 hover:bg-rose-100 border-rose-200'
    },
    {
      role: 'senior',
      title: t('role_senior', 'மூத்த குடிமக்கள்'),
      subtitle: t('role_senior_sub', 'முதியோர் உதவித்தொகை & மருத்துவக் காப்பீடு'),
      icon: '👵',
      href: '/schemes?filter=senior',
      bgColor: 'bg-amber-50 hover:bg-amber-100 border-amber-200'
    },
    {
      role: 'student',
      title: t('role_student', 'நான் ஒரு மாணவர்'),
      subtitle: t('role_student_sub', 'படிப்பு உதவித்தொகை, சான்றிதழ்கள் & கலந்தாய்வு'),
      icon: '🎓',
      href: '/schemes?filter=student',
      bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
    },
    {
      role: 'land',
      title: t('role_land', 'நிலம் & வீடு'),
      subtitle: t('role_land_sub', 'பட்டா மாறுதல், சிட்டா நகல், கலைஞர் கனவு இல்லம்'),
      icon: '🏠',
      href: '/services?category=land',
      bgColor: 'bg-orange-50 hover:bg-orange-100 border-orange-200'
    },
    {
      role: 'labour',
      title: t('role_labour', 'கூலி & தொழிலாளர்'),
      subtitle: t('role_labour_sub', 'உழவர் பாதுகாப்பு அட்டை & 100 நாள் வேலை'),
      icon: '💼',
      href: '/services?category=social_security',
      bgColor: 'bg-teal-50 hover:bg-teal-100 border-teal-200'
    }
  ];

  const faqs = [
    {
      q: {
        ta: 'பட்டா பெயர் மாற்றம் செய்ய நால்ரோடு இ-சேவை மையத்திற்கு என்னென்ன ஆவணங்கள் கொண்டு வர வேண்டும்?',
        en: 'What documents should I bring to Nalroad e-Seva Centre for Patta transfer?'
      },
      a: {
        ta: 'பதிவு செய்யப்பட்ட கிரையப் பத்திரம் (Sale Deed) நகல், முந்தைய மூலப் பத்திரம், தற்போதைய பட்டா நகல் அல்லது எண், வில்லங்கச் சான்றிதழ் (EC) மற்றும் உங்கள் ஆதார் அட்டை ஆகியவற்றை கொண்டு வர வேண்டும்.',
        en: 'Registered Sale Deed copy, parent document, current Patta copy/number, Encumbrance Certificate (EC), and applicant Aadhaar card.'
      }
    },
    {
      q: {
        ta: 'சொட்டு நீர் பாசனத்திற்கு 100% மானியம் பெற யார் தகுதியானவர்கள்?',
        en: 'Who is eligible for 100% subsidy on drip irrigation?'
      },
      a: {
        ta: '2.5 ஏக்கர் வரை நன்செய் நிலம் அல்லது 5 ஏக்கர் வரை புன்செய் நிலம் வைத்து சிறு/குறு விவசாயி சான்றிதழ் பெற்றுள்ள விவசாயிகளுக்கு தோட்டக்கலைத் துறை மூலம் 100% மானியம் வழங்கப்படுகிறது.',
        en: 'Small and marginal farmers holding up to 2.5 acres of wetland or 5 acres of dryland with a valid Small/Marginal Farmer Certificate qualify for 100% subsidy via Horticulture Dept.'
      }
    },
    {
      q: {
        ta: 'முதியோர் உதவித்தொகை (OAP) வாங்க வயது வரம்பு என்ன? எவ்வளவு தொகை கிடைக்கும்?',
        en: 'What is the age limit for Old Age Pension and what is the monthly amount?'
      },
      a: {
        ta: 'விண்ணப்பதாரருக்கு 60 வயது பூர்த்தியடைந்திருக்க வேண்டும். வறுமைக்கோட்டிற்கு கீழ் வாழும் ஆதரவற்ற முதியோர்களுக்கு மாதம் ₹1,000 வங்கி கணக்கில் நேரடியாக வரவு வைக்கப்படும்.',
        en: 'The applicant must be 60 years or older with no steady income. Eligible destitute seniors receive ₹1,000 per month credited directly to bank account.'
      }
    },
    {
      q: {
        ta: 'இணையதளத்தில் விண்ணப்பம் செய்யத் தெரியாவிட்டால் மையத்தை எவ்வாறு தொடர்பு கொள்ளலாம்?',
        en: 'How do I get help if I cannot use this website myself?'
      },
      a: {
        ta: 'கவலை வேண்டாம்! திரையின் வலது கீழ் மூலையில் உள்ள தொலைபேசி பொத்தானை அழுத்தி நால்ரோடு மைய ஆபரேட்டர் முருகேசன் கே (9790382437) அவர்களை நேரடியாக அழைக்கலாம் அல்லது மையத்திற்கு நேரில் வரலாம்.',
        en: 'No worries! Click the green call button at bottom right to reach centre operator Murugesan K directly at 9790382437 or visit the centre in person.'
      }
    }
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. URGENT ANNOUNCEMENT BANNER - FULL VISIBILITY & CUSTOMER PROMINENCE */}
      {platformSettings?.announcementBanner?.enabled !== false && (
        <section
          aria-label="Urgent Announcements"
          className={`py-3.5 px-4 sm:px-6 border-b-2 shadow-sm transition-colors ${
            platformSettings?.announcementBanner?.type === 'alert'
              ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white border-red-800'
              : platformSettings?.announcementBanner?.type === 'info'
              ? 'bg-gradient-to-r from-sky-700 to-blue-800 text-white border-sky-900'
              : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-600'
          }`}
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-start gap-3 w-full">
              <div
                className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  platformSettings?.announcementBanner?.type === 'alert'
                    ? 'bg-white/20 text-white'
                    : platformSettings?.announcementBanner?.type === 'info'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-950 text-amber-300'
                }`}
              >
                <Megaphone className="w-5 h-5 animate-bounce" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      platformSettings?.announcementBanner?.type === 'alert'
                        ? 'bg-white text-red-700'
                        : platformSettings?.announcementBanner?.type === 'info'
                        ? 'bg-white text-sky-800'
                        : 'bg-slate-950 text-amber-300'
                    }`}
                  >
                    <span>{language === 'ta' ? 'முக்கிய அறிவிப்பு' : 'Live Notice'}</span>
                  </span>

                  <span className="text-[11px] opacity-85 font-bold">
                    {language === 'ta' ? 'நால்ரோடு மக்கள் இ-சேவை மையம்' : 'Nalroad Makkal e-Seva'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-black leading-snug break-words">
                  {platformSettings?.announcementBanner?.text?.[language] ||
                    (language === 'ta'
                      ? '📢 PM கிசான் 19-வது தவணை e-KYC முகாம் & சொட்டு நீர் பாசன 100% மானிய பதிவு நால்ரோடு மையத்தில் நடைபெறுகிறது. தொடர்புக்கு: 97903 82437.'
                      : '📢 PM-KISAN 19th installment e-KYC camp & 100% drip subsidy registration open at Nalroad Centre. Call: 97903 82437.')}
                </p>
              </div>
            </div>

            {/* Quick Action & Voice Readout */}
            <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-1 md:pt-0">
              <VoiceAssistButton
                textToSpeak={
                  platformSettings?.announcementBanner?.text?.[language] ||
                  (language === 'ta'
                    ? 'PM கிசான் 19-வது தவணை e-KYC முகாம் மற்றும் சொட்டு நீர் பாசன 100% மானிய பதிவு நால்ரோடு மையத்தில் நடைபெறுகிறது.'
                    : 'PM-KISAN 19th installment e-KYC camp and drip subsidy registration open at Nalroad Centre.')
                }
                size="sm"
              />
              <Link
                href="/csc-centre"
                className={`text-xs font-black px-3.5 py-2 rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-1 ${
                  platformSettings?.announcementBanner?.type === 'alert' ||
                  platformSettings?.announcementBanner?.type === 'info'
                    ? 'bg-white text-slate-900 hover:bg-slate-100'
                    : 'bg-slate-950 text-white hover:bg-slate-800'
                }`}
              >
                <span>{language === 'ta' ? 'விவரம் பார்க்க' : 'View Details'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 2. HERO EXPERIENCE */}
      <section className="relative pt-4 sm:pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* REAL-TIME CENTRE OPERATIONAL STATUS INDICATOR (CLICKABLE TO CSC CENTRE) */}
          <div className="flex items-center justify-center">
            <Link
              href="/csc-centre"
              title={
                language === 'ta'
                  ? 'மையத்தின் முழு விவரம், முகவரி & வழிகாட்டுதல் பார்க்க கிளிக் செய்யவும்'
                  : 'Click to view full centre details, address & directions'
              }
              className={`group inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl text-xs sm:text-sm font-black border-2 shadow-xs hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer ${
                platformSettings?.centreStatus === 'temp_closed'
                  ? 'bg-orange-50 hover:bg-orange-100/90 border-orange-400 text-orange-950'
                  : platformSettings?.centreStatus === 'camp'
                  ? 'bg-amber-50 hover:bg-amber-100/90 border-amber-400 text-amber-950'
                  : platformSettings?.centreStatus === 'closed'
                  ? 'bg-rose-50 hover:bg-rose-100/90 border-rose-400 text-rose-950'
                  : 'bg-emerald-50 hover:bg-emerald-100/90 border-emerald-500 text-emerald-950'
              }`}
            >
              {/* Pulsing indicator dot */}
              <span className="relative flex h-3 w-3 shrink-0">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    platformSettings?.centreStatus === 'temp_closed'
                      ? 'bg-orange-400'
                      : platformSettings?.centreStatus === 'camp'
                      ? 'bg-amber-400'
                      : platformSettings?.centreStatus === 'closed'
                      ? 'bg-rose-400'
                      : 'bg-emerald-400'
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    platformSettings?.centreStatus === 'temp_closed'
                      ? 'bg-orange-500'
                      : platformSettings?.centreStatus === 'camp'
                      ? 'bg-amber-500'
                      : platformSettings?.centreStatus === 'closed'
                      ? 'bg-rose-500'
                      : 'bg-emerald-500'
                  }`}
                ></span>
              </span>

              {/* Status Text */}
              <span className="whitespace-nowrap">
                {platformSettings?.centreStatus === 'temp_closed'
                  ? language === 'ta'
                    ? '🟠 தற்காலிகமாக வெளியே சென்றுள்ளார் (Temporarily Away)'
                    : '🟠 Temporarily Stepped Out'
                  : platformSettings?.centreStatus === 'camp'
                  ? language === 'ta'
                    ? '🟡 கிராம கள முகாமில் உள்ளார் (In Field Camp)'
                    : '🟡 In Village Field Camp'
                  : platformSettings?.centreStatus === 'closed'
                  ? language === 'ta'
                    ? '🔴 மையம் மூடப்பட்டுள்ளது (Centre is Closed)'
                    : '🔴 Centre is Closed'
                  : language === 'ta'
                  ? '🟢 மையம் தற்போது திறந்துள்ளது (Centre is OPEN)'
                  : '🟢 Centre is Currently OPEN'}
              </span>

              <span className="hidden sm:inline text-slate-400 select-none">|</span>

              {/* Note / Timing & Direct Call or Directions */}
              <span className="text-[11px] sm:text-xs font-semibold whitespace-nowrap text-slate-700">
                {(typeof platformSettings?.statusNote === 'string'
                  ? platformSettings.statusNote
                  : platformSettings?.statusNote?.[language]) ||
                  (platformSettings?.centreStatus === 'temp_closed'
                    ? language === 'ta'
                      ? 'சிறிது நேரத்தில் திறக்கப்படும் | அழைக்க: 97903 82437'
                      : 'Back shortly | Call 97903 82437'
                    : platformSettings?.centreStatus === 'camp'
                    ? language === 'ta'
                      ? 'களப்பணி | அழைக்க: 97903 82437'
                      : 'In field | Call: 97903 82437'
                    : platformSettings?.centreStatus === 'closed'
                    ? language === 'ta'
                      ? 'விடுமுறை | நாளை காலை 9:30 மணிக்கு திறக்கப்படும்'
                      : 'Closed | Resumes tomorrow 9:30 AM'
                    : language === 'ta'
                    ? 'காலை 9:30 - மாலை 5:00'
                    : '9:30 AM - 5:00 PM')}
              </span>

              {/* Clickable Cue */}
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-white/90 group-hover:bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs whitespace-nowrap ml-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{language === 'ta' ? 'நால்ரோடு மையம் ↗' : 'Nalroad Centre ↗'}</span>
              </span>
            </Link>
          </div>

          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-100/90 text-emerald-900 border border-emerald-300 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-extrabold shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{t('hero_badge', 'பெரியாக்கோட்டை கிராம பஞ்சாயத்து டிஜிட்டல் தளம்')}</span>
          </div>

          {/* Hero Main Heading */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            {language === 'ta' ? (
              <>
                பெரியாக்கோட்டை மக்களுக்கான அரசு சேவைகள் &{' '}
                <span className="text-emerald-700 underline decoration-amber-400 decoration-wavy decoration-2">
                  விவசாய உதவிகள்
                </span>
              </>
            ) : (
              <>
                Government Services &{' '}
                <span className="text-emerald-700 underline decoration-amber-400 decoration-wavy decoration-2">
                  Farmer Support
                </span>{' '}
                for Periyakottai
              </>
            )}
          </h1>

          {/* Hero Subtitle */}
          <p className="max-w-3xl mx-auto text-sm sm:text-lg text-slate-700 leading-relaxed font-normal">
            {t(
              'hero_desc',
              'சான்றிதழ்கள், விவசாய மானியங்கள், நலத்திட்டங்கள் மற்றும் நால்ரோடு மக்கள் இ-சேவை மையத்தின் நேரடி உதவி — அனைத்தும் ஒரே இடத்தில்.'
            )}
          </p>

          {/* Search Bar with voice assist */}
          <div className="pt-2">
            <HeroSearch />
          </div>

          {/* Quick Action Navigation Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all hover:scale-105 whitespace-nowrap"
            >
              <FileText className="w-4 h-4 text-emerald-300" />
              <span>{t('action_find_service', 'சேவையைத் தேடுங்கள்')}</span>
            </Link>

            <Link
              href="/schemes/eligibility"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all hover:scale-105 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{t('action_check_eligibility', 'திட்ட தகுதி பார்க்கவும்')}</span>
            </Link>

            <Link
              href="/farmer-hub"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 shadow-2xs transition-all hover:scale-105 whitespace-nowrap"
            >
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>{t('action_farmer_corner', 'விவசாய மையம்')}</span>
            </Link>

            <Link
              href="/csc-centre"
              className="inline-flex items-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-emerald-300 shadow-2xs transition-all hover:scale-105 whitespace-nowrap"
            >
              <Building2 className="w-4 h-4 text-emerald-800" />
              <span>{t('action_contact_centre', 'இ-சேவை மைய உதவி')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. "WHAT CAN YOU DO FOR ME?" ROLE EXPERIENCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-950">
              {t('role_title', 'உங்களுக்கு என்ன உதவி வேண்டும்?')}
            </h2>
            <VoiceAssistButton
              textToSpeak={
                language === 'ta'
                  ? 'உங்களுக்கு என்ன உதவி வேண்டும்? நீங்கள் விவசாயியா, பெண்ணா, மாணவரா, அல்லது மூத்த குடிமகனா என்பதை தேர்ந்தெடுத்து அதற்கான திட்டங்களை பார்க்கலாம்.'
                  : 'What assistance do you need? Select whether you are a farmer, woman, student, or senior citizen to discover relevant services.'
              }
              size="sm"
            />
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            {t('role_subtitle', 'உங்களுக்கான வகையைத் தேர்ந்தெடுத்து தேவையான சேவைகளைப் பெறுங்கள்')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {roleCards.map((card) => (
            <Link
              key={card.role}
              href={card.href}
              className={`p-4 rounded-3xl border-2 transition-all hover:-translate-y-1 hover:shadow-md flex flex-col items-center text-center justify-between ${card.bgColor}`}
            >
              <div className="w-14 h-14 rounded-2xl bg-white shadow-2xs flex items-center justify-center text-2xl mb-3">
                {card.icon}
              </div>
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                  {card.title}
                </h3>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug line-clamp-2">
                  {card.subtitle}
                </p>
              </div>
              <span className="mt-3 inline-flex items-center text-[10px] font-bold text-slate-700 group-hover:text-slate-950">
                {language === 'ta' ? 'பார்க்க' : 'View'} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* HOT SECTION: TAMIL NADU GOVT VISION & LIVE CITIZEN NEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-white via-emerald-50/40 to-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold mb-2">
                <Radio className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span>
                  {language === 'ta'
                    ? 'தமிழ்நாடு அரசு தொலைநோக்கு & நேரடி செய்திகள்'
                    : 'TN Govt Vision & Live Citizen Updates'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-950 flex items-center gap-2">
                <span>🔥</span>
                <span>
                  {language === 'ta'
                    ? 'முக்கிய செய்திகள் & அரசு நல அறிவிப்புகள்'
                    : 'Hot News & Tamil Nadu Govt Policies'}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {language === 'ta'
                  ? 'கலைஞர் கனவு இல்லம், மக்களைத் தேடி மருத்துவம், காலை உணவுத் திட்டம், PM-கிசான் மற்றும் ஒட்டன்சத்திரம் வேளாண் சந்தை நேரடி அறிவிப்புகள்.'
                  : 'Key welfare policies, Kalaignar Kanavu Illam, Makkalai Thedi Maruthuvam, PM-KISAN, and live Oddanchatram agricultural notifications.'}
              </p>
            </div>

            <Link
              href="/news"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-colors shrink-0 self-start sm:self-center"
            >
              <Newspaper className="w-4 h-4" />
              <span>{language === 'ta' ? 'அனைத்து செய்திகள் (News Hub)' : 'Explore All News'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Categories Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <Link
              href="/news?category=vision"
              className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 font-bold hover:bg-purple-100 transition-colors whitespace-nowrap"
            >
              🏛️ {language === 'ta' ? 'அரசு திட்டங்கள்' : 'TN Vision'}
            </Link>
            <Link
              href="/news?category=agri"
              className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold hover:bg-emerald-100 transition-colors whitespace-nowrap"
            >
              🌾 {language === 'ta' ? 'வேளாண்மை' : 'Agriculture'}
            </Link>
            <Link
              href="/news?category=jobs"
              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-bold hover:bg-blue-100 transition-colors whitespace-nowrap"
            >
              🎓 {language === 'ta' ? 'வேலைவாய்ப்பு' : 'Jobs & Skills'}
            </Link>
            <Link
              href="/news?category=district"
              className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-bold hover:bg-amber-100 transition-colors whitespace-nowrap"
            >
              📍 {language === 'ta' ? 'திண்டுக்கல் & ஒட்டன்சத்திரம்' : 'Dindigul District'}
            </Link>
            <Link
              href="/news?category=national"
              className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 font-bold hover:bg-rose-100 transition-colors whitespace-nowrap"
            >
              🇮🇳 {language === 'ta' ? 'மத்திய அரசுத் திட்டம்' : 'National Schemes'}
            </Link>
          </div>

          {/* News Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {hotNews.map((item) => (
              <NewsCard key={item.id} news={item} variant="full" />
            ))}
          </div>
        </div>
      </section>

      {/* 4. POPULAR SERVICES DIRECTORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-emerald-600 rounded-full"></span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950">
                {t('popular_services_title', 'அடிக்கடி தேவைப்படும் அரசு சேவைகள்')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 pl-4.5">
              {t('popular_services_desc', 'கிராம மக்கள் அதிகம் விண்ணப்பிக்கும் சேவைகள் மற்றும் தேவையான ஆவணங்கள்')}
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
          >
            <span>{t('view_all_services', 'அனைத்து சேவைகளையும் பார்க்க (50+)')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      {/* 5. LOCAL FARMER HUB SPOTLIGHT (ODDANCHATRAM MARKET & SUBSIDIES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-3xl text-white p-6 sm:p-8 lg:p-10 shadow-xl overflow-hidden relative border-2 border-emerald-700">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-emerald-800/90 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-700">
                <Sprout className="w-4 h-4" />
                <span>{language === 'ta' ? 'ஒட்டன்சத்திரம் வேளாண் & தோட்டக்கலை மையம்' : 'Oddanchatram Agri Corner'}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                {language === 'ta'
                  ? 'விவசாயிகளுக்கான அரசு மானியங்கள் & காந்தி சந்தை நிலவரம்'
                  : 'Agricultural Subsidies & Oddanchatram Gandhi Market Prices'}
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                {language === 'ta'
                  ? 'பெரியாக்கோட்டை மற்றும் நால்ரோடு பகுதி விவசாயிகளுக்கு 100% சொட்டு நீர் பாசன மானியம், 70% சோலார் பம்புசெட் மானியம், PM-கிசான் e-KYC மற்றும் ஒட்டன்சத்திரம் மார்க்கெட் காய்கறி விலைகள்.'
                  : 'Discover 100% drip irrigation subsidy, 70% solar pump subsidy, PM-KISAN e-KYC support, and daily wholesale vegetable prices from Oddanchatram Gandhi Market.'}
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/farmer-hub"
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow transition-all flex items-center gap-2"
                >
                  <Sprout className="w-4 h-4" />
                  <span>{language === 'ta' ? 'விவசாய மையம் பார்க்க' : 'Open Farmer Hub'}</span>
                </Link>

                <a
                  href="tel:9790382437"
                  className="bg-emerald-800/80 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xl border border-emerald-700 transition-all flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-300" />
                  <span>{language === 'ta' ? 'மானிய உதவிக்கு அழைக்க' : 'Call for Subsidy Guidance'}</span>
                </a>
              </div>
            </div>

            {/* Right: Live Market Snapshot */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15">
              <div className="flex items-center justify-between pb-3 border-b border-white/20 mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-300" />
                  <span className="font-extrabold text-xs sm:text-sm text-amber-300">
                    {language === 'ta' ? 'இன்றைய காய்கறி நிலவரம்' : 'Oddanchatram Market Rates'}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-200">
                  {new Date().toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-IN')}
                </span>
              </div>

              <div className="space-y-2.5">
                {ODDANCHATRAM_CROP_PRICES.slice(0, 4).map((crop, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-white/10 last:border-0"
                  >
                    <span className="text-white font-medium">{crop.cropName[language]}</span>
                    <span className="font-bold text-amber-300 bg-emerald-950/60 px-2 py-0.5 rounded">
                      {crop.priceRange}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <Link
                  href="/farmer-hub"
                  className="text-xs text-emerald-200 hover:text-white font-bold inline-flex items-center gap-1"
                >
                  <span>{language === 'ta' ? 'முழு காய்கறி விலை பட்டியல்' : 'View full market price list'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href={platformSettings?.marketWhatsAppUrl || ODDANCHATRAM_MARKET_WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-green-500 hover:bg-green-400 text-slate-950 font-black px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-xs shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{language === 'ta' ? 'வாட்ஸ்அப் குழு' : 'Market WhatsApp'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WELFARE SCHEMES SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-amber-500 rounded-full"></span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950">
                {language === 'ta' ? 'முக்கிய அரசு நலத்திட்டங்கள்' : 'Featured Government Schemes'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 pl-4.5">
              {language === 'ta'
                ? 'பெண்கள், விவசாயிகள் மற்றும் குடும்பங்களுக்கான நிதி உதவி திட்டங்கள்'
                : 'Direct benefit transfer and welfare schemes for rural households'}
            </p>
          </div>
          <Link
            href="/schemes"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
          >
            <span>{language === 'ta' ? 'அனைத்து திட்டங்களையும் பார்க்க' : 'Explore All Schemes'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      </section>

      {/* 7. DEDICATED SPOTLIGHT: NALROAD MAKKAL E-SEVA MAIYAM (MURUGESAN K) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border-2 border-emerald-600/60 p-6 sm:p-8 lg:p-10 shadow-lg relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Centre Operator Profile */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-extrabold">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span>{language === 'ta' ? 'நால்ரோடு மக்கள் இ-சேவை மையம்' : 'Nalroad Makkal e-Seva Centre'}</span>
                </div>
                <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-1 rounded-full shadow-2xs">
                  e-Sevai ID: EFADGL0636
                </span>
              </div>

              {/* Photo & Name Bar */}
              <div className="flex items-center gap-4">
                <img
                  src="/images/murugesan.jpg"
                  alt="முருகேசன் கே - நால்ரோடு மக்கள் இ-சேவை மையம்"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-500 shadow-md shrink-0"
                />
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
                    {language === 'ta' ? 'முருகேசன் கே' : 'Murugesan K'}
                  </h2>
                  <p className="text-xs sm:text-sm font-bold text-emerald-800">
                    {language === 'ta'
                      ? 'அங்கீகரிக்கப்பட்ட இ-சேவை ஆபரேட்டர் & கிராம சேவை ஒருங்கிணைப்பாளர்'
                      : 'Authorized e-Sevai CSC Operator & Village Coordinator'}
                  </p>
                  <div className="pt-1.5 flex flex-wrap gap-2">
                    <a
                      href="https://www.facebook.com/murugesan.odc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-colors"
                      title="Murugesan Facebook Profile"
                    >
                      <span>Facebook</span>
                      <span>↗</span>
                    </a>
                    <Link
                      href="/murugesan"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors"
                    >
                      <span>{language === 'ta' ? 'முழு சுயவிவரம்' : 'Full Bio'}</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {language === 'ta'
                  ? 'பெரியாக்கோட்டை, நால்ரோடு, தேவத்தூர் மற்றும் சுற்றுவட்டார கிராம மக்கள் இணையதள சிக்கல்கள் இல்லாமல் சான்றிதழ்கள், நில ஆவணங்கள், மகளிர் உரிமைத் தொகை மற்றும் விவசாய உதவிகளை எளிதில் பெற எங்கள் மையம் துணை நிற்கிறது. ஆவணங்களை கொண்டு வந்தால் உடனடியாக ஆன்லைனில் விண்ணப்பித்து தரப்படும்.'
                  : 'Supporting citizens of Periyakottai and surrounding hamlets in navigating digital government portals, online certificate applications, land records, and welfare schemes without bureaucratic confusion.'}
              </p>

              {/* Verified Details Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
                <a
                  href="https://maps.app.goo.gl/kDxy1NXkBNCYcAZEA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 bg-slate-50 hover:bg-slate-100 p-3 rounded-xl border border-slate-200 transition-colors group"
                >
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="font-bold block text-slate-900 group-hover:text-emerald-700">
                      {language === 'ta' ? 'மைய முகவரி (Google மேப்):' : 'Location (Google Map):'}
                    </span>
                    <span className="text-slate-600">நால்ரோடு சந்திப்பு, பெரியாக்கோட்டை - 624614 ↗</span>
                  </div>
                </a>

                <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-slate-900">
                      {language === 'ta' ? 'இயங்கும் நேரம்:' : 'Working Hours:'}
                    </span>
                    <span>
                      {platformSettings?.operatingHours
                        ? (language === 'ta' ? platformSettings.operatingHours.ta : platformSettings.operatingHours.en)
                        : (language === 'ta' ? 'திங்கள் - சனி: காலை 9:30 - மாலை 5:00 | ஞாயிறு: விடுமுறை' : 'Mon - Sat: 9:30 AM - 5:00 PM | Sun: Holiday')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap gap-3">
                <a
                  href="tel:9790382437"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow transition-all flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-200" />
                  <span>{language === 'ta' ? 'உடனே அழைக்க: 97903 82437' : 'Direct Call: 97903 82437'}</span>
                </a>

                <a
                  href="https://maps.app.goo.gl/kDxy1NXkBNCYcAZEA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xl shadow transition-all flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-sky-200" />
                  <span>{language === 'ta' ? 'Google மேப் வழி' : 'Directions'}</span>
                </a>

                <a
                  href="https://wa.me/919790382437?text=வணக்கம்%20முருகேசன்%20அவர்களே,%20பெரியாக்கோட்டை%20டிஜிட்டல்%20சேவை%20வழியாக%20தொடர்பு%20கொள்கிறேன்."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={() => {
                    setSelectedService({
                      id: 'general_assistance',
                      name: language === 'ta' ? 'நால்ரோடு மைய உதவி' : 'Nalroad Centre Assistance'
                    });
                    setModalOpen(true);
                  }}
                  className="bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm px-4 py-3 rounded-xl border-2 border-slate-300 transition-all"
                >
                  {language === 'ta' ? 'மைய உதவிக்கு விண்ணப்பிக்க' : 'Book Centre Help'}
                </button>
              </div>
            </div>

            {/* Right: Centre Highlights Card */}
            <div className="lg:col-span-5 bg-emerald-50 rounded-2xl p-6 border-2 border-dashed border-emerald-300 space-y-4">
              <h3 className="font-extrabold text-sm sm:text-base text-emerald-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span>{language === 'ta' ? 'மையத்தில் கிடைக்கும் சேவைகள்' : 'Services Offered at Centre'}</span>
              </h3>

              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{language === 'ta' ? 'வருமானம், சாதி, இருப்பிடம், வாரிசு, முதல் பட்டதாரி சான்றிதழ்கள்' : 'Income, Community, Nativity, Legal Heir & First Graduate'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{language === 'ta' ? 'பட்டா மாறுதல், சிட்டா/அடங்கல் நகல், வில்லங்கச் சான்றிதழ் (EC)' : 'Patta transfer, Chitta copy & Encumbrance Certificate (EC)'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{language === 'ta' ? 'PM கிசான் பதிவு, e-KYC கைரேகை இணைப்பு & வங்கி மேப்பிங்' : 'PM-KISAN registration, biometric e-KYC & NPCI bank mapping'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{language === 'ta' ? 'ஸ்மார்ட் குடும்ப அட்டை பெயர் சேர்த்தல், நீக்கல், முகவரி மாற்றம்' : 'Smart Ration Card additions, removals and address change'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{language === 'ta' ? 'ஆதார் முகவரி திருத்தம், PVC பிளாஸ்டிக் ஆதார், புதிய பான் கார்டு' : 'Aadhaar demographic update, PVC Smart Card & PAN Card'}</span>
                </li>
              </ul>

              <div className="pt-3 border-t border-emerald-200 text-center">
                <Link
                  href="/csc-centre"
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
                >
                  <span>{language === 'ta' ? 'மையத்தின் முழு விவரம் பார்க்க' : 'View full centre details'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. HOW IT WORKS (3 SIMPLE STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-950">
            {language === 'ta' ? '3 எளிய படிகளில் அரசு சேவை பெறுங்கள்' : 'Get Services in 3 Simple Steps'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {language === 'ta'
              ? 'அலைச்சலும் குழப்பமும் இல்லாமல் அரசு சலுகைகளைப் பெறுங்கள்'
              : 'Effortless procedure designed for villagers'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center space-y-3 relative shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-xl flex items-center justify-center mx-auto">
              1
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              {language === 'ta' ? 'தேவையான சேவையைத் தேடுங்கள்' : 'Discover the Service'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ta'
                ? 'எங்கள் தேடுபொறி அல்லது தகுதி வழிகாட்டி மூலம் உங்களுக்குத் தேவையான சான்றிதழ் அல்லது திட்டத்தைத் தேர்ந்தெடுக்கவும்.'
                : 'Search our directory or use the eligibility wizard to find the right certificate or scheme.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center space-y-3 relative shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 font-black text-xl flex items-center justify-center mx-auto">
              2
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              {language === 'ta' ? 'ஆவணங்களை சரிபாருங்கள்' : 'Check Required Documents'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ta'
                ? 'எங்கள் ஆவண சரிபார்ப்பு பட்டியல் மூலம் ஆதார், ரேஷன் கார்டு, பட்டா போன்ற சரியான ஆவணங்களை தயார் செய்யுங்கள்.'
                : 'Review the verified checklist so you don’t miss any mandatory documents.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center space-y-3 relative shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white font-black text-xl flex items-center justify-center mx-auto">
              3
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              {language === 'ta' ? 'மையத்தில் அல்லது ஆன்லைனில் முடிக்கவும்' : 'Complete at Centre or Online'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ta'
                ? 'அதிகாரப்பூர்வ அரசு போர்ட்டலில் சுயமாக விண்ணப்பிக்கலாம் அல்லது நால்ரோடு இ-சேவை மையத்திற்கு வந்து உதவி பெறலாம்.'
                : 'Apply online yourself or visit Nalroad Makkal e-Seva Centre for prompt operator assistance.'}
            </p>
          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <div className="flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-700" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-950">
              {language === 'ta' ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'Frequently Asked Questions'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            {language === 'ta'
              ? 'அரசு சேவைகள் மற்றும் இ-சேவை மையம் குறித்த பொதுவான சந்தேகங்கள்'
              : 'Common questions on certificates, schemes, and centre services'}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 font-bold text-sm sm:text-base text-slate-900 hover:text-emerald-800"
                >
                  <span>{faq.q[language]}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-emerald-700' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                    <p>{faq.a[language]}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <VoiceAssistButton textToSpeak={faq.a[language]} size="sm" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. EMERGENCY & HELPLINES BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-slate-800">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              {language === 'ta' ? 'அவசர உதவி அல்லது அரசு அலுவலகங்களை தொடர்பு கொள்ள வேண்டுமா?' : 'Need Emergency or Administrative Assistance?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              {language === 'ta'
                ? 'ஒட்டன்சத்திரம் வட்டாட்சியர், பி.டி.ஓ, அரசு தலைமை மருத்துவமனை, காவல் நிலையம் மற்றும் மின்சார வாரிய எண்கள் சரிபார்க்கப்பட்டு உள்ளன.'
                : 'Oddanchatram Tahsildar, BDO, GH, Police, and TANGEDCO Minnagam numbers verified.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/contacts"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl shadow transition-colors"
            >
              {language === 'ta' ? 'அனைத்து எண்களையும் பார்க்க' : 'View Contact Directory'}
            </Link>
            <a
              href="tel:108"
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl shadow transition-colors flex items-center gap-1.5"
            >
              <PhoneCall className="w-4 h-4" />
              <span>108 (ஆம்புலன்ஸ்)</span>
            </a>
          </div>
        </div>
      </section>

      {/* Global Request Modal */}
      <RequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceId={selectedService.id}
        serviceName={selectedService.name}
      />
    </div>
  );
}
