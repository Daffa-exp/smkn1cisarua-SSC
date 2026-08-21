'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '@/components/providers/AuthProvider';
import { Sun, CloudSun, Moon } from 'lucide-react';

type Period = 'pagi' | 'siang' | 'sore' | 'malam';

const PERIODS: Record<Period, { greeting: string; label: string; src: string; Icon: React.FC<{ className?: string }>; iconColor: string }> = {
  pagi: {
    greeting: 'Selamat Pagi,',
    label: 'Pagi',
    src: '/img_time/pagi.jpg',
    Icon: Sun,
    iconColor: 'text-amber-300 drop-shadow-md',
  },
  siang: {
    greeting: 'Selamat Siang,',
    label: 'Siang',
    src: '/img_time/siang.jpg',
    Icon: CloudSun,
    iconColor: 'text-yellow-200 drop-shadow-md',
  },
  sore: {
    greeting: 'Selamat Sore,',
    label: 'Sore',
    src: '/img_time/sore.jpg',
    Icon: Sun,
    iconColor: 'text-orange-300 drop-shadow-md',
  },
  malam: {
    greeting: 'Selamat Malam,',
    label: 'Malam',
    src: '/img_time/malam.jpg',
    Icon: Moon,
    iconColor: 'text-indigo-200 drop-shadow-md',
  },
};

function getPeriod(hour: number): Period {
  if (hour >= 5 && hour <= 10) return 'pagi';
  if (hour >= 11 && hour <= 14) return 'siang';
  if (hour >= 15 && hour <= 18) return 'sore';
  return 'malam';
}

export const WelcomeBanner: React.FC = () => {
  const { user } = useAuth();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const hour = now.getHours();
  const period = getPeriod(hour);
  const config = PERIODS[period];
  const Icon = config.Icon;

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timeStr = `${hours}:${minutes} WIB`;

  const dateStr = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="relative h-[220px] overflow-hidden rounded-2xl shadow-lg sm:h-[260px]">
      {/* Background image */}
      <AnimatePresence mode="sync">
        <motion.div
          key={period}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          <Image
            src={config.src}
            alt={`${config.label} scenery`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 80vw"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/30 via-slate-900/15 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between px-4 py-4 sm:flex-row sm:items-end sm:px-6 sm:py-5">
        {/* Left: Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="max-w-[75%] sm:max-w-xl"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-2.5 py-1 backdrop-blur-sm">
            <Icon className={`h-4 w-4 ${config.iconColor}`} />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/90">{config.label}</span>
          </div>
          <h1 className="mt-1.5 text-lg font-bold leading-tight text-white drop-shadow-md sm:text-xl">
            {config.greeting}
          </h1>
          <h2 className="text-base font-semibold leading-tight text-white drop-shadow-sm sm:text-lg">
            {user?.name || 'Pengguna SSC'}
          </h2>
        </motion.div>

        {/* Right: Clock */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-2 self-start rounded-lg bg-black/15 px-3 py-1.5 text-right backdrop-blur-sm sm:mt-0 sm:self-auto"
        >
          <div className="text-xl font-bold text-white drop-shadow-md sm:text-2xl">{timeStr}</div>
          <div className="mt-0.5 text-[11px] text-white/80">{dateStr}</div>
        </motion.div>
      </div>
    </div>
  );
};
