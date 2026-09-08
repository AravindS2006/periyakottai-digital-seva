'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/context';
import {
  RequestTicket,
  GrievanceTicket,
  RequestStatus,
  GrievanceStatus,
  PlatformSettings,
  VillageNotice,
  GrievanceCategory
} from '@/types';
import {
  printAcknowledgmentReceipt,
  printOfficialGrievancePdf,
  generateOfficialForwardingWhatsAppUrl,
  getGrievanceDepartment
} from '@/lib/printReceipt';
import {
  Bell,
  Search,
  PlusCircle,
  RefreshCw,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Phone,
  PhoneCall,
  MessageCircle,
  Printer,
  X,
  Sliders,
  ChevronDown,
  Check,
  Trash2,
  Clock,
  Inbox,
  Building2,
  MapPin,
  FileText,
  Lock,
  ArrowRight,
  ExternalLink,
  Calendar,
  Sparkles,
  Droplets,
  Lightbulb,
  Truck,
  Waves,
  HeartHandshake,
  Bug,
  Dog,
  Landmark,
  School,
  HelpCircle,
  Send,
  Globe,
  Share2
} from 'lucide-react';

export default function OperatorPortalPage() {
  const { language: globalLanguage, setLanguage: setGlobalLanguage } = useI18n();
  const router = useRouter();

  // PORTAL LANGUAGE: Defaults to 'en' as requested ("The operator portal is not in english fix it")
  // Allows seamless 1-click toggle to Tamil if desired.
  const [portalLang, setPortalLang] = useState<'en' | 'ta'>('en');

  // Helper translation function
  const t = (enText: string, taText: string) => (portalLang === 'en' ? enText : taText);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Data state
  const [requests, setRequests] = useState<RequestTicket[]>([]);
  const [grievances, setGrievances] = useState<GrievanceTicket[]>([]);
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [notices, setNotices] = useState<VillageNotice[]>([]);
  const [loading, setLoading] = useState(true);

  // DEFAULT LANDING TAB IS VILLAGE GRIEVANCES AS REQUIRED
  const [activeTab, setActiveTab] = useState<'grievances' | 'requests' | 'settings'>('grievances');

  // Notifications Modal State
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Filter state for Grievances (Dropdown List View)
  const [grvStatusFilter, setGrvStatusFilter] = useState<string>('All');
  const [grvCategoryFilter, setGrvCategoryFilter] = useState<string>('All');
  const [grvHamletFilter, setGrvHamletFilter] = useState<string>('All');
  const [grvSearchQuery, setGrvSearchQuery] = useState<string>('');

  // Filter state for Requests (Dropdown List View)
  const [reqStatusFilter, setReqStatusFilter] = useState<string>('All');
  const [reqPriorityFilter, setReqPriorityFilter] = useState<string>('All');
  const [reqSearchQuery, setReqSearchQuery] = useState('');

  // Settings & Notice management state
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [newNoticeTitleTa, setNewNoticeTitleTa] = useState('');
  const [newNoticeTitleEn, setNewNoticeTitleEn] = useState('');
  const [newNoticeContentTa, setNewNoticeContentTa] = useState('');
  const [newNoticeContentEn, setNewNoticeContentEn] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState<'camp' | 'subsidy' | 'panchayat' | 'urgent'>('camp');
  const [newNoticeImportant, setNewNoticeImportant] = useState(false);
  const [newNoticeSource, setNewNoticeSource] = useState('Four Roads Makkal e-Seva Centre');
  const [submittingNotice, setSubmittingNotice] = useState(false);

  // Status update modal / remark modal
  const [statusModalTicket, setStatusModalTicket] = useState<{
    id: string;
    type: 'request' | 'grievance';
    currentStatus: string;
    citizenName: string;
    phoneNumber: string;
    serviceName: string;
    description?: string;
  } | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('In Progress');
  const [statusNote, setStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Walk-in Citizen Booking Modal
  const [walkinModalOpen, setWalkinModalOpen] = useState(false);
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinHamlet, setWalkinHamlet] = useState('Periyakottai');
  const [walkinService, setWalkinService] = useState('Patta Transfer (பட்டா மாறுதல்)');
  const [walkinPriority, setWalkinPriority] = useState<'Normal' | 'Urgent'>('Normal');
  const [walkinNote, setWalkinNote] = useState('');
  const [submittingWalkin, setSubmittingWalkin] = useState(false);

  // Check auth session
  useEffect(() => {
    const cookies = document.cookie.split(';');
    const session = cookies.find((c) => c.trim().startsWith('pds_admin_session='));
    if (session && (session.includes('verified_624614') || session.includes('authenticated_murugesan'))) {
      setIsAuthenticated(true);
      loadData();
    } else {
      setIsAuthenticated(false);
    }
    setCheckingAuth(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        loadData();
      } else {
        setAuthError(t('Invalid security PIN. Please try again.', 'தவறான ரகசிய எண் (PIN). மீண்டும் முயற்சிக்கவும்.'));
      }
    } catch {
      setAuthError(t('Login failed. Please check network connection.', 'உள்நுழைவு தோல்வியடைந்தது. நெட்வொர்க்கை சரிபார்க்கவும்.'));
    }
  };

  const handleLogout = () => {
    document.cookie = 'pds_admin_session=; path=/; max-age=0';
    setIsAuthenticated(false);
    router.push('/');
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [reqRes, grvRes, setRes, notRes] = await Promise.all([
        fetch('/api/requests', { cache: 'no-store' }),
        fetch('/api/grievances', { cache: 'no-store' }),
        fetch('/api/settings', { cache: 'no-store' }),
        fetch('/api/notices', { cache: 'no-store' })
      ]);

      if (reqRes.ok) {
        const data = await reqRes.json();
        setRequests(Array.isArray(data) ? data : []);
      }
      if (grvRes.ok) {
        const data = await grvRes.json();
        setGrievances(Array.isArray(data) ? data : []);
      }
      if (setRes.ok) {
        const data = await setRes.json();
        if (data.success && data.settings) setSettings(data.settings);
      }
      if (notRes.ok) {
        const data = await notRes.json();
        if (data.success && Array.isArray(data.notices)) setNotices(data.notices);
      }
    } catch (err) {
      console.error('Error loading operator portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Quick Grievance Status Transition
  const handleQuickGrievanceStatusChange = async (ticketId: string, newStatus: GrievanceStatus, quickNote?: string) => {
    setUpdatingStatus(true);
    try {
      const defaultNote =
        newStatus === 'Forwarded to Official'
          ? (portalLang === 'en'
              ? 'Forwarded to competent department official for field inspection & action.'
              : 'மனு சம்பந்தப்பட்ட ஊராட்சி அதிகாரிகளுக்கு நடவடிக்கைக்காக அனுப்பப்பட்டுள்ளது.')
          : newStatus === 'Action Pending'
          ? (portalLang === 'en'
              ? 'Field inspection & corrective measures in progress.'
              : 'கள ஆய்வு & நடவடிக்கை மேற்கொள்ளப்பட்டு வருகிறது.')
          : newStatus === 'Resolved'
          ? (portalLang === 'en'
              ? 'Grievance inspected and successfully resolved.'
              : 'புகார் சரி செய்யப்பட்டு முழுமையாக தீர்க்கப்பட்டது.')
          : (portalLang === 'en' ? 'Grievance received and registered.' : 'மனு பெறப்பட்டு பதிவு செய்யப்பட்டது.');

      const res = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ticketId,
          type: 'grievance',
          status: newStatus,
          note: quickNote || defaultNote,
          author: 'Murugesan K (Operator)'
        })
      });

      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error('Error in quick status transition:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  /**
   * SEND TO OFFICIAL:
   * 1. Formats entire grievance as neat, detailed 1-page A4 PDF memo
   * 2. Forwards to operator's WhatsApp (97903 82437) himself
   * 3. Updates status to 'Forwarded to Official'
   */
  const handleSendGrievanceToOfficial = async (grv: GrievanceTicket) => {
    setUpdatingStatus(true);
    try {
      // 1. Synchronously open WhatsApp to operator's WhatsApp number to avoid browser popup blockers
      const whatsappUrl = generateOfficialForwardingWhatsAppUrl(grv);
      window.open(whatsappUrl, '_blank');

      // 2. Generate neat, detailed official PDF / Print memo
      setTimeout(() => {
        printOfficialGrievancePdf(grv);
      }, 150);

      // 3. Update status in backend
      await handleQuickGrievanceStatusChange(
        grv.id,
        'Forwarded to Official',
        portalLang === 'en'
          ? 'Forwarded to department official for field inspection & action (Official Memo Generated).'
          : 'மனு சம்பந்தப்பட்ட துறை அலுவலருக்கு கள ஆய்வு & நடவடிக்கைக்காக அனுப்பப்பட்டது (அதிகாரப்பூர்வ குறிப்பாணை தயார்).'
      );

      setSaveSuccessMsg(
        t(
          '✅ Official PDF Memo generated & forwarded to Operator WhatsApp (97903 82437)!',
          '✅ அதிகாரப்பூர்வ PDF குறிப்பாணை உருவாக்கப்பட்டு ஆபரேட்டர் வாட்ஸ்அப்பிற்கு (97903 82437) அனுப்பப்பட்டது!'
        )
      );
      setTimeout(() => setSaveSuccessMsg(''), 5000);
    } catch (err) {
      console.error('Error in sending grievance to official:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Quick Request Status Transition
  const handleQuickRequestStatusChange = async (ticketId: string, newStatus: RequestStatus, quickNote?: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ticketId,
          type: 'request',
          status: newStatus,
          note: quickNote || `Status updated to ${newStatus}`,
          author: 'Murugesan K (Operator)'
        })
      });

      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error('Error updating request status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Status Modal Submit (with custom remark)
  const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalTicket) return;

    setUpdatingStatus(true);
    try {
      const res = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: statusModalTicket.id,
          type: statusModalTicket.type,
          status: selectedStatus,
          note: statusNote.trim() || `Status updated to ${selectedStatus}`,
          author: 'Murugesan K (Operator)'
        })
      });

      if (res.ok) {
        setStatusModalTicket(null);
        setStatusNote('');
        loadData();
      }
    } catch (err) {
      console.error('Error updating ticket status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Centre Status Quick Change
  const handleQuickCentreStatusChange = async (newStatus: 'open' | 'closed' | 'camp' | 'temp_closed') => {
    if (!settings) return;
    const updatedSettings: PlatformSettings = {
      ...settings,
      centreStatus: newStatus,
      lastUpdated: new Date().toISOString()
    };
    setSettings(updatedSettings);
    setSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: updatedSettings,
          actor: 'Murugesan K (Operator)'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setSaveSuccessMsg(t('✅ Centre status updated successfully!', '✅ மையம் நிலை மாற்றப்பட்டது!'));
        setTimeout(() => setSaveSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Error saving centre status:', err);
    } finally {
      setSavingSettings(false);
    }
  };

  // Walk-in booking submit
  const handleWalkinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName.trim() || !walkinPhone.trim()) return;
    setSubmittingWalkin(true);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizenName: walkinName.trim(),
          phoneNumber: walkinPhone.trim(),
          serviceId: 'walkin_service',
          serviceName: walkinService,
          village: walkinHamlet,
          priority: walkinPriority,
          additionalDetails: walkinNote.trim() || (portalLang === 'en' ? 'Direct Walk-in Booking' : 'நேரடி மைய முன்பதிவு')
        })
      });
      if (res.ok) {
        setWalkinModalOpen(false);
        setWalkinName('');
        setWalkinPhone('');
        setWalkinNote('');
        loadData();
      }
    } catch (err) {
      console.error('Error creating walkin request:', err);
    } finally {
      setSubmittingWalkin(false);
    }
  };

  // Notice Creation
  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitleTa.trim() || !newNoticeContentTa.trim()) return;

    setSubmittingNotice(true);
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: {
            ta: newNoticeTitleTa.trim(),
            en: newNoticeTitleEn.trim() || newNoticeTitleTa.trim()
          },
          content: {
            ta: newNoticeContentTa.trim(),
            en: newNoticeContentEn.trim() || newNoticeContentTa.trim()
          },
          category: newNoticeCategory,
          important: newNoticeImportant,
          source: newNoticeSource
        })
      });

      if (res.ok) {
        setNoticeModalOpen(false);
        setNewNoticeTitleTa('');
        setNewNoticeTitleEn('');
        setNewNoticeContentTa('');
        setNewNoticeContentEn('');
        loadData();
      }
    } catch (err) {
      console.error('Error creating notice:', err);
    } finally {
      setSubmittingNotice(false);
    }
  };

  // Notice Deletion
  const handleDeleteNotice = async (id: string) => {
    if (!confirm(t('Are you sure you want to delete this notice?', 'இந்த அறிவிப்பை நீக்க விரும்புகிறீர்களா?'))) return;
    try {
      const res = await fetch(`/api/notices?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error('Error deleting notice:', err);
    }
  };

  // Helper: WhatsApp URL for Citizen Grievance Update
  const generateGrievanceWhatsAppUrl = (grv: GrievanceTicket) => {
    const text = encodeURIComponent(
      portalLang === 'en'
        ? `Greetings ${grv.citizenName},\n\nUpdate from Four Roads Makkal e-Seva Centre (Murugesan K, CSC EFADGL0636):\n\n📋 Grievance ID: ${grv.id}\n📁 Category: ${grv.category}\n🚦 Status: *${grv.status}*\n📍 Hamlet: ${grv.location || grv.village}\n\nFor assistance, contact Four Roads e-Seva at 97903 82437.\n\nPeriyakottai Digital Seva`
        : `வணக்கம் ${grv.citizenName} அவர்களே,\n\nநால்ரோடு மக்கள் இ-சேவை மையத்திலிருந்து (முருகேசன் கு EFADGL0636) இந்த செய்தி அனுப்பப்படுகிறது.\n\nதங்கள் குறைதீர்ப்பு மனு விவரம்:\n📋 மனு எண்: ${grv.id}\n📁 பிரிவு: ${grv.category}\n🚦 தற்போதைய நிலை: *${grv.status}*\n📍 இடம்: ${grv.location || grv.village}\n\nகூடுதல் விவரங்களை அறிய நால்ரோடு மையத்தை 97903 82437 என்ற எண்ணில் தொடர்பு கொள்ளலாம்.\n\nபெரியகோட்டை டிஜிட்டல் சேவை`
    );
    return `https://wa.me/91${grv.phoneNumber.replace(/\D/g, '')}?text=${text}`;
  };

  // Helper: WhatsApp URL for Citizen Request Update
  const generateRequestWhatsAppUrl = (ticket: RequestTicket) => {
    const text = encodeURIComponent(
      portalLang === 'en'
        ? `Greetings ${ticket.citizenName},\n\nUpdate from Four Roads Makkal e-Seva Centre (Murugesan K, CSC EFADGL0636):\n\n📋 Request ID: ${ticket.id}\n📄 Service: ${ticket.serviceName}\n🚦 Status: *${ticket.status}*\n\nContact: 97903 82437`
        : `வணக்கம் ${ticket.citizenName} அவர்களே,\n\nநால்ரோடு மக்கள் இ-சேவை மையத்திலிருந்து (முருகேசன் கு EFADGL0636):\n\nவிண்ணப்ப விவரம்:\n📋 மனு எண்: ${ticket.id}\n📄 சேவை: ${ticket.serviceName}\n🚦 தற்போதைய நிலை: *${ticket.status}*\n\nதொடர்புக்கு: 97903 82437`
    );
    return `https://wa.me/91${ticket.phoneNumber.replace(/\D/g, '')}?text=${text}`;
  };

  // Filter Grievances
  const filteredGrievances = grievances.filter((g) => {
    const matchesStatus = grvStatusFilter === 'All' || g.status === grvStatusFilter;
    const matchesCategory = grvCategoryFilter === 'All' || g.category === grvCategoryFilter;
    const matchesHamlet =
      grvHamletFilter === 'All' ||
      (g.location && g.location.toLowerCase().includes(grvHamletFilter.toLowerCase())) ||
      (g.village && g.village.toLowerCase().includes(grvHamletFilter.toLowerCase()));
    const q = grvSearchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      g.id.toLowerCase().includes(q) ||
      g.citizenName.toLowerCase().includes(q) ||
      g.phoneNumber.includes(q) ||
      g.description.toLowerCase().includes(q) ||
      (g.location && g.location.toLowerCase().includes(q));
    return matchesStatus && matchesCategory && matchesHamlet && matchesQuery;
  });

  // Filter Requests
  const filteredRequests = requests.filter((r) => {
    const matchesStatus = reqStatusFilter === 'All' || r.status === reqStatusFilter;
    const matchesPriority = reqPriorityFilter === 'All' || r.priority === reqPriorityFilter;
    const q = reqSearchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      r.id.toLowerCase().includes(q) ||
      r.citizenName.toLowerCase().includes(q) ||
      r.phoneNumber.includes(q) ||
      r.serviceName.toLowerCase().includes(q) ||
      r.village.toLowerCase().includes(q);
    return matchesStatus && matchesPriority && matchesQuery;
  });

  // KPI Calculations
  const newGrievances = grievances.filter((g) => g.status === 'Received');
  const forwardedGrievances = grievances.filter((g) => g.status === 'Forwarded to Official');
  const pendingGrievances = grievances.filter((g) => g.status === 'Action Pending');
  const resolvedGrievances = grievances.filter((g) => g.status === 'Resolved');
  const urgentRequests = requests.filter((r) => r.priority === 'Urgent' && r.status !== 'Completed');
  const totalNotifications = newGrievances.length + urgentRequests.length;

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-700">
            {t('Verifying Operator Session...', 'ஆபரேட்டர் அமர்வு சரிபார்க்கப்படுகிறது...')}
          </p>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN IN ENGLISH / TAMIL
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200">
          <div className="text-center space-y-2">
            <img
              src="/images/murugesan.jpg"
              alt="Murugesan K"
              className="w-16 h-16 rounded-2xl mx-auto object-cover border-2 border-emerald-600 shadow-md"
            />
            <h1 className="text-xl font-black text-slate-900">
              {t('Operator Management Console', 'நால்ரோடு மக்கள் இ-சேவை மையம்')}
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              {t('Four Roads Makkal e-Seva Centre • Periyakottai (624614)', 'ஆபரேட்டர் மேலாண்மை போர்டல் • பெரியகோட்டை')}
            </p>
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full text-xs font-bold mt-1">
              <span>CSC ID: EFADGL0636 • Murugesan K</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                {t('Enter Operator Security PIN', 'ஆபரேட்டர் ரகசிய எண் (PIN)')}
              </label>
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••••"
                className="w-full text-center tracking-widest text-2xl font-black py-2.5 rounded-xl border-2 border-slate-300 focus:border-emerald-600 outline-none"
                autoFocus
              />
              <p className="text-[11px] text-slate-500 mt-1 text-center">
                {t('Authorized CSC Operator Access Only (Default PIN: 624614)', 'அங்கீகரிக்கப்பட்ட இ-சேவை மைய ஆபரேட்டர் மட்டுமே அணுக முடியும்')}
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3 rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{t('Verify PIN & Access Console', 'உள்நுழைக (Enter Portal)')}</span>
            </button>
          </form>

          {/* Quick Language Toggle in Login */}
          <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <button
              type="button"
              onClick={() => setPortalLang(portalLang === 'en' ? 'ta' : 'en')}
              className="text-slate-600 hover:text-emerald-700 font-bold flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{portalLang === 'en' ? 'தமிழில் மாற்ற (Switch to Tamil)' : 'Switch to English'}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link href="/" className="hover:text-emerald-800 font-bold">
              ← {t('Citizen Home Portal', 'பொது முகப்பு தளம்')}
            </Link>
            <Link href="/panchayat" className="hover:text-emerald-800 font-bold">
              {t('Panchayat Portal →', 'குறைதீர்ப்பு தளம் →')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/90 py-3 px-3 sm:px-6 lg:px-8 space-y-4">
      <div className="max-w-7xl mx-auto space-y-3">

        {/* 1. SLIM EXECUTIVE OPERATOR TOOLBAR (VERY SMALL OPERATOR DETAILS) */}
        <div className="bg-white rounded-2xl px-4 py-2.5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Operator Small Avatar & Details */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <img
              src="/images/murugesan.jpg"
              alt="Murugesan K"
              className="w-10 h-10 rounded-xl object-cover border border-emerald-600 shadow-xs shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                  {portalLang === 'en' ? 'Murugesan K' : 'முருகேசன் கு'}
                </span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded">
                  EFADGL0636
                </span>
                <span className="text-[11px] text-emerald-800 font-bold hidden sm:inline">
                  • {t('Four Roads Makkal e-Seva Centre (624614)', 'நால்ரோடு மக்கள் இ-சேவை மையம் (624614)')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                <span>{t('Centre Status:', 'மைய நிலை:')}</span>
                <select
                  value={settings?.centreStatus || 'open'}
                  onChange={(e) => handleQuickCentreStatusChange(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 font-bold text-slate-800 cursor-pointer text-[10px]"
                  disabled={savingSettings}
                >
                  <option value="open">🟢 {t('Open', 'திறந்துள்ளது (Open)')}</option>
                  <option value="camp">🔵 {t('Special Camp', 'முகாமில் (Field Camp)')}</option>
                  <option value="temp_closed">🟡 {t('Temp Break', 'இடைவேளை (Break)')}</option>
                  <option value="closed">🔴 {t('Closed', 'விடுமுறை (Closed)')}</option>
                </select>
                {saveSuccessMsg && (
                  <span className="text-emerald-700 font-bold animate-in fade-in truncate max-w-xs">{saveSuccessMsg}</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Tools: Language Toggle, Notifications, Walk-in, Refresh, Logout */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
            {/* Language Switcher (EN / TA) */}
            <button
              onClick={() => {
                const nextLang = portalLang === 'en' ? 'ta' : 'en';
                setPortalLang(nextLang);
                if (setGlobalLanguage) setGlobalLanguage(nextLang);
              }}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-400 bg-slate-50 text-slate-800 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
              title="Toggle English / தமிழ்"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{portalLang === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            {/* Real-time Notification Bell */}
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center cursor-pointer"
              title={t('Operator Notifications', 'அறிவிப்புகள்')}
            >
              <Bell className="w-4 h-4 text-slate-800" />
              {totalNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {totalNotifications}
                </span>
              )}
            </button>

            {/* Walk-in Booking Button */}
            <button
              onClick={() => setWalkinModalOpen(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-200" />
              <span>{t('+ Walk-in', '+ முன் பதிவு')}</span>
            </button>

            {/* Reload Data */}
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
              title={t('Refresh Data', 'மறுஏற்றம்')}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 rounded-xl transition-colors cursor-pointer"
              title={t('Logout', 'வெளியேறு')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS MODAL / DRAWER */}
        {notificationsOpen && (
          <div className="bg-white rounded-2xl border-2 border-amber-400 p-4 shadow-xl animate-in fade-in zoom-in-95 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-600" />
                <span className="font-extrabold text-sm text-slate-900">
                  {t(`Live Operator Notifications (${totalNotifications})`, `ஆபரேட்டர் நேரலை அறிவிப்புகள் (${totalNotifications})`)}
                </span>
              </div>
              <button
                onClick={() => setNotificationsOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {newGrievances.length === 0 && urgentRequests.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  {t('No pending or urgent notifications at this time.', 'தற்போது புதிய அவசர அல்லது நிலுவை அறிவிப்புகள் எதுவும் இல்லை.')}
                </div>
              ) : (
                <>
                  {newGrievances.map((g) => (
                    <div
                      key={g.id}
                      onClick={() => {
                        setActiveTab('grievances');
                        setGrvStatusFilter('Received');
                        setGrvSearchQuery(g.id);
                        setNotificationsOpen(false);
                      }}
                      className="p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl cursor-pointer flex items-center justify-between gap-3 text-xs transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-[11px] text-amber-950">{g.id}</span>
                          <span className="bg-red-600 text-white font-black text-[9px] px-1.5 py-0.2 rounded">
                            {t('NEW GRIEVANCE', 'புதிய குறை')}
                          </span>
                        </div>
                        <p className="font-bold text-slate-900 truncate mt-0.5">
                          {g.citizenName} ({g.location || g.village}) — {g.category}
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-amber-900 shrink-0">
                        {t('View & Act →', 'தீர்வு காண்க →')}
                      </span>
                    </div>
                  ))}

                  {urgentRequests.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => {
                        setActiveTab('requests');
                        setReqPriorityFilter('Urgent');
                        setReqSearchQuery(r.id);
                        setNotificationsOpen(false);
                      }}
                      className="p-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-xl cursor-pointer flex items-center justify-between gap-3 text-xs transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-[11px] text-rose-950">{r.id}</span>
                          <span className="bg-red-600 text-white font-black text-[9px] px-1.5 py-0.2 rounded">
                            {t('URGENT REQUEST', 'அவசர விண்ணப்பம்')}
                          </span>
                        </div>
                        <p className="font-bold text-slate-900 truncate mt-0.5">
                          {r.citizenName} — {r.serviceName}
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-rose-900 shrink-0">
                        {t('View →', 'காண்க →')}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* 2. COMPACT 5-KPI SUMMARY BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {/* Total Grievances */}
          <div
            onClick={() => {
              setActiveTab('grievances');
              setGrvStatusFilter('All');
            }}
            className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs cursor-pointer hover:border-purple-400 transition-colors"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
              <span>{t('Total Grievances', 'மொத்த புகார்கள்')}</span>
              <Building2 className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <p className="text-lg font-black text-slate-900 mt-0.5">{grievances.length}</p>
          </div>

          {/* New Grievances */}
          <div
            onClick={() => {
              setActiveTab('grievances');
              setGrvStatusFilter('Received');
            }}
            className={`p-2.5 rounded-xl border shadow-2xs cursor-pointer transition-colors ${
              newGrievances.length > 0
                ? 'bg-amber-50 border-amber-400 hover:bg-amber-100 ring-1 ring-amber-400'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
              <span>🚨 {t('New Grievances', 'புதிய மனுக்கள்')}</span>
              <Bell className={`w-3.5 h-3.5 ${newGrievances.length > 0 ? 'text-red-600 animate-bounce' : 'text-slate-400'}`} />
            </div>
            <p className={`text-lg font-black mt-0.5 ${newGrievances.length > 0 ? 'text-red-600' : 'text-slate-900'}`}>
              {newGrievances.length}
            </p>
          </div>

          {/* Forwarded Grievances */}
          <div
            onClick={() => {
              setActiveTab('grievances');
              setGrvStatusFilter('Forwarded to Official');
            }}
            className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs cursor-pointer hover:border-blue-400 transition-colors"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
              <span>{t('Forwarded to Official', 'அதிகாரிக்கு அனுப்பியவை')}</span>
              <Clock className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <p className="text-lg font-black text-blue-700 mt-0.5">{forwardedGrievances.length}</p>
          </div>

          {/* Resolved Grievances */}
          <div
            onClick={() => {
              setActiveTab('grievances');
              setGrvStatusFilter('Resolved');
            }}
            className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs cursor-pointer hover:border-emerald-400 transition-colors"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
              <span>{t('Resolved', 'தீர்க்கப்பட்டவை')}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-lg font-black text-emerald-700 mt-0.5">{resolvedGrievances.length}</p>
          </div>

          {/* e-Seva Requests */}
          <div
            onClick={() => {
              setActiveTab('requests');
              setReqStatusFilter('All');
            }}
            className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs cursor-pointer hover:border-emerald-400 transition-colors col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
              <span>{t('e-Seva Requests', 'அரசு சான்றிதழ் மனுக்கள்')}</span>
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-lg font-black text-slate-900 mt-0.5">{requests.length}</p>
          </div>
        </div>

        {/* 3. MAIN WORKSPACE */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-4">
          {/* Navigation Workspace Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Tab 1: Grievances (DEFAULT) */}
              <button
                onClick={() => setActiveTab('grievances')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'grievances'
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{t('Village Grievances', 'கிராம குறைதீர்ப்பு')} ({grievances.length})</span>
                {newGrievances.length > 0 && (
                  <span className="bg-red-600 text-white font-black text-[9px] px-1.5 py-0.2 rounded-full animate-pulse">
                    {newGrievances.length} {t('New', 'புதியவை')}
                  </span>
                )}
              </button>

              {/* Tab 2: e-Seva Requests */}
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'requests'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{t('Citizen Requests', 'அரசு சான்றிதழ் மனுக்கள்')} ({requests.length})</span>
              </button>

              {/* Tab 3: Centre Settings & Notices */}
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>{t('Settings & Notices', 'மைய அமைப்புகள் & அறிவிப்புகள்')}</span>
              </button>
            </div>
          </div>

          {/* TAB 1: VILLAGE GRIEVANCES (LANDING PAGE) */}
          {activeTab === 'grievances' && (
            <div className="space-y-4">
              {/* Alert banner if new grievances pending */}
              {newGrievances.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-amber-950 font-bold">
                    <Bell className="w-4 h-4 text-amber-700 animate-bounce" />
                    <span>
                      {t(
                        `Attention: ${newGrievances.length} new grievance(s) received. Immediate field action required!`,
                        `கவனிக்கவும்: ${newGrievances.length} புதிய குறைதீர்ப்பு மனுக்கள் வந்துள்ளன. உடனடியாக நடவடிக்கை எடுக்கவும்!`
                      )}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setGrvStatusFilter('Received');
                      setGrvSearchQuery('');
                    }}
                    className="bg-slate-950 text-amber-300 font-bold px-2.5 py-1 rounded-lg hover:bg-black shrink-0 cursor-pointer text-xs"
                  >
                    {t('View New Only →', 'புதியவை மட்டும் காண்க →')}
                  </button>
                </div>
              )}

              {/* CLEAN FILTER BAR AS DROPDOWN LISTS (NO CLUTTER!) */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                {/* Search Input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={grvSearchQuery}
                    onChange={(e) => setGrvSearchQuery(e.target.value)}
                    placeholder={t('Search by ID, name, mobile, description...', 'மனு எண், பெயர், எண், விவரம்...')}
                    className="w-full pl-8 pr-6 py-2 text-xs rounded-xl border border-slate-300 focus:border-purple-600 bg-white"
                  />
                  {grvSearchQuery && (
                    <button
                      onClick={() => setGrvSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Status Dropdown List */}
                <div>
                  <select
                    value={grvStatusFilter}
                    onChange={(e) => setGrvStatusFilter(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:border-purple-600 bg-white cursor-pointer"
                  >
                    <option value="All">{t('All Statuses', 'அனைத்து நிலைகளும் (All Status)')}</option>
                    <option value="Received">🚨 {t(`New / Received (${newGrievances.length})`, `புதிய மனுக்கள் (${newGrievances.length})`)}</option>
                    <option value="Forwarded to Official">⏳ {t(`Forwarded to Official (${forwardedGrievances.length})`, `அதிகாரிக்கு அனுப்பியவை (${forwardedGrievances.length})`)}</option>
                    <option value="Action Pending">🔄 {t(`Action Pending (${pendingGrievances.length})`, `நடவடிக்கை நிலுவை (${pendingGrievances.length})`)}</option>
                    <option value="Resolved">✅ {t(`Resolved (${resolvedGrievances.length})`, `தீர்க்கப்பட்டவை (${resolvedGrievances.length})`)}</option>
                  </select>
                </div>

                {/* Category Dropdown List */}
                <div>
                  <select
                    value={grvCategoryFilter}
                    onChange={(e) => setGrvCategoryFilter(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:border-purple-600 bg-white cursor-pointer"
                  >
                    <option value="All">{t('All Categories', 'அனைத்து பிரிவுகளும் (All Categories)')}</option>
                    <option value="Drinking Water Supply">{t('🚰 Drinking Water Supply', '🚰 குடிநீர் வசதி (Drinking Water)')}</option>
                    <option value="Street Light Maintenance">{t('💡 Street Light Maintenance', '💡 தெருவிளக்கு பராமரிப்பு (Street Light)')}</option>
                    <option value="Drainage & Sanitation">{t('🌊 Drainage & Sanitation', '🌊 சாக்கடை & கழிவுநீர் (Drainage)')}</option>
                    <option value="Road & Pavement Repair">{t('🛣️ Road & Pavement Repair', '🛣️ சாலை & நடைபாதை (Roads)')}</option>
                    <option value="Garbage & Waste Disposal">{t('🗑️ Garbage & Waste Disposal', '🗑️ குப்பை மேலாண்மை (Garbage)')}</option>
                    <option value="Public Health & Mosquito Fogging">{t('🏥 Public Health & Fogging', '🏥 பொது சுகாதாரம் (Health & Fogging)')}</option>
                    <option value="PDS / Ration Shop">{t('🌾 PDS / Ration Shop', '🌾 ரேஷன் கடை குறைபாடுகள் (Ration)')}</option>
                    <option value="Agricultural Grievances">{t('🚜 Agricultural Grievances', '🚜 விவசாயம் & பாசனம் (Agriculture)')}</option>
                    <option value="Revenue & Patta Matters">{t('🏛️ Revenue & Patta Matters', '🏛️ வருவாய்த்துறை & பட்டா (Revenue)')}</option>
                    <option value="School & Anganwadi Infrastructure">{t('🏫 School & Anganwadi', '🏫 பள்ளி & அங்கன்வாடி (School)')}</option>
                    <option value="Stray Animals & Cattle">{t('🐕 Stray Animals & Cattle', '🐕 தெருநாய்கள் & கால்நடைகள் (Animals)')}</option>
                    <option value="Other Grievances">{t('❓ Other Grievances', '❓ இதர பொது பிரச்சினைகள் (Other)')}</option>
                  </select>
                </div>

                {/* Village Hamlet Dropdown List */}
                <div>
                  <select
                    value={grvHamletFilter}
                    onChange={(e) => setGrvHamletFilter(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:border-purple-600 bg-white cursor-pointer"
                  >
                    <option value="All">{t('All Hamlets', 'அனைத்து கிராம பகுதிகள் (All Hamlets)')}</option>
                    <option value="பெரியகோட்டை">{t('Periyakottai (பெரியகோட்டை)', 'பெரியகோட்டை')}</option>
                    <option value="பெரியகோட்டை கிழக்கு">{t('Periyakottai East (பெரியகோட்டை கிழக்கு)', 'பெரியகோட்டை கிழக்கு')}</option>
                    <option value="பெரியகோட்டை மேற்கு">{t('Periyakottai West (பெரியகோட்டை மேற்கு)', 'பெரியகோட்டை மேற்கு')}</option>
                    <option value="கருங்கல்பட்டி">{t('Karungalpatti (கருங்கல்பட்டி)', 'கருங்கல்பட்டி')}</option>
                    <option value="கந்தப்ப கவுண்டன் வலசு">{t('Kandhappa Goundan Valasu (கந்தப்ப கவுண்டன் வலசு)', 'கந்தப்ப கவுண்டன் வலசு')}</option>
                  </select>
                </div>
              </div>

              {/* GRIEVANCES TICKET LIST */}
              <div className="space-y-3">
                {filteredGrievances.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <Inbox className="w-10 h-10 text-slate-400 mx-auto" />
                    <p className="font-bold text-sm text-slate-700">
                      {t('No grievance tickets found matching the selected filters.', 'தேர்ந்தெடுக்கப்பட்ட வடிகட்டிகளில் மனுக்கள் எதுவும் இல்லை.')}
                    </p>
                    <button
                      onClick={() => {
                        setGrvStatusFilter('All');
                        setGrvCategoryFilter('All');
                        setGrvHamletFilter('All');
                        setGrvSearchQuery('');
                      }}
                      className="text-xs text-purple-700 hover:underline font-bold"
                    >
                      {t('Reset All Filters', 'வடிகட்டிகளை மீட்டமைக்க')}
                    </button>
                  </div>
                ) : (
                  filteredGrievances.map((grv) => {
                    const dept = getGrievanceDepartment(grv.category);
                    return (
                      <div
                        key={grv.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          grv.status === 'Received'
                            ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                            : grv.status === 'Forwarded to Official'
                            ? 'bg-blue-50/40 border-blue-200'
                            : grv.status === 'Resolved'
                            ? 'bg-emerald-50/30 border-emerald-200'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                          {/* Ticket Meta & Content */}
                          <div className="space-y-2 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono font-black text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                {grv.id}
                              </span>

                              {/* Status Badge */}
                              <span
                                className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                                  grv.status === 'Received'
                                    ? 'bg-red-100 text-red-800'
                                    : grv.status === 'Forwarded to Official'
                                    ? 'bg-blue-100 text-blue-900'
                                    : grv.status === 'Action Pending'
                                    ? 'bg-amber-100 text-amber-900'
                                    : grv.status === 'Resolved'
                                    ? 'bg-emerald-100 text-emerald-900'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {grv.status === 'Received'
                                  ? t('🚨 Received (New)', '🚨 புதிய மனு (Received)')
                                  : grv.status === 'Forwarded to Official'
                                  ? t('⏳ Forwarded to Official', '⏳ அதிகாரிக்கு அனுப்பப்பட்டது')
                                  : grv.status === 'Action Pending'
                                  ? t('🔄 Action Pending', '🔄 நடவடிக்கை நிலுவை')
                                  : grv.status === 'Resolved'
                                  ? t('✅ Resolved', '✅ தீர்க்கப்பட்டது')
                                  : grv.status}
                              </span>

                              {/* Category Badge */}
                              <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                                {grv.category}
                              </span>

                              {/* Dept Badge */}
                              <span className="text-[10px] font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 hidden sm:inline">
                                {portalLang === 'en' ? dept.en : dept.ta}
                              </span>

                              <span className="text-[11px] text-slate-400">
                                {new Date(grv.createdAt).toLocaleDateString(portalLang === 'en' ? 'en-GB' : 'ta-IN')}
                              </span>
                            </div>

                            <h3 className="font-bold text-sm text-slate-900">
                              {grv.citizenName} ({grv.phoneNumber}) —{' '}
                              <span className="font-normal text-slate-700">{grv.description}</span>
                            </h3>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1 font-medium">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{t('Hamlet:', 'இடம்:')} {grv.location || grv.village}</span>
                              </span>

                              {grv.timeline && grv.timeline.length > 0 && grv.timeline[grv.timeline.length - 1].note && (
                                <span className="text-[11px] text-purple-900 font-bold bg-purple-50 border border-purple-200 px-2 py-0.5 rounded truncate max-w-md">
                                  {t('Latest Action:', 'நடவடிக்கை:')} {grv.timeline[grv.timeline.length - 1].note}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Problem Solver Interactive Action Tools */}
                          {/* CRITICAL ORDER: Send to Official -> Start Action -> NOTE BUTTON -> RESOLVE BUTTON -> WhatsApp -> Call -> PDF Memo */}
                          <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                            
                            {/* 1. SEND TO OFFICIAL (Formats neat PDF + Forwards to operator's WhatsApp himself) */}
                            {grv.status === 'Received' && (
                              <button
                                onClick={() => handleSendGrievanceToOfficial(grv)}
                                disabled={updatingStatus}
                                className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                                title={t(
                                  'Format official PDF and forward to operator WhatsApp (97903 82437)',
                                  'அதிகாரப்பூர்வ PDF உருவாக்கி ஆபரேட்டர் வாட்ஸ்அப்பிற்கு அனுப்ப'
                                )}
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>{t('Send to Official →', 'அதிகாரிக்கு அனுப்பு →')}</span>
                              </button>
                            )}

                            {/* 2. START ACTION TRANSITION */}
                            {grv.status === 'Forwarded to Official' && (
                              <button
                                onClick={() => handleQuickGrievanceStatusChange(grv.id, 'Action Pending')}
                                disabled={updatingStatus}
                                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                                title={t('Mark Action in Progress', 'நடவடிக்கை நிலுவைக்கு மாற்ற')}
                              >
                                <span>{t('Start Action →', 'நடவடிக்கை துவங்கு →')}</span>
                              </button>
                            )}

                            {/* 3. NOTE BUTTON (MUST BE BEFORE THE RESOLVE BUTTON AS REQUESTED) */}
                            <button
                              onClick={() => {
                                setStatusModalTicket({
                                  id: grv.id,
                                  type: 'grievance',
                                  currentStatus: grv.status,
                                  citizenName: grv.citizenName,
                                  phoneNumber: grv.phoneNumber,
                                  serviceName: grv.category,
                                  description: grv.description
                                });
                                setSelectedStatus(grv.status);
                              }}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                              title={t('Add Official Remark / Change Status', 'குறிப்பு அல்லது நிலை மாற்ற')}
                            >
                              <FileText className="w-3.5 h-3.5 text-slate-600" />
                              <span>{t('Note', 'குறிப்பு')}</span>
                            </button>

                            {/* 4. RESOLVE BUTTON (AFTER NOTE BUTTON AS REQUESTED) */}
                            {grv.status !== 'Resolved' && grv.status !== 'Closed' && (
                              <button
                                onClick={() => handleQuickGrievanceStatusChange(grv.id, 'Resolved')}
                                disabled={updatingStatus}
                                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                                title={t('Mark as Resolved', 'பிரச்சனை தீர்க்கப்பட்டது என குறிக்க')}
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>{t('Resolve', 'தீர்க்கப்பட்டது')}</span>
                              </button>
                            )}

                            {/* 5. WhatsApp Citizen 1-Click */}
                            <a
                              href={generateGrievanceWhatsAppUrl(grv)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-colors shadow-2xs"
                              title={t('Send WhatsApp update to citizen', 'குடிமகனுக்கு வாட்ஸ்அப் தகவல் அனுப்ப')}
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>

                            {/* 6. Call Citizen */}
                            <a
                              href={`tel:${grv.phoneNumber}`}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors"
                              title={t('Call Citizen', 'அழைக்க')}
                            >
                              <PhoneCall className="w-3.5 h-3.5 text-slate-700" />
                            </a>

                            {/* 7. Official PDF Memo Direct Button */}
                            <button
                              onClick={() => printOfficialGrievancePdf(grv)}
                              className="p-1.5 bg-slate-100 hover:bg-purple-100 text-purple-800 rounded-xl transition-colors cursor-pointer"
                              title={t('Print Official Grievance Memo PDF', 'அதிகாரப்பூர்வ குறைதீர்ப்பு குறிப்பாணை PDF அச்சிடுக')}
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CITIZEN SERVICE REQUESTS */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              {/* Requests Filter Bar */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={reqSearchQuery}
                    onChange={(e) => setReqSearchQuery(e.target.value)}
                    placeholder={t('Search by ID, name, service...', 'மனு எண், பெயர், சேவை...')}
                    className="w-full pl-8 pr-6 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-600 bg-white"
                  />
                  {reqSearchQuery && (
                    <button
                      onClick={() => setReqSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div>
                  <select
                    value={reqStatusFilter}
                    onChange={(e) => setReqStatusFilter(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:border-emerald-600 bg-white cursor-pointer"
                  >
                    <option value="All">{t('All Statuses', 'அனைத்து நிலைகளும் (All Status)')}</option>
                    <option value="Submitted">{t('Submitted / New', 'மனு பதிவு (Submitted)')}</option>
                    <option value="In Progress">{t('In Progress', 'செயலில் (In Progress)')}</option>
                    <option value="Ready for Citizen">{t('Ready for Citizen', 'சான்றிதழ் தயார் (Ready)')}</option>
                    <option value="Completed">{t('Completed', 'முடிக்கப்பட்டது (Completed)')}</option>
                  </select>
                </div>

                <div>
                  <select
                    value={reqPriorityFilter}
                    onChange={(e) => setReqPriorityFilter(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:border-emerald-600 bg-white cursor-pointer"
                  >
                    <option value="All">{t('All Priorities', 'அனைத்து முன்னுரிமை (All Priority)')}</option>
                    <option value="Urgent">🚨 {t('Urgent Applications', 'அவசர விண்ணப்பங்கள் (Urgent)')}</option>
                    <option value="Normal">📋 {t('Normal Applications', 'சாதாரண விண்ணப்பங்கள் (Normal)')}</option>
                  </select>
                </div>
              </div>

              {/* Requests List */}
              <div className="space-y-3">
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                    <Inbox className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="font-bold text-sm text-slate-700">
                      {t('No citizen service applications found.', 'விண்ணப்பங்கள் எதுவும் இல்லை.')}
                    </p>
                  </div>
                ) : (
                  filteredRequests.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-black font-mono text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {ticket.id}
                          </span>
                          <span
                            className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                              ticket.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-900'
                                : ticket.status === 'In Progress'
                                ? 'bg-blue-100 text-blue-900'
                                : ticket.status === 'Ready for Citizen'
                                ? 'bg-purple-100 text-purple-900'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {ticket.status}
                          </span>
                          {ticket.priority === 'Urgent' && (
                            <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded-full">
                              {t('URGENT', 'அவசரம்')}
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400">
                            {new Date(ticket.createdAt).toLocaleDateString(portalLang === 'en' ? 'en-GB' : 'ta-IN')}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-sm text-slate-900">
                          {ticket.citizenName} — <span className="text-emerald-800">{ticket.serviceName}</span>
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                          <span className="flex items-center gap-1 font-semibold">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{ticket.phoneNumber}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{ticket.village}</span>
                          </span>
                        </div>
                      </div>

                      {/* Request Action Tools */}
                      {/* NOTE BUTTON BEFORE COMPLETE BUTTON */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        {/* NOTE BUTTON */}
                        <button
                          onClick={() => {
                            setStatusModalTicket({
                              id: ticket.id,
                              type: 'request',
                              currentStatus: ticket.status,
                              citizenName: ticket.citizenName,
                              phoneNumber: ticket.phoneNumber,
                              serviceName: ticket.serviceName
                            });
                            setSelectedStatus(ticket.status);
                          }}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                          title={t('Add Note / Update Status', 'குறிப்பு சேர்க்க')}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{t('Note', 'குறிப்பு')}</span>
                        </button>

                        {/* COMPLETE BUTTON */}
                        {ticket.status !== 'Completed' && (
                          <button
                            onClick={() => handleQuickRequestStatusChange(ticket.id, 'Completed')}
                            disabled={updatingStatus}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                            title={t('Mark Completed', 'முடிக்கப்பட்டது')}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{t('Complete', 'முடிக்கப்பட்டது')}</span>
                          </button>
                        )}

                        {/* WhatsApp */}
                        <a
                          href={generateRequestWhatsAppUrl(ticket)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs flex items-center gap-1"
                          title="WhatsApp Citizen"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        {/* Call */}
                        <a
                          href={`tel:${ticket.phoneNumber}`}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                          title={t('Call Citizen', 'அழைக்க')}
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </a>

                        {/* Print Receipt */}
                        <button
                          onClick={() => printAcknowledgmentReceipt(ticket)}
                          className="p-1.5 bg-slate-100 hover:bg-emerald-100 text-emerald-800 rounded-xl cursor-pointer"
                          title={t('Print Acknowledgment Receipt', 'ரசீது அச்சிடுக')}
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS & NOTICES */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Centre Status Management */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">
                      {t('Centre Operating Status & Working Hours', 'மையத்தின் செயல்பாட்டு நிலை')}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t('Controls the live badge shown on the citizen homepage', 'பொதுமக்கள் தளத்தில் தோன்றும் நேரலை நிலை')}
                    </p>
                  </div>
                  {saveSuccessMsg && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                      {saveSuccessMsg}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['open', 'camp', 'temp_closed', 'closed'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleQuickCentreStatusChange(st)}
                      className={`p-3 rounded-xl border text-left font-bold text-xs transition-all cursor-pointer ${
                        settings?.centreStatus === st
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="text-sm">
                        {st === 'open' && '🟢'}
                        {st === 'camp' && '🔵'}
                        {st === 'temp_closed' && '🟡'}
                        {st === 'closed' && '🔴'}
                      </div>
                      <div className="mt-1 font-black">
                        {st === 'open' && t('Open for Service', 'திறந்துள்ளது')}
                        {st === 'camp' && t('Field Camp', 'கிராம முகாமில்')}
                        {st === 'temp_closed' && t('Temporary Break', 'இடைவேளை')}
                        {st === 'closed' && t('Closed', 'விடுமுறை')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Village Announcements Management */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">
                      {t('Village Notice Board & Public Announcements', 'கிராம ஊராட்சி நேரலை அறிவிப்பு பலகை')}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t('Displayed on citizen portal and panchayat page', 'பொதுமக்கள் தளத்தில் உடனுக்குடன் காண்பிக்கப்படும்')}
                    </p>
                  </div>
                  <button
                    onClick={() => setNoticeModalOpen(true)}
                    className="bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{t('+ Create Notice', '+ புதிய அறிவிப்பு')}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {notices.map((n) => (
                    <div
                      key={n.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 px-2 py-0.5 rounded">
                          {n.category}
                        </span>
                        <button
                          onClick={() => handleDeleteNotice(n.id)}
                          className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                          title={t('Delete Notice', 'அறிவிப்பை நீக்க')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="font-black text-xs text-slate-900">
                        {portalLang === 'en' ? n.title.en || n.title.ta : n.title.ta}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {portalLang === 'en' ? n.content.en || n.content.ta : n.content.ta}
                      </p>
                      <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 flex items-center justify-between">
                        <span>{n.source}</span>
                        <span>{new Date(n.date).toLocaleDateString(portalLang === 'en' ? 'en-GB' : 'ta-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* WALK-IN CITIZEN REGISTRATION MODAL */}
      {walkinModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-sm text-slate-900">
                {t('Register Walk-in Citizen Application', 'நேரடி குடிமக்கள் முன் பதிவு (Walk-in Booking)')}
              </h3>
              <button
                onClick={() => setWalkinModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleWalkinSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('Citizen Name', 'குடிமகன் பெயர்')} *</label>
                <input
                  type="text"
                  required
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  placeholder={t('e.g. K. Arumugam', 'எ.கா: சுப்பிரமணி க')}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('Mobile Number', 'செல்போன் எண்')} *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={walkinPhone}
                    onChange={(e) => setWalkinPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('Village Hamlet', 'கிராம பகுதி')}</label>
                  <select
                    value={walkinHamlet}
                    onChange={(e) => setWalkinHamlet(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Periyakottai">Periyakottai (பெரியகோட்டை)</option>
                    <option value="Periyakottai East">Periyakottai East (பெரியகோட்டை கிழக்கு)</option>
                    <option value="Periyakottai West">Periyakottai West (பெரியகோட்டை மேற்கு)</option>
                    <option value="Karungalpatti">Karungalpatti (கருங்கல்பட்டி)</option>
                    <option value="Kandhappa Goundan Valasu">Kandhappa Goundan Valasu (கந்தப்ப கவுண்டன் வலசு)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('Service Required', 'கோரப்படும் சேவை')}</label>
                  <input
                    type="text"
                    value={walkinService}
                    onChange={(e) => setWalkinService(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('Priority', 'முன்னுரிமை')}</label>
                  <select
                    value={walkinPriority}
                    onChange={(e) => setWalkinPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    <option value="Normal">{t('Normal Priority', 'சாதாரண முன்னுரிமை')}</option>
                    <option value="Urgent">🚨 {t('Urgent Application', 'அவசர விண்ணப்பம்')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('Special Notes / Documents', 'குறிப்புகள் / ஆவணங்கள்')}</label>
                <textarea
                  rows={2}
                  value={walkinNote}
                  onChange={(e) => setWalkinNote(e.target.value)}
                  placeholder={t('Enter Aadhaar / Ration card / service details...', 'ஆதார் அல்லது ரேஷன் அட்டை விவரங்கள்...')}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setWalkinModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  {t('Cancel', 'ரத்து')}
                </button>
                <button
                  type="submit"
                  disabled={submittingWalkin}
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800"
                >
                  {submittingWalkin ? t('Registering...', 'பதிவாகிறது...') : t('Register Walk-in', 'முன் பதிவு செய்க')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFICIAL REMARK / DETAILED STATUS UPDATE MODAL */}
      {statusModalTicket && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-sm text-slate-900">
                {t('Add Official Action Remark', 'அதிகாரப்பூர்வ நடவடிக்கை குறிப்பு')}
              </h3>
              <button
                onClick={() => setStatusModalTicket(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900">
                {t('Ticket ID:', 'மனு எண்:')} <span className="font-mono">{statusModalTicket.id}</span>
              </p>
              <p className="text-slate-600">
                {t('Citizen:', 'மனுதாரர்:')} {statusModalTicket.citizenName} ({statusModalTicket.phoneNumber})
              </p>
              {statusModalTicket.description && (
                <p className="text-slate-500 italic truncate">
                  "{statusModalTicket.description}"
                </p>
              )}
            </div>

            <form onSubmit={handleUpdateStatusSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('Select Status:', 'மனு நிலை:')}</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                >
                  {statusModalTicket.type === 'grievance' ? (
                    <>
                      <option value="Received">{t('Received (New)', 'Received (புதிய மனு)')}</option>
                      <option value="Forwarded to Official">{t('Forwarded to Official', 'Forwarded to Official (அதிகாரிக்கு அனுப்பியது)')}</option>
                      <option value="Action Pending">{t('Action Pending', 'Action Pending (நடவடிக்கை நிலுவை)')}</option>
                      <option value="Resolved">{t('Resolved', 'Resolved (தீர்க்கப்பட்டது)')}</option>
                      <option value="Closed">{t('Closed', 'Closed (நிறைவு)')}</option>
                    </>
                  ) : (
                    <>
                      <option value="Submitted">{t('Submitted', 'Submitted (மனு பதிவு)')}</option>
                      <option value="In Progress">{t('In Progress', 'In Progress (செயலில்)')}</option>
                      <option value="Ready for Citizen">{t('Ready for Citizen', 'Ready for Citizen (சான்றிதழ் தயார்)')}</option>
                      <option value="Completed">{t('Completed', 'Completed (முடிக்கப்பட்டது)')}</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t('Official Remark / Note for Citizen & Records:', 'அதிகாரப்பூர்வ குறிப்பு (மனுதாரருக்கும் தெரியும்):')} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder={t(
                    'e.g. Field inspection conducted by VAO; repair work ordered for completion.',
                    'எ.கா: கிராம நிர்வாக அலுவலர் ஆய்வு செய்தார்; குடிநீர் மோட்டார் பழுது நீக்கும் பணி துவங்கியுள்ளது.'
                  )}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setStatusModalTicket(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  {t('Cancel', 'ரத்து')}
                </button>
                <button
                  type="submit"
                  disabled={updatingStatus}
                  className="px-4 py-2 rounded-xl bg-purple-900 text-white font-bold hover:bg-purple-950"
                >
                  {updatingStatus ? t('Saving...', 'சேமிக்கப்படுகிறது...') : t('Save Remark & Update', 'சேமித்து நிலையை மாற்று')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NOTICE MODAL */}
      {noticeModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-sm text-slate-900">
                {t('Post New Announcement / Notice', 'புதிய ஊராட்சி அறிவிப்பு வெளியிடுக')}
              </h3>
              <button
                onClick={() => setNoticeModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('Notice Title (English)', 'அறிவிப்பு தலைப்பு (ஆங்கிலம்)')}</label>
                <input
                  type="text"
                  value={newNoticeTitleEn}
                  onChange={(e) => setNewNoticeTitleEn(e.target.value)}
                  placeholder="e.g. Special Aadhaar Correction Camp This Friday"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('Notice Title (Tamil)', 'அறிவிப்பு தலைப்பு (தமிழ்)')} *</label>
                <input
                  type="text"
                  required
                  value={newNoticeTitleTa}
                  onChange={(e) => setNewNoticeTitleTa(e.target.value)}
                  placeholder="எ.கா: வரும் வெள்ளிக்கிழமை சிறப்பு ஆதார் திருத்த முகாம்"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('Description (English)', 'முழு விவரம் (ஆங்கிலம்)')}</label>
                <textarea
                  rows={2}
                  value={newNoticeContentEn}
                  onChange={(e) => setNewNoticeContentEn(e.target.value)}
                  placeholder="Details regarding time, venue, documents..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('Description (Tamil)', 'முழு விவரம் (தமிழ்)')} *</label>
                <textarea
                  required
                  rows={2}
                  value={newNoticeContentTa}
                  onChange={(e) => setNewNoticeContentTa(e.target.value)}
                  placeholder="முகாம் நடைபெறும் இடம், நேரம், தேவையான ஆவணங்கள்..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('Category', 'பிரிவு')}</label>
                  <select
                    value={newNoticeCategory}
                    onChange={(e) => setNewNoticeCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="camp">{t('Camp (முகாம்)', 'camp (முகாம்)')}</option>
                    <option value="subsidy">{t('Subsidy (மானியம்)', 'subsidy (மானியம்)')}</option>
                    <option value="panchayat">{t('Panchayat (ஊராட்சி)', 'panchayat (ஊராட்சி)')}</option>
                    <option value="urgent">{t('Urgent (அவசரம்)', 'urgent (அவசரம்)')}</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('Source', 'மூலம்')}</label>
                  <input
                    type="text"
                    value={newNoticeSource}
                    onChange={(e) => setNewNoticeSource(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="noticeImportant"
                  checked={newNoticeImportant}
                  onChange={(e) => setNewNoticeImportant(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 cursor-pointer"
                />
                <label htmlFor="noticeImportant" className="font-bold text-slate-800 cursor-pointer">
                  {t('Mark as Urgent Announcement (Flashing Banner)', 'அவசர முதன்மை அறிவிப்பாக வெளியிடுக')}
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setNoticeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  {t('Cancel', 'ரத்து')}
                </button>
                <button
                  type="submit"
                  disabled={submittingNotice}
                  className="px-4 py-2 rounded-xl bg-purple-900 text-white font-bold hover:bg-purple-950"
                >
                  {submittingNotice ? t('Publishing...', 'வெளியாகிறது...') : t('Publish Notice', 'அறிவிப்பை வெளியிடு')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
