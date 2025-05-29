
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PricingPlans from '@/components/subscription/PricingPlans';
import RevenueAnalytics from '@/components/analytics/RevenueAnalytics';
import APIKeyManagement from '@/components/settings/APIKeyManagement';
import { useAuth } from '@/hooks/useAuth';
import { LoadingCard } from '@/components/ui/loading';

const Subscription = () => {
  const { userData, loading } = useAuth();
  const [currentPlan, setCurrentPlan] = useState('basic');

  // Mock revenue data - replace with real data from your API
  const revenueMetrics = {
    totalRevenue: 1250000,
    monthlyGrowth: 23.5,
    totalDeliveries: 1543,
    activeUsers: 256,
    averageOrderValue: 850,
    commissionEarned: 125000
  };

  const handlePlanSelection = (planId: string) => {
    // Implement plan selection logic here
    setCurrentPlan(planId);
    // You would typically redirect to payment processor here
    console.log('Selected plan:', planId);
  };

  if (loading) {
    return <LoadingCard title="Loading subscription details..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Monetization & API Management
          </h1>
          <p className="text-gray-600">
            Manage your subscription, track revenue, and control API access
          </p>
        </div>

        <Tabs defaultValue="pricing" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pricing">Pricing Plans</TabsTrigger>
            <TabsTrigger value="analytics">Revenue Analytics</TabsTrigger>
            <TabsTrigger value="api">API Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pricing" className="mt-6">
            <PricingPlans 
              onSelectPlan={handlePlanSelection}
              currentPlan={currentPlan}
            />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <RevenueAnalytics metrics={revenueMetrics} />
          </TabsContent>
          
          <TabsContent value="api" className="mt-6">
            <APIKeyManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Subscription;
