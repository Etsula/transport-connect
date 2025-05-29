
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import APIDocumentation from '@/components/developer/APIDocumentation';
import APIKeyManagement from '@/components/settings/APIKeyManagement';
import PricingPlans from '@/components/subscription/PricingPlans';
import { useAuth } from '@/hooks/useAuth';
import { LoadingCard } from '@/components/ui/loading';

const DeveloperPortal = () => {
  const { userData, loading } = useAuth();

  const handlePlanSelection = (planId: string) => {
    console.log('Selected plan:', planId);
    // Redirect to payment or subscription management
  };

  if (loading) {
    return <LoadingCard title="Loading developer portal..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Developer Portal
          </h1>
          <p className="text-gray-600">
            Integrate iShip delivery services into your applications
          </p>
        </div>

        <Tabs defaultValue="docs" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="docs">Documentation</TabsTrigger>
            <TabsTrigger value="keys">API Keys</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="docs" className="mt-6">
            <APIDocumentation />
          </TabsContent>
          
          <TabsContent value="keys" className="mt-6">
            <APIKeyManagement />
          </TabsContent>
          
          <TabsContent value="pricing" className="mt-6">
            <PricingPlans 
              onSelectPlan={handlePlanSelection}
              currentPlan="basic"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeveloperPortal;
