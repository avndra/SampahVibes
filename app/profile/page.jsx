import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Activity from '@/lib/models/Activity';
import ProfileClient from '@/components/ProfileClient';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  if (session.user.id === 'demo-user-id') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-950 dark:to-red-950">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-8xl mb-6">🔒</div>
          <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Demo Account
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-semibold mb-8">
            Demo accounts cannot access profile features. Please create a real account to unlock all features!
          </p>
          <Link href="/login">
            <Button size="lg" className="rounded-2xl">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  await connectDB();

  const [user, activities] = await Promise.all([
    User.findById(session.user.id).lean(),
    Activity.find({ userId: session.user.id })
      .sort({ timestamp: -1 })
      .limit(20)
      .lean()
  ]);

  if (!user) {
    redirect('/login');
  }

  return (
    <ProfileClient
      user={JSON.parse(JSON.stringify(user))}
      activities={JSON.parse(JSON.stringify(activities))}
    />
  );
}