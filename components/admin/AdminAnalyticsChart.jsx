'use client';

import { Paper, Typography, Box } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminAnalyticsChart() {
  // Mock data - in production, fetch from API
  const data = [
    { month: 'Jan', points: 4000, users: 240 },
    { month: 'Feb', points: 3000, users: 198 },
    { month: 'Mar', points: 2000, users: 280 },
    { month: 'Apr', points: 2780, users: 308 },
    { month: 'May', points: 1890, users: 400 },
    { month: 'Jun', points: 2390, users: 380 },
  ];

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        border: '2px solid',
        borderColor: 'divider',
        borderRadius: 3
      }}
    >
      <Typography variant="h6" fontWeight="black" gutterBottom>
        📈 Growth Trends
      </Typography>
      <Box sx={{ mt: 3 }}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" style={{ fontSize: '12px', fontWeight: 'bold' }} />
            <YAxis style={{ fontSize: '12px', fontWeight: 'bold' }} />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px',
                border: '2px solid #22c55e',
                fontWeight: 'bold'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="points" 
              stroke="#22c55e" 
              strokeWidth={3}
              fill="url(#colorPoints)"
              name="Points"
            />
            <Area 
              type="monotone" 
              dataKey="users" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fill="url(#colorUsers)"
              name="Users"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}