'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n/context';
import { Phone, Mail, MapPin, ShieldCheck, Heart, ExternalLink, Lock, Sun, Moon } from 'lucide-react';

export function Footer() {
  const { language, t, textScale, setTextScale, highContrast, toggleHighContrast } = useI18n();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16">
      {/* Top Banner: Local Assistance Guarantee */}
      <div className="bg-emerald-950/80 border-b border-emerald-900 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm sm:text-base">
                {language === 'ta'
                  ? 'நம்பகமான உள்ளூர் இ-சேவை உதவி மையம்'
                  : 'Trusted Local e-Seva Assistance Hub'}
              </h4>
              <p className="text-xs text-emerald-200/80">
                {language === 'ta'
                  ? 'நால்ரோடு மக்கள் இ-சேவை மையம் | பெரியகோட்டை கிராம மக்களுக்கான நேரடி டிஜிட்டல் உதவி'
                  : 'Nalroad Makkal e-Seva Centre | Dedicated digital gateway for Periyakottai residents'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:9790382437"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{language === 'ta' ? 'அழைக்க: 97903 82437' : 'Call: 97903 82437'}</span>
            </a>
            <a
              href="https://wa.me/919790382437?text=வணக்கம்,%20பெரியகோட்டை%20டிஜிட்டல்%20சேவை%20வழியாக%20தொடர்பு%20கொள்கிறேன்."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="பெரியகோட்டை அரசு இ-சேவை இலச்சினை"
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow-md shrink-0"
              />
              <h3 className="text-white font-extrabold text-base leading-tight">
                {language === 'ta' ? 'பெரியகோட்டை டிஜிட்டல் சேவை' : 'Periyakottai Digital Seva'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'ta'
                ? 'பெரியகோட்டை கிராம பஞ்சாயத்து மற்றும் நால்ரோடு பகுதி விவசாயிகளுக்கும், பொதுமக்களுக்கும் அரசு சேவைகளை எளிதாகக் கொண்டு சேர்க்கும் பொது சேவை தளம்.'
                : 'Smart public service platform enabling transparent, effortless access to government schemes and e-Seva assistance for the people of Periyakottai.'}
            </p>
            <div className="pt-2 text-xs space-y-1.5 text-slate-300">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://maps.app.goo.gl/kDxy1NXkBNCYcAZEA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 underline decoration-dotted transition-colors"
                  title="Google மேப்பில் திறக்க"
                >
                  நால்ரோடு சந்திப்பு, பெரியகோட்டை - 624614 (Google Map ↗)
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 97903 82437 (முருகேசன் கு EFADGL0636)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="break-all">nalroadmakkalesevaimaiyam@gmail.com</span>
              </p>
              <div className="pt-1 flex items-center gap-3 text-xs">
                <a
                  href="https://www.facebook.com/murugesan.odc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-1"
                >
                  <span>Facebook Profile</span>
                  <span>↗</span>
                </a>
                <span>•</span>
                <Link href="/murugesan" className="text-amber-400 hover:text-amber-300 font-bold">
                  {language === 'ta' ? 'ஆபரேட்டர் விபரம்' : 'Operator Bio'}
                </Link>
              </div>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">
              {language === 'ta' ? 'முக்கிய சேவைகள்' : 'Key Services'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  {language === 'ta' ? 'வருமானம் & சாதி சான்றிதழ்கள்' : 'Income & Community Certificates'}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  {language === 'ta' ? 'பட்டா மாறுதல் & சிட்டா நகல்' : 'Patta Transfer & Chitta'}
                </Link>
              </li>
              <li>
                <Link href="/schemes" className="hover:text-white transition-colors">
                  {language === 'ta' ? 'கலைஞர் மகளிர் உரிமைத் திட்டம் (KMUT)' : 'Magalir Urimai Thittam'}
                </Link>
              </li>
              <li>
                <Link href="/farmer-hub" className="hover:text-white transition-colors">
                  {language === 'ta' ? 'PM கிசான் & சொட்டு நீர் மானியம்' : 'PM-KISAN & Drip Subsidy'}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  {language === 'ta' ? 'புதிய ஸ்மார்ட் குடும்ப அட்டை' : 'New Smart Ration Card'}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  {language === 'ta' ? 'ஆதார் & பான் அட்டை சேவைகள்' : 'Aadhaar & PAN Services'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Citizens & Farmers */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">
              {language === 'ta' ? 'பயனுள்ள இணைப்புகள்' : 'Useful Portals'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/news" className="hover:text-white transition-colors text-amber-300 font-semibold flex items-center gap-1">
                  <span>★</span>
                  <span>{language === 'ta' ? 'அரசு தொலைநோக்கு & முக்கிய செய்திகள்' : 'Govt Vision & Live News Hub'}</span>
                </Link>
              </li>
              <li>
                <Link href="/schemes/eligibility" className="hover:text-white transition-colors">
                  {language === 'ta' ? 'திட்ட தகுதி அறிதல் (5 கேள்விகள்)' : '5-Step Scheme Eligibility'}
                </Link>
              </li>
              <li>
                <Link href="/farmer-hub" className="hover:text-white transition-colors">
                  {language === 'ta' ? 'ஒட்டன்சத்திரம் காய்கறி மார்க்கெட் நிலவரம்' : 'Oddanchatram Market Prices'}
                </Link>
              </li>
              <li>
                <Link href="/documents" className="hover:text-white transition-colors">
                  {language === 'ta' ? 'ஆவண சரிபார்ப்பு பட்டியல்' : 'Document Checklist'}
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-white transition-colors">
                  {language === 'ta' ? 'விண்ணப்பத்தின் நிலை அறிய' : 'Track Request Status'}
                </Link>
              </li>
              <li>
                <Link href="/panchayat" className="hover:text-white transition-colors">
                  {language === 'ta' ? 'கிராம குறை தீர்ப்பு வசதி' : 'Panchayat Grievance Redressal'}
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="hover:text-white transition-colors">
                  {language === 'ta' ? 'ஒட்டன்சத்திரம் அவசர எண்கள்' : 'Oddanchatram Emergency Contacts'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Government Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">
              {language === 'ta' ? 'அரசு அதிகாரப்பூர்வ தளங்கள்' : 'Official Portals'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="https://www.tnesevai.tn.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>தமிழ்நாடு e-Sevai போர்டல்</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://eservices.tn.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>நில அளவை AnyWhere AnyTime</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.tnpds.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>TNPDS குடும்ப அட்டை போர்டல்</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmkisan.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>PM-KISAN உழவர் தளம்</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://dindigul.nic.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>திண்டுக்கல் மாவட்ட நிர்வாகம்</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-slate-800 space-y-1.5">
              <Link
                href="/operator"
                className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 font-bold transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'ஆபரேட்டர் மேலாண்மை தளம் (Operator Portal)' : 'Operator Portal (Murugesan K)'}</span>
              </Link>
              <p className="text-[10px] text-slate-500">e-Sevai ID: EFADGL0636</p>
            </div>
          </div>
        </div>

        {/* Accessibility & Settings Controls in Footer */}
        <div className="mt-8 p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold">
              {language === 'ta' ? 'அணுகல்தன்மை வசதிகள்:' : 'Accessibility Controls:'}
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">
              {language === 'ta' ? 'ஒட்டன்சத்திரம் தாலுகா (624614)' : 'Oddanchatram Taluk (624614)'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Text Scale */}
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-700" role="group" aria-label="Text Size Controls">
              <button
                type="button"
                onClick={() => setTextScale('normal')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  textScale === 'normal' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="இயல்பு எழுத்து (Normal)"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setTextScale('large')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  textScale === 'large' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="பெரிய எழுத்து (Large)"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setTextScale('huge')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  textScale === 'huge' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="மிகப்பெரிய எழுத்து (Extra Large)"
              >
                A+
              </button>
            </div>

            {/* Contrast Toggle */}
            <button
              type="button"
              onClick={toggleHighContrast}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors border cursor-pointer ${
                highContrast
                  ? 'bg-amber-400 text-slate-950 border-amber-500 font-black'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
              aria-pressed={highContrast}
            >
              {highContrast ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{highContrast ? (language === 'ta' ? 'வெளிச்சம்' : 'High Contrast') : (language === 'ta' ? 'கான்ட்ராஸ்ட்' : 'Contrast')}</span>
            </button>
          </div>
        </div>

        {/* Disclaimer Box */}
        <div className="mt-6 p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-300 mb-1">
            {language === 'ta' ? 'அதிகாரப்பூர்வ மறுப்புரை (Disclaimer):' : 'Official Disclaimer:'}
          </p>
          <p>
            {language === 'ta'
              ? 'இந்த இணையதளம் பெரியகோட்டை கிராம மக்கள் அரசு திட்டங்கள் மற்றும் சான்றிதழ் விவரங்களை எளிதில் அறிந்துகொள்ளவும், நால்ரோடு மக்கள் இ-சேவை மையத்தின் (முருகேசன் கு) உதவியைப் பெறவும் உருவாக்கப்பட்ட குடிமக்கள் வழிகாட்டி தளம் ஆகும். இது தமிழ்நாடு அரசோ அல்லது மத்திய அரசோ நேரடியாக நடத்தும் தளம் அல்ல. அரசு சான்றிதழ்கள், மானியங்கள் மற்றும் திட்டங்களுக்கான இறுதி ஒப்புதல் மற்றும் தகுதி நிர்ணயம் சம்பந்தப்பட்ட அரசு அலுவலர்களின் ஆய்வுக்கு உட்பட்டது.'
              : 'This platform is an independent civic information and CSC assistance gateway operated in association with Nalroad Makkal e-Seva Centre (Murugesan K) for Periyakottai village. It is not an official government authority. Final approval and eligibility for all government certificates and welfare schemes remain subject to verification by the respective government departments.'}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} பெரியகோட்டை டிஜிட்டல் சேவை | Oddanchatram, Dindigul - 624614
          </p>
          <p className="flex items-center gap-1 text-slate-400">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for the farmers and people of Periyakottai</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
