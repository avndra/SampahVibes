'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, PieChart as RechartsPieChart, Cell } from 'recharts';

const EChart = ({ type, data, dataKey, secondDataKey, colors = [], color }) => {
  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: 'white'
            }}
          />
          <Bar dataKey={dataKey} fill={colors[0] || color || '#3b82f6'} />
        </BarChart>
      </ResponsiveContainer>
    );
  } else if (type === 'area') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[0] || color || '#3b82f6'} stopOpacity={0.3} />
              <stop offset="95%" stopColor={colors[0] || color || '#3b82f6'} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: 'white'
            }}
          />
          <Area type="monotone" dataKey={dataKey} stroke={colors[0] || color || '#3b82f6'} fill="url(#colorGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    );
  } else if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: 'white'
            }}
          />
          <RechartsPieChart
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </RechartsPieChart>
        </RechartsPieChart>
      </ResponsiveContainer>
    );
  }
  return null;
};

export default EChart;