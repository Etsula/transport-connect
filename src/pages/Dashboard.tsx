
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LoadingCard } from "@/components/ui/loading";
import { useShipmentMessages } from "@/hooks/useShipmentMessages";
import StatsCards from "@/components/dashboard/StatsCards";
import ShipmentsList from "@/components/dashboard/ShipmentsList";
import QuickActions from "@/components/dashboard/QuickActions";
import ShipmentTracking from "@/components/ShipmentTracking";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import Disclaimers from "@/components/disclaimers/Disclaimers";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { userData, loading: authLoading, logout } = useAuth();
  const { shipments, loading: shipmentsLoading } = useShipmentMessages();
  const [latestTracking, setLatestTracking] = useState<any>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  // Fetch real tracking data for the user's most recent active shipment
  useEffect(() => {
    const fetchTracking = async () => {
      if (!shipments.length || shipmentsLoading) return;
      
      const activeShipment = shipments.find(s => 
        s.status === "in_transit" || s.status === "assigned"
      );
      
      if (!activeShipment) return;

      setTrackingLoading(true);
      try {
        const { data: trackingData } = await supabase
          .from("shipment_tracking")
          .select("*")
          .eq("shipment_id", activeShipment.id)
          .order("created_at", { ascending: true });

        if (trackingData && trackingData.length > 0) {
          const trackingPoints = trackingData.map(t => ({
            location: t.location || "Unknown location",
            timestamp: new Date(t.created_at).toLocaleString(),
            status: t.status,
            coordinates: t.latitude && t.longitude 
              ? { lat: t.latitude, lng: t.longitude }
              : undefined
          }));

          const completedSteps = trackingData.length;
          const estimatedTotal = Math.max(completedSteps + 2, 5);
          const progress = Math.min(Math.round((completedSteps / estimatedTotal) * 100), 95);

          setLatestTracking({
            shipmentId: activeShipment.id,
            currentStatus: trackingData[trackingData.length - 1].status,
            trackingPoints,
            progress
          });
        }
      } catch (err) {
        console.error("Error fetching tracking:", err);
      } finally {
        setTrackingLoading(false);
      }
    };

    fetchTracking();
  }, [shipments, shipmentsLoading]);

  if (authLoading) {
    return <LoadingCard title="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
            <Button variant="outline" onClick={logout}>Sign Out</Button>
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
              userId={userData.id}
            />
          </div>
          <div>
            <NotificationCenter />
          </div>
        </div>

        {latestTracking && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Live Tracking</h2>
            <ShipmentTracking 
              shipmentId={latestTracking.shipmentId}
              currentStatus={latestTracking.currentStatus}
              trackingPoints={latestTracking.trackingPoints}
              progress={latestTracking.progress}
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

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <QuickActions userType={userData.userType} />
        </section>

        <section>
          <Disclaimers type="all" compact />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
