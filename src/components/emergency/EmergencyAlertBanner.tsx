'use client';

import React, { useEffect, useState } from 'react';
import { ShieldAlert, AlertTriangle, X } from 'lucide-react';

interface EmergencyAlertItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
}

export const EmergencyAlertBanner: React.FC = () => {
  const [activeAlerts, setActiveAlerts] = useState<EmergencyAlertItem[]>([]);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    fetch('/api/emergency')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.alerts) {
          setActiveAlerts(data.alerts);
        }
      })
      .catch(() => {});
  }, []);

  if (isDismissed || activeAlerts.length === 0) return null;

  const currentAlert = activeAlerts[0];

  return (
    <div className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 text-white py-3 px-4 shadow-md relative z-50 border-b-2 border-amber-400 animate-pulse">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                EMERGENCY ALERT
              </span>
              <h4 className="text-sm font-bold leading-tight">{currentAlert.title}</h4>
            </div>
            <p className="text-xs text-rose-100 mt-0.5">{currentAlert.message}</p>
          </div>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="p-1.5 hover:bg-white/20 rounded-xl transition-colors shrink-0 text-rose-100 hover:text-white"
          title="Tutup Banner Sementara"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
