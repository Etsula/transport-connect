
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { LoadingCard } from '@/components/ui/loading';
import PaymentDashboard from '@/components/payments/PaymentDashboard';
import InvoiceGenerator from '@/components/invoices/InvoiceGenerator';

const PaymentCenter = () => {
  const { authenticated, loading } = useAuthGuard();

  if (loading) {
    return <LoadingCard title="Loading payment center..." />;
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
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
            <div className="text-center py-8">
              <p className="text-gray-500">Payment methods management coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PaymentCenter;
