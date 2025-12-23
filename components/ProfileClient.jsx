'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ActivityFeed from '@/components/ActivityFeed';
import ProgressChart from '@/components/ProgressChart';
import ProfileEditModal from '@/components/ProfileEditModal';
import Image from 'next/image';
import Icon from '@/components/Icon';
import { getCurrentMonth } from '@/lib/utils';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Award,
  Calendar,
  LogOut
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { signOut } from 'next-auth/react';

export default function ProfileClient({ user, activities }) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const currentMonthPoints = user.monthlyPoints?.[getCurrentMonth()] || 0;

  const stats = [
    { title: 'Total Poin', value: user.totalPoints.toLocaleString(), icon: 'points_earned', unit: 'pts', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { title: 'Total Berat', value: user.totalWeight.toFixed(1), icon: 'metal', unit: 'kg', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { title: 'Total Pindai', value: user.totalDeposits, icon: 'scan', unit: 'x', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { title: 'Bulan Ini', value: currentMonthPoints.toLocaleString(), icon: 'points_earned', unit: 'pts', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 md:pb-12">
      
      {/* ================= MOBILE LAYOUT (MD:HIDDEN) ================= */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="relative bg-[#0a1f1f] pb-20 pt-8 px-4 rounded-b-[2.5rem] shadow-lg">
          <div className="container mx-auto max-w-lg text-center text-white">
             <div className="relative w-28 h-28 mx-auto rounded-full border-4 border-white/10 shadow-xl overflow-hidden mb-4">
                <Image src={user.avatar || '/icons/default_avatar.png'} alt={user.name} fill className="object-cover" unoptimized />
                <div className="absolute bottom-0 right-0 bg-yellow-400 text-black p-1.5 rounded-full border-2 border-[#0a1f1f]">
                   <Award className="w-4 h-4" />
                </div>
             </div>
             <h1 className="text-2xl font-black mb-1">{user.name}</h1>
             <p className="text-gray-400 text-sm mb-4 flex items-center justify-center gap-2">
                <Mail className="w-3 h-3" /> {user.email}
             </p>
             <div className="flex justify-center gap-2 mb-6">
                <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-8 text-xs rounded-full bg-transparent" onClick={() => setEditModalOpen(true)}>
                   <Edit className="w-3 h-3 mr-1.5" /> Edit
                </Button>
                <Button size="sm" variant="destructive" className="h-8 text-xs rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20" onClick={() => signOut()}>
                   <LogOut className="w-3 h-3 mr-1.5" /> Keluar
                </Button>
             </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="container mx-auto max-w-xl px-4 -mt-12 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
             {stats.map((stat, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
                   <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
                      <Icon name={stat.icon} size={16} className={stat.color} />
                   </div>
                   <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">{stat.title}</p>
                      <p className="text-lg font-black text-gray-800 dark:text-white">
                         {stat.value} <span className="text-xs font-normal text-gray-400">{stat.unit}</span>
                      </p>
                   </div>
                </div>
             ))}
          </div>
          {/* Info */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
             {user.phone && (<div className="flex items-center gap-3 text-sm"><Phone className="w-4 h-4 text-gray-400" /><p>{user.phone}</p></div>)}
             {user.address && (<div className="flex items-center gap-3 text-sm"><MapPin className="w-4 h-4 text-gray-400" /><p>{user.address}</p></div>)}
             <div className="flex items-center gap-3 text-sm"><Calendar className="w-4 h-4 text-gray-400" /><p>Member sejak {formatDate(user.createdAt).split(',')[0]}</p></div>
          </div>
          {/* Chart & Activity */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
             <ProgressChart monthlyPoints={user.monthlyPoints || {}} />
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
             <h3 className="font-bold text-lg mb-4">Aktivitas</h3>
             <ActivityFeed activities={activities} />
          </div>
        </div>
      </div>


      {/* ================= DESKTOP LAYOUT (HIDDEN MD:BLOCK) ================= */}
      <div className="hidden md:block container mx-auto px-4 py-8">
        {/* Desktop Header Background */}
        <div className="h-48 bg-gradient-to-r from-green-900 to-emerald-900 rounded-3xl mb-8 shadow-lg relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?w=1600')] bg-cover opacity-10" />
        </div>

        <div className="grid grid-cols-12 gap-8 -mt-24 relative z-10">
           
           {/* Left Sidebar: Profile Card */}
           <div className="col-span-4 lg:col-span-3">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 text-center sticky top-24">
                 <div className="relative w-32 h-32 mx-auto rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden mb-4 -mt-16 bg-gray-100">
                    <Image src={user.avatar || '/icons/default_avatar.png'} alt={user.name} fill className="object-cover" unoptimized />
                 </div>
                 <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                 <p className="text-gray-500 text-sm mb-6">{user.email}</p>
                 
                 <div className="space-y-4 text-left border-t border-gray-100 dark:border-gray-800 pt-6">
                    {user.phone && <div className="flex items-center gap-3 text-sm text-gray-600"><Phone className="w-4 h-4" /> {user.phone}</div>}
                    {user.address && <div className="flex items-center gap-3 text-sm text-gray-600"><MapPin className="w-4 h-4" /> {user.address}</div>}
                    <div className="flex items-center gap-3 text-sm text-gray-600"><Calendar className="w-4 h-4" /> Member sejak {formatDate(user.createdAt).split(',')[0]}</div>
                 </div>

                 <div className="mt-8 flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setEditModalOpen(true)}>Edit</Button>
                    <Button variant="destructive" size="icon" onClick={() => signOut()}><LogOut className="w-4 h-4" /></Button>
                 </div>
              </div>
           </div>

           {/* Right Content: Stats & Activity */}
           <div className="col-span-8 lg:col-span-9 space-y-8">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                 {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:-translate-y-1 transition-transform">
                       <div className="flex justify-between items-start mb-2">
                          <div className={`p-2 rounded-lg ${stat.bg}`}>
                             <Icon name={stat.icon} size={20} className={stat.color} />
                          </div>
                       </div>
                       <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.title}</p>
                       <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{stat.value}</p>
                    </div>
                 ))}
              </div>

              {/* Charts */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                 <ProgressChart monthlyPoints={user.monthlyPoints || {}} />
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                 <h3 className="text-xl font-bold mb-6">Aktivitas Terbaru</h3>
                 <ActivityFeed activities={activities} />
              </div>

           </div>
        </div>
      </div>

      {/* Edit Modal (Shared) */}
      <ProfileEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={user}
      />
    </div>
  );
}