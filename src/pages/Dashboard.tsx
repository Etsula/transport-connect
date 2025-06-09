
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LoadingCard } from "@/components/ui/loading";
import { useShipmentMessages } from "@/hooks/useShipmentMessages";
import StatsCards from "@/components/dashboard/StatsCards";
import ShipmentsList from "@/components/dashboard/ShipmentsList";
import QuickActions from "@/components/dashboard/QuickActions";
import ShipmentTracking from "@/components/ShipmentTracking";
import NotificationCenter from "@/components/notifications/NotificationCenter";

const Dashboard = () => {
  const { userData, loading: authLoading, signOut } = useAuth();
  const { shipments, loading: shipmentsLoading } = useShipmentMessages();

  const demoTrackingData = {
    shipmentId: "123456789",
    currentStatus: "In Transit",
    progress: 65,
    trackingPoints: [
      {
        location: "Warehouse, Nairobi",
        timestamp: "Jun 12, 8:30 AM",
        status: "Picked up",
        coordinates: { lat: -1.286389, lng: 36.817223 }
      },
      {
        location: "Sorting Center, Nakuru",
        timestamp: "Jun 12, 2:15 PM",
        status: "In Transit",
        coordinates: { lat: -0.303099, lng: 36.080025 }
      },
      {
        location: "En route to Kisumu",
        timestamp: "Jun 13, 9:45 AM",
        status: "In Transit",
        coordinates: { lat: 0.091517, lng: 34.767906 }
      }
    ]
  };

  if (authLoading) {
    return <LoadingCard title="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
            <Button variant="outline" onClick={signOut}>Sign Out</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <StatsCards 
              shipments={shipments} 
              loading={shipmentsLoading} 
              userType={userData.userType} 
            />
          </div>
          <div>
            <NotificationCenter />
          </div>
        </div>

        {userData.userType === "shipper" && shipments.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Live Tracking</h2>
            <ShipmentTracking 
              shipmentId={demoTrackingData.shipmentId}
              currentStatus={demoTrackingData.currentStatus}
              trackingPoints={demoTrackingData.trackingPoints}
              progress={demoTrackingData.progress}
            />
          </section>
        )}

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {userData.userType === "shipper" ? "Your Recent Shipments" : "Available Shipments"}
          </h2>
          <ShipmentsList 
            shipments={shipments} 
            loading={shipmentsLoading} 
            userType={userData.userType} 
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <QuickActions userType={userData.userType} />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
