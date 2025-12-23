'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  User,
  Mail,
  Package,
  Lock,
  Unlock,
  Trash2,
  BarChart3,
  MoreHorizontal,
  ShieldAlert
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function ModernAdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (userId, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isBanned: !currentStatus }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        fetchUsers(); // Refresh the list
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        fetchUsers(); // Refresh the list
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-500">Manage platform users and permissions</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-blue-500 transition-colors" />
          <Input
            placeholder="Search users..."
            className="pl-10 w-full md:w-72 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: users.length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active', value: users.filter(u => !u.isBanned).length, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Banned', value: users.filter(u => u.isBanned).length, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Avg. Points', value: Math.round(users.reduce((sum, u) => sum + u.totalPoints, 0) / (users.length || 1)), color: 'text-purple-600', bg: 'bg-purple-50' }
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <div className={`text-3xl font-black ${stat.color}`}>{stat.value.toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users List */}
      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
          <CardTitle className="text-lg font-bold text-gray-900">User Directory</CardTitle>
          <CardDescription>Manage all platform members</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredUsers.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg shadow-inner">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{user.name}</h3>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className={`
                          ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                        `}>
                          {user.role}
                        </Badge>
                        <Badge variant="outline" className={`
                          ${user.isBanned ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}
                        `}>
                          {user.isBanned ? 'Banned' : 'Active'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8 w-full md:w-auto">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{user.totalPoints.toLocaleString()} pts</p>
                      <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Points</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleBan(user._id, user.isBanned)}
                        disabled={user.role === 'admin'}
                        className={`h-9 w-9 rounded-lg ${user.isBanned ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'}`}
                        title={user.isBanned ? "Unban User" : "Ban User"}
                      >
                        {user.isBanned ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user._id)}
                        disabled={user.role === 'admin'}
                        className="h-9 w-9 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No users found</h3>
              <p className="text-gray-500">Try adjusting your search terms</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}