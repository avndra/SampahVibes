'use client';

import AdminAnalyticsChart from '@/components/admin/AdminAnalyticsChart';
import Icon from '@/components/Icon';

export default function AdminDashboardClient({
  totalUsers,
  totalProducts,
  totalActivities,
  analyticsData,
  recentActivities
}) {
  const cards = [
    {
      title: 'Total Users',
      value: totalUsers.toLocaleString(),
      icon: 'user',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30'
    },
    {
      title: 'Total Products',
      value: totalProducts.toLocaleString(),
      icon: 'admin_products',
      bgColor: 'bg-green-50 dark:bg-green-950/30'
    },
    {
      title: 'Points Distributed',
      value: analyticsData.totalPoints.toLocaleString(),
      icon: 'points_earned',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/30'
    },
    {
      title: 'Total Weight (kg)',
      value: analyticsData.totalWeight.toFixed(2),
      icon: 'metal', // Using metal as a weight representation
      bgColor: 'bg-purple-50 dark:bg-purple-950/30'
    },
    {
      title: 'Total Scans',
      value: analyticsData.totalDeposits.toLocaleString(),
      icon: 'scan',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/30'
    },
    {
      title: 'Total Activities',
      value: totalActivities.toLocaleString(),
      icon: 'points_earned',
      bgColor: 'bg-pink-50 dark:bg-pink-950/30'
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          📊 Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 font-semibold">
          Monitor your platform's performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cards.map((card, index) => {
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                    {card.title}
                  </p>
                  <p className="text-4xl font-black text-gray-900 dark:text-white">
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${card.bgColor}`}>
                  <Icon name={card.icon} size={32} className="h-8 w-8" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Activities */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdminAnalyticsChart />
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-gray-100 dark:border-gray-800">
          <h3 className="text-xl font-black mb-4 text-gray-900 dark:text-white">
            🔥 Recent Activities
          </h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl border-2 ${
                    activity.type === 'earn'
                      ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                      : 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800'
                  }`}
                >
                  <p className="font-bold text-sm text-gray-900 dark:text-white">
                    {activity.type === 'earn' ? '🎉' : '🎁'} {activity.userId?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {activity.type === 'earn' ? 'Earned' : 'Redeemed'} {Math.abs(activity.points)} points
                    {activity.productName && ` • ${activity.productName}`}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No activities yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}