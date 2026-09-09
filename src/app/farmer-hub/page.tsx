'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/context';
import {
  ODDANCHATRAM_CROP_PRICES,
  AGRI_SUBSIDIES,
  PACCS_GUIDE,
  ODDANCHATRAM_MARKET_WHATSAPP_LINK,
  ODDANCHATRAM_MARKET_DISCLAIMER
} from '@/data/farmerAdvisoryData';
import { VoiceAssistButton } from '@/components/VoiceAssistButton';
import { RequestModal } from '@/components/RequestModal';
import { FarmerGrievanceModal } from '@/components/FarmerGrievanceModal';
import {
  Sprout,
  TrendingUp,
  TrendingDown,
  Minus,
  PhoneCall,
  CheckCircle2,
  Droplets,
  Sun,
  ShieldCheck,
  Building,
  UserCheck,
  HelpCircle,
  Calendar,
  MessageCircle,
  ExternalLink,
  Radio,
  AlertCircle,
  FileText,
  ArrowRight
} from 'lucide-react';


export default function FarmerHubPage() {
  const { language } = useI18n();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('விவசாய மானிய உதவி (Agri Subsidy Help)');
  const [grievanceModalOpen, setGrievanceModalOpen] = useState(false);
  const [selectedAgriTopic, setSelectedAgriTopic] = useState<string | undefined>(undefined);
  const [marketWhatsAppUrl, setMarketWhatsAppUrl] = useState(ODDANCHATRAM_MARKET_WHATSAPP_LINK);
  const [rawMarketNotice, setRawMarketNotice] = useState<{ ta: string; en: string } | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          if (data.settings.marketWhatsAppUrl) {
            setMarketWhatsAppUrl(data.settings.marketWhatsAppUrl);
          }
          if (data.settings.marketNotice) {
            setRawMarketNotice(data.settings.marketNotice);
          }
        }
      })
      .catch((err) => console.error('Error fetching settings in farmer-hub:', err));
  }, []);

  const customMarketNotice = rawMarketNotice ? rawMarketNotice[language] : null;

  const audioIntro =
    language === 'ta'
      ? 'ஒட்டன்சத்திரம் பகுதி விவசாயிகளுக்கான சிறப்பு தகவல் மையம். இன்றைய காந்தி சந்தை காய்கறி விலைகள், 100 சதவீத சொட்டு நீர் மானியம், சூரியசக்தி பம்புசெட் மானியம் மற்றும் PM கிசான் வழிகாட்டுதல்கள் இங்கு உள்ளன.'
      : 'Special farmer hub for Oddanchatram and Periyakottai. Access daily vegetable market prices, 100% drip irrigation subsidy, solar pumps, and PM-KISAN guidance.';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-4 border-2 border-emerald-700">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 bg-emerald-700 text-amber-300 text-xs font-black uppercase px-3.5 py-1 rounded-full border border-emerald-600">
            <Sprout className="w-4 h-4" />
            <span>{language === 'ta' ? 'விவசாய தகவல் மையம்' : 'Farmer Advisory Corner'}</span>
          </div>

          <VoiceAssistButton textToSpeak={audioIntro} size="sm" />
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
          {language === 'ta'
            ? 'பெரியகோட்டை & ஒட்டன்சத்திரம் உழவர் தகவல் மையம்'
            : 'Periyakottai & Oddanchatram Farmer Information Hub'}
        </h1>

        <p className="text-xs sm:text-base text-emerald-100 max-w-3xl leading-relaxed">
          {language === 'ta'
            ? 'ஒட்டன்சத்திரம் காந்தி சந்தை காய்கறி நிலவரம், தோட்டக்கலை சொட்டு நீர் பாசன மானியங்கள், இலவச விவசாய மின்சாரம், பயிர்க்கடன் மற்றும் PM கிசான் திட்டங்களின் விரிவான வழிகாட்டி.'
            : 'Wholesale prices from Oddanchatram vegetable shandy, 100% micro-irrigation subsidies, crop insurance, zero-interest loans, and agricultural advisories.'}
        </p>

        {/* Action button */}
        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => {
              setSelectedAgriTopic(undefined);
              setGrievanceModalOpen(true);
            }}
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs sm:text-sm font-black px-5 py-3 rounded-xl shadow transition-all flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-emerald-950" />
            <span>{language === 'ta' ? 'உழவர் குறைதீர்ப்பு மனு பதிவு' : 'Register Farmer Grievance'}</span>
          </button>

          <a
            href="tel:9790382437"
            className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl shadow transition-all flex items-center gap-2 border border-emerald-500"
          >
            <PhoneCall className="w-4 h-4 text-amber-300" />
            <span>{language === 'ta' ? 'இ-சேவை மைய உழவர் உதவி: 97903 82437' : 'Call Farmer Desk: 97903 82437'}</span>
          </a>

          <a
            href="tel:18001801551"
            className="bg-emerald-900 hover:bg-emerald-800 text-emerald-100 text-xs sm:text-sm font-bold px-4 py-3 rounded-xl border border-emerald-700 transition-all flex items-center gap-2"
          >
            <Sprout className="w-4 h-4 text-amber-300" />
            <span>{language === 'ta' ? 'கிசான் உதவி எண் (1800-180-1551)' : 'Kisan Call Centre (1800-180-1551)'}</span>
          </a>
        </div>
      </div>

      {/* SECTION 1: ODDANCHATRAM VEGETABLE MARKET PRICES */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-950">
                {language === 'ta'
                  ? 'ஒட்டன்சத்திரம் காந்தி மார்க்கெட் காய்கறி விலைகள்'
                  : 'Oddanchatram Gandhi Market Daily Prices'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'ta'
                ? 'ஒட்டன்சத்திரம் காய்கறி சந்தை தினசரி மொத்த விற்பனை விலை நிலவரம் (முருங்கை, வெங்காயம், தக்காளி)'
                : 'Daily wholesale market arrivals and wholesale prices for local harvest'}
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {language === 'ta' ? 'புதுப்பிக்கப்பட்ட தேதி: ' : 'Updated: '}
            {new Date().toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-IN')}
          </span>
        </div>

        {/* Real-time Auction Notice & WhatsApp Group Link */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-md border border-emerald-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="flex items-center gap-1 bg-emerald-700/80 text-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-600">
                <Radio className="w-3 h-3 text-amber-300 animate-pulse" />
                <span>{language === 'ta' ? 'தினசரி காலை & மாலை ஏல நிலவரம்' : 'Live Daily Auction Rates'}</span>
              </span>
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-white">
              {language === 'ta'
                ? 'ஒட்டன்சத்திரம் காந்தி காய்கறி மார்க்கெட் தினசரி விலை வாட்ஸ்அப் குழு'
                : 'Oddanchatram Daily Vegetable Market WhatsApp Group'}
            </h3>
            <p className="text-xs text-emerald-200/90 max-w-2xl leading-relaxed">
              {customMarketNotice || ODDANCHATRAM_MARKET_DISCLAIMER[language]}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full md:w-auto">
            <a
              href={marketWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-400 text-slate-950 font-black px-5 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>{language === 'ta' ? 'வாட்ஸ்அப் குழுவில் இணைய' : 'Join WhatsApp Group'}</span>
            </a>
            <a
              href="https://wa.me/919790382437?text=வணக்கம்%20முருகேசன்%20அவர்களே,%20ஒட்டன்சத்திரம்%20காய்கறி%20மார்க்கெட்%20விலை%20வாட்ஸ்அப்%20குழுவில்%20இணைய%20விரும்புகிறேன்."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-950 hover:bg-emerald-800 text-emerald-200 font-bold px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-emerald-700 transition-colors"
            >
              <span>{language === 'ta' ? 'விலை விபரம் கேட்க' : 'Enquire Rate'}</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ODDANCHATRAM_CROP_PRICES.map((crop, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {crop.variety}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold">
                    {crop.trend === 'up' && (
                      <span className="text-emerald-700 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {language === 'ta' ? 'விலை ஏறியுள்ளது' : 'Rising'}
                      </span>
                    )}
                    {crop.trend === 'down' && (
                      <span className="text-rose-700 flex items-center gap-0.5 bg-rose-50 px-2 py-0.5 rounded-full">
                        <TrendingDown className="w-3.5 h-3.5" />
                        {language === 'ta' ? 'விலை இறக்கம்' : 'Falling'}
                      </span>
                    )}
                    {crop.trend === 'stable' && (
                      <span className="text-slate-600 flex items-center gap-0.5 bg-slate-100 px-2 py-0.5 rounded-full">
                        <Minus className="w-3.5 h-3.5" />
                        {language === 'ta' ? 'சராசரி' : 'Stable'}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-extrabold text-base text-slate-900">
                  {crop.cropName[language]}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {language === 'ta' ? 'மொத்த விலை:' : 'Wholesale Rate:'}
                </span>
                <span className="text-base sm:text-lg font-black text-emerald-800">
                  {crop.priceRange}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: AGRICULTURAL SUBSIDIES */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-lg sm:text-2xl font-extrabold text-slate-950 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-emerald-700" />
            <span>{language === 'ta' ? 'அரசு விவசாய மானியங்கள் & பாசன உதவிகள்' : 'Government Agricultural Subsidies'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'ta'
              ? 'சொட்டு நீர் பாசனம், சூரியசக்தி மின் மோட்டார், பயிர் காப்பீடு மற்றும் மண் பரிசோதனை'
              : 'Drip irrigation, solar pumps, PMFBY crop insurance and Soil Health Card'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {AGRI_SUBSIDIES.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-block bg-emerald-100 text-emerald-900 text-xs font-black px-3 py-1 rounded-full border border-emerald-300">
                    {sub.subsidyRate[language]}
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    {sub.department[language]}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {sub.title[language]}
                </h3>

                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs sm:text-sm text-emerald-950 font-medium">
                  {sub.keyBenefit[language]}
                </div>

                <div className="text-xs text-slate-600">
                  <span className="font-bold text-slate-900">
                    {language === 'ta' ? 'தகுதி: ' : 'Eligibility: '}
                  </span>
                  <span>{sub.eligibility[language]}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => {
                    setSelectedTopic(sub.title[language]);
                    setModalOpen(true);
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{language === 'ta' ? 'மானியம் பெற மைய உதவி' : 'Apply with Centre Help'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: PACCS COOPERATIVE SOCIETY GUIDE */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-sm space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full">
            <Building className="w-4 h-4 text-emerald-700" />
            <span>{language === 'ta' ? 'கூட்டுறவு சங்கம்' : 'Cooperative Society'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950">
            {PACCS_GUIDE.name[language]}
          </h2>
          <p className="text-xs text-slate-600">
            {language === 'ta'
              ? 'பெரியகோட்டை கிராம விவசாயிகள் கூட்டுறவு கடன் சங்கம் மூலம் பெறக்கூடிய நன்மைகள்'
              : 'Services and credit facilities provided to local farmers through PACCS'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PACCS_GUIDE.services.map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                {item.title[language]}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.desc[language]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: FARMER CIVIC & AGRICULTURAL GRIEVANCE DESK */}
      <section className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white space-y-6 border-2 border-emerald-600 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-800 text-amber-300 text-xs font-black uppercase px-3 py-1 rounded-full border border-emerald-600">
              <Sprout className="w-4 h-4" />
              <span>{language === 'ta' ? 'உழவர் குறைதீர்ப்பு மையம்' : 'Farmer Grievance Desk'}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white">
              {language === 'ta'
                ? 'விவசாயிகள் பிரச்சனை & குறைதீர்ப்பு மையம்'
                : 'Agricultural Grievance Resolution Desk'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              {language === 'ta'
                ? 'உரம் & யூரியா தட்டுப்பாடு, பயிர் இழப்பு நிவாரண விண்ணப்பம், பாசன வாய்க்கால் தூர்வாருதல், இலவச மின்சாரம் அல்லது PM-கிசான் தவணை சிக்கல்கள் உள்ளதா? உடனடியாக இணையதளத்தில் மனு பதிவு செய்யுங்கள். முருகேசன் (இ-சேவை) உரிய அதிகாரிகளுடன் ஒருங்கிணைத்து தீர்வு காண்பார்.'
                : 'Facing fertilizer shortages, crop loss claims, irrigation canal blockage, agri power outage, or PM-KISAN issues? Register your grievance directly for prompt official follow-up.'}
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedAgriTopic(undefined);
              setGrievanceModalOpen(true);
            }}
            className="shrink-0 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-6 py-3.5 rounded-2xl shadow-lg transition-all text-xs sm:text-sm flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 text-emerald-950" />
            <span>{language === 'ta' ? '+ உழவர் மனு பதிவு செய்க' : '+ File Agri Grievance'}</span>
          </button>
        </div>

        {/* Quick Issue Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {[
            {
              title: { ta: 'உரம் & யூரியா தட்டுப்பாடு', en: 'Fertilizer / Urea Shortage' },
              desc: { ta: 'கூட்டுறவு சங்கம் மற்றும் கடைகளில் உரம் கிடைக்கவில்லை அல்லது கூடுதல் விலைக்கு விற்கப்பட்டால் புகார் செய்யலாம்.', en: 'Shortage or overpricing of urea, DAP, complex fertilizers at local centres.' },
              topic: 'உரம் & யூரியா தட்டுப்பாடு / கூடுதல் விலை'
            },
            {
              title: { ta: 'பயிர் இழப்பு & காப்பீடு நிவாரணம்', en: 'Crop Loss & Insurance Claim' },
              desc: { ta: 'மழை, வறட்சி அல்லது காட்டு விலங்குகளால் பயிர் சேதம் அடைந்தால் உரிய அரசு நிவாரணம் கோரலாம்.', en: 'Claim compensation for flood, drought, or wildlife damage to crops.' },
              topic: 'பயிர் இழப்பு & காப்பீட்டு இழப்பீடு கோரிக்கை'
            },
            {
              title: { ta: 'பாசன கால்வாய் அடைப்பு', en: 'Irrigation Canal Blockage' },
              desc: { ta: 'பாசன வாய்க்கால் தூர்வாருதல், ஆக்கிரமிப்பு மற்றும் கடைமடை வரை தண்ணீர் வராத பிரச்சனைகள்.', en: 'Canal dredging, encroachment, or irrigation water distribution issues.' },
              topic: 'பாசன வாய்க்கால் தூர்வாருதல் / தண்ணீர் தடை'
            },
            {
              title: { ta: 'PM கிசான் தவணை தடை', en: 'PM-KISAN Installment Stuck' },
              desc: { ta: 'நில ஆவணம் பதிவு, e-KYC கைரேகை அல்லது வங்கி கணக்கு ஆதார் இணைப்பில் உள்ள குறைகள்.', en: 'Land seeding, e-KYC biometric, or DBT bank linkage issues.' },
              topic: 'PM-கிசான் 19வது தவணை வரவில்லை / e-KYC சிக்கல்'
            }
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-slate-800/80 hover:bg-slate-800 rounded-2xl p-4 border border-slate-700/80 flex flex-col justify-between space-y-3 transition-colors"
            >
              <div className="space-y-1.5">
                <h3 className="font-bold text-sm text-amber-300">
                  {card.title[language]}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {card.desc[language]}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedAgriTopic(card.topic);
                  setGrievanceModalOpen(true);
                }}
                className="w-full py-2 px-3 rounded-xl bg-emerald-700/60 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-emerald-600/40"
              >
                <span>{language === 'ta' ? 'உடனடி மனு பதிவு' : 'Report Issue'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: AGRICULTURAL OFFICIALS CONTACT STRIP */}
      <section className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-6 border border-slate-800">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-extrabold text-white">
            {language === 'ta' ? 'வேளாண்மை மற்றும் தோட்டக்கலைத்துறை முக்கிய தொடர்புகள்' : 'Agricultural Officers Directory'}
          </h2>
          <p className="text-xs text-slate-400">
            {language === 'ta'
              ? 'ஒட்டன்சத்திரம் தாலுகா மற்றும் திண்டுக்கல் மாவட்ட வேளாண்மை அலுவலர்களின் நேரடி தொடர்புகள்'
              : 'Direct contacts of Oddanchatram & Dindigul agricultural authorities'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-1">
            <span className="text-emerald-400 font-bold block">
              {language === 'ta' ? 'தோட்டக்கலை உதவி இயக்குநர்' : 'AD Horticulture'}
            </span>
            <span className="text-white font-medium">ஒட்டன்சத்திரம் தாலுகா</span>
            <a href="tel:9600226791" className="block text-amber-300 font-bold text-sm pt-1">
              96002 26791
            </a>
          </div>

          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-1">
            <span className="text-emerald-400 font-bold block">
              {language === 'ta' ? 'இணை இயக்குநர் (வேளாண்மை)' : 'Joint Director (Agri)'}
            </span>
            <span className="text-white font-medium">திண்டுக்கல் மாவட்டம்</span>
            <a href="tel:04512904031" className="block text-amber-300 font-bold text-sm pt-1">
              0451-2904031
            </a>
          </div>

          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-1">
            <span className="text-emerald-400 font-bold block">
              {language === 'ta' ? 'கிசான் உழவர் அழைப்பு மையம்' : 'Kisan Call Centre'}
            </span>
            <span className="text-white font-medium">கட்டணமில்லா தமிழ் உதவி</span>
            <a href="tel:18001801551" className="block text-amber-300 font-bold text-sm pt-1">
              1800-180-1551
            </a>
          </div>

          <div className="bg-emerald-950 p-4 rounded-2xl border border-emerald-700 space-y-1">
            <span className="text-emerald-300 font-bold block">
              {language === 'ta' ? 'நால்ரோடு மக்கள் இ-சேவை மையம்' : 'Nalroad e-Seva Centre'}
            </span>
            <span className="text-white font-medium">முருகேசன் (பெரியகோட்டை)</span>
            <a href="tel:9790382437" className="block text-amber-300 font-bold text-sm pt-1">
              97903 82437
            </a>
          </div>
        </div>
      </section>

      <RequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceName={selectedTopic}
      />

      <FarmerGrievanceModal
        isOpen={grievanceModalOpen}
        onClose={() => setGrievanceModalOpen(false)}
        initialTopic={selectedAgriTopic}
      />
    </div>
  );
}
