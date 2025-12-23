'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { getMonthsArray, getMonthName } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

export default function ProgressChart({ monthlyPoints }) {
  const months = getMonthsArray(6);
  
  const data = months.map(month => ({
    month: getMonthName(month).split(' ')[0], // Short month name
    points: monthlyPoints?.[month] || 0
  }));

  const totalPoints = data.reduce((sum, item) => sum + item.points, 0);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border-2 border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <h3 className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Progres Poin
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
            6 bulan terakhir • Total: {totalPoints.toLocaleString()} poin
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            stroke="#6b7280"
            style={{ fontSize: '12px', fontWeight: 'bold' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px', fontWeight: 'bold' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '2px solid #22c55e',
              borderRadius: '12px',
              fontWeight: 'bold'
            }}
          />
          <Area
            type="monotone"
            dataKey="points"
            stroke="#22c55e"
            strokeWidth={3}
            fill="url(#colorPoints)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}