'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
  User,
  Package,
  Edit3,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Activity,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/admin/activities');
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Failed to fetch admin activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter(activity =>
    activity.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.adminId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionColor = (action) => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-700 border-green-200';
      case 'update': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delete': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'create': return <Plus className="h-4 w-4" />;
      case 'update': return <Edit3 className="h-4 w-4" />;
      case 'delete': return <Trash2 className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-500">Track all administrative actions and system events</p>
        </div>
        <div className="relative group w-full md:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-blue-500 transition-colors" />
          <Input
            placeholder="Search logs..."
            className="pl-10 bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Logs', value: activities.length, color: 'text-gray-900', bg: 'bg-white' },
          { label: 'Created', value: activities.filter(a => a.action === 'create').length, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Updated', value: activities.filter(a => a.action === 'update').length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Deleted', value: activities.filter(a => a.action === 'delete').length, color: 'text-red-600', bg: 'bg-red-50' }
        ].map((stat, i) => (
          <Card key={i} className={`border-none shadow-sm ${stat.bg}`}>
            <CardContent className="p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">{stat.label}</p>
              <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activities Timeline */}
      <Card className="border-none shadow-sm bg-white">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-lg font-bold text-gray-900">Recent Audit Logs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredActivities.length > 0 ? (
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-100 hidden md:block"></div>

              <div className="divide-y divide-gray-100">
                {filteredActivities.map((activity) => (
                  <div
                    key={activity._id}
                    className="relative flex flex-col md:flex-row gap-6 p-6 hover:bg-gray-50 transition-colors group"
                  >
                    {/* Icon Bubble */}
                    <div className={`hidden md:flex relative z-10 w-16 h-16 rounded-2xl items-center justify-center flex-shrink-0 shadow-sm border ${getActionColor(activity.action)}`}>
                      {getActionIcon(activity.action)}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`uppercase text-[10px] font-bold tracking-wider ${getActionColor(activity.action)}`}>
                            {activity.action}
                          </Badge>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(activity.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 md:mt-0">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                            {activity.adminId?.name?.charAt(0) || '?'}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {activity.adminId?.name || 'System'}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-gray-900 mb-1">
                        {activity.entityType.charAt(0).toUpperCase() + activity.entityType.slice(1)}: {activity.entityName}
                      </h3>

                      {activity.details && (
                        <p className="text-gray-500 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100 inline-block">
                          {activity.action === 'create' && 'Created a new entry in the system.'}
                          {activity.action === 'update' && 'Modified existing details.'}
                          {activity.action === 'delete' && 'Permanently removed from the database.'}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No logs found</h3>
              <p className="text-gray-500">System is waiting for actions...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}