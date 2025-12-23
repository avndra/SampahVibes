import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';

export const metadata = {
  title: 'Admin Dashboard - E-Recycle',
  description: 'Manage your E-Recycle platform',
};

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    redirect('/');
  }

  return <AdminLayoutClient session={session}>{children}</AdminLayoutClient>;
}