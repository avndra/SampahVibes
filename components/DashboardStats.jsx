'use client';

import { getCurrentMonth } from '@/lib/utils';
import Icon from '@/components/Icon';
import Image from 'next/image';
import { calculateProgress, getXpForNextLevel, getCurrentLevelXp, getLevelTitle } from '@/lib/xpSystem';
import { Zap, TrendingUp } from 'lucide-react';

import { useAppContext } from '@/context/AppContext';

export default function DashboardStats({ user: initialUser }) {
  const { user: contextUser } = useAppContext();

  // Use context user if available (for real-time updates), otherwise fallback to initial prop
  const user = contextUser || initialUser;

  if (!user) return null;

  const currentMonthPoints = user.monthlyPoints?.[getCurrentMonth()] || 0;

  // XP/Level calculations
  const userXp = user.xp || 0;
  const userLevel = user.level ?? 0;
  const xpProgress = calculateProgress(userXp, userLevel);
  const xpForNext = getXpForNextLevel(userLevel);
  const xpCurrent = getCurrentLevelXp(userLevel);
  const levelTitle = getLevelTitle(userLevel);

  const stats = [
    {
      title: 'Total Poin',
      value: user.totalPoints.toLocaleString(),
      icon: 'points_earned',
      unit: 'pts',
      color: 'text-white',
      bgIcon: 'bg-yellow-500'
    },
    {
      title: 'Total Berat',
      value: user.totalWeight.toFixed(1),
      icon: 'metal',
      unit: 'kg',
      color: 'text-white',
      bgIcon: 'bg-blue-500'
    },
    {
      title: 'Total Pindai',
      value: user.totalDeposits,
      icon: 'scan',
      unit: 'x',
      color: 'text-white',
      bgIcon: 'bg-green-500'
    },
    {
      title: 'Bulan Ini',
      value: currentMonthPoints.toLocaleString(),
      icon: 'points_earned',
      unit: 'pts',
      color: 'text-white',
      bgIcon: 'bg-purple-500'
    }
  ];

  return (
    <div
      className="rounded-[2rem] p-5 md:p-8 shadow-xl relative overflow-hidden border border-white/5 group w-full bg-[#0a1f1f]"
    >
      {/* Blured Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-[2px] scale-105"
        style={{ backgroundImage: "url('/ui/profilecardBG1.png')" }}
      />
      {/* Overlay to ensure text readability if needed, keeping it minimal or removing if image is dark enough */}
      {/* <div className="absolute inset-0 bg-black/20" /> */}

      <div className="relative z-10 flex flex-col gap-5">

        {/* Top Section: User Profile (Compact) */}
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-white/10 shadow-lg overflow-hidden flex-shrink-0">
            <Image
              src={user.avatar || '/icons/default_avatar.png'}
              alt="User"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-green-400 text-[10px] md:text-xs font-bold tracking-wider uppercase">
                Level {userLevel}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-500"></span>
              <span className="text-purple-400 text-[10px] md:text-xs font-bold tracking-wider uppercase">
                {levelTitle}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight leading-none truncate">
              {user.name}
            </h1>

            {/* XP Progress Bar */}
            <div className="mt-2 text-xs w-full max-w-[200px]">
              <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-400" /> {userXp.toLocaleString()} XP</span>
                <span>{xpForNext.toLocaleString()} XP</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden w-full">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10" />

        {/* Bottom Section: Stats Grid (Compact) */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-green-500/10 hover:bg-green-500/20 backdrop-blur-sm border border-white/5 rounded-xl p-3 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`p-1.5 rounded-md ${stat.bgIcon}`}>
                  <Icon name={stat.icon} size={16} className={`${stat.color}`} />
                </div>
              </div>
              <div>
                <p className="text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-0.5 truncate">
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-white leading-tight">
                    {stat.value}
                  </span>
                  <span className={`text-[10px] font-bold ${stat.color}`}>
                    {stat.unit}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}