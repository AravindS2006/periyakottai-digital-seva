'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n/context';
import { VILLAGE_INFO } from '@/data/villageInfoData';
import { VoiceAssistButton } from '@/components/VoiceAssistButton';
import {
  Building2,
  AlertTriangle,
  Droplets,
  Lightbulb,
  Truck,
  CheckCircle2,
  Copy,
  Check,
  Send,
  Calendar,
  MessageCircle,
  Printer,
  Search,
  PhoneCall,
  MapPin,
  Megaphone,
  ChevronRight,
  FileText,
  RefreshCw,
  Users,
  ShieldCheck,
  Phone,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Edit3,
  FilePlus,
  BookOpen,
  Waves,
  Bug,
  Dog,
  Landmark,
  School,
  HeartHandshake
} from 'lucide-react';
import { GrievanceTicket, GrievanceCategory, GrievanceStatus, PlatformSettings, VillageNotice } from '@/types';
import { printAcknowledgmentReceipt } from '@/lib/printReceipt';

export default function PanchayatPage() {
  const { language } = useI18n();

  // Primary mode at the top: 'report' or 'track'
  const [activePortalMode, setActivePortalMode] = useState<'report' | 'track'>('report');

  // Form State - default to first hamlet in VILLAGE_INFO (Periyakottai)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedHamlet, setSelectedHamlet] = useState(VILLAGE_INFO.hamlets[0].ta);
  const [customLocation, setCustomLocation] = useState('');
  const [category, setCategory] = useState<GrievanceCategory>('drinking_water');
  const [priority, setPriority] = useState<'Normal' | 'Urgent'>('Normal');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdGrievance, setCreatedGrievance] = useState<GrievanceTicket | null>(null);
  const [copied, setCopied] = useState(false);
  const [formError, setFormError] = useState('');

  // Live Settings & Notices
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings | null>(null);
  const [notices, setNotices] = useState<VillageNotice[]>([]);
  const [selectedNoticeCategory, setSelectedNoticeCategory] = useState<string>('all');
  const [loadingNotices, setLoadingNotices] = useState(false);

  // Embedded Tracker State
  const [trackQuery, setTrackQuery] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackedTickets, setTrackedTickets] = useState<GrievanceTicket[] | null>(null);
  const [selectedTrackedTicket, setSelectedTrackedTicket] = useState<GrievanceTicket | null>(null);
  const [trackError, setTrackError] = useState('');

  // Additional Civic Info Tabs: 'services' | 'directory' | 'profile'
  const [civicTab, setCivicTab] = useState<'services' | 'directory' | 'profile'>('services');

  const audioIntro =
    language === 'ta'
      ? 'பெரியகோட்டை கிராம ஊராட்சி பொதுமக்கள் குறைதீர்ப்பு தலைமை தளம். குடிநீர், தெருவிளக்கு, சாலை, சாக்கடை, ரேஷன் மற்றும் கிராமப் பிரச்சனைகளை உடனடியாக பதிவு செய்து கண்காணிக்கலாம்.'
      : 'Periyakottai Gram Panchayat Civic Redressal Portal. Report all village civic grievances and track ticket status in real-time.';

  // Initial Fetch & Visibility-based re-fetch (Zero polling, protected free limit)
  useEffect(() => {
    let lastFetched = Date.now();

    const fetchLivePortalData = () => {
      lastFetched = Date.now();

      // Fetch Settings (announcement banner, centre status)
      fetch('/api/settings', { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.settings) {
            setPlatformSettings(data.settings);
          }
        })
        .catch((err) => console.error('Error fetching settings on panchayat:', err));

      // Fetch Village Notices
      setLoadingNotices(true);
      fetch('/api/notices', { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.notices)) {
            setNotices(data.notices);
          }
        })
        .catch((err) => console.error('Error fetching notices on panchayat:', err))
        .finally(() => setLoadingNotices(false));
    };

    fetchLivePortalData();

    const onVisible = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastFetched > 120000) {
        fetchLivePortalData();
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  // Comprehensive Village Grievance categories (All kinds of village grievances)
  const categories: {
    id: GrievanceCategory;
    title: { ta: string; en: string };
    icon: any;
  }[] = [
    { id: 'drinking_water', title: { ta: 'குடிநீர் விநியோகம் / தொட்டி', en: 'Drinking Water' }, icon: Droplets },
    { id: 'street_light', title: { ta: 'தெருவிளக்கு பழுது', en: 'Street Lights' }, icon: Lightbulb },
    { id: 'road_repair', title: { ta: 'சாலை & தெரு பழுது', en: 'Road Repair' }, icon: Truck },
    { id: 'drainage', title: { ta: 'சாக்கடை & கழிவுநீர் கால்வாய்', en: 'Drainage & Sewage' }, icon: Waves },
    { id: 'sanitation', title: { ta: 'குப்பை & சுகாதார பராமரிப்பு', en: 'Sanitation / Garbage' }, icon: Sparkles },
    { id: 'ration_shop', title: { ta: 'ரேஷன் கடை குறை', en: 'Ration Shop' }, icon: Building2 },
    { id: 'agriculture', title: { ta: 'விவசாய பாசனம் & மின்சாரம்', en: 'Agri & Irrigation' }, icon: FileText },
    { id: 'burial_ground', title: { ta: 'மயானம் / சுடுகாட்டுப் பாதை', en: 'Burial Ground Access' }, icon: HeartHandshake },
    { id: 'health_sanitation', title: { ta: 'கொசு மருந்து & தடுப்பு மருந்து', en: 'Mosquito Fogging / Health' }, icon: Bug },
    { id: 'stray_animals', title: { ta: 'தெரு நாய் & விலங்கு தொல்லை', en: 'Stray Dogs / Animals' }, icon: Dog },
    { id: 'revenue_land', title: { ta: 'வருவாய்த்துறை & பட்டா / நிலம்', en: 'Revenue / Land Records' }, icon: Landmark },
    { id: 'community_infra', title: { ta: 'பள்ளி, நூலகம் & சமுதாயக்கூடம்', en: 'School / Hall / Infra' }, icon: School },
    { id: 'other', title: { ta: 'இதர கிராம பொதுப் பிரச்சனை', en: 'Other Village Grievance' }, icon: HelpCircle }
  ];

  const categoryDeptMap: Record<GrievanceCategory, { dept: { ta: string; en: string } }> = {
    drinking_water: { dept: { ta: 'ஊராட்சி குடிநீர் பிரிவு', en: 'Panchayat Water Supply Dept' } },
    street_light: { dept: { ta: 'மின்வாரியம் & பஞ்சாயத்து', en: 'TNEB & Panchayat Lighting' } },
    road_repair: { dept: { ta: 'ஊரக வளர்ச்சி & ஊராட்சி நெடுஞ்சாலை', en: 'Rural Development & Roads' } },
    drainage: { dept: { ta: 'ஊராட்சி சுகாதாரப் பிரிவு', en: 'Sanitation & Sewage Dept' } },
    sanitation: { dept: { ta: 'கிராம துப்புரவு அணி', en: 'Village Sanitation Team' } },
    ration_shop: { dept: { ta: 'உணவு & கூட்டுறவுத் துறை', en: 'Civil Supplies & Ration Dept' } },
    agriculture: { dept: { ta: 'வேளாண்மை & பாசன மின் பிரிவு', en: 'Agriculture & Irrigation Section' } },
    burial_ground: { dept: { ta: 'ஊராட்சி நிர்வாகம்', en: 'Gram Panchayat Admin' } },
    health_sanitation: { dept: { ta: 'ஆரம்ப சுகாதார நிலையம் & ஊராட்சி', en: 'Primary Health Centre & Panchayat' } },
    stray_animals: { dept: { ta: 'கால்நடை பராமரிப்பு & ஊராட்சி', en: 'Animal Husbandry & Panchayat' } },
    revenue_land: { dept: { ta: 'வருவாய்த்துறை (VAO / RI / தாலுகா)', en: 'Revenue Dept (VAO/RI)' } },
    community_infra: { dept: { ta: 'ஊராட்சி வளர்ச்சி முகமை', en: 'Panchayat Development Section' } },
    other: { dept: { ta: 'கிராம ஊராட்சி அலுவலகம்', en: 'Panchayat General Office' } }
  };

  const getCategoryPlaceholder = (cat: GrievanceCategory, lang: 'ta' | 'en'): string => {
    if (lang === 'ta') {
      switch (cat) {
        case 'drinking_water':
          return 'எ.கா: மேல்நிலை குடிநீர் தொட்டியில் நீர் வரவில்லை / தெரு குழாய் உடைப்பு ஏற்பட்டுள்ளது...';
        case 'street_light':
          return 'எ.கா: பிள்ளையார் கோயில் தெருவில் 2 மின்கம்பங்களில் விளக்கு எரியவில்லை, இரவில் இருட்டாக உள்ளது...';
        case 'road_repair':
          return 'எ.கா: மெயின் ரோட்டில் குண்டும் குழியுமாக உள்ளது, பழுது பார்க்க வேண்டும்...';
        case 'drainage':
          return 'எ.கா: சாக்கடை அடைப்பு ஏற்பட்டு கழிவுநீர் சாலையில் தேங்கி சுகாதார சீர்கேடு ஏற்பட்டுள்ளது...';
        case 'sanitation':
          return 'எ.கா: குப்பைத் தொட்டி நிரம்பி வழிந்து துர்நாற்றம் வீசுகிறது, உடனே அகற்ற வேண்டும்...';
        case 'ration_shop':
          return 'எ.கா: ரேஷன் பொருட்கள் விநியோகம் / கைரேகை பதிவு / குடும்ப அட்டை தொடர்பான குறை...';
        case 'agriculture':
          return 'எ.கா: விவசாய பாசன வாய்க்கால் தூர்வாரப்பட வேண்டும் / மும்முனை மின்சாரம் குறைபாடு...';
        case 'burial_ground':
          return 'எ.கா: மயானத்திற்கு செல்லும் பாதை சேதமடைந்துள்ளது, சீரமைக்க வேண்டும்...';
        case 'health_sanitation':
          return 'எ.கா: பகுதியில் கொசுக்கள் அதிகமாக உள்ளது, கொசு மருந்து தெளிக்க வேண்டும்...';
        case 'stray_animals':
          return 'எ.கா: பள்ளிக்கூடம் அருகே தெரு நாய்கள் தொல்லை அதிகமாக உள்ளது, கட்டுப்படுத்த வேண்டும்...';
        case 'revenue_land':
          return 'எ.கா: பட்டா மாறுதல் / நில எல்லை அளவீடு தொடர்பாக வழிகாட்டல் தேவை...';
        case 'community_infra':
          return 'எ.கா: சமுதாயக்கூடம் / பள்ளி / நூலக கட்டிடம் பழுது பார்க்கப்பட வேண்டும்...';
        default:
          return 'குறையின் முழு விவரம், சரியான இடம், தேவைப்படும் தீர்வு ஆகியவற்றை தெளிவாக குறிப்பிடவும்...';
      }
    } else {
      switch (cat) {
        case 'drinking_water':
          return 'e.g. Street pipe leakage / dry overhead tank / dirty water supply...';
        case 'street_light':
          return 'e.g. 2 street lamps not working near Temple street for past 3 days...';
        case 'road_repair':
          return 'e.g. Deep potholes on main village street causing accidents...';
        case 'drainage':
          return 'e.g. Blocked drainage overflowing onto road causing hygiene issues...';
        case 'sanitation':
          return 'e.g. Waste bin overflowing and needs immediate cleaning...';
        case 'ration_shop':
          return 'e.g. Essential goods ration shop issue / biometric issue...';
        case 'agriculture':
          return 'e.g. Irrigation canal desiltation needed / agricultural power issue...';
        case 'burial_ground':
          return 'e.g. Burial ground pathway overgrown and damaged...';
        case 'health_sanitation':
          return 'e.g. Mosquito menace in area, fogging required...';
        case 'stray_animals':
          return 'e.g. Stray animal menace near school area...';
        case 'revenue_land':
          return 'e.g. Land survey / Patta transfer assistance needed...';
        case 'community_infra':
          return 'e.g. Village community hall or library repair needed...';
        default:
          return 'Describe the grievance clearly with exact location and required solution...';
      }
    }
  };

  // Village e-Services
  const villageServices = [
    {
      id: 'patta',
      title: { ta: 'நிலப் பட்டா & சிட்டா நகல்', en: 'Patta & Chitta Records' },
      desc: { ta: 'கிராம நில உரிமை ஆவணம் மற்றும் வரைபட பார்வை.', en: 'Land ownership records and FMB field sketch download.' },
      officialUrl: 'https://eservices.tn.gov.in',
      badge: { ta: 'வருவாய்த்துறை', en: 'Revenue' },
      docs: { ta: 'சர்வே எண் / பட்டா எண்', en: 'Survey No / Patta No' }
    },
    {
      id: 'ration',
      title: { ta: 'ஸ்மார்ட் குடும்ப அட்டை (TNPDS)', en: 'Smart Ration Card' },
      desc: { ta: 'புதிய அட்டை விண்ணப்பம், குடும்ப உறுப்பினர் சேர்த்தல் / நீக்கல்.', en: 'New card application, add/remove member, address change.' },
      officialUrl: 'https://tnpds.gov.in',
      badge: { ta: 'உணவுப்பொருள்', en: 'Food Supply' },
      docs: { ta: 'ஆதார் அட்டை, பிறப்புச் சான்றிதழ்', en: 'Aadhaar, Birth Certificate' }
    },
    {
      id: 'pension',
      title: { ta: 'முதியோர் & விதவை ஓய்வூதியம் (OAP)', en: 'Social Welfare Pension' },
      desc: { ta: 'மாதாந்திர முதியோர், மாற்றுத்திறனாளி & விதவை உதவித்தொகை.', en: 'Monthly pension for senior citizens, widows, and disabled persons.' },
      officialUrl: 'https://edistricts.tn.gov.in',
      badge: { ta: 'சமூக நலத்துறை', en: 'Social Welfare' },
      docs: { ta: 'ஆதார், வயது சான்று, வங்கி பாஸ்புக்', en: 'Aadhaar, Age Proof, Bank Book' }
    },
    {
      id: 'pmkisan',
      title: { ta: 'PM-கிசான் & உழவர் கடன் அட்டை', en: 'PM-Kisan & Farmer Welfare' },
      desc: { ta: 'ஆண்டுக்கு ₹6,000 வேளாண் உதவித்தொகை & பயிர் காப்பீடு.', en: 'PM-Kisan ₹6,000 assistance, e-KYC and crop insurance.' },
      officialUrl: 'https://pmkisan.gov.in',
      badge: { ta: 'வேளாண்மை', en: 'Agriculture' },
      docs: { ta: 'பட்டா பாஸ்புக், ஆதார், நில ஆவணம்', en: 'Patta Passbook, Aadhaar, Land Doc' }
    },
    {
      id: 'electricity',
      title: { ta: 'மின்சார பெயர் மாற்றம் & கட்டணம்', en: 'TANGEDCO Electricity Services' },
      desc: { ta: 'வீட்டு/விவசாய மின் இணைப்பு பெயர் மாற்றம், புதிய இணைப்பு.', en: 'Ownership transfer, tariff payment, new connection.' },
      officialUrl: 'https://www.tnebnet.org',
      badge: { ta: 'மின்சாரம்', en: 'Electricity' },
      docs: { ta: 'மின் அட்டை எண், பத்திர நகல்', en: 'EB Consumer No, Property Doc' }
    },
    {
      id: 'certificates',
      title: { ta: 'வருமானம், சாதி & இருப்பிட சான்றிதழ்', en: 'Revenue e-Certificates' },
      desc: { ta: 'வருமானச் சான்றிதழ், சாதிச் சான்றிதழ் & முதல் பட்டதாரி.', en: 'Income, Community, Nativity & First Graduate certificates.' },
      officialUrl: 'https://www.tnesevai.tn.gov.in',
      badge: { ta: 'இ-சேவை', en: 'e-Seva' },
      docs: { ta: 'ஆதார், குடும்ப அட்டை, புகைப்படம்', en: 'Aadhaar, Ration Card, Photo' }
    }
  ];

  // Submit Grievance
  const handleSubmitGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !description.trim()) {
      setFormError(language === 'ta' ? 'அனைத்து விவரங்களையும் பூர்த்தி செய்யவும்.' : 'Please fill all required fields.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!/^\d{10}$/.test(cleanPhone)) {
      setFormError(language === 'ta' ? 'சரியான 10 இலக்க செல்போன் எண்ணை உள்ளிடவும்.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    setFormError('');

    const fullLocation = customLocation.trim()
      ? `${selectedHamlet} - ${customLocation.trim()}`
      : selectedHamlet;

    try {
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizenName: name.trim(),
          phoneNumber: cleanPhone,
          village: 'பெரியகோட்டை',
          location: fullLocation,
          category,
          priority,
          description: description.trim(),
          status: 'Received'
        })
      });

      if (!res.ok) throw new Error('Failed to register grievance');
      const data = await res.json();
      setCreatedGrievance(data);
    } catch {
      setFormError(
        language === 'ta'
          ? 'புகாரை பதிவு செய்வதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.'
          : 'Could not register grievance. Please retry.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const copyId = () => {
    if (!createdGrievance) return;
    navigator.clipboard.writeText(createdGrievance.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Track Grievance
  const handleTrackSearch = async (e?: React.FormEvent, customId?: string) => {
    if (e) e.preventDefault();
    const query = (customId || trackQuery).trim();
    if (!query) {
      setTrackError(
        language === 'ta'
          ? 'மனு எண் அல்லது 10 இலக்க செல்போன் எண்ணை உள்ளிடவும்.'
          : 'Please enter Grievance ID or 10-digit phone number.'
      );
      return;
    }

    setTrackingLoading(true);
    setTrackError('');
    setTrackedTickets(null);
    setSelectedTrackedTicket(null);

    try {
      const res = await fetch(`/api/track/${encodeURIComponent(query)}`, { cache: 'no-store' });
      const data = await res.json();

      if (!res.ok || !data.found) {
        setTrackError(
          language === 'ta'
            ? 'மனு எதுவும் கண்டுபிடிக்கப்படவில்லை. மனு எண் அல்லது செல்போன் எண்ணை சரிபார்க்கவும்.'
            : 'No matching grievance records found. Please verify your ID or phone.'
        );
        return;
      }

      if (Array.isArray(data.grievances) && data.grievances.length > 0) {
        setTrackedTickets(data.grievances);
        setSelectedTrackedTicket(data.grievances[0]);
      } else if (data.ticket && (data.ticket.category || data.ticket.location || data.type === 'grievance')) {
        const grv = data.ticket as GrievanceTicket;
        setTrackedTickets([grv]);
        setSelectedTrackedTicket(grv);
      } else if (data.data && (data.data.category || data.data.location || data.type === 'grievance')) {
        const grv = data.data as GrievanceTicket;
        setTrackedTickets([grv]);
        setSelectedTrackedTicket(grv);
      } else {
        setTrackError(
          language === 'ta'
            ? 'இந்த செல்போன் எண்ணில் குறைதீர்ப்பு மனுக்கள் எதுவும் இல்லை.'
            : 'No grievances found under this mobile number or ticket ID.'
        );
      }
    } catch {
      setTrackError(
        language === 'ta'
          ? 'நிலை அறிவதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.'
          : 'Error searching grievance. Please retry.'
      );
    } finally {
      setTrackingLoading(false);
    }
  };

  // Status visual mapping
  const getStatusStepIndex = (status: GrievanceStatus) => {
    switch (status) {
      case 'Received':
        return 0;
      case 'Forwarded to Official':
        return 1;
      case 'Action Pending':
        return 2;
      case 'Resolved':
      case 'Closed':
        return 3;
      default:
        return 0;
    }
  };

  const filteredNotices = notices.filter((n) => {
    if (selectedNoticeCategory === 'all') return true;
    if (selectedNoticeCategory === 'panchayat') return n.category === 'panchayat';
    if (selectedNoticeCategory === 'camp') return n.category === 'camp';
    if (selectedNoticeCategory === 'subsidy') return n.category === 'subsidy' || n.category === 'urgent';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      {/* 1. SLIM STATUS & ASSISTANCE BAR */}
      <div className="flex items-center justify-between gap-2 flex-wrap pb-1">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
          <span>
            {language === 'ta'
              ? 'கிராம பொதுமக்கள் குறைதீர்ப்பு தலைமை தளம்'
              : 'Citizen Civic Grievance Redressal Portal'}
          </span>
        </div>

        {/* Live Centre Operations Badge & Voice Assist */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={platformSettings?.googleMapUrl || 'https://maps.app.goo.gl/kDxy1NXkBNCYcAZEA'}
            target="_blank"
            rel="noopener noreferrer"
            title="Google மேப்பில் நால்ரோடு மைய இருப்பிடம் பார்க்க"
            className="inline-flex items-center gap-1.5 bg-slate-950 hover:bg-black text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
          >
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                platformSettings?.centreStatus === 'closed' || platformSettings?.centreStatus === 'camp'
                  ? 'bg-rose-400 shadow-[0_0_8px_#f43f5e]'
                  : platformSettings?.centreStatus === 'break' || platformSettings?.centreStatus === 'temp_closed'
                  ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
                  : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
              }`}
            />
            <span>
              {platformSettings?.centreStatus === 'closed' || platformSettings?.centreStatus === 'camp'
                ? (language === 'ta' ? 'நால்ரோடு மையம்: விடுமுறை' : 'Nalroad Centre: Closed')
                : platformSettings?.centreStatus === 'break' || platformSettings?.centreStatus === 'temp_closed'
                ? (language === 'ta' ? 'நால்ரோடு மையம்: இடைவேளை' : 'Nalroad Centre: Break')
                : (language === 'ta' ? 'நால்ரோடு மையம்: இயங்குகிறது' : 'Nalroad Centre: Open')}
            </span>
            <MapPin className="w-3.5 h-3.5 text-amber-300 ml-0.5" />
          </a>
          <VoiceAssistButton textToSpeak={audioIntro} size="sm" />
        </div>
      </div>

      {/* 2. PRIMARY CIVIC REPORTING & TRACKING PORTAL (ON TOP!) */}
      <div className="bg-white rounded-3xl border-2 border-amber-400 shadow-xl overflow-hidden">
        {/* Portal Top Bar: Mode Switcher */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 p-2 sm:p-3 flex flex-wrap items-center justify-between gap-2 border-b-2 border-amber-600">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePortalMode('report')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs transition-all shadow-xs cursor-pointer ${
                activePortalMode === 'report'
                  ? 'bg-slate-950 text-amber-300 border border-slate-800'
                  : 'bg-white/80 hover:bg-white text-slate-900'
              }`}
            >
              <FilePlus className="w-4 h-4" />
              <span>{language === 'ta' ? '1. புதிய மனு பதிவு (Register)' : '1. Register Grievance'}</span>
            </button>

            <button
              onClick={() => setActivePortalMode('track')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs transition-all shadow-xs cursor-pointer ${
                activePortalMode === 'track'
                  ? 'bg-slate-950 text-amber-300 border border-slate-800'
                  : 'bg-white/80 hover:bg-white text-slate-900'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>{language === 'ta' ? '2. மனு நிலை அறிய (Track Status)' : '2. Track Status'}</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-950 text-xs font-bold px-2">
            <span>ஆபரேட்டர் நேரடி உதவி:</span>
            <a href="tel:9790382437" className="underline font-black text-slate-950 hover:text-emerald-950">
              முருகேசன் (97903 82437)
            </a>
          </div>
        </div>

        {/* Portal Body: MODE 1 - REPORTING FORM */}
        {activePortalMode === 'report' && (
          <div className="p-5 sm:p-8 space-y-6">
            {createdGrievance ? (
              /* Success Confirmation */
              <div className="text-center py-6 sm:py-8 space-y-5 animate-in fade-in zoom-in-95 max-w-2xl mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    {language === 'ta' ? 'மனு பதிவு செய்யப்பட்டது' : 'Grievance Registered'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-950">
                    {language === 'ta' ? 'உங்கள் குறை வெற்றிகரமாக பதிவானது' : 'Grievance Submitted Successfully'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {language === 'ta'
                      ? 'உங்கள் மனு எண் கீழே தரப்பட்டுள்ளது. நால்ரோடு இ-சேவை மையம் வாயிலாக ஊராட்சி நிர்வாகத்திற்கு அனுப்பப்பட்டுள்ளது.'
                      : 'Your Grievance ID is generated. It has been routed to village authorities.'}
                  </p>
                </div>

                {/* Clean ID Display (PDS-GRV-XXXX) */}
                <div className="bg-slate-50 border-2 border-emerald-400 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
                  <div className="text-center sm:text-left">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                      {language === 'ta' ? 'மனு எண் (Grievance Ticket ID)' : 'Ticket ID'}
                    </span>
                    <span className="font-mono text-xl sm:text-2xl font-black text-emerald-900 tracking-wider">
                      {createdGrievance.id}
                    </span>
                  </div>

                  <button
                    onClick={copyId}
                    className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-amber-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? (language === 'ta' ? 'நகலெடுக்கப்பட்டது' : 'Copied!') : (language === 'ta' ? 'எண்ணை நகலெடு' : 'Copy ID')}</span>
                  </button>
                </div>

                {/* Direct Action Buttons: Single-Page Print Slip & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <button
                    onClick={() =>
                      printAcknowledgmentReceipt({
                        id: createdGrievance.id,
                        citizenName: createdGrievance.citizenName,
                        phoneNumber: createdGrievance.phoneNumber,
                        serviceName: `கிராம குறைதீர்ப்பு (${createdGrievance.category})`,
                        village: createdGrievance.village,
                        createdAt: createdGrievance.createdAt,
                        status: createdGrievance.status,
                        description: createdGrievance.description
                      })
                    }
                    className="w-full flex items-center justify-center gap-2 bg-slate-950 hover:bg-black text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors text-xs cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-amber-400" />
                    <span>{language === 'ta' ? 'ரசீது அச்சிடுக (1-Page Slip)' : 'Print 1-Page Slip'}</span>
                  </button>

                  <a
                    href={`https://wa.me/919790382437?text=${encodeURIComponent(
                      `வணக்கம் முருகேசன் அவர்களே,\nஎன் பெயர்: ${createdGrievance.citizenName}\nமனு எண்: ${createdGrievance.id}\nபிரிவு: ${createdGrievance.category}\nஇடம்: ${createdGrievance.location}\nவிவரம்: ${createdGrievance.description}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl shadow transition-colors text-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp வழி அனுப்ப</span>
                  </a>

                  <button
                    onClick={() => {
                      setTrackQuery(createdGrievance.id);
                      setActivePortalMode('track');
                      handleTrackSearch(undefined, createdGrievance.id);
                    }}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs shadow transition-colors text-center cursor-pointer"
                  >
                    {language === 'ta' ? 'நிலையை கண்காணிக்க' : 'Track Status'}
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setCreatedGrievance(null);
                      setName('');
                      setPhone('');
                      setDescription('');
                      setCustomLocation('');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-900 font-bold underline cursor-pointer"
                  >
                    {language === 'ta' ? 'மற்றொரு புகாரை பதிவு செய்ய (File Another Issue)' : 'File Another Grievance'}
                  </button>
                </div>
              </div>
            ) : (
              /* Two-Column Form Layout: Form on Left, Sleek Small Operator Card on Right */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form Column */}
                <div className="lg:col-span-8 space-y-5">
                  {/* Issue Category Dropdown List Selector */}
                  <div>
                    <label className="block text-xs font-black text-slate-900 mb-1.5">
                      {language === 'ta'
                        ? 'பிரச்சனை வகை (Issue Category) *'
                        : 'Issue Category *'}
                    </label>

                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as GrievanceCategory)}
                        className="w-full px-3.5 py-3 rounded-xl border-2 border-emerald-600/50 focus:border-emerald-700 text-sm font-bold text-slate-900 bg-white cursor-pointer shadow-xs transition-colors"
                      >
                        {categories.map((cat, idx) => (
                          <option key={cat.id} value={cat.id}>
                            {`${idx + 1}. ${cat.title[language]}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Selected Issue Info Card with Department & Fast Action Notice */}
                    {(() => {
                      const selectedCat = categories.find((c) => c.id === category) || categories[0];
                      const IconComp = selectedCat.icon;
                      const deptInfo = categoryDeptMap[category];
                      return (
                        <div className="mt-2.5 p-3 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                              <IconComp className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[10px] text-amber-900 font-bold uppercase tracking-wider block">
                                {deptInfo?.dept[language] || (language === 'ta' ? 'ஊராட்சி நிர்வாகம்' : 'Panchayat Admin')}
                              </span>
                              <span className="font-extrabold text-slate-950 text-xs sm:text-sm truncate block">
                                {selectedCat.title[language]}
                              </span>
                            </div>
                          </div>

                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-md border border-emerald-300 shrink-0">
                            {language === 'ta' ? 'நேரடி குறைதீர்ப்பு' : 'Direct Grievance'}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  <form onSubmit={handleSubmitGrievance} className="space-y-4">
                    {formError && (
                      <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          {language === 'ta' ? 'விண்ணப்பதாரர் பெயர் *' : 'Applicant Name *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={language === 'ta' ? 'உங்கள் பெயர்' : 'Your name'}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          {language === 'ta' ? 'செல்போன் எண் (10 இலக்கம்) *' : 'Mobile Number (10 digits) *'}
                        </label>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="98XXXXXXXX"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm text-slate-900 font-mono"
                        />
                      </div>
                    </div>

                    {/* VILLAGE HAMLET DROPDOWN - EXACT OPTIONS: Periyakottai, Periyakottai East, Periyakottai West, Karungalpatti, Kandhappa Goundan Valasu, Others */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          {language === 'ta' ? 'கிராமம் / சிற்றூர் (Hamlet) *' : 'Village Hamlet *'}
                        </label>
                        <select
                          value={selectedHamlet}
                          onChange={(e) => setSelectedHamlet(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm text-slate-900 bg-white font-medium cursor-pointer"
                        >
                          {VILLAGE_INFO.hamlets.map((hamlet, idx) => (
                            <option key={idx} value={hamlet[language]}>
                              {hamlet[language]}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          {language === 'ta' ? 'தெரு / பகுதி / அடையாள இடம் (Street / Area)' : 'Street / Landmark / Area'}
                        </label>
                        <input
                          type="text"
                          value={customLocation}
                          onChange={(e) => setCustomLocation(e.target.value)}
                          placeholder={language === 'ta' ? 'எ.கா: பிள்ளையார் கோயில் அருகில் / கிழக்குத் தெரு' : 'e.g. Near Temple / East Street'}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          {language === 'ta' ? 'முன்னுரிமை (Priority)' : 'Priority'}
                        </label>
                        <select
                          value={priority}
                          onChange={(e) => setPriority(e.target.value as 'Normal' | 'Urgent')}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm text-slate-900 bg-white font-medium cursor-pointer"
                        >
                          <option value="Normal">{language === 'ta' ? 'சாதாரண குறை (Normal)' : 'Normal'}</option>
                          <option value="Urgent">{language === 'ta' ? 'அவசர தீர்வு தேவை (Urgent)' : 'Urgent'}</option>
                        </select>
                      </div>

                      <div className="flex items-center text-xs text-slate-500 pt-5">
                        <span>{language === 'ta' ? 'ஊராட்சி அலுவலகம் & அதிகாரிகளுக்கு உடனடியாக அனுப்பப்படும்' : 'Forwarded directly to Panchayat Administration'}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {language === 'ta' ? 'பிரச்சனையின் முழு விவரம் (Detailed Description) *' : 'Detailed Description *'}
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={getCategoryPlaceholder(category, language)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-sm text-slate-900 resize-y"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-black py-3.5 px-6 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {submitting
                          ? (language === 'ta' ? 'பதிவாகிறது...' : 'Submitting...')
                          : (language === 'ta' ? 'மனுவை சமர்ப்பிக்க (Submit Civic Grievance)' : 'Submit Civic Grievance')}
                      </span>
                    </button>
                  </form>
                </div>

                {/* Right Column: SLEEK, SMALL OPERATOR CARD & VILLAGE HAMLET SCOPE */}
                <div className="lg:col-span-4 space-y-3">
                  {/* Compact Operator Profile Card */}
                  <div className="bg-slate-900 text-white p-3.5 sm:p-4 rounded-2xl border border-emerald-500/50 shadow-md space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src="/images/murugesan.jpg"
                        alt="முருகேசன்"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-black text-xs sm:text-sm text-white truncate">முருகேசன்</h3>
                          <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded">
                            EFADGL0636
                          </span>
                        </div>
                        <p className="text-[10px] text-emerald-300 truncate">
                          {language === 'ta' ? 'நால்ரோடு இ-சேவை ஆபரேட்டர்' : 'Nalroad e-Seva Operator'}
                        </p>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-snug">
                      {language === 'ta'
                        ? 'மனு சமர்ப்பிக்க உதவி தேவைப்பட்டால் நேரடியாக தொடர்பு கொள்ளவும்.'
                        : 'Need help submitting? Contact operator directly.'}
                    </p>

                    <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                      <a
                        href="tel:9790382437"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-2 rounded-xl text-[11px] flex items-center justify-center gap-1 shadow-xs transition-colors"
                      >
                        <PhoneCall className="w-3 h-3 text-amber-300 shrink-0" />
                        <span className="truncate">97903 82437</span>
                      </a>

                      <a
                        href={`https://wa.me/919790382437?text=${encodeURIComponent(
                          'வணக்கம் முருகேசன் அவர்களே, பெரியகோட்டை கிராம ஊராட்சி குறைதீர்ப்பு தளம் வழியாக தொடர்பு கொள்கிறேன்.'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-2 rounded-xl text-[11px] flex items-center justify-center gap-1 shadow-xs transition-colors"
                      >
                        <MessageCircle className="w-3 h-3 shrink-0" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    <div className="text-center pt-0.5 border-t border-slate-800">
                      <Link
                        href="/murugesan"
                        className="text-[10px] text-amber-300 hover:text-amber-200 inline-flex items-center gap-1 font-semibold"
                      >
                        <span>{language === 'ta' ? 'ஆபரேட்டர் சான்றிதழ் விவரங்கள்' : 'Operator Credentials'}</span>
                        <ChevronRight className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Hamlets scope */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                    <span className="font-bold text-slate-900 block text-[11px]">
                      {language === 'ta' ? 'ஊராட்சிக்குட்பட்ட சிற்றூர்கள் (Hamlets):' : 'Hamlets Covered:'}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {VILLAGE_INFO.hamlets.map((h, i) => (
                        <span
                          key={i}
                          className="bg-white border border-slate-200 text-slate-800 text-[10px] px-2 py-0.5 rounded-md font-medium"
                        >
                          {h[language]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Portal Body: MODE 2 - LIVE TRACKER */}
        {activePortalMode === 'track' && (
          <div className="p-5 sm:p-8 space-y-6">
            <div className="max-w-2xl space-y-1">
              <h2 className="text-lg sm:text-xl font-black text-slate-950">
                {language === 'ta' ? 'மனுவின் தற்போதைய நிலையை அறிய' : 'Track Grievance Status Live'}
              </h2>
              <p className="text-xs text-slate-600">
                {language === 'ta'
                  ? 'உங்கள் மனு எண் (எ.கா: PDS-GRV-XXXX) அல்லது பதிவு செய்த 10 இலக்க செல்போன் எண்ணை உள்ளிட்டு தேடவும்.'
                  : 'Enter your Ticket ID (e.g., PDS-GRV-XXXX) or registered 10-digit mobile number.'}
              </p>
            </div>

            {/* Search Box */}
            <form onSubmit={handleTrackSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  placeholder={language === 'ta' ? 'PDS-GRV-XXXX அல்லது 98XXXXXXXX' : 'PDS-GRV-XXXX or 98XXXXXXXX'}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-300 focus:border-emerald-600 text-sm text-slate-900 font-mono font-bold uppercase"
                />
              </div>

              <button
                type="submit"
                disabled={trackingLoading}
                className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-black text-sm px-6 py-3 rounded-2xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {trackingLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>{trackingLoading ? (language === 'ta' ? 'தேடுகிறது...' : 'Searching...') : (language === 'ta' ? 'கண்காணிக்க' : 'Track')}</span>
              </button>
            </form>

            {trackError && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 max-w-2xl">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{trackError}</span>
              </div>
            )}

            {/* If multiple tickets found for phone number */}
            {trackedTickets && trackedTickets.length > 1 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {language === 'ta' ? `கண்டுபிடிக்கப்பட்ட மனுக்கள் (${trackedTickets.length}):` : `Found Tickets (${trackedTickets.length}):`}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {trackedTickets.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTrackedTicket(t)}
                      className={`text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                        selectedTrackedTicket?.id === t.id
                          ? 'border-emerald-600 bg-emerald-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-mono font-black text-xs text-slate-950">{t.id}</span>
                        <span className="text-[10px] bg-slate-100 font-bold px-2 py-0.5 rounded">
                          {t.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 truncate mt-1">{t.description}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">{t.createdAt.split('T')[0]}</span>
                        <span className="font-bold text-emerald-800">{t.status}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Ticket Status Card */}
            {selectedTrackedTicket && (
              <div className="bg-slate-50 rounded-3xl p-5 sm:p-7 border-2 border-emerald-500 shadow-sm space-y-6 animate-in fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-lg sm:text-xl text-slate-950">
                        {selectedTrackedTicket.id}
                      </span>
                      <span
                        className={`text-xs font-black px-3 py-1 rounded-full ${
                          selectedTrackedTicket.status === 'Resolved' || selectedTrackedTicket.status === 'Closed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : selectedTrackedTicket.status === 'Action Pending'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-blue-100 text-blue-800 border border-blue-300'
                        }`}
                      >
                        {selectedTrackedTicket.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {language === 'ta' ? 'பதிவு செய்த நாள்:' : 'Registered On:'}{' '}
                      <span className="font-mono font-bold text-slate-800">
                        {selectedTrackedTicket.createdAt.replace('T', ' ').substring(0, 16)}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        printAcknowledgmentReceipt({
                          id: selectedTrackedTicket.id,
                          citizenName: selectedTrackedTicket.citizenName,
                          phoneNumber: selectedTrackedTicket.phoneNumber,
                          serviceName: `கிராம குறைதீர்ப்பு (${selectedTrackedTicket.category})`,
                          village: selectedTrackedTicket.village,
                          createdAt: selectedTrackedTicket.createdAt,
                          status: selectedTrackedTicket.status,
                          description: selectedTrackedTicket.description
                        })
                      }
                      className="bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold py-2 px-3.5 rounded-xl border border-slate-300 flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      <span>{language === 'ta' ? 'ரசீது அச்சிடு' : 'Print Slip'}</span>
                    </button>

                    <a
                      href={`https://wa.me/919790382437?text=${encodeURIComponent(
                        `வணக்கம் முருகேசன் அவர்களே, என் குறைதீர்ப்பு மனு எண்: ${selectedTrackedTicket.id} நிலவரம் குறித்து கேட்க விரும்புகிறேன்.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 px-3.5 rounded-xl flex items-center gap-1.5 shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* 4-Step Visual Tracker */}
                <div className="py-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { step: 0, label: { ta: '1. பெறப்பட்டது', en: '1. Received' } },
                      { step: 1, label: { ta: '2. அதிகாரிக்கு அனுப்பப்பட்டது', en: '2. Forwarded' } },
                      { step: 2, label: { ta: '3. நடவடிக்கை நிலுவை', en: '3. Action Pending' } },
                      { step: 3, label: { ta: '4. தீர்க்கப்பட்டது', en: '4. Resolved' } }
                    ].map((st) => {
                      const currentStep = getStatusStepIndex(selectedTrackedTicket.status);
                      const isComplete = currentStep >= st.step;
                      const isCurrent = currentStep === st.step;

                      return (
                        <div
                          key={st.step}
                          className={`p-3 rounded-2xl border text-center transition-all ${
                            isCurrent
                              ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                              : isComplete
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-white text-slate-400 border-slate-200'
                          }`}
                        >
                          <div className="flex justify-center mb-1">
                            {isComplete ? (
                              <CheckCircle2 className={`w-5 h-5 ${isCurrent ? 'text-amber-300' : 'text-emerald-700'}`} />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                            )}
                          </div>
                          <span className="text-xs font-bold block">{st.label[language]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Grievance Details Card */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-2 border-b border-slate-100">
                    <div>
                      <span className="text-slate-400 block">{language === 'ta' ? 'விண்ணப்பதாரர்:' : 'Citizen:'}</span>
                      <span className="font-bold text-slate-900">{selectedTrackedTicket.citizenName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{language === 'ta' ? 'பிரிவு:' : 'Category:'}</span>
                      <span className="font-bold text-slate-900">{selectedTrackedTicket.category}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{language === 'ta' ? 'இடம் / கிராமம்:' : 'Location:'}</span>
                      <span className="font-bold text-slate-900">{selectedTrackedTicket.location}</span>
                    </div>
                  </div>

                  <span className="text-slate-400 block pt-1">{language === 'ta' ? 'பிரச்சனை விவரம்:' : 'Description:'}</span>
                  <p className="text-slate-800 leading-relaxed">{selectedTrackedTicket.description}</p>
                </div>

                {/* Operator Timeline Notes */}
                {selectedTrackedTicket.timeline && selectedTrackedTicket.timeline.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-black text-slate-900 block">
                      {language === 'ta' ? 'அதிகாரப்பூர்வ நடவடிக்கை குறிப்புகள்:' : 'Official Action Timeline:'}
                    </span>
                    <div className="space-y-2">
                      {selectedTrackedTicket.timeline.map((item, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{item.status}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
                            </div>
                            <p className="text-slate-600 mt-0.5">{item.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. PANCHAYAT NOTICES (DIRECTLY BELOW GRIEVANCE PORTAL) */}
      <div className="space-y-4">
        {/* Live Operator Announcement Banner (If active) */}
        {platformSettings?.announcementBanner?.enabled !== false && (
          <section
            aria-label="Panchayat Announcements"
            className={`rounded-2xl p-4 sm:p-4.5 border-2 shadow-xs transition-all ${
              platformSettings?.announcementBanner?.type === 'alert'
                ? 'bg-gradient-to-r from-red-600 via-rose-700 to-red-800 text-white border-red-900'
                : platformSettings?.announcementBanner?.type === 'warning'
                ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 border-amber-600'
                : 'bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white border-emerald-600'
            }`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    platformSettings?.announcementBanner?.type === 'warning'
                      ? 'bg-slate-950 text-amber-300'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  <Megaphone className="w-5 h-5 animate-bounce" />
                </div>

                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        platformSettings?.announcementBanner?.type === 'warning'
                          ? 'bg-slate-950 text-amber-300'
                          : 'bg-white text-emerald-950'
                      }`}
                    >
                      <span>{language === 'ta' ? 'ஊராட்சி நேரலை அறிவிப்பு' : 'Panchayat Live Notice'}</span>
                    </span>
                    <span className="text-[11px] opacity-90 font-bold">
                      {language === 'ta' ? 'நால்ரோடு மக்கள் இ-சேவை மையம்' : 'Nalroad Makkal e-Seva'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-black leading-snug break-words">
                    {platformSettings?.announcementBanner?.text?.[language] ||
                      (language === 'ta'
                        ? '📢 பெரியகோட்டை கிராம மக்களுக்கு: குடிநீர் மற்றும் தெருவிளக்கு பராமரிப்பு புகார்களை இந்த பக்கத்தில் உடனடியாக பதிவு செய்யலாம். நால்ரோடு மையம் வாயிலாக உடனடி தீர்வு காணப்படும்.'
                        : '📢 Periyakottai citizens: Report drinking water, streetlight, and civic issues directly above for official follow-up.')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <VoiceAssistButton
                  textToSpeak={
                    platformSettings?.announcementBanner?.text?.[language] ||
                    (language === 'ta'
                      ? 'பெரியகோட்டை கிராம ஊராட்சி நேரலை அறிவிப்பு.'
                      : 'Periyakottai Gram Panchayat live notice.')
                  }
                  size="sm"
                />
                <a
                  href="tel:9790382437"
                  className={`text-xs font-black px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0 ${
                    platformSettings?.announcementBanner?.type === 'warning'
                      ? 'bg-slate-950 text-white hover:bg-slate-800'
                      : 'bg-white text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                  <span>97903 82437</span>
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Village Notice Board */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-blue-600" />
                <h3 className="text-base sm:text-lg font-black text-slate-950">
                  {language === 'ta' ? 'பெரியகோட்டை கிராம ஊராட்சி அறிவிப்புகள் பலகை' : 'Periyakottai Village Circulars & Notices'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'ta'
                  ? 'ஊராட்சி மன்றம் மற்றும் நால்ரோடு மக்கள் இ-சேவை மையம் வாயிலாக பதிவேற்றப்படும் நேரலை அறிவிப்புகள்.'
                  : 'Official circulars published by panchayat and Nalroad e-Seva centre.'}
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'all', label: { ta: 'அனைத்தும்', en: 'All' } },
                { id: 'panchayat', label: { ta: 'ஊராட்சி', en: 'Panchayat' } },
                { id: 'camp', label: { ta: 'முகாம்கள்', en: 'Camps' } },
                { id: 'subsidy', label: { ta: 'மானியங்கள்', en: 'Subsidies' } }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedNoticeCategory(f.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedNoticeCategory === f.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {f.label[language]}
                </button>
              ))}
            </div>
          </div>

          {loadingNotices ? (
            <div className="py-8 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              <span>{language === 'ta' ? 'ஏற்றப்படுகிறது...' : 'Loading notices...'}</span>
            </div>
          ) : filteredNotices.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl">
              {language === 'ta' ? 'தற்போது இந்த பிரிவில் அறிவிப்புகள் எதுவும் இல்லை.' : 'No notices in this category right now.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNotices.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 rounded-2xl border transition-all space-y-2.5 flex flex-col justify-between ${
                    n.important
                      ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            n.category === 'panchayat'
                              ? 'bg-emerald-100 text-emerald-800'
                              : n.category === 'camp'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {n.category}
                        </span>
                        {n.important && (
                          <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded-full animate-pulse">
                            {language === 'ta' ? 'முக்கியமானது' : 'Important'}
                          </span>
                        )}
                      </div>

                      <VoiceAssistButton
                        textToSpeak={`${n.title[language]}. ${n.content[language]}`}
                        size="sm"
                      />
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                      {n.title[language]}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {n.content[language]}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{n.source || 'பெரியகோட்டை கிராம ஊராட்சி'}</span>
                    <span className="font-mono font-medium">{n.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. CIVIC SERVICES, DIRECTORY & GRAMA SABHA TABS */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setCivicTab('services')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              civicTab === 'services'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{language === 'ta' ? 'அத்தியாவசிய இ-சேவைகள்' : 'Village e-Services'}</span>
          </button>

          <button
            onClick={() => setCivicTab('directory')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              civicTab === 'directory'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{language === 'ta' ? 'அதிகாரிகள் தொடர்புகள்' : 'Authority Directory'}</span>
          </button>

          <button
            onClick={() => setCivicTab('profile')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              civicTab === 'profile'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{language === 'ta' ? 'கிராம சபை & விவரங்கள்' : 'Grama Sabha & Profile'}</span>
          </button>
        </div>

        {/* E-SERVICES TAB */}
        {civicTab === 'services' && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-5 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-950">
                  {language === 'ta' ? 'கிராம மக்களின் அத்தியாவசிய இ-சேவைகள்' : 'Essential Village e-Services'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'ta'
                    ? 'நால்ரோடு மக்கள் இ-சேவை மையம் வாயிலாக கிராம மக்களுக்கு வழங்கப்படும் முக்கிய அரசு சேவைகள் மற்றும் விண்ணப்பங்கள்.'
                    : 'Key digital services, land records, and welfare applications facilitated through Nalroad e-Seva.'}
                </p>
              </div>

              <a
                href="tel:9790382437"
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 px-3.5 rounded-xl flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-center"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'ta' ? 'முருகேசனை அழைக்க' : 'Call Operator'}</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {villageServices.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-slate-50 hover:bg-emerald-50/40 p-4.5 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] bg-emerald-100 text-emerald-900 font-extrabold px-2 py-0.5 rounded-md">
                        {srv.badge[language]}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {srv.docs[language]}
                      </span>
                    </div>

                    <h4 className="font-black text-sm text-slate-900 leading-snug">
                      {srv.title[language]}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {srv.desc[language]}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                    <a
                      href={srv.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-[11px] font-bold py-2 px-2.5 rounded-xl flex items-center justify-center gap-1 shadow-xs"
                    >
                      <span>அரசு தளம்</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>

                    <a
                      href={`https://wa.me/919790382437?text=${encodeURIComponent(
                        `வணக்கம் முருகேசன் அவர்களே, பெரியகோட்டை இ-சேவை தளம் வாயிலாக "${srv.title.ta}" சேவை பெற உதவி தேவைப்படுகிறது.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold py-2 px-2.5 rounded-xl flex items-center justify-center gap-1 shadow-xs"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>உதவி பெற</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DIRECTORY TAB */}
        {civicTab === 'directory' && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-5 animate-in fade-in">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-950">
                {language === 'ta' ? 'கிராம நிர்வாகம் & அவசர தொடர்புகள்' : 'Village Administration Directory'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'ta'
                  ? 'பெரியகோட்டை கிராம அலுவலர்கள் மற்றும் அவசர சேவை எண்கள்'
                  : 'Direct contact numbers for civic, revenue, EB, and health administration.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {VILLAGE_INFO.administrationDirectory.map((contact, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between gap-3 hover:shadow-xs transition-all"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 font-extrabold px-2 py-0.5 rounded-md">
                      {contact.badge[language]}
                    </span>
                    <h4 className="font-black text-xs sm:text-sm text-slate-900 leading-snug">
                      {contact.role[language]}
                    </h4>
                    <p className="text-xs font-bold text-emerald-800">
                      {contact.person[language]}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {contact.address[language]}
                    </p>
                  </div>

                  <a
                    href={`tel:${contact.phone.replace(/\D/g, '')}`}
                    className="w-full bg-slate-900 hover:bg-black text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
                    <span>{contact.phone}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFILE & GRAMA SABHA TAB */}
        {civicTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
            {/* Village Profile Details */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-base sm:text-lg font-black text-slate-950">
                {language === 'ta' ? 'ஊராட்சி விவரங்கள்' : 'Gram Panchayat Details'}
              </h3>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">{language === 'ta' ? 'ஊராட்சி ஒன்றியம்:' : 'Block:'}</span>
                  <span className="font-bold text-slate-900">{VILLAGE_INFO.block[language]}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">{language === 'ta' ? 'தாலுகா & மாவட்டம்:' : 'Taluk & District:'}</span>
                  <span className="font-bold text-slate-900">ஒட்டன்சத்திரம், திண்டுக்கல்</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">{language === 'ta' ? 'அஞ்சல் குறியீடு:' : 'PIN Code:'}</span>
                  <span className="font-bold font-mono text-emerald-800">624614</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">{language === 'ta' ? 'சட்டமன்றத் தொகுதி:' : 'Assembly Constituency:'}</span>
                  <span className="font-bold text-slate-900">ஒட்டன்சத்திரம் (128)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">{language === 'ta' ? 'நாடாளுமன்றத் தொகுதி:' : 'Parliamentary:'}</span>
                  <span className="font-bold text-slate-900">திண்டுக்கல் (22)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">{language === 'ta' ? 'சிற்றூர்கள் (Hamlets):' : 'Hamlets:'}</span>
                  <span className="font-bold text-slate-900">பெரியகோட்டை, பெரியகோட்டை கிழக்கு, பெரியகோட்டை மேற்கு, கருங்கல்பட்டி, கந்தப்ப கவுண்டன் வலசு</span>
                </div>
              </div>
            </div>

            {/* Grama Sabha Information */}
            <div className="lg:col-span-6 bg-emerald-50 rounded-3xl p-5 sm:p-7 border-2 border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-950 font-black text-base">
                <Calendar className="w-5 h-5 text-emerald-700" />
                <span>{language === 'ta' ? 'கிராம சபை கூட்ட நாட்கள்' : 'Mandated Grama Sabha Schedule'}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {VILLAGE_INFO.gramaSabhaDates.map((gs, idx) => (
                  <div key={idx} className="p-2.5 bg-white rounded-xl border border-emerald-200 text-xs">
                    <span className="font-black text-emerald-900 block">{gs.date}</span>
                    <span className="text-slate-600 text-[11px]">{gs.occasion[language]}</span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-emerald-900 leading-relaxed bg-emerald-100/70 p-2.5 rounded-xl">
                {language === 'ta'
                  ? 'கிராம வரவு செலவு கணக்கு, 100 நாள் வேலை திட்ட பட்டியல், குடிநீர் பணிகள் மற்றும் நலத்திட்ட பயனாளிகள் கிராம சபையில் வெளிப்படையாக முடிவு செய்யப்படுகின்றனர்.'
                  : 'Village budget audits, 100-day work lists, and welfare approvals are verified in Grama Sabha.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
