import { connectDB } from '@/lib/db';
import Activity from '@/lib/models/Activity'; // Make sure Activity is imported
import User from '@/lib/models/User'; // Import User for population
import Product from '@/lib/models/Product'; // Import Product for population
import AdminOrderClient from '@/components/admin/AdminOrderClient';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  await connectDB();

  // Fetch all redeems (orders), sorted by newest
  const orders = await Activity.find({ type: 'redeem' })
    .populate('userId', 'name email avatar')
    .populate('productId', 'name image pointsCost')
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage user redemptions and shipments</p>
      </div>

      <AdminOrderClient initialOrders={JSON.parse(JSON.stringify(orders))} />
    </div>
  );
}