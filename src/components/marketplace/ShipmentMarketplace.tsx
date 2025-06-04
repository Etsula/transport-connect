import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Package, Clock, DollarSign, User, Filter } from 'lucide-react';

interface MarketplaceShipment {
  id: string;
  title: string;
  from: string;
  to: string;
  budget: number;
  urgency: 'standard' | 'urgent' | 'express';
  packageType: string;
  weight: number;
  isInternational: boolean;
  requiresDocuments: boolean;
  postedBy: string;
  postedTime: string;
  bidsCount: number;
  status: 'open' | 'assigned' | 'in_progress' | 'completed';
}

const ShipmentMarketplace = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const sampleShipments: MarketplaceShipment[] = [
    {
      id: '1',
      title: 'Electronics to Mombasa - Urgent',
      from: 'Nairobi CBD',
      to: 'Mombasa, Nyali',
      budget: 3500,
      urgency: 'urgent',
      packageType: 'Electronics',
      weight: 2.5,
      isInternational: false,
      requiresDocuments: false,
      postedBy: 'TechHub Kenya',
      postedTime: '2 hours ago',
      bidsCount: 7,
      status: 'open'
    },
    {
      id: '2',
      title: 'International Shipment - Documents Required',
      from: 'Nairobi',
      to: 'Dubai, UAE',
      budget: 15000,
      urgency: 'standard',
      packageType: 'Documents',
      weight: 0.5,
      isInternational: true,
      requiresDocuments: true,
      postedBy: 'Legal Associates',
      postedTime: '5 hours ago',
      bidsCount: 3,
      status: 'open'
    },
    {
      id: '3',
      title: 'Furniture Delivery - Large Truck Needed',
      from: 'Nakuru',
      to: 'Kisumu',
      budget: 8000,
      urgency: 'standard',
      packageType: 'Furniture',
      weight: 200,
      isInternational: false,
      requiresDocuments: false,
      postedBy: 'HomeDecor Ltd',
      postedTime: '1 day ago',
      bidsCount: 12,
      status: 'open'
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'express': return 'bg-orange-100 text-orange-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const placeBid = (shipmentId: string) => {
    console.log('Placing bid for shipment:', shipmentId);
    // Implementation for bid placement
  };

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
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All Shipments</TabsTrigger>
          <TabsTrigger value="local">Local Only</TabsTrigger>
          <TabsTrigger value="international">International</TabsTrigger>
          <TabsTrigger value="urgent">Urgent</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          {sampleShipments.map((shipment) => (
            <Card key={shipment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{shipment.title}</h3>
                      <Badge className={getUrgencyColor(shipment.urgency)}>
                        {shipment.urgency}
                      </Badge>
                      {shipment.isInternational && (
                        <Badge variant="outline">International</Badge>
                      )}
                      {shipment.requiresDocuments && (
                        <Badge variant="secondary">Docs Required</Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <span className="text-sm">From: {shipment.from}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-600" />
                        <span className="text-sm">To: {shipment.to}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{shipment.packageType} - {shipment.weight}kg</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-semibold">Budget: KSh {shipment.budget.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>Posted by {shipment.postedBy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{shipment.postedTime}</span>
                      </div>
                      <div>
                        {shipment.bidsCount} bids received
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    <Button onClick={() => placeBid(shipment.id)}>
                      Place Bid
                    </Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Updated Commission Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Platform Fees (Reduced):</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Local deliveries: 12% platform fee (was 15%)</li>
                <li>• International: 8% platform fee (was 10%)</li>
                <li>• Bulk shipments (5+): Additional 2% discount</li>
                <li>• Verified transporters: 1% fee reduction</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Payment Protection:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Payments held in secure escrow</li>
                <li>• Released upon delivery confirmation</li>
                <li>• Automatic commission deduction</li>
                <li>• Instant payout to transporters</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentMarketplace;
