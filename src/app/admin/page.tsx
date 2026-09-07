'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/operator');
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-8">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-bold text-slate-700">
          ஆபரேட்டர் மேலாண்மை தளத்திற்கு திருப்பி விடப்படுகிறது (Redirecting to Operator Portal)...
        </p>
      </div>
    </div>
  );
}
