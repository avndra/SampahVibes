'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export default function BanGuard({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status === 'loading') return;

        // Check if user is Banned
        if (session?.user?.isBanned) {
            if (pathname !== '/banned') {
                router.replace('/banned');
            }
        } else {
            // If user is NOT banned (or guest), they shouldn't be on /banned
            if (pathname === '/banned') {
                router.replace('/');
            }
        }
    }, [session, status, pathname, router]);

    return <>{children}</>;
}
