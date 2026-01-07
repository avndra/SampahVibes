import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Product from '@/lib/models/Product';
import Activity from '@/lib/models/Activity';
import ModernAdminDashboard from '@/components/admin/ModernAdminDashboard';

// Prevent prerendering - requires database connection at runtime
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  await connectDB();

  const [totalUsers, totalProducts, totalActivities, stats, recentActivities, lowStockProducts] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Activity.countDocuments(),
    User.aggregate([
      {
        $group: {
          _id: null,
          totalPoints: { $sum: '$totalPoints' },
          totalWeight: { $sum: '$totalWeight' },
          totalDeposits: { $sum: '$totalDeposits' }
        }
      }
    ]),
    Activity.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('userId', 'name email')
      .populate('productId', 'name')
      .lean(),
    Product.find()
      .sort({ stock: 1 })
      .limit(5)
      .select('name stock')
      .lean()
  ]);

  const analyticsData = stats[0] || { totalPoints: 0, totalWeight: 0, totalDeposits: 0 };

  return (
    <ModernAdminDashboard
      totalUsers={totalUsers}
      totalProducts={totalProducts}
      totalActivities={totalActivities}
      analyticsData={analyticsData}
      recentActivities={JSON.parse(JSON.stringify(recentActivities))}
      lowStockProducts={JSON.parse(JSON.stringify(lowStockProducts))}
    />
  );
}

