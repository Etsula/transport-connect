
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { LoadingCard } from '@/components/ui/loading';
import PaymentDashboard from '@/components/payments/PaymentDashboard';
import InvoiceGenerator from '@/components/invoices/InvoiceGenerator';
import PaymentMethodsManager from '@/components/payments/PaymentMethodsManager';
import Disclaimers from '@/components/disclaimers/Disclaimers';

const PaymentCenter = () => {
  const { authenticated, loading } = useAuthGuard();

  if (loading) {
    return <LoadingCard title="Loading payment center..." />;
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">Payment Center</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <PaymentDashboard />
          </TabsContent>

          <TabsContent value="invoices">
            <InvoiceGenerator />
          </TabsContent>

          <TabsContent value="methods">
            <PaymentMethodsManager />
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <Disclaimers type="liability" compact />
        </div>
      </main>
    </div>
  );
};

export default PaymentCenter;
