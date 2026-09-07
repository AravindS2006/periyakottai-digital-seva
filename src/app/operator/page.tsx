'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/context';
import { RequestTicket, GrievanceTicket, RequestStatus, GrievanceStatus, PlatformSettings, VillageNotice } from '@/types';
import { SERVICES_DATA } from '@/data/servicesData';
import {
  LayoutDashboard,
  Inbox,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  MessageCircle,
  PlusCircle,
  Search,
  Filter,
  Printer,
  RefreshCw,
  LogOut,
  ShieldCheck,
  Building2,
  User,
  Phone,
  MapPin,
  Calendar,
  FileText,
  X,
  ExternalLink,
  ChevronDown,
  Lock,
  ArrowRight,
  Plus,
  AlertCircle,
  Sliders,
  Settings,
  Megaphone,
  Trash2,
  Save,
  Bell
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
  const [activeTab, setActiveTab] = useState<'requests' | 'grievances' | 'settings'>('requests');

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Status update modal
  const [statusModalTicket, setStatusModalTicket] = useState<{
    id: string;
    type: 'request' | 'grievance';
    currentStatus: string;
    citizenName: string;
    phoneNumber: string;
    serviceName: string;
  } | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('In Progress');
  const [statusNote, setStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // New Walk-in Booking Modal
  const [walkinModalOpen, setWalkinModalOpen] = useState(false);
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinVillage, setWalkinVillage] = useState('பெரியாக்கோட்டை (Periyakottai)');
  const [walkinServiceId, setWalkinServiceId] = useState('patta_transfer');
  const [walkinServiceName, setWalkinServiceName] = useState('பட்டா பெயர் மாற்றம் (Patta Transfer)');
  const [walkinPriority, setWalkinPriority] = useState<'Normal' | 'Urgent'>('Normal');
  const [walkinNote, setWalkinNote] = useState('');
  const [submittingWalkin, setSubmittingWalkin] = useState(false);
  const [walkinSuccessTicket, setWalkinSuccessTicket] = useState<RequestTicket | null>(null);

  // Printable Slip state
  const [slipTicket, setSlipTicket] = useState<RequestTicket | null>(null);

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
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [reqRes, grvRes, setRes, notRes] = await Promise.all([
        fetch('/api/requests'),
        fetch('/api/grievances'),
        fetch('/api/settings'),
        fetch('/api/notices')
      ]);
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setRequests(Array.isArray(reqData) ? reqData : []);
      }
      if (grvRes.ok) {
        const grvData = await grvRes.json();
        setGrievances(Array.isArray(grvData) ? grvData : []);
      }
      if (setRes.ok) {
        const setData = await setRes.json();
        if (setData.settings) setSettings(setData.settings);
      }
      if (notRes.ok) {
        const notData = await notRes.json();
        if (Array.isArray(notData.notices)) setNotices(notData.notices);
      }
    } catch (err) {
      console.error('Error loading operator data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSavingSettings(true);
    setSaveSuccessMsg('');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings,
          actor: 'Murugesan K (Operator)'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setSaveSuccessMsg(language === 'ta' ? 'அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன!' : 'Centre settings updated live!');
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSavingSettings(false);
    }
  };

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
          village: walkinVillage,
          serviceId: walkinServiceId,
          serviceName: walkinServiceName,
          priority: walkinPriority,
          description: walkinNote.trim() || 'நேரில் வந்து பதிவு செய்யப்பட்ட மனு (Walk-in Entry)',
          status: 'Under Review'
        })
      });

      if (res.ok) {
        const newTicket = await res.json();
        setWalkinSuccessTicket(newTicket);
        loadData();
      }
    } catch (err) {
      console.error('Error submitting walkin:', err);
    } finally {
      setSubmittingWalkin(false);
    }
  };

  const generateCitizenWhatsAppUrl = (ticket: RequestTicket) => {
    const text = encodeURIComponent(
      `வணக்கம் ${ticket.citizenName} அவர்களே,\n\nநால்ரோடு மக்கள் இ-சேவை மையத்திலிருந்து (முருகேசன் கே EFADGL0636) இந்த செய்தி அனுப்பப்படுகிறது.\n\nதங்கள் விண்ணப்பம்:\n📋 மனு எண்: ${ticket.id}\n📁 சேவை: ${ticket.serviceName}\n🚦 தற்போதைய நிலை: *${ticket.status}*\n\nதங்கள் ஆவணங்கள் குறித்த விவரங்களை அறிய மையத்தை 97903 82437 என்ற எண்ணில் தொடர்பு கொள்ளவும்.\n\nபெரியாக்கோட்டை டிஜிட்டல் சேவை`
    );
    return `https://wa.me/91${ticket.phoneNumber.replace(/\D/g, '')}?text=${text}`;
  };

  const filteredRequests = requests.filter((r) => {
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || r.priority === priorityFilter;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      r.id.toLowerCase().includes(q) ||
      r.citizenName.toLowerCase().includes(q) ||
      r.phoneNumber.includes(q) ||
      r.serviceName.toLowerCase().includes(q) ||
      r.village.toLowerCase().includes(q);
    return matchesStatus && matchesPriority && matchesQuery;
  });

  const filteredGrievances = grievances.filter((g) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      g.id.toLowerCase().includes(q) ||
      g.citizenName.toLowerCase().includes(q) ||
      g.phoneNumber.includes(q) ||
      g.description.toLowerCase().includes(q)
    );
  });

  // Calculate statistics
  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status !== 'Completed' && r.status !== 'Cancelled').length;
  const completedRequests = requests.filter((r) => r.status === 'Completed').length;
  const urgentRequests = requests.filter((r) => r.priority === 'Urgent' && r.status !== 'Completed').length;
  const totalGrievances = grievances.length;

  // Unauthenticated view
  if (!isAuthenticated && !checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-emerald-500 shadow-2xl max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden border-4 border-emerald-600 shadow-lg">
            <img
              src="/images/murugesan.jpg"
              alt="முருகேசன் கே"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <span className="text-[11px] bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full">
              e-Sevai ID: EFADGL0636
            </span>
            <h1 className="text-2xl font-black text-slate-950 mt-2">
              ஆபரேட்டர் மேலாண்மை தளம்
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              நால்ரோடு மக்கள் இ-சேவை மையம் | முருகேசன் கே
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
                className="w-full text-center tracking-widest text-2xl font-black py-3 rounded-xl border-2 border-slate-300 focus:border-emerald-600 outline-none"
                autoFocus
              />
              <p className="text-[11px] text-slate-500 mt-1">
                அங்கீகரிக்கப்பட்ட நால்ரோடு இ-சேவை மைய ஆபரேட்டர் மட்டுமே அணுக முடியும்
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3 rounded-xl shadow transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>உள்நுழைக (Enter Portal)</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link href="/" className="hover:text-emerald-800 font-bold">
              ← பொது தளம்
            </Link>
            <Link href="/murugesan" className="hover:text-emerald-800 font-bold">
              சுயவிவரம்
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Operator Header Banner */}
        <div className="bg-white rounded-3xl p-6 border-2 border-emerald-600 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/images/murugesan.jpg"
              alt="முருகேசன் கே"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-950">
                  முருகேசன் கே (Murugesan K)
                </h1>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  EFADGL0636
                </span>
              </div>
              <p className="text-xs text-slate-600">
                நால்ரோடு மக்கள் இ-சேவை மையம் | பெரியாக்கோட்டை - 624614
              </p>
              <p className="text-[11px] text-emerald-800 font-bold flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>ஆபரேட்டர் மேலாண்மை பயன்முறை (Operator Mode Active)</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setWalkinModalOpen(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-emerald-200" />
              <span>+ புதிய முன் பதிவு (Walk-in)</span>
            </button>

            <button
              onClick={loadData}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
              title="புதுப்பிக்க"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-700' : ''}`} />
              <span className="hidden sm:inline">புதுப்பி</span>
            </button>

            <button
              onClick={handleLogout}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>வெளியேறு</span>
            </button>
          </div>
        </div>

        {/* Live KPI Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>மொத்த மனுக்கள்</span>
              <Inbox className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">{totalRequests}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>செயலில் உள்ளவை</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{pendingRequests}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>அவசர மனுக்கள்</span>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-red-600 mt-1">{urgentRequests}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>முடிவடைந்தவை</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">{completedRequests}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>கிராம புகார்கள்</span>
              <Building2 className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-purple-700 mt-1">{totalGrievances}</p>
          </div>
        </div>

        {/* Main Workspace Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-5">
          {/* Workspace Tabs & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 ${
                  activeTab === 'requests'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>அரசு மனுக்கள் ({requests.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('grievances')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 ${
                  activeTab === 'grievances'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>புகார்கள் ({grievances.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 ${
                  activeTab === 'settings'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>மைய அமைப்புகள் & அறிவிப்புகள்</span>
              </button>
            </div>

            {/* Quick Search */}
            {activeTab !== 'settings' && (
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="பெயர், எண் அல்லது ID தேடுக..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 outline-none"
                />
              </div>
            )}
          </div>

          {/* Secondary Filters for Requests */}
          {activeTab === 'requests' && (
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-slate-400 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  <span>நிலை:</span>
                </span>
                {['All', 'Submitted', 'Under Review', 'In Progress', 'Ready for Citizen', 'Completed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                      statusFilter === st
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'All' ? 'அனைத்தும்' : st}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-400">முன்னுரிமை:</span>
                {['All', 'Urgent', 'Normal'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriorityFilter(p)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                      priorityFilter === p
                        ? 'bg-emerald-800 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* REQUESTS LIST */}
          {activeTab === 'requests' && (
            <div className="space-y-3">
              {loading ? (
                <div className="py-12 text-center text-xs text-slate-500 font-bold">
                  விண்ணப்பங்கள் ஏற்றப்படுகின்றன...
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="py-14 text-center bg-white rounded-2xl border border-dashed border-slate-200 p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">
                    தற்போது புதிய விண்ணப்பங்கள் எதுவும் இல்லை
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    பொதுமக்கள் இணையதளம் வாயிலாக விண்ணப்பிக்கும் மனுக்கள் அல்லது மையத்தின் நேரடி பதிவுகள் இங்கே உடனடியாக தோன்றும்.
                  </p>
                  <button
                    onClick={() => setWalkinModalOpen(true)}
                    className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ புதிய முன் பதிவு செய்க</span>
                  </button>
                </div>
              ) : (
                filteredRequests.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xs"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-xs text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md">
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

                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
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
                        {ticket.notes && ticket.notes.length > 0 && (
                          <span className="text-[11px] text-slate-500 italic truncate max-w-md">
                            குறிப்பு: {ticket.notes[ticket.notes.length - 1].message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Operator Interactive Quick Actions */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      {/* Update Status Button */}
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
                        className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                        title="நிலை மாற்றம்"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>நிலை மாற்றம்</span>
                      </button>

                      {/* 1-Click WhatsApp Notification */}
                      <a
                        href={generateCitizenWhatsAppUrl(ticket)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                        title="வாட்ஸ்அப் தகவல்"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>வாட்ஸ்அப்</span>
                      </a>

                      {/* Direct Call */}
                      <a
                        href={`tel:${ticket.phoneNumber}`}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors"
                        title="அழைக்க"
                      >
                        <PhoneCall className="w-4 h-4 text-emerald-700" />
                      </a>

                      {/* Print Acknowledgment Slip */}
                      <button
                        onClick={() => setSlipTicket(ticket)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors"
                        title="ரசீது அச்சிட"
                      >
                        <Printer className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* GRIEVANCES LIST */}
          {activeTab === 'grievances' && (
            <div className="space-y-3">
              {filteredGrievances.length === 0 ? (
                <div className="py-14 text-center bg-white rounded-2xl border border-dashed border-slate-200 p-6 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-700 mx-auto flex items-center justify-center">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">
                    நிலுவையில் உள்ள பொது புகார்கள் எதுவும் இல்லை
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    பெரியாக்கோட்டை கிராம மக்களிடமிருந்து பெறப்படும் குடிநீர், தெருவிளக்கு, சாலை பராமரிப்பு புகார்கள் இங்கே கண்காணிக்கப்படும்.
                  </p>
                </div>
              ) : (
                filteredGrievances.map((grv) => (
                  <div
                    key={grv.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-purple-300 transition-all bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xs"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-xs text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md">
                          {grv.id}
                        </span>
                        <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900">
                          {grv.status}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {grv.category}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(grv.createdAt).toLocaleDateString('ta-IN')}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-slate-900">
                        {grv.citizenName} ({grv.phoneNumber}) — <span className="font-normal text-slate-700">{grv.description}</span>
                      </h3>

                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>இடம்: {grv.location}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setStatusModalTicket({
                            id: grv.id,
                            type: 'grievance',
                            currentStatus: grv.status,
                            citizenName: grv.citizenName,
                            phoneNumber: grv.phoneNumber,
                            serviceName: `கிராம புகார்: ${grv.category}`
                          });
                          setSelectedStatus(grv.status);
                        }}
                        className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>நிலை மாற்றம்</span>
                      </button>

                      <a
                        href={`tel:${grv.phoneNumber}`}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors"
                      >
                        <PhoneCall className="w-4 h-4 text-purple-700" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: CENTRE SETTINGS & NOTICES MANAGEMENT */}
          {activeTab === 'settings' && (
            <div className="space-y-8 animate-in fade-in">
              {/* Success Notification Banner */}
              {saveSuccessMsg && (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-2xl text-emerald-900 font-extrabold text-sm flex items-center gap-3 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* Sub-section 1: Centre Operational Status & Controls */}
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="border border-slate-200 rounded-2xl p-5 sm:p-6 bg-slate-50/50 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-emerald-700" />
                        <span>மைய இயங்கும் நிலை & வேலை நேரம் (Centre Operations)</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        வலைத்தளத்தில் பொதுமக்களுக்கு காட்டப்படும் நேரடி நிலை மற்றும் தொடர்பு எண்கள்
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={savingSettings}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto"
                    >
                      <Save className="w-4 h-4" />
                      <span>{savingSettings ? 'சேமிக்கப்படுகிறது...' : 'அமைப்புகளை சேமி (Save)'}</span>
                    </button>
                  </div>

                  {/* Status Radio / Option Cards */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      மையத்தின் தற்போதைய நிலை (Current Status):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setSettings((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  centreStatus: 'open',
                                  statusNote: {
                                    ta: 'மையம் வழக்கம்போல் இயங்குகிறது. அசல் ஆவணங்களுடன் வரவும்.',
                                    en: 'Centre is open normally. Please carry original documents.'
                                  }
                                }
                              : null
                          )
                        }
                        className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                          settings?.centreStatus === 'open'
                            ? 'border-emerald-600 bg-emerald-50/80 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-emerald-800">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>🟢 திறந்துள்ளது (Open)</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 font-medium">வழக்கமான சேவைகள் இயங்குகிறது</p>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setSettings((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  centreStatus: 'camp',
                                  statusNote: {
                                    ta: 'இன்று கிராம கள ஆய்வு முகாமில் உள்ளோம். அவசர தொடர்புக்கு அழைக்கவும்.',
                                    en: 'In field camp today. Call operator for urgent help.'
                                  }
                                }
                              : null
                          )
                        }
                        className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                          settings?.centreStatus === 'camp'
                            ? 'border-amber-500 bg-amber-50/80 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-amber-800">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                          <span>🟡 கிராம கள முகாம் (Field Camp)</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 font-medium">ஊராட்சி/கள ஆய்வு முகாம்</p>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setSettings((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  centreStatus: 'closed',
                                  statusNote: {
                                    ta: 'இன்று அரசு விடுமுறை / தற்காலிக விடுப்பு. நாளை மையம் இயங்கும்.',
                                    en: 'Holiday today. Centre resumes tomorrow.'
                                  }
                                }
                              : null
                          )
                        }
                        className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                          settings?.centreStatus === 'closed'
                            ? 'border-rose-600 bg-rose-50/80 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-rose-800">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                          <span>🔴 மூடப்பட்டுள்ளது (Closed)</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 font-medium">விடுமுறை அல்லது பராமரிப்பு</p>
                      </button>
                    </div>
                  </div>

                  {/* Status Note Text Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        நிலை குறிப்பு (தமிழ்):
                      </label>
                      <input
                        type="text"
                        value={settings?.statusNote?.ta || ''}
                        onChange={(e) =>
                          setSettings((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  statusNote: { ...prev.statusNote, ta: e.target.value }
                                }
                              : null
                          )
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-emerald-600 bg-white"
                        placeholder="எ.கா: மையம் வழக்கம்போல் இயங்குகிறது..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Status Note (English):
                      </label>
                      <input
                        type="text"
                        value={settings?.statusNote?.en || ''}
                        onChange={(e) =>
                          setSettings((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  statusNote: { ...prev.statusNote, en: e.target.value }
                                }
                              : null
                          )
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-emerald-600 bg-white"
                        placeholder="e.g. Centre is open normally..."
                      />
                    </div>
                  </div>

                  {/* Operating Hours */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        வேலை நேரம் (தமிழ்):
                      </label>
                      <input
                        type="text"
                        value={settings?.operatingHours?.ta || ''}
                        onChange={(e) =>
                          setSettings((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  operatingHours: { ...prev.operatingHours, ta: e.target.value }
                                }
                              : null
                          )
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-emerald-600 bg-white"
                        placeholder="திங்கள் - சனி: காலை 9:30 - மாலை 5:00 | ஞாயிறு: விடுமுறை"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Working Hours (English):
                      </label>
                      <input
                        type="text"
                        value={settings?.operatingHours?.en || ''}
                        onChange={(e) =>
                          setSettings((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  operatingHours: { ...prev.operatingHours, en: e.target.value }
                                }
                              : null
                          )
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-emerald-600 bg-white"
                        placeholder="Mon - Sat: 9:30 AM - 5:00 PM | Sun: Holiday"
                      />
                    </div>
                  </div>

                  {/* Contact Numbers & Map URL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        முதன்மை அலைபேசி:
                      </label>
                      <input
                        type="text"
                        value={settings?.primaryPhone || ''}
                        onChange={(e) =>
                          setSettings((prev) => (prev ? { ...prev, primaryPhone: e.target.value } : null))
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-emerald-600 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        மாற்று எண் (WhatsApp):
                      </label>
                      <input
                        type="text"
                        value={settings?.alternatePhone || ''}
                        onChange={(e) =>
                          setSettings((prev) => (prev ? { ...prev, alternatePhone: e.target.value } : null))
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-emerald-600 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        மின்னஞ்சல் (Email):
                      </label>
                      <input
                        type="email"
                        value={settings?.email || ''}
                        onChange={(e) =>
                          setSettings((prev) => (prev ? { ...prev, email: e.target.value } : null))
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-emerald-600 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Google மேப் இணைப்பு:
                      </label>
                      <input
                        type="text"
                        value={settings?.googleMapUrl || ''}
                        onChange={(e) =>
                          setSettings((prev) => (prev ? { ...prev, googleMapUrl: e.target.value } : null))
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-emerald-600 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Sub-section 2: Flash Announcement Banner Controls */}
                <div className="border border-slate-200 rounded-2xl p-5 sm:p-6 bg-amber-50/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Megaphone className="w-5 h-5 text-amber-700" />
                      <h3 className="text-sm sm:text-base font-black text-slate-900">
                        அவசர அறிவிப்பு பட்டை (Flash Announcement Banner)
                      </h3>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(settings?.announcementBanner?.enabled)}
                        onChange={(e) =>
                          setSettings((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  announcementBanner: {
                                    ...prev.announcementBanner,
                                    enabled: e.target.checked
                                  }
                                }
                              : null
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      <span className="ml-2 text-xs font-extrabold text-slate-700">
                        {settings?.announcementBanner?.enabled ? 'இயக்கத்தில் உள்ளது' : 'முடக்கப்பட்டது'}
                      </span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        அறிவிப்பு வாசகம் (தமிழ்):
                      </label>
                      <input
                        type="text"
                        value={settings?.announcementBanner?.text?.ta || ''}
                        onChange={(e) =>
                          setSettings((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  announcementBanner: {
                                    ...prev.announcementBanner,
                                    text: { ...prev.announcementBanner.text, ta: e.target.value }
                                  }
                                }
                              : null
                          )
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-amber-600 bg-white"
                        placeholder="எ.கா: PM கிசான் 19-வது தவணை e-KYC முகாம் நால்ரோடு மையத்தில் நடைபெறுகிறது..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        அறிவிப்பு வகை (Alert Type):
                      </label>
                      <select
                        value={settings?.announcementBanner?.type || 'info'}
                        onChange={(e) =>
                          setSettings((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  announcementBanner: {
                                    ...prev.announcementBanner,
                                    type: e.target.value as 'info' | 'warning' | 'alert'
                                  }
                                }
                              : null
                          )
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-amber-600 bg-white"
                      >
                        <option value="info">நீல நிற தகவல் (Info - Blue)</option>
                        <option value="warning">மஞ்சள் நிற எச்சரிக்கை (Warning - Amber)</option>
                        <option value="alert">சிவப்பு நிற அவசரம் (Alert - Red)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sub-section 3: Oddanchatram Market WhatsApp Group Link */}
                <div className="border border-slate-200 rounded-2xl p-5 sm:p-6 bg-green-50/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-green-700" />
                      <h3 className="text-sm sm:text-base font-black text-slate-900">
                        ஒட்டன்சத்திரம் மார்க்கெட் வாட்ஸ்அப் குழு இணைப்பு (Market Group Link)
                      </h3>
                    </div>
                    {settings?.marketWhatsAppUrl && (
                      <a
                        href={settings.marketWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-800 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <span>சோதிக்க (Test)</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        வாட்ஸ்அப் குழு இணைப்பு (WhatsApp Group URL):
                      </label>
                      <input
                        type="url"
                        value={settings?.marketWhatsAppUrl || ''}
                        onChange={(e) =>
                          setSettings((prev) =>
                            prev ? { ...prev, marketWhatsAppUrl: e.target.value } : null
                          )
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-green-600 bg-white"
                        placeholder="https://chat.whatsapp.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        விலை தகவல் குறிப்பு (Notice text):
                      </label>
                      <input
                        type="text"
                        value={settings?.marketNotice?.ta || ''}
                        onChange={(e) =>
                          setSettings((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  marketNotice: { ...prev.marketNotice, ta: e.target.value }
                                }
                              : null
                          )
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-green-600 bg-white"
                        placeholder="தினசரி காலை 8:00 மணிக்கு வாட்ஸ்அப் குழுவில் விலை நிலவரம்..."
                      />
                    </div>
                  </div>
                </div>

                {/* Big Save Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm px-8 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5 text-emerald-200" />
                    <span>{savingSettings ? 'சேமிக்கப்படுகிறது...' : 'அனைத்து அமைப்புகளையும் சேமிக்கவும் (Save Changes)'}</span>
                  </button>
                </div>
              </form>

              {/* Sub-section 4: Village Notice Board Management (CRUD) */}
              <div className="border border-slate-200 rounded-2xl p-5 sm:p-6 bg-white space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-purple-700" />
                      <span>கிராம அறிவிப்பு பலகை மேலாண்மை ({notices.length})</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      பொதுமக்களுக்கான அரசு முகாம்கள், மானிய அறிவிப்புகள் மற்றும் ஊராட்சி செய்திகள்
                    </p>
                  </div>

                  <button
                    onClick={() => setNoticeModalOpen(true)}
                    className="bg-purple-700 hover:bg-purple-800 text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ புதிய கிராம அறிவிப்பு</span>
                  </button>
                </div>

                {notices.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs font-bold">
                    தற்போது அறிவிப்புகள் எதுவும் இல்லை. &quot;+ புதிய கிராம அறிவிப்பு&quot; பொத்தானை அழுத்தவும்.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {notices.map((notice) => (
                      <div key={notice.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                                notice.category === 'camp'
                                  ? 'bg-blue-100 text-blue-800'
                                  : notice.category === 'subsidy'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : notice.category === 'urgent'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {notice.category}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              தேதி: {notice.date}
                            </span>
                            {notice.important && (
                              <span className="text-[10px] font-extrabold bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded">
                                முக்கியம்
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-black text-slate-900">
                            {notice.title.ta}
                          </h4>
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {notice.content.ta}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            ஆதாரம்: {notice.source || 'நால்ரோடு மையம்'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => handleDeleteNotice(notice.id)}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1 transition-colors"
                            title="அறிவிப்பை நீக்க"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>நீக்கு</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* MODAL: STATUS UPDATE WITH PROGRESS NOTE */}
        {statusModalTicket && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-emerald-500 shadow-2xl space-y-5 animate-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    மனு நிலை மாற்றம் & குறிப்பு
                  </h3>
                  <p className="text-xs text-slate-500">
                    {statusModalTicket.id} — {statusModalTicket.citizenName}
                  </p>
                </div>
                <button
                  onClick={() => setStatusModalTicket(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateStatusSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    புதிய நிலை (Status):
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 font-bold text-sm outline-none focus:border-emerald-600"
                  >
                    <option value="Submitted">Submitted (பதிவு செய்யப்பட்டது)</option>
                    <option value="Under Review">Under Review (ஆய்வில் உள்ளது)</option>
                    <option value="In Progress">In Progress (செயலில் உள்ளது)</option>
                    <option value="Ready for Citizen">Ready for Citizen (சான்றிதழ் தயார்)</option>
                    <option value="Completed">Completed (நிறைவடைந்தது)</option>
                    <option value="Cancelled">Cancelled (ரத்து செய்யப்பட்டது)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    ஆபரேட்டர் குறிப்பு (Operator Progress Note):
                  </label>
                  <textarea
                    rows={3}
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="எ.கா: கிராம நிர்வாக அலுவலர் (VAO) சரிபார்த்துள்ளார், சான்றிதழ் அச்சிட தயார்."
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-none focus:border-emerald-600"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStatusModalTicket(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    ரத்து
                  </button>
                  <button
                    type="submit"
                    disabled={updatingStatus}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow"
                  >
                    {updatingStatus ? 'சேமிக்கப்படுகிறது...' : 'நிலையை புதுப்பி'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: NEW IN-PERSON WALK-IN ENTRY */}
        {walkinModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-emerald-500 shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    நேரடி வருகை மனு பதிவு (Walk-in Entry)
                  </h3>
                  <p className="text-xs text-slate-500">
                    மையத்திற்கு நேரில் வந்த பொதுமக்களுக்கான உடனடி பதிவு
                  </p>
                </div>
                <button
                  onClick={() => {
                    setWalkinModalOpen(false);
                    setWalkinSuccessTicket(null);
                  }}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {walkinSuccessTicket ? (
                <div className="space-y-4 text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-extrabold text-base text-slate-900">
                    மனு வெற்றிகரமாக உருவாக்கப்பட்டது!
                  </h4>
                  <p className="text-xs font-black text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    மனு எண்: {walkinSuccessTicket.id}
                  </p>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => setSlipTicket(walkinSuccessTicket)}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <Printer className="w-4 h-4" />
                      <span>ரசீது அச்சிட</span>
                    </button>
                    <button
                      onClick={() => {
                        setWalkinSuccessTicket(null);
                        setWalkinName('');
                        setWalkinPhone('');
                        setWalkinNote('');
                        setWalkinModalOpen(false);
                      }}
                      className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
                    >
                      முடிந்தது
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleWalkinSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      விண்ணப்பதாரர் பெயர்:
                    </label>
                    <input
                      type="text"
                      required
                      value={walkinName}
                      onChange={(e) => setWalkinName(e.target.value)}
                      placeholder="விண்ணப்பதாரர் முழு பெயர்"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      செல்போன் எண் (10 இலக்கம்):
                    </label>
                    <input
                      type="tel"
                      required
                      value={walkinPhone}
                      onChange={(e) => setWalkinPhone(e.target.value)}
                      placeholder="98XXXXXXXX"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      கிராமம் / இருப்பிடம்:
                    </label>
                    <select
                      value={walkinVillage}
                      onChange={(e) => setWalkinVillage(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 outline-none focus:border-emerald-600"
                    >
                      <option value="பெரியாக்கோட்டை (Periyakottai)">பெரியாக்கோட்டை (Periyakottai)</option>
                      <option value="நால்ரோடு (Nalroad)">நால்ரோடு (Nalroad)</option>
                      <option value="தேவத்தூர் (Devathur)">தேவத்தூர் (Devathur)</option>
                      <option value="சத்திரப்பட்டி (Chatrapatti)">சத்திரப்பட்டி (Chatrapatti)</option>
                      <option value="ஒட்டன்சத்திரம் டவுன் (Oddanchatram)">ஒட்டன்சத்திரம் டவுன் (Oddanchatram)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      தேவைப்படும் சேவை:
                    </label>
                    <select
                      value={walkinServiceId}
                      onChange={(e) => {
                        setWalkinServiceId(e.target.value);
                        const s = SERVICES_DATA.find((x) => x.id === e.target.value);
                        if (s) setWalkinServiceName(s.name.ta);
                      }}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 outline-none focus:border-emerald-600"
                    >
                      {SERVICES_DATA.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name.ta}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        முன்னுரிமை:
                      </label>
                      <select
                        value={walkinPriority}
                        onChange={(e) => setWalkinPriority(e.target.value as any)}
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-300 outline-none"
                      >
                        <option value="Normal">சாதாரண (Normal)</option>
                        <option value="Urgent">அவசரம் (Urgent)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ஆவணங்கள்:
                      </label>
                      <input
                        type="text"
                        value={walkinNote}
                        onChange={(e) => setWalkinNote(e.target.value)}
                        placeholder="ஆதார், பத்திரம் பெறப்பட்டது"
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-300 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setWalkinModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                    >
                      ரத்து
                    </button>
                    <button
                      type="submit"
                      disabled={submittingWalkin}
                      className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow"
                    >
                      {submittingWalkin ? 'பதிவாகிறது...' : 'மனு பதிவு செய்'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* PRINTABLE CITIZEN ACKNOWLEDGMENT SLIP MODAL */}
        {slipTicket && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-slate-800 shadow-2xl space-y-4">
              <div className="border-b-2 border-slate-800 pb-3 text-center space-y-1">
                <span className="text-[10px] bg-slate-900 text-amber-300 font-black px-2 py-0.5 rounded">
                  அரசு இ-சேவை மையம் | EFADGL0636
                </span>
                <h3 className="text-base font-black text-slate-950">
                  நால்ரோடு மக்கள் இ-சேவை மையம்
                </h3>
                <p className="text-[11px] text-slate-600">
                  பெரியாக்கோட்டை சந்திப்பு, ஒட்டன்சத்திரம் தாலுகா - 624614
                </p>
                <p className="text-[11px] font-bold text-slate-800">
                  ஆபரேட்டர்: முருகேசன் கே | 97903 82437
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-800 py-2">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-bold text-slate-500">மனு எண்:</span>
                  <span className="font-mono font-black text-emerald-900">{slipTicket.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-bold text-slate-500">விண்ணப்பதாரர்:</span>
                  <span className="font-bold">{slipTicket.citizenName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-bold text-slate-500">செல்போன்:</span>
                  <span>{slipTicket.phoneNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-bold text-slate-500">சேவை:</span>
                  <span className="font-bold text-slate-900">{slipTicket.serviceName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-bold text-slate-500">ஊர்:</span>
                  <span>{slipTicket.village}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-bold text-slate-500">பதிவு தேதி:</span>
                  <span>{new Date(slipTicket.createdAt).toLocaleDateString('ta-IN')}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-bold text-slate-500">தற்போதைய நிலை:</span>
                  <span className="font-extrabold text-emerald-800">{slipTicket.status}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl text-[10px] text-slate-500 text-center leading-relaxed">
                உங்கள் மனு நிலையை பெரியாக்கோட்டை டிஜிட்டல் சேவை இணையதளத்தில் (Track Portal) அறிந்து கொள்ளலாம்.
              </div>

              <div className="pt-2 flex justify-between gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-slate-950 hover:bg-slate-800 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>அச்சிடு (Print Slip)</span>
                </button>
                <button
                  onClick={() => setSlipTicket(null)}
                  className="px-4 py-2.5 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs"
                >
                  மூடு
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: PUBLISH NEW VILLAGE NOTICE */}
        {noticeModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-purple-500 shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    புதிய கிராம அறிவிப்பு வெளியிடு
                  </h3>
                  <p className="text-xs text-slate-500">
                    நால்ரோடு & பெரியாக்கோட்டை மக்கள் பார்க்கும் அறிவிப்பு பலகை
                  </p>
                </div>
                <button
                  onClick={() => setNoticeModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateNotice} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    தலைப்பு (தமிழ்)*:
                  </label>
                  <input
                    type="text"
                    required
                    value={newNoticeTitleTa}
                    onChange={(e) => setNewNoticeTitleTa(e.target.value)}
                    placeholder="எ.கா: சொட்டு நீர் பாசனம் மானிய பதிவு முகாம்"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Title (English - Optional):
                  </label>
                  <input
                    type="text"
                    value={newNoticeTitleEn}
                    onChange={(e) => setNewNoticeTitleEn(e.target.value)}
                    placeholder="e.g. Drip Irrigation Subsidy Registration Camp"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-purple-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      வகை (Category):
                    </label>
                    <select
                      value={newNoticeCategory}
                      onChange={(e) =>
                        setNewNoticeCategory(e.target.value as 'camp' | 'subsidy' | 'panchayat' | 'urgent')
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-purple-600"
                    >
                      <option value="camp">முகாம் (Camp)</option>
                      <option value="subsidy">மானியம் (Subsidy)</option>
                      <option value="panchayat">பஞ்சாயத்து (Panchayat)</option>
                      <option value="urgent">அவசர செய்தி (Urgent)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      ஆதாரம் (Source):
                    </label>
                    <input
                      type="text"
                      value={newNoticeSource}
                      onChange={(e) => setNewNoticeSource(e.target.value)}
                      placeholder="எ.கா: வேளாண்மைத் துறை"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    விளக்க உரை (தமிழ்)*:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newNoticeContentTa}
                    onChange={(e) => setNewNoticeContentTa(e.target.value)}
                    placeholder="அறிவிப்பு விவரங்களை விரிவாக எழுதவும்..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-purple-600"
                  ></textarea>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="importantNotice"
                    checked={newNoticeImportant}
                    onChange={(e) => setNewNoticeImportant(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 border-slate-300 focus:ring-purple-500"
                  />
                  <label htmlFor="importantNotice" className="text-xs font-bold text-slate-700 cursor-pointer">
                    முக்கிய அறிவிப்பாக முன்னிலைப்படுத்து (Mark as Important)
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setNoticeModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    ரத்து
                  </button>
                  <button
                    type="submit"
                    disabled={submittingNotice}
                    className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-black shadow"
                  >
                    {submittingNotice ? 'வெளியிடப்படுகிறது...' : 'அறிவிப்பை வெளியிடு'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
