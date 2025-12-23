'use client';

import { getCurrentMonth } from '@/lib/utils';
import Icon from '@/components/Icon';
import Image from 'next/image';

export default function DashboardStats({ user }) {
  const currentMonthPoints = user.monthlyPoints?.[getCurrentMonth()] || 0;

  const stats = [
    {
      title: 'Total Poin',
      value: user.totalPoints.toLocaleString(),
      icon: 'points_earned',
      unit: 'pts',
      color: 'text-yellow-400',
      bgIcon: 'bg-yellow-400/20'
    },
    {
      title: 'Total Berat',
      value: user.totalWeight.toFixed(1),
      icon: 'metal',
      unit: 'kg',
      color: 'text-blue-400',
      bgIcon: 'bg-blue-400/20'
    },
    {
      title: 'Total Pindai',
      value: user.totalDeposits,
      icon: 'scan',
      unit: 'x',
      color: 'text-green-400',
      bgIcon: 'bg-green-400/20'
    },
    {
      title: 'Bulan Ini',
      value: currentMonthPoints.toLocaleString(),
      icon: 'points_earned',
      unit: 'pts',
      color: 'text-purple-400',
      bgIcon: 'bg-purple-400/20'
    }
  ];

  return (
    <div className="bg-[#0a1f1f] rounded-[2rem] p-5 md:p-8 shadow-xl relative overflow-hidden border border-white/5 group w-full">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-green-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-green-500/20 transition-all duration-700" />
      
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
            <p className="text-green-400 text-[10px] md:text-xs font-bold tracking-wider uppercase mb-0.5">
              Selamat Datang,
            </p>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight leading-none truncate">
              {user.name}
            </h1>
            <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
              <span className="text-[10px] text-gray-300 font-medium">Member Aktif</span>
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
              className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/5 rounded-xl p-3 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`p-1.5 rounded-md ${stat.bgIcon}`}>
                  <Icon name={stat.icon} size={16} className={`${stat.color}`} />
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-0.5 truncate">
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