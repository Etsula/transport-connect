
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import APIKeyGenerator from '@/components/admin/APIKeyGenerator';
import APIUsageMonitor from '@/components/admin/APIUsageMonitor';
import APIKeyManagement from '@/components/settings/APIKeyManagement';
import { useAuth } from '@/hooks/useAuth';
import { LoadingCard } from '@/components/ui/loading';

const APIManagement = () => {
  const { userData, loading } = useAuth();

  if (loading) {
    return <LoadingCard title="Loading API management..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            API Management Portal
          </h1>
          <p className="text-gray-600">
            Generate API keys, monitor usage, and manage your API infrastructure
          </p>
        </div>

        <Tabs defaultValue="keys" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="keys">API Keys</TabsTrigger>
            <TabsTrigger value="generate">Generate Keys</TabsTrigger>
            <TabsTrigger value="monitor">Usage Monitor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="keys" className="mt-6">
            <APIKeyManagement />
          </TabsContent>
          
          <TabsContent value="generate" className="mt-6">
            <APIKeyGenerator />
          </TabsContent>
          
          <TabsContent value="monitor" className="mt-6">
            <APIUsageMonitor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default APIManagement;
