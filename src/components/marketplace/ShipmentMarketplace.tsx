
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Package, Clock, DollarSign, User, Filter, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LoadingCard } from '@/components/ui/loading';
import { useAuth } from '@/hooks/useAuth';
import BidForm from '@/components/BidForm';
import Disclaimers from '@/components/disclaimers/Disclaimers';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface MarketplaceShipment {
  id: string;
  title: string;
  pickup_location: string;
  delivery_location: string;
  budget: number | null;
  delivery_urgency: string | null;
  package_type: string | null;
  weight: number | null;
  is_international: boolean;
  requires_documents: boolean;
  description: string | null;
  created_at: string;
  status: string;
  shipper_id: string;
  profiles: { company_name: string | null } | null;
  bid_count: number;
}

const ShipmentMarketplace = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [shipments, setShipments] = useState<MarketplaceShipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const { toast } = useToast();
  const { userData, authenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const { data: shipmentsData, error } = await (supabase.from("shipments") as any)
        .select("id, title, pickup_location, delivery_location, budget, delivery_urgency, package_type, weight, is_international, requires_documents, description, created_at, status, shipper_id, profiles:shipper_id(company_name)")
        .eq("status", "open")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (shipmentsData && shipmentsData.length > 0) {
        const shipmentIds = shipmentsData.map((s: any) => s.id);

        // Fetch bid counts for each shipment
        const { data: bidsData } = await supabase
          .from("bids")
          .select("shipment_id")
          .in("shipment_id", shipmentIds);

        const bidCounts: Record<string, number> = {};
        bidsData?.forEach((b) => {
          bidCounts[b.shipment_id] = (bidCounts[b.shipment_id] || 0) + 1;
        });

        const enriched = shipmentsData.map((s: any) => ({
          ...s,
          bid_count: bidCounts[s.id] || 0,
        }));

        setShipments(enriched);
      } else {
        setShipments([]);
      }
    } catch (err: any) {
      console.error("Error fetching marketplace:", err);
      toast({
        title: "Error",
        description: "Failed to load marketplace shipments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string | null) => {
    switch (urgency) {
      case 'urgent': return 'bg-destructive/10 text-destructive';
      case 'express': return 'bg-orange-100 text-orange-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handlePlaceBid = (shipmentId: string) => {
    if (!authenticated) {
      toast({ title: "Sign in required", description: "Please sign in to place a bid", variant: "destructive" });
      navigate("/auth");
      return;
    }
    setSelectedShipmentId(shipmentId);
    setBidDialogOpen(true);
  };

  const filteredShipments = shipments.filter((s) => {
    const matchesSearch = searchTerm === '' ||
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.pickup_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.delivery_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.package_type || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'local') return matchesSearch && !s.is_international;
    if (filter === 'international') return matchesSearch && s.is_international;
    if (filter === 'urgent') return matchesSearch && (s.delivery_urgency === 'urgent' || s.delivery_urgency === 'express');
    return matchesSearch;
  });

  if (loading) {
    return <LoadingCard title="Loading marketplace..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shipment Marketplace</h1>
          <p className="text-muted-foreground">Find shipments that match your route and earn money</p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search locations, package types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All ({shipments.length})</TabsTrigger>
          <TabsTrigger value="local">Local ({shipments.filter(s => !s.is_international).length})</TabsTrigger>
          <TabsTrigger value="international">International ({shipments.filter(s => s.is_international).length})</TabsTrigger>
          <TabsTrigger value="urgent">Urgent ({shipments.filter(s => s.delivery_urgency === 'urgent' || s.delivery_urgency === 'express').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4 mt-4">
          {filteredShipments.length === 0 ? (
            <Card className="p-8 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-lg font-medium">No shipments found</p>
              <p className="text-muted-foreground mt-1">
                {searchTerm ? "Try adjusting your search terms" : "Check back later for new shipment opportunities"}
              </p>
            </Card>
          ) : (
            filteredShipments.map((shipment) => (
              <Card key={shipment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{shipment.title}</h3>
                        <Badge className={getUrgencyColor(shipment.delivery_urgency)}>
                          {shipment.delivery_urgency || 'standard'}
                        </Badge>
                        {shipment.is_international && (
                          <Badge variant="outline">International</Badge>
                        )}
                        {shipment.requires_documents && (
                          <Badge variant="secondary">Docs Required</Badge>
                        )}
                      </div>

                      {shipment.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{shipment.description}</p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-green-600 shrink-0" />
                          <span className="text-sm">From: {shipment.pickup_location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-destructive shrink-0" />
                          <span className="text-sm">To: {shipment.delivery_location}</span>
                        </div>
                        {shipment.package_type && (
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-blue-600 shrink-0" />
                            <span className="text-sm">{shipment.package_type}{shipment.weight ? ` - ${shipment.weight}kg` : ''}</span>
                          </div>
                        )}
                        {shipment.budget && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600 shrink-0" />
                            <span className="text-sm font-semibold">Budget: KSh {shipment.budget.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{shipment.profiles?.company_name || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{getTimeAgo(shipment.created_at)}</span>
                        </div>
                        <div>
                          {shipment.bid_count} bid{shipment.bid_count !== 1 ? 's' : ''} received
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                      {userData.userType === 'transporter' && shipment.shipper_id !== userData.id && (
                        <Button onClick={() => handlePlaceBid(shipment.id)} className="flex-1 md:flex-none">
                          Place Bid
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/shipment/${shipment.id}`)}
                        className="flex-1 md:flex-none"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      <CommissionInfo />

      <Disclaimers type="liability" compact />

      <Dialog open={bidDialogOpen} onOpenChange={setBidDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Place a Bid</DialogTitle>
          </DialogHeader>
          {selectedShipmentId && (
            <BidForm
              shipmentId={selectedShipmentId}
              onBidPlaced={() => {
                setBidDialogOpen(false);
                fetchShipments();
                toast({ title: "Bid placed", description: "Your bid has been submitted successfully" });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const CommissionInfo = () => {
  const [commissions, setCommissions] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("commission_structures")
        .select("*")
        .eq("is_active", true)
        .order("referral_level", { ascending: true });
      if (data) setCommissions(data);
    };
    fetch();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Structure</CardTitle>
      </CardHeader>
      <CardContent>
        {commissions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Platform Fees:</h4>
              <ul className="space-y-1 text-muted-foreground">
                {commissions.map((c) => (
                  <li key={c.id}>
                    • {c.user_type} (Level {c.referral_level}): {c.commission_percentage}% commission
                    {c.base_commission > 0 && ` + KSh ${c.base_commission} base`}
                    {c.min_rating_required > 0 && ` (min rating: ${c.min_rating_required})`}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Payment Protection:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Payments held in secure escrow</li>
                <li>• Released upon delivery confirmation</li>
                <li>• Automatic commission deduction</li>
                <li>• Payout to transporters after confirmation</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Payment Protection:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Payments held in secure escrow</li>
                <li>• Released upon delivery confirmation</li>
                <li>• Automatic commission deduction</li>
                <li>• Payout to transporters after confirmation</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShipmentMarketplace;
