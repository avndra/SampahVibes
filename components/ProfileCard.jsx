'use client';

import { Award, Recycle, Package, Zap } from 'lucide-react';
import { calculateProgress, getXpForNextLevel, getCurrentLevelXp, getLevelTitle } from '@/lib/xpSystem';

export default function ProfileCard({ user }) {
  if (!user) {
    return null;
  }

  const {
    name,
    email,
    avatar,
    totalPoints = 0,
    totalWeight = 0,
    totalDeposits = 0,
    xp = 0,
    level = 0,
  } = user;

  // XP calculations
  const xpProgress = calculateProgress(xp, level);
  const xpForNext = getXpForNextLevel(level);
  const xpCurrent = getCurrentLevelXp(level);
  const levelTitle = getLevelTitle(level);

  const stats = [
    {
      label: 'Points',
      value: totalPoints.toLocaleString(),
      icon: <Award className="w-4 h-4 text-yellow-400" />,
    },
    {
      label: 'Recycled',
      value: `${totalWeight.toFixed(1)}kg`,
      icon: <Recycle className="w-4 h-4 text-green-400" />,
    },
    {
      label: 'Deposits',
      value: totalDeposits,
      icon: <Package className="w-4 h-4 text-blue-400" />,
    },
  ];

  return (
    <div
      className="rounded-3xl shadow-2xl border border-white/10 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/ui/profilecardBG1.png')" }}
    >
      {/* Header with user info */}
      <div className="relative p-6">

        <div className="relative flex items-center gap-4">
          {/* Avatar with level badge */}
          <div className="relative flex-shrink-0">
            <img
              src={avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
              alt={name}
              className="w-16 h-16 rounded-full border-2 border-green-500/30 object-cover shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-[#0a1a1a]">
              Lv.{level}
            </div>
          </div>

          {/* Name & Title */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-black text-white truncate">{name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-400">{levelTitle}</span>
              <span className="text-gray-600">•</span>
              <span className="text-xs text-gray-500 truncate">{email}</span>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="relative mt-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-gray-400">XP Progress</span>
            </div>
            <span className="text-xs font-bold text-purple-400">
              {xp.toLocaleString()} XP
            </span>
          </div>

          {/* Progress bar container */}
          <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 rounded-full transition-all duration-700 ease-out shadow-lg shadow-purple-500/20"
              style={{ width: `${xpProgress}%` }}
            />
          </div>

          {/* Progress labels */}
          <div className="flex justify-between mt-1.5 text-[10px] text-gray-500">
            <span>{(xp - xpCurrent).toLocaleString()} / {(xpForNext - xpCurrent).toLocaleString()}</span>
            <span>Level {level + 1}</span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white/5 rounded-xl p-3 text-center border border-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                {stat.icon}
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{stat.label}</p>
              </div>
              <p className="text-xl font-black text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}