'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

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
        <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="text-xl font-bold text-gray-700 dark:text-gray-300">Loading...</span>
          </div>
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