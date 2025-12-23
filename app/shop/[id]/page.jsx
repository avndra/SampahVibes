import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/lib/models/User';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/ProductDetailClient';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }) {
  const { id } = await params;

  await connectDB();

  const product = await Product.findById(id).lean();

  if (!product) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  let userPoints = 0;

  if (session?.user?.id && session.user.id !== 'demo-user-id') {
    const user = await User.findById(session.user.id).lean();
    userPoints = user?.totalPoints || 0;
  }

  return (
    <ProductDetailClient
      product={JSON.parse(JSON.stringify(product))}
      userPoints={userPoints}
      isLoggedIn={!!session}
    />
  );
}