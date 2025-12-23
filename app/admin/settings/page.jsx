'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/context/AppContext';
import { updateUserProfile } from '@/lib/actions/profile';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const { user, refreshUser } = useAppContext();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateUserProfile({ name });

    if (result.success) {
      toast.success(result.message);
      refreshUser(); // Refresh user data in the context
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="p-6">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Update your administrator profile</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Information</CardTitle>
          <CardDescription>This is how your name appears in the application.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
              <Label htmlFor="adminName">Admin Name</Label>
              <Input
                id="adminName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}