'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/context';
import { Lock, ShieldCheck, ArrowRight, Building2 } from 'lucide-react';

export default function AdminLoginPage() {
  const { language } = useI18n();
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pin.trim() })
      });

      if (!res.ok) {
        setError(language === 'ta' ? 'தவறான ரகசிய குறியீடு (PIN).' : 'Invalid Operator PIN.');
        return;
      }

      router.push('/operator');
    } catch {
      setError(language === 'ta' ? 'உள்நுழைவில் பிழை ஏற்பட்டது.' : 'Login failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-950">
            {language === 'ta' ? 'மைய நிர்வாகி உள்நுழைவு' : 'Operator Portal Login'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'ta'
              ? 'நால்ரோடு மக்கள் இ-சேவை மையம் (முருகேசன் கு)'
              : 'Nalroad Makkal e-Seva Maiyam (Murugesan K)'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'ta' ? 'ஆபரேட்டர் ரகசிய குறியீடு (Operator PIN):' : 'Operator PIN:'}
            </label>
            <input
              type="password"
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••"
              className="w-full text-center tracking-widest text-lg font-mono py-3 rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:outline-none text-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-sm shadow transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? (language === 'ta' ? 'சரிபார்க்கிறது...' : 'Verifying...') : (language === 'ta' ? 'உள்நுழைக' : 'Log In')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Authorized Operator Security Notice */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1 text-xs text-slate-500">
          <p className="font-bold text-slate-700">
            {language === 'ta'
              ? 'அங்கீகரிக்கப்பட்ட நால்ரோடு மைய ஆபரேட்டர்களுக்கான பிரத்யேக தளம்'
              : 'Secured access for authorized Nalroad centre operators only'}
          </p>
          <p className="text-[11px] text-slate-400">
            {language === 'ta'
              ? 'அனுமதி பெறாத நபர்கள் உள்நுழைய அனுமதியில்லை.'
              : 'Unauthorized access is prohibited.'}
          </p>
        </div>
      </div>
    </div>
  );
}
