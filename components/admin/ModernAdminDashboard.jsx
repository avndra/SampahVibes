'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Bell,
  User,
  Users,
  Package,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  Plus,
  Filter,
  Download,
  Activity,
  Zap,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EChart from '@/components/admin/EChart';

export default function ModernAdminDashboard({
  totalUsers,
  totalProducts,
  totalActivities,
  analyticsData,
  recentActivities: initialRecentActivities = [],
  lowStockProducts = []
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const processedRecentActivities = useMemo(() => {
    return initialRecentActivities.map((activity, index) => ({
      id: index + 1,
      user: activity.userId?.name || 'Unknown User',
      action: activity.type === 'earn' ? `Earned ${activity.points} points` : `Redeemed ${activity.points} points`,
      time: activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Just now',
      status: 'completed'
    }));
  }, [initialRecentActivities]);

  const topProducts = useMemo(() => {
    return lowStockProducts.map((product, index) => {
      let status = 'in-stock';
      if (product.stock === 0) {
        status = 'out-of-stock';
      } else if (product.stock < 10) {
        status = 'low-stock';
      }

      return {
        id: index + 1,
        name: product.name,
        stock: product.stock,
        status
      };
    });
  }, [lowStockProducts]);

  const [filteredActivities, setFilteredActivities] = useState(processedRecentActivities);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredActivities(processedRecentActivities);
      return;
    }

    const filtered = processedRecentActivities.filter(activity =>
      activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredActivities(filtered);
  }, [searchTerm, processedRecentActivities]);

  const stats = [
    { title: 'Total Points', value: analyticsData.totalPoints?.toLocaleString() || '0', change: '+12%', icon: DollarSign, color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' },
    { title: 'Total Users', value: totalUsers.toLocaleString(), change: '+5%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
    { title: 'Recycled (kg)', value: analyticsData.totalWeight?.toFixed(2) || '0.00', change: '+18%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' },
    { title: 'Total Scans', value: analyticsData.totalDeposits?.toLocaleString() || '0', change: '+8%', icon: Package, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' },
  ];

  return (
    <div className="space-y-8 font-sans text-gray-900">

      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            Overview of your platform's performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-green-600 transition-colors" />
            <Input
              placeholder="Search analytics..."
              className="pl-10 w-full md:w-64 bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl shadow-sm hidden md:flex">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button size="icon" variant="ghost" className="rounded-xl hover:bg-gray-100 text-gray-500">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.bg} ${stat.color} flex items-center`}>
                  <ArrowUpRight className="w-3 h-3 mr-1" /> {stat.change}
                </span>
              </div>

              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
                <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white border-gray-100 shadow-sm rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Activity Overview</CardTitle>
                <CardDescription className="text-gray-500">Points generation over time</CardDescription>
              </div>
              <select className="bg-gray-50 border-none text-sm font-medium rounded-lg px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors">
                <option>This Year</option>
                <option>Last Year</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <EChart
                type="area"
                data={[
                  { month: 'Jan', points: Math.round(analyticsData.totalPoints * 0.2) },
                  { month: 'Feb', points: Math.round(analyticsData.totalPoints * 0.35) },
                  { month: 'Mar', points: Math.round(analyticsData.totalPoints * 0.45) },
                  { month: 'Apr', points: Math.round(analyticsData.totalPoints * 0.6) },
                  { month: 'May', points: Math.round(analyticsData.totalPoints * 0.8) },
                  { month: 'Jun', points: analyticsData.totalPoints },
                ]}
                dataKey="points"
                color="#10b981"
              />
            </div>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card className="bg-white border-gray-100 shadow-sm rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">User Growth</CardTitle>
                <CardDescription className="text-gray-500">New signups this month</CardDescription>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <EChart
                type="bar"
                data={[
                  { name: 'Week 1', value: 45 },
                  { name: 'Week 2', value: 80 },
                  { name: 'Week 3', value: 120 },
                  { name: 'Week 4', value: 160 },
                ]}
                colors={['#3b82f6']}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity List */}
        <Card className="lg:col-span-1 bg-white border-gray-100 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="space-y-1 px-2">
              {filteredActivities.slice(0, 6).map((activity, i) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-gray-200">
                    <Zap className="w-5 h-5 text-gray-500 group-hover:text-yellow-500 transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 truncate">{activity.user}</p>
                    <p className="text-xs text-gray-500 truncate">{activity.action}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">{activity.time.split(',')[1]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card className="lg:col-span-2 bg-white border-gray-100 shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Inventory Status</CardTitle>
              <CardDescription className="text-gray-500">Products requiring attention</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="h-9 rounded-lg text-xs border-gray-200 text-gray-600 hover:bg-gray-50">
              <Filter className="w-3 h-3 mr-2" /> Filter Items
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 rounded-lg">
                  <tr>
                    <th className="px-6 py-4 font-semibold rounded-l-lg">Product Name</th>
                    <th className="px-6 py-4 font-semibold">Stock Level</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold rounded-r-lg text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 text-gray-600">{product.stock} units</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={`
                                      border-0 px-3 py-1 rounded-full font-bold
                                      ${product.status === 'out-of-stock' ? 'bg-red-100 text-red-700' : ''}
                                      ${product.status === 'low-stock' ? 'bg-orange-100 text-orange-700' : ''}
                                      ${product.status === 'in-stock' ? 'bg-green-100 text-green-700' : ''}
                                   `}
                        >
                          {product.status.replace(/-/g, ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}