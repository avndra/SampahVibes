import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Product from '@/lib/models/Product';
import Activity from '@/lib/models/Activity';
import HomePageClient from '@/components/HomePageClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // Check if user is admin and redirect to admin dashboard
  if (session?.user?.role === 'admin') {
    redirect('/admin');
  }

  await connectDB();

  const featuredProducts = await Product.find({ featured: true, isActive: true })
    .limit(4)
    .lean();

  let user = null;
  let recentActivities = [];

  if (session?.user?.id && session.user.id !== 'demo-user-id') {
    user = await User.findById(session.user.id).lean();

    // If user was deleted or banned by admin, force logout
    if (!user || user.isBanned) {
      redirect('/api/auth/signout?callbackUrl=/login');
    }

    recentActivities = await Activity.find({ userId: session.user.id })
      .sort({ timestamp: -1 })
      .limit(5)
      .lean();
  }

  return (
    <HomePageClient
      session={session}
      user={user ? JSON.parse(JSON.stringify(user)) : null}
      featuredProducts={JSON.parse(JSON.stringify(featuredProducts))}
      recentActivities={JSON.parse(JSON.stringify(recentActivities))}
    />
  );
}