'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/context';
import { RequestTicket, GrievanceTicket, RequestStatus, GrievanceStatus, PlatformSettings, VillageNotice, GrievanceCategory } from '@/types';
import { printAcknowledgmentReceipt } from '@/lib/printReceipt';
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
  Send
} from 'lucide-react';

export default function OperatorPortalPage() {
  const { language } = useI18n();
  const router = useRouter();

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

  // DEFAULT LANDING TAB IS VILLAGE GRIEVANCE AS REQUESTED
  const [activeTab, setActiveTab] = useState<'grievances' | 'requests' | 'settings'>('grievances');

  // Notifications Modal State
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Filter state for Grievances (Dropdown List View)
  const [grvStatusFilter, setGrvStatusFilter] = useState<string>('All');
  const [grvCategoryFilter, setGrvCategoryFilter] = useState<string>('All');
  const [grvHamletFilter, setGrvHamletFilter] = useState<string>('All');
  const [grvPriorityFilter, setGrvPriorityFilter] = useState<string>('All');
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
  const [newNoticeSource, setNewNoticeSource] = useState('நால்ரோடு மக்கள் இ-சேவை மையம்');
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
  const [walkinHamlet, setWalkinHamlet] = useState('பெரியகோட்டை');
  const [walkinService, setWalkinService] = useState('பட்டா மாறுதல் (Patta Transfer)');
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
        setAuthError(language === 'ta' ? 'தவறான ரகசிய எண் (PIN). மீண்டும் முயற்சிக்கவும்.' : 'Invalid PIN. Please try again.');
      }
    } catch {
      setAuthError('Login failed. Please check network.');
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
          ? 'மனு சம்பந்தப்பட்ட ஊராட்சி அதிகாரிகளுக்கு நடவடிக்கைக்காக அனுப்பப்பட்டுள்ளது.'
          : newStatus === 'Action Pending'
          ? 'கள ஆய்வு & நடவடிக்கை மேற்கொள்ளப்பட்டு வருகிறது.'
          : newStatus === 'Resolved'
          ? 'புகார் சரி செய்யப்பட்டு முழுமையாக தீர்க்கப்பட்டது.'
          : 'மனு பெறப்பட்டு பதிவு செய்யப்பட்டது.';

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
        setSaveSuccessMsg(language === 'ta' ? '✅ மையம் நிலை மாற்றப்பட்டது!' : '✅ Centre status updated!');
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
          additionalDetails: walkinNote.trim() || 'நேரடி மைய முன்பதிவு (Direct Walk-in Booking)'
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
    if (!newNoticeTitleTa.trim()) return;
    setSubmittingNotice(true);
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: { ta: newNoticeTitleTa.trim(), en: newNoticeTitleEn.trim() || newNoticeTitleTa.trim() },
          content: { ta: newNoticeContentTa.trim(), en: newNoticeContentEn.trim() || newNoticeContentTa.trim() },
          category: newNoticeCategory,
          important: newNoticeImportant,
          source: newNoticeSource.trim(),
          date: new Date().toISOString().split('T')[0]
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
      console.error('Error publishing notice:', err);
    } finally {
      setSubmittingNotice(false);
    }
  };

  // Notice Deletion
  const handleDeleteNotice = async (id: string) => {
    if (!confirm(language === 'ta' ? 'இந்த அறிவிப்பை நீக்க விரும்புகிறீர்களா?' : 'Delete this notice?')) return;
    try {
      const res = await fetch(`/api/notices?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error('Error deleting notice:', err);
    }
  };

  // Helper: WhatsApp URL for Grievances
  const generateGrievanceWhatsAppUrl = (grv: GrievanceTicket) => {
    const text = encodeURIComponent(
      `வணக்கம் ${grv.citizenName} அவர்களே,\n\nநால்ரோடு மக்கள் இ-சேவை மையத்திலிருந்து (முருகேசன் கு EFADGL0636) இந்த செய்தி அனுப்பப்படுகிறது.\n\nதங்கள் குறைதீர்ப்பு மனு விவரம்:\n📋 மனு எண்: ${grv.id}\n📁 பிரிவு: ${grv.category}\n🚦 தற்போதைய நிலை: *${grv.status}*\n📍 இடம்: ${grv.location || grv.village}\n\nகூடுதல் விவரங்களை அறிய நால்ரோடு மையத்தை 97903 82437 என்ற எண்ணில் தொடர்பு கொள்ளலாம்.\n\nபெரியகோட்டை டிஜிட்டல் சேவை`
    );
    return `https://wa.me/91${grv.phoneNumber.replace(/\D/g, '')}?text=${text}`;
  };

  // Helper: WhatsApp URL for Requests
  const generateRequestWhatsAppUrl = (ticket: RequestTicket) => {
    const text = encodeURIComponent(
      `வணக்கம் ${ticket.citizenName} அவர்களே,\n\nநால்ரோடு மக்கள் இ-சேவை மையத்திலிருந்து (முருகேசன் கு EFADGL0636):\n\nவிண்ணப்ப விவரம்:\n📋 மனு எண்: ${ticket.id}\n📄 சேவை: ${ticket.serviceName}\n🚦 தற்போதைய நிலை: *${ticket.status}*\n\nதொடர்புக்கு: 97903 82437`
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
  const resolvedGrievances = grievances.filter((g) => g.status === 'Resolved' || g.status === 'Closed');

  const pendingRequests = requests.filter((r) => r.status !== 'Completed' && r.status !== 'Cancelled');
  const urgentRequests = requests.filter((r) => r.priority === 'Urgent' && r.status !== 'Completed');

  // Total Actionable Notification Items
  const totalNotifications = newGrievances.length + urgentRequests.length;

  // Unauthenticated Login View
  if (!isAuthenticated && !checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-emerald-500 shadow-2xl max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border-2 border-emerald-600 shadow-md">
            <img
              src="/images/murugesan.jpg"
              alt="முருகேசன் கு"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full">
              e-Sevai ID: EFADGL0636
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 mt-2">
              ஆபரேட்டர் மேலாண்மை தளம்
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              நால்ரோடு மக்கள் இ-சேவை மையம் | முருகேசன் கு
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-left text-xs font-bold text-slate-700 mb-1">
                ரகசிய கடவுச்சொல் (Operator PIN):
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
              <p className="text-[11px] text-slate-500 mt-1">
                அங்கீகரிக்கப்பட்ட நால்ரோடு இ-சேவை மைய ஆபரேட்டர் மட்டுமே அணுக முடியும்
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3 rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>உள்நுழைக (Enter Portal)</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link href="/" className="hover:text-emerald-800 font-bold">
              ← பொது முகப்பு தளம்
            </Link>
            <Link href="/panchayat" className="hover:text-emerald-800 font-bold">
              குறைதீர்ப்பு தளம்
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/90 py-4 px-3 sm:px-6 lg:px-8 space-y-4">
      <div className="max-w-7xl mx-auto space-y-4">

        {/* 1. SLIM EXECUTIVE OPERATOR TOOLBAR (VERY SMALL OPERATOR DETAILS) */}
        <div className="bg-white rounded-2xl px-4 py-2.5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Operator Small Avatar & Details */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <img
              src="/images/murugesan.jpg"
              alt="முருகேசன் கு"
              className="w-10 h-10 rounded-xl object-cover border border-emerald-600 shadow-xs shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                  முருகேசன் கு
                </span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded">
                  EFADGL0636
                </span>
                <span className="text-[11px] text-emerald-800 font-bold hidden sm:inline">
                  • நால்ரோடு மக்கள் இ-சேவை மையம் (624614)
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                <span>மைய நிலை:</span>
                <select
                  value={settings?.centreStatus || 'open'}
                  onChange={(e) => handleQuickCentreStatusChange(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 font-bold text-slate-800 cursor-pointer"
                  disabled={savingSettings}
                >
                  <option value="open">🟢 திறந்துள்ளது (Open)</option>
                  <option value="camp">🔵 முகாமில் (Field Camp)</option>
                  <option value="temp_closed">🟡 இடைவேளை (Break)</option>
                  <option value="closed">🔴 விடுமுறை (Closed)</option>
                </select>
                {saveSuccessMsg && (
                  <span className="text-emerald-700 font-bold animate-in fade-in">{saveSuccessMsg}</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Tools: Notifications, Walk-in, Refresh, Logout */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
            {/* Real-time Notification Bell */}
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center cursor-pointer"
              title="அறிவிப்புகள் (Notifications)"
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
              <span>+ முன் பதிவு</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={loadData}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-2.5 py-2 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              title="தரவை புதுப்பி"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-700' : ''}`} />
              <span className="hidden sm:inline">புதுப்பி</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-2.5 py-2 rounded-xl border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
              title="வெளியேறு"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS DROPDOWN / MODAL */}
        {notificationsOpen && (
          <div className="bg-white rounded-2xl border-2 border-amber-400 p-4 shadow-xl animate-in fade-in zoom-in-95 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-600" />
                <span className="font-extrabold text-sm text-slate-900">
                  ஆபரேட்டர் நேரலை அறிவிப்புகள் ({totalNotifications})
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
                  தற்போது புதிய அவசர அல்லது நிலுவை அறிவிப்புகள் எதுவும் இல்லை.
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
                          <span className="bg-red-600 text-white font-black text-[9px] px-1.5 py-0.2 rounded">புதிய குறை</span>
                        </div>
                        <p className="font-bold text-slate-900 truncate mt-0.5">
                          {g.citizenName} ({g.location || g.village}) — {g.category}
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-amber-900 shrink-0">தீர்வு காண்க →</span>
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
                          <span className="bg-red-600 text-white font-black text-[9px] px-1.5 py-0.2 rounded">அவசர விண்ணப்பம்</span>
                        </div>
                        <p className="font-bold text-slate-900 truncate mt-0.5">
                          {r.citizenName} — {r.serviceName}
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-rose-900 shrink-0">காண்க →</span>
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
              <span>மொத்த புகார்கள்</span>
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
              <span>🚨 புதிய மனுக்கள்</span>
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
              <span>அதிகாரிக்கு அனுப்பியவை</span>
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
              <span>தீர்க்கப்பட்டவை</span>
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
              <span>அரசு சான்றிதழ் மனுக்கள்</span>
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
              {/* Tab 1: Grievance (DEFAULT) */}
              <button
                onClick={() => setActiveTab('grievances')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'grievances'
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>கிராம குறைதீர்ப்பு ({grievances.length})</span>
                {newGrievances.length > 0 && (
                  <span className="bg-red-600 text-white font-black text-[9px] px-1.5 py-0.2 rounded-full animate-pulse">
                    {newGrievances.length} புதியவை
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
                <span>அரசு சான்றிதழ் மனுக்கள் ({requests.length})</span>
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
                <span>மைய அமைப்புகள் & அறிவிப்புகள்</span>
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
                    <span>கவனிக்கவும்: {newGrievances.length} புதிய குறைதீர்ப்பு மனுக்கள் வந்துள்ளன. உடனடியாக நடவடிக்கை எடுக்கவும்!</span>
                  </div>
                  <button
                    onClick={() => {
                      setGrvStatusFilter('Received');
                      setGrvSearchQuery('');
                    }}
                    className="bg-slate-950 text-amber-300 font-bold px-2.5 py-1 rounded-lg hover:bg-black shrink-0 cursor-pointer"
                  >
                    புதியவை மட்டும் காண்க →
                  </button>
                </div>
              )}

              {/* CLEAN FILTER BAR AS DROPDOWN LISTS (NO CLUTTER!) */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
                {/* Search Input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={grvSearchQuery}
                    onChange={(e) => setGrvSearchQuery(e.target.value)}
                    placeholder="மனு எண், பெயர், எண், விவரம்..."
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
                    <option value="All">அனைத்து நிலைகளும் (All Status)</option>
                    <option value="Received">🚨 புதிய மனுக்கள் ({newGrievances.length} New)</option>
                    <option value="Forwarded to Official">⏳ அதிகாரிக்கு அனுப்பியவை ({forwardedGrievances.length})</option>
                    <option value="Action Pending">🔄 நடவடிக்கை நிலுவை ({pendingGrievances.length})</option>
                    <option value="Resolved">✅ தீர்க்கப்பட்டவை ({resolvedGrievances.length})</option>
                  </select>
                </div>

                {/* Category Dropdown List */}
                <div>
                  <select
                    value={grvCategoryFilter}
                    onChange={(e) => setGrvCategoryFilter(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:border-purple-600 bg-white cursor-pointer"
                  >
                    <option value="All">அனைத்து பிரச்சனைகளும் (All Categories)</option>
                    <option value="drinking_water">💧 குடிநீர் விநியோகம் / தொட்டி</option>
                    <option value="street_light">💡 தெருவிளக்கு பழுது</option>
                    <option value="road_repair">🛣️ சாலை & தெரு பழுது</option>
                    <option value="drainage">🚰 சாக்கடை & கழிவுநீர்</option>
                    <option value="sanitation">🧹 குப்பை & சுகாதாரம்</option>
                    <option value="ration_shop">🍚 ரேஷன் கடை குறை</option>
                    <option value="agriculture">🌾 விவசாயம் & பாசனம்</option>
                    <option value="burial_ground">🕊️ மயானம் / பாதை</option>
                    <option value="health_sanitation">🦟 கொசு மருந்து & சுகாதாரம்</option>
                    <option value="stray_animals">🐕 விலங்கு & தெருநாய் தொல்லை</option>
                    <option value="revenue_land">📜 வருவாய்த்துறை & பட்டா</option>
                    <option value="community_infra">🏫 பள்ளி & சமுதாயக்கூடம்</option>
                    <option value="other">📋 இதர கிராமப் பிரச்சனை</option>
                  </select>
                </div>

                {/* Hamlet Dropdown List */}
                <div>
                  <select
                    value={grvHamletFilter}
                    onChange={(e) => setGrvHamletFilter(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:border-purple-600 bg-white cursor-pointer"
                  >
                    <option value="All">அனைத்து சிற்றூர்களும் (All Hamlets)</option>
                    <option value="பெரியகோட்டை">பெரியகோட்டை</option>
                    <option value="பெரியகோட்டை கிழக்கு">பெரியகோட்டை கிழக்கு</option>
                    <option value="பெரியகோட்டை மேற்கு">பெரியகோட்டை மேற்கு</option>
                    <option value="கருங்கல்பட்டி">கருங்கல்பட்டி</option>
                    <option value="கந்தப்ப கவுண்டன் வலசு">கந்தப்ப கவுண்டன் வலசு</option>
                  </select>
                </div>

                {/* Action / Reset */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-semibold truncate flex-1">
                    கிடைத்த மனுக்கள்: <b className="text-slate-900">{filteredGrievances.length}</b>
                  </span>

                  {(grvSearchQuery || grvStatusFilter !== 'All' || grvCategoryFilter !== 'All' || grvHamletFilter !== 'All') && (
                    <button
                      onClick={() => {
                        setGrvSearchQuery('');
                        setGrvStatusFilter('All');
                        setGrvCategoryFilter('All');
                        setGrvHamletFilter('All');
                      }}
                      className="px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg font-bold cursor-pointer shrink-0"
                    >
                      மீட்டமை
                    </button>
                  )}
                </div>
              </div>

              {/* GRIEVANCES LIST VIEW (ACTIONABLE PROBLEM SOLVER) */}
              {loading ? (
                <div className="py-12 text-center text-xs text-slate-500 font-bold">
                  புகார்கள் ஏற்றப்படுகின்றன...
                </div>
              ) : filteredGrievances.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-sm text-slate-800">
                    தேர்ந்தெடுக்கப்பட்ட வடிகட்டியில் எந்த புகாரும் இல்லை
                  </h4>
                  <p className="text-xs text-slate-500">
                    பொதுமக்கள் பதிவு செய்யும் புதிய மனுக்கள் உடனடியாக இங்கே தோன்றும்.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredGrievances.map((grv) => (
                    <div
                      key={grv.id}
                      className={`p-4 rounded-2xl border transition-all bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xs ${
                        grv.status === 'Received'
                          ? 'border-2 border-amber-400 bg-amber-50/20'
                          : grv.status === 'Resolved' || grv.status === 'Closed'
                          ? 'border-emerald-200 bg-emerald-50/10'
                          : 'border-slate-200'
                      }`}
                    >
                      {/* Ticket Info */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-black text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {grv.id}
                          </span>

                          {grv.status === 'Received' && (
                            <span className="bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                              ● புதிய மனு
                            </span>
                          )}

                          <span
                            className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                              grv.status === 'Resolved' || grv.status === 'Closed'
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                : grv.status === 'Action Pending'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : grv.status === 'Forwarded to Official'
                                ? 'bg-blue-100 text-blue-900 border-blue-300'
                                : 'bg-purple-100 text-purple-900 border-purple-300'
                            }`}
                          >
                            ● {grv.status}
                          </span>

                          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                            {grv.category}
                          </span>

                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(grv.createdAt).toLocaleDateString('ta-IN')}
                          </span>
                        </div>

                        <h3 className="font-bold text-sm text-slate-900">
                          {grv.citizenName} ({grv.phoneNumber}) — <span className="font-normal text-slate-700">{grv.description}</span>
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>இடம்: {grv.location || grv.village}</span>
                          </span>

                          {grv.timeline && grv.timeline.length > 0 && grv.timeline[grv.timeline.length - 1].note && (
                            <span className="text-[11px] text-purple-900 font-bold bg-purple-50 border border-purple-200 px-2 py-0.5 rounded truncate max-w-md">
                              நடவடிக்கை: {grv.timeline[grv.timeline.length - 1].note}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Problem Solver Interactive Action Tools */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        {/* 1-Click Fast Transitions */}
                        {grv.status === 'Received' && (
                          <button
                            onClick={() => handleQuickGrievanceStatusChange(grv.id, 'Forwarded to Official')}
                            disabled={updatingStatus}
                            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                            title="ஊராட்சி அதிகாரிக்கு அனுப்ப"
                          >
                            <span>அதிகாரிக்கு அனுப்பு →</span>
                          </button>
                        )}

                        {grv.status === 'Forwarded to Official' && (
                          <button
                            onClick={() => handleQuickGrievanceStatusChange(grv.id, 'Action Pending')}
                            disabled={updatingStatus}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                            title="நடவடிக்கை நிலுவைக்கு மாற்ற"
                          >
                            <span>நடவடிக்கை துவங்கு →</span>
                          </button>
                        )}

                        {grv.status !== 'Resolved' && grv.status !== 'Closed' && (
                          <button
                            onClick={() => handleQuickGrievanceStatusChange(grv.id, 'Resolved')}
                            disabled={updatingStatus}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                            title="பிரச்சனை தீர்க்கப்பட்டது என குறிக்க"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>தீர்க்கப்பட்டது</span>
                          </button>
                        )}

                        {/* Add Custom Remark / Detailed Status Modal */}
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
                          title="குறிப்பு அல்லது நிலை மாற்ற"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>குறிப்பு</span>
                        </button>

                        {/* WhatsApp Citizen 1-Click */}
                        <a
                          href={generateGrievanceWhatsAppUrl(grv)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-colors shadow-2xs"
                          title="குடிமகனுக்கு வாட்ஸ்அப் தகவல் அனுப்ப"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        {/* Call Citizen */}
                        <a
                          href={`tel:${grv.phoneNumber}`}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors"
                          title="அழைக்க"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-slate-700" />
                        </a>

                        {/* Print Official Slip */}
                        <button
                          onClick={() =>
                            printAcknowledgmentReceipt({
                              id: grv.id,
                              citizenName: grv.citizenName,
                              phoneNumber: grv.phoneNumber,
                              serviceName: `கிராம குறைதீர்ப்பு (${grv.category})`,
                              village: grv.location || grv.village,
                              createdAt: grv.createdAt,
                              status: grv.status,
                              description: grv.description
                            })
                          }
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                          title="1-பக்க ரசீது அச்சிட"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: E-SEVA REQUESTS */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              {/* Clean Filter Bar as Dropdown Lists */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={reqSearchQuery}
                    onChange={(e) => setReqSearchQuery(e.target.value)}
                    placeholder="விண்ணப்ப எண், பெயர், எண்..."
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

                {/* Status Dropdown */}
                <div>
                  <select
                    value={reqStatusFilter}
                    onChange={(e) => setReqStatusFilter(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:border-emerald-600 bg-white cursor-pointer"
                  >
                    <option value="All">அனைத்து நிலைகளும் (All Status)</option>
                    <option value="Submitted">மனு பெறப்பட்டது (Submitted)</option>
                    <option value="Under Review">ஆய்வில் உள்ளது (Under Review)</option>
                    <option value="In Progress">செயலில் உள்ளது (In Progress)</option>
                    <option value="Ready for Citizen">சான்றிதழ் தயார் (Ready)</option>
                    <option value="Completed">நிறைவடைந்தது (Completed)</option>
                  </select>
                </div>

                {/* Priority Dropdown */}
                <div>
                  <select
                    value={reqPriorityFilter}
                    onChange={(e) => setReqPriorityFilter(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:border-emerald-600 bg-white cursor-pointer"
                  >
                    <option value="All">அனைத்து முன்னுரிமை</option>
                    <option value="Urgent">🔴 அவசரம் (Urgent)</option>
                    <option value="Normal">சாதாரண (Normal)</option>
                  </select>
                </div>
              </div>

              {/* REQUESTS LIST */}
              {loading ? (
                <div className="py-12 text-center text-xs text-slate-500 font-bold">
                  விண்ணப்பங்கள் ஏற்றப்படுகின்றன...
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6 space-y-2">
                  <FileText className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-sm text-slate-800">
                    விண்ணப்பங்கள் எதுவும் இல்லை
                  </h4>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredRequests.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xs"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
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
                              அவசரம்
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400">
                            {new Date(ticket.createdAt).toLocaleDateString('ta-IN')}
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
                      <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        {ticket.status !== 'Completed' && (
                          <button
                            onClick={() => handleQuickRequestStatusChange(ticket.id, 'Completed')}
                            disabled={updatingStatus}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>முடிக்கப்பட்டது</span>
                          </button>
                        )}

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
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>நிலை மாற்றம்</span>
                        </button>

                        <a
                          href={generateRequestWhatsAppUrl(ticket)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        <a
                          href={`tel:${ticket.phoneNumber}`}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-slate-700" />
                        </a>

                        <button
                          onClick={() =>
                            printAcknowledgmentReceipt({
                              id: ticket.id,
                              citizenName: ticket.citizenName,
                              phoneNumber: ticket.phoneNumber,
                              serviceName: ticket.serviceName,
                              village: ticket.village,
                              createdAt: ticket.createdAt,
                              status: ticket.status
                            })
                          }
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
                          title="ரசீது அச்சிட"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CENTRE SETTINGS & NOTICES */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Centre Status Configuration */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-700" />
                  <span>நால்ரோடு இ-சேவை மைய நேரலை இயக்க நிலை (Live Status)</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'open', label: '🟢 இயங்குகிறது (Open)' },
                    { id: 'camp', label: '🔵 சிறப்பு முகாம் (Camp)' },
                    { id: 'temp_closed', label: '🟡 தற்காலிக இடைவேளை' },
                    { id: 'closed', label: '🔴 விடுமுறை (Closed)' }
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => handleQuickCentreStatusChange(st.id as any)}
                      disabled={savingSettings}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        settings?.centreStatus === st.id
                          ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Village Notices Management */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span>கிராம அரசு செய்திகள் & அறிவிப்புகள் ({notices.length})</span>
                  </h4>
                  <button
                    onClick={() => setNoticeModalOpen(true)}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ புதிய அறிவிப்பு</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {notices.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{n.title.ta}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                            {n.date}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] truncate mt-0.5">{n.content.ta}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteNotice(n.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg shrink-0 cursor-pointer"
                        title="அறிவிப்பை நீக்கு"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: STATUS UPDATE / REMARK MODAL */}
      {statusModalTicket && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-emerald-600 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono font-black text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {statusModalTicket.id}
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 mt-1">
                  மனு நிலை மாற்றம் & குறிப்பு பதிவு
                </h3>
              </div>
              <button
                onClick={() => setStatusModalTicket(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl space-y-1">
              <p><b>குடிமகன்:</b> {statusModalTicket.citizenName} ({statusModalTicket.phoneNumber})</p>
              <p><b>பிரிவு:</b> {statusModalTicket.serviceName}</p>
            </div>

            <form onSubmit={handleUpdateStatusSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  புதிய நிலை தேர்வு செய்க:
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:border-emerald-600 bg-white"
                >
                  {statusModalTicket.type === 'grievance' ? (
                    <>
                      <option value="Received">🚨 மனு பெறப்பட்டது (Received)</option>
                      <option value="Forwarded to Official">⏳ அதிகாரிக்கு அனுப்பப்பட்டது (Forwarded)</option>
                      <option value="Action Pending">🔄 நடவடிக்கை எடுக்கப்படுகிறது (Action Pending)</option>
                      <option value="Resolved">✅ தீர்க்கப்பட்டது (Resolved)</option>
                      <option value="Closed">முடிக்கப்பட்டது (Closed)</option>
                    </>
                  ) : (
                    <>
                      <option value="Submitted">மனு பெறப்பட்டது (Submitted)</option>
                      <option value="Under Review">ஆய்வில் உள்ளது (Under Review)</option>
                      <option value="In Progress">செயலில் உள்ளது (In Progress)</option>
                      <option value="Ready for Citizen">சான்றிதழ் தயார் (Ready)</option>
                      <option value="Completed">நிறைவடைந்தது (Completed)</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  ஆபரேட்டர் உத்தியோகபூர்வ குறிப்பு (Official Note):
                </label>
                <textarea
                  rows={2}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="எ.கா: கள ஆய்வு செய்யப்பட்டது / சம்பந்தப்பட்ட துறைக்கு மனு அனுப்பப்பட்டது..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-600 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStatusModalTicket(null)}
                  className="flex-1 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  ரத்து
                </button>
                <button
                  type="submit"
                  disabled={updatingStatus}
                  className="flex-1 py-2 text-xs font-black text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs cursor-pointer"
                >
                  {updatingStatus ? 'சேமிக்கப்படுகிறது...' : 'உடனே சேமி'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: WALK-IN BOOKING MODAL */}
      {walkinModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-emerald-600 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-700" />
                <span>நேரடி வாடிக்கையாளர் முன் பதிவு (Walk-in Citizen)</span>
              </h3>
              <button
                onClick={() => setWalkinModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWalkinSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">விண்ணப்பதாரர் பெயர் *</label>
                <input
                  type="text"
                  required
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  placeholder="பெயர்"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">செல்போன் எண் (10 இலக்கம்) *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={walkinPhone}
                  onChange={(e) => setWalkinPhone(e.target.value)}
                  placeholder="98XXXXXXXX"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-600 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">சிற்றூர் (Hamlet)</label>
                  <select
                    value={walkinHamlet}
                    onChange={(e) => setWalkinHamlet(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:border-emerald-600 bg-white cursor-pointer"
                  >
                    <option value="பெரியகோட்டை">பெரியகோட்டை</option>
                    <option value="பெரியகோட்டை கிழக்கு">பெரியகோட்டை கிழக்கு</option>
                    <option value="பெரியகோட்டை மேற்கு">பெரியகோட்டை மேற்கு</option>
                    <option value="கருங்கல்பட்டி">கருங்கல்பட்டி</option>
                    <option value="கந்தப்ப கவுண்டன் வலசு">கந்தப்ப கவுண்டன் வலசு</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">முன்னுரிமை</label>
                  <select
                    value={walkinPriority}
                    onChange={(e) => setWalkinPriority(e.target.value as any)}
                    className="w-full px-2.5 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:border-emerald-600 bg-white cursor-pointer"
                  >
                    <option value="Normal">சாதாரண (Normal)</option>
                    <option value="Urgent">அவசரம் (Urgent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">தேவைப்படும் சேவை</label>
                <select
                  value={walkinService}
                  onChange={(e) => setWalkinService(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:border-emerald-600 bg-white cursor-pointer"
                >
                  <option value="பட்டா மாறுதல் (Patta Transfer)">பட்டா பெயர் மாற்றம் (Patta Transfer)</option>
                  <option value="சிட்டா / அடங்கல் நகல் (Chitta Adangal)">சிட்டா / அடங்கல் நகல்</option>
                  <option value="வருமானச் சான்றிதழ் (Income Certificate)">வருமானச் சான்றிதழ்</option>
                  <option value="சாதிச் சான்றிதழ் (Community Certificate)">சாதிச் சான்றிதழ்</option>
                  <option value="இருப்பிடச் சான்றிதழ் (Nativity Certificate)">இருப்பிடச் சான்றிதழ்</option>
                  <option value="முதல் பட்டதாரி சான்றிதழ் (First Graduate)">முதல் பட்டதாரி சான்றிதழ்</option>
                  <option value="ஸ்மார்ட் ரேஷன் கார்டு விண்ணப்பம் (Ration Card)">ஸ்மார்ட் ரேஷன் கார்டு சேவை</option>
                  <option value="PM கிசான் உழவர் உதவித் தொகை (PM-Kisan)">PM கிசான் உதவித் தொகை பதிவு</option>
                  <option value="முதியோர் உதவித்தொகை (OAP Pension)">முதியோர் ஓய்வூதியம்</option>
                  <option value="மகளிர் உரிமைத் தொகை (Magalir Urimai)">மகளிர் உரிமைத் தொகை விண்ணப்பம்</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">குறிப்பு</label>
                <input
                  type="text"
                  value={walkinNote}
                  onChange={(e) => setWalkinNote(e.target.value)}
                  placeholder="அசல் ஆவணங்கள் சமர்ப்பிக்கப்பட்டது / கூடுதல் தகவல்..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setWalkinModalOpen(false)}
                  className="flex-1 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  ரத்து
                </button>
                <button
                  type="submit"
                  disabled={submittingWalkin}
                  className="flex-1 py-2 text-xs font-black text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs cursor-pointer"
                >
                  {submittingWalkin ? 'பதிவாகிறது...' : 'முன்பதிவு செய்'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PUBLISH NOTICE MODAL */}
      {noticeModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-emerald-600 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900">
                புதிய அரசு செய்தி / அறிவிப்பு வெளியீடு
              </h3>
              <button
                onClick={() => setNoticeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">அறிவிப்பு தலைப்பு (தமிழ்) *</label>
                <input
                  type="text"
                  required
                  value={newNoticeTitleTa}
                  onChange={(e) => setNewNoticeTitleTa(e.target.value)}
                  placeholder="எ.கா: சிறப்பு பட்டா திருத்த முகாம்"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">முழு விவரம் *</label>
                <textarea
                  required
                  rows={3}
                  value={newNoticeContentTa}
                  onChange={(e) => setNewNoticeContentTa(e.target.value)}
                  placeholder="நாள், நேரம், இடம் மற்றும் தேவையான ஆவணங்கள்..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-600 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">பிரிவு</label>
                  <select
                    value={newNoticeCategory}
                    onChange={(e) => setNewNoticeCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:border-emerald-600 bg-white"
                  >
                    <option value="camp">சிறப்பு முகாம் (Camp)</option>
                    <option value="subsidy">மானியத் திட்டம் (Subsidy)</option>
                    <option value="panchayat">பஞ்சாயத்து அறிவிப்பு</option>
                    <option value="urgent">அவசர செய்தி (Urgent)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newNoticeImportant}
                      onChange={(e) => setNewNoticeImportant(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>முக்கிய அறிவிப்பு</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNoticeModalOpen(false)}
                  className="flex-1 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  ரத்து
                </button>
                <button
                  type="submit"
                  disabled={submittingNotice}
                  className="flex-1 py-2 text-xs font-black text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs cursor-pointer"
                >
                  {submittingNotice ? 'வெளியிடப்படுகிறது...' : 'வெளியிடுக'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
