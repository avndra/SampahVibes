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
    <div className="w-full">
      <ResponsiveContainer width="100%" height={150}>
        <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#9ca3af"
            style={{ fontSize: '10px', fontWeight: '500' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: '10px', fontWeight: '500' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          />
          <Area
            type="monotone"
            dataKey="points"
            stroke="#22c55e"
            strokeWidth={2}
            fill="url(#colorPoints)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}