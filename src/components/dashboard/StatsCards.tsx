
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Package, Truck, Clock, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StatsCardsProps {
  shipments: any[];
  loading: boolean;
  userType: string;
  userId?: string;
}

const StatsCards = ({ shipments, loading, userType, userId }: StatsCardsProps) => {
  const [bidCount, setBidCount] = useState<number>(0);
  const [transporterCount, setTransporterCount] = useState<number>(0);
  const [statsLoading, setStatsLoading] = useState(true);

  const activeShipments = loading ? 0 : shipments.filter(s => s.status === "open" || s.status === "assigned" || s.status === "in_transit").length;
  const internationalShipments = loading ? 0 : shipments.filter(s => s.is_international).length;
  const pendingCount = loading ? 0 : shipments.filter(s => s.status === "open").length;

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        if (userType === "transporter" && userId) {
          const { count } = await supabase
            .from("bids")
            .select("*", { count: "exact", head: true })
            .eq("transporter_id", userId);
          setBidCount(count || 0);
        } else {
          const { count } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("user_type", "transporter");
          setTransporterCount(count || 0);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    if (!loading) {
      fetchStats();
    }
  }, [loading, userType, userId, shipments]);

  const displayValue = (val: number) => (loading || statsLoading) ? "..." : val;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Package className="w-8 h-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Active Shipments</p>
            <p className="text-2xl font-bold">{loading ? "..." : activeShipments}</p>
          </div>
        </div>
      </Card>
      
      {userType === "transporter" ? (
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Package className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">My Bids</p>
              <p className="text-2xl font-bold">{displayValue(bidCount)}</p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Truck className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Available Transporters</p>
              <p className="text-2xl font-bold">{displayValue(transporterCount)}</p>
            </div>
          </div>
        </Card>
      )}
      
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Clock className="w-8 h-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Pending Requests</p>
            <p className="text-2xl font-bold">{loading ? "..." : pendingCount}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Globe className="w-8 h-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">International Shipments</p>
            <p className="text-2xl font-bold">{loading ? "..." : internationalShipments}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatsCards;
