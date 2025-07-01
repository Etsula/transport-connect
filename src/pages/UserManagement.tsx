
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { LoadingCard } from '@/components/ui/loading';
import UserManagementTable from '@/components/users/UserManagementTable';
import UserProfileEditor from '@/components/users/UserProfileEditor';

const UserManagement = () => {
  const { authenticated, loading } = useAuthGuard();

  if (loading) {
    return <LoadingCard title="Loading user management..." />;
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">User Management</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <UserManagementTable />
          </TabsContent>

          <TabsContent value="profile">
            <UserProfileEditor />
          </TabsContent>

          <TabsContent value="settings">
            <div className="text-center py-8">
              <p className="text-gray-500">Advanced user settings coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default UserManagement;
