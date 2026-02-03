'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ProfileEditModal from '@/components/ProfileEditModal';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { formatDate } from '@/lib/utils';
import {
  Mail,
  Phone,
  MapPin,
  Edit,
  Calendar,
  ShieldCheck,
  Settings
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { user } = useAppContext();
  const [editModalOpen, setEditModalOpen] = useState(false);

  if (!user) {
    return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-8 font-sans max-w-7xl mx-auto">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Admin Settings
          </h1>
          <p className="text-gray-500 font-medium">
            Manage your administrator profile and preferences.
          </p>
        </div>
        <button
          onClick={() => setEditModalOpen(true)}
          className="btn-add-animated"
        >
          <span>
            <Edit className="h-4 w-4" />
            Edit Profile
          </span>
        </button>
      </div>

      {/* HERO PROFILE CARD */}
      <div
        className="relative overflow-hidden rounded-[2.5rem] text-white shadow-xl p-8 bg-cover bg-center"
        style={{ backgroundImage: "url('/ui/profilecardBG2.png')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 md:bg-black/50" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden bg-[#0a1f1f]">
                <Image
                  src={user.avatar || '/icons/default_avatar.png'}
                  alt={user.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full border-4 border-[#0a1f1f]">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h2 className="text-4xl font-black tracking-tight">{user.name}</h2>
                  <span className="bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Administrator
                  </span>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-300 text-sm font-medium">
                  <div className="flex items-center gap-2 bg-white/5 py-1.5 px-3 rounded-lg border border-white/10">
                    <Mail className="w-4 h-4 text-green-400" /> {user.email}
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 py-1.5 px-3 rounded-lg border border-white/10">
                    <Calendar className="w-4 h-4 text-purple-400" /> Joined {formatDate(user.createdAt || new Date()).split(',')[0]}
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 bg-white/5 py-1.5 px-3 rounded-lg border border-white/10">
                      <Phone className="w-4 h-4 text-blue-400" /> {user.phone}
                    </div>
                  )}
                </div>
              </div>

              {/* Address Badge */}
              {user.address && (
                <div className="inline-flex items-center gap-2 bg-white/10 py-2 px-4 rounded-full text-sm font-medium border border-white/20 backdrop-blur-sm">
                  <MapPin className="w-4 h-4 text-red-400" />
                  {user.address}
                </div>
              )}

              {!user.address && !user.phone && (
                <p className="text-gray-400 text-sm italic">
                  Complete your profile details to look more professional!
                </p>
              )}
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