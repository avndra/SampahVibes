'use client';

import { Award, Recycle, Package } from 'lucide-react';

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
  } = user;

  const stats = [
    {
      label: 'Points',
      value: totalPoints.toLocaleString(),
      icon: <Award className="w-5 h-5 text-yellow-300" />,
    },
    {
      label: 'Recycled',
      value: `${totalWeight.toFixed(1)}kg`,
      icon: <Recycle className="w-5 h-5 text-green-300" />,
    },
    {
      label: 'Deposits',
      value: totalDeposits,
      icon: <Package className="w-5 h-5 text-blue-300" />,
    },
  ];

  return (
    <div className="bg-gray-800/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-green-500/20 overflow-hidden">
      {/* Header with Green Gradient */}
      <div className="p-6 bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20">
        <div className="flex items-center gap-5">
          <div className="relative flex-shrink-0">
            <img 
              src={avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} 
              alt={name} 
              className="w-20 h-20 rounded-full border-4 border-white/20 object-cover shadow-lg"
            />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">{name}</h3>
            <p className="text-white/70 text-sm">{email}</p>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="flex items-center justify-center gap-2 mb-1">
                {stat.icon}
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
              </div>
              <p className="text-3xl font-extrabold text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}