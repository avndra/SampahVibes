'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ActivityFeed from '@/components/ActivityFeed';
import ProgressChart from '@/components/ProgressChart';
import ProfileEditModal from '@/components/ProfileEditModal';
import Image from 'next/image';
import Icon from '@/components/Icon';
import { getCurrentMonth, formatDate } from '@/lib/utils';
import { calculateProgress, getXpForNextLevel, getCurrentLevelXp, getLevelTitle } from '@/lib/xpSystem';
import {
   Mail,
   Phone,
   MapPin,
   Edit,
   Calendar,
   LogOut,
   Trophy,
   TrendingUp,
   Scale,
   ScanLine,
   Zap,
   Star
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function ProfileClient({ user, activities }) {
   const [editModalOpen, setEditModalOpen] = useState(false);
   const currentMonthPoints = user.monthlyPoints?.[getCurrentMonth()] || 0;

   // XP/Level calculations
   const userXp = user.xp || 0;
   const userLevel = user.level ?? 0; // Start from level 0
   const xpProgress = calculateProgress(userXp, userLevel);
   const xpForNext = getXpForNextLevel(userLevel);
   const xpCurrent = getCurrentLevelXp(userLevel);
   const levelTitle = getLevelTitle(userLevel);

   const stats = [
      {
         title: 'Total Poin',
         value: user.totalPoints.toLocaleString(),
         lucideIcon: Trophy,
         unit: 'pts',
         color: 'text-yellow-400',
         bg: 'bg-yellow-400/20'
      },
      {
         title: 'Total Berat',
         value: user.totalWeight.toFixed(1),
         lucideIcon: Scale,
         unit: 'kg',
         color: 'text-blue-400',
         bg: 'bg-blue-400/20'
      },
      {
         title: 'Total Pindai',
         value: user.totalDeposits,
         lucideIcon: ScanLine,
         unit: 'x',
         color: 'text-green-400',
         bg: 'bg-green-400/20'
      },
      {
         title: 'Bulan Ini',
         value: currentMonthPoints.toLocaleString(),
         lucideIcon: TrendingUp,
         unit: 'pts',
         color: 'text-purple-400',
         bg: 'bg-purple-400/20'
      }
   ];

   return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8 pb-24 md:pb-12 font-sans">
         <div className="max-w-7xl mx-auto space-y-6">

            {/* Page Title */}
            <div className="flex items-center justify-between mb-2">
               <div>
                  <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                     Dashboard
                  </h1>
                  <p className="text-gray-500 font-medium">
                     Welcome back, {user.name.split(' ')[0]}!
                  </p>
               </div>

               <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setEditModalOpen(true)}>
                     <Edit className="w-4 h-4 mr-2" /> Edit Profile
                  </Button>
                  <Button variant="destructive" size="icon" className="rounded-xl" onClick={() => signOut()}>
                     <LogOut className="w-4 h-4" />
                  </Button>
               </div>
            </div>

            {/* BENTO GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

               {/* LEFT COLUMN (Profile & Chart) */}
               <div className="lg:col-span-3 space-y-6">

                  {/* 1. HERO PROFILE CARD */}
                  <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0a1f1f] text-white shadow-xl p-8">
                     {/* Background Pattern */}
                     <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
                     <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -ml-24 -mb-24" />

                     <div className="relative z-10">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                           {/* Avatar */}
                           <div className="relative">
                              <div className="w-28 h-28 rounded-full border-4 border-white/10 shadow-2xl overflow-hidden bg-[#0a1f1f]">
                                 <Image src={user.avatar || '/icons/default_avatar.png'} alt={user.name} fill className="object-cover" unoptimized />
                              </div>
                              <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black p-1.5 rounded-full border-4 border-[#0a1f1f]">
                                 <Trophy className="w-5 h-5" />
                              </div>
                           </div>

                           {/* Info */}
                           <div className="flex-1 space-y-4">
                              <div>
                                 <h2 className="text-3xl font-black tracking-tight mb-1">{user.name}</h2>
                                 <div className="flex flex-wrap gap-4 text-gray-300 text-sm">
                                    <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {user.email}</div>
                                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Joined {formatDate(user.createdAt).split(',')[0]}</div>
                                    {user.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {user.phone}</div>}
                                 </div>
                              </div>

                              {/* Address Badge */}
                              {user.address && (
                                 <div className="inline-flex items-center gap-2 bg-white/5 py-1.5 px-3 rounded-full text-xs font-medium border border-white/10">
                                    <MapPin className="w-3.5 h-3.5 text-green-400" />
                                    {user.address}
                                 </div>
                              )}

                              {/* XP Level Progress Bar */}
                              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mt-4">
                                 <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                       <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1.5 rounded-lg">
                                          <Zap className="w-4 h-4 text-white" />
                                       </div>
                                       <div>
                                          <p className="text-xs text-gray-400 font-medium">Level {userLevel}</p>
                                          <p className="font-bold text-white text-sm">{levelTitle}</p>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       <p className="text-xs text-gray-400">Total XP</p>
                                       <p className="font-bold text-purple-400">{userXp.toLocaleString()}</p>
                                    </div>
                                 </div>

                                 {/* Progress Bar */}
                                 <div className="relative">
                                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                       <div
                                          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 rounded-full transition-all duration-500"
                                          style={{ width: `${xpProgress}%` }}
                                       />
                                    </div>
                                    <div className="flex justify-between mt-2 text-[10px] text-gray-400">
                                       <span>{(userXp - xpCurrent).toLocaleString()} / {(xpForNext - xpCurrent).toLocaleString()} XP</span>
                                       <span>Level {userLevel + 1}</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* STATS GRID INSIDE CARD */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
                           {stats.map((stat, i) => (
                              <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                                 <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-1.5 rounded-lg ${stat.bg}`}>
                                       <stat.lucideIcon className={`w-4 h-4 ${stat.color}`} />
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.title}</span>
                                 </div>
                                 <p className="text-2xl font-black tracking-tight">
                                    {stat.value}
                                    <span className="text-xs font-medium text-gray-500 ml-1">{stat.unit}</span>
                                 </p>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* 2. CHART SECTION */}
                  <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                     <div className="flex items-center justify-between mb-6">
                        <div>
                           <h3 className="text-xl font-bold text-gray-900 dark:text-white">Activity Analysis</h3>
                           <p className="text-sm text-gray-500">Points earned over the last 6 months</p>
                        </div>
                     </div>
                     <div className="h-[300px] w-full">
                        <ProgressChart monthlyPoints={user.monthlyPoints || {}} />
                     </div>
                  </div>
               </div>

               {/* RIGHT COLUMN (Activity Feed) */}
               <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 h-[900px] flex flex-col overflow-hidden sticky top-8">
                     <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                           Recent Activity
                        </h3>
                     </div>
                     <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <ActivityFeed activities={activities} />
                     </div>
                  </div>
               </div>

            </div>
         </div>

         <ProfileEditModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            user={user}
         />
      </div>
   );
}