'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Loader from '@/components/Loader';

const AppContext = createContext();

export function AppProvider({ children }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (session?.user) {
      fetchUserData();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [session, status]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        console.log('[AppContext] User data fetched:', { xp: data.xp, level: data.level, name: data.name });
        setUser(data);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = () => {
    if (session?.user) {
      fetchUserData();
    }
  };

  return (
    <AppContext.Provider value={{ user, loading, refreshUser, session }}>
      {loading ? (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a1f1f]">
          <Loader />
          <span className="mt-8 text-xl font-bold text-green-400">Loading...</span>
        </div>
      ) : (
        children
      )}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}