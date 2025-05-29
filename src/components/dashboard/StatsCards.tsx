
import React from 'react';
import { Card } from '@/components/ui/card';
import { Package, Truck, Clock, Globe } from 'lucide-react';

interface StatsCardsProps {
  shipments: any[];
  loading: boolean;
  userType: string;
}

const StatsCards = ({ shipments, loading, userType }: StatsCardsProps) => {
  const activeShipments = loading ? 0 : shipments.filter(s => s.status === "open").length;
  const internationalShipments = loading ? 0 : shipments.filter(s => s.is_international).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Package className="w-8 h-8 text-primary" />
          <div>
            <p className="text-sm text-gray-600">Active Shipments</p>
            <p className="text-2xl font-bold">{loading ? "..." : activeShipments}</p>
          </div>
        </div>
      </Card>
      
      {userType === "transporter" ? (
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Package className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-gray-600">My Bids</p>
              <p className="text-2xl font-bold">-</p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Truck className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-gray-600">Available Transporters</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </Card>
      )}
      
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Clock className="w-8 h-8 text-primary" />
          <div>
            <p className="text-sm text-gray-600">Pending Requests</p>
            <p className="text-2xl font-bold">2</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Globe className="w-8 h-8 text-primary" />
          <div>
            <p className="text-sm text-gray-600">International Shipments</p>
            <p className="text-2xl font-bold">{loading ? "..." : internationalShipments}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatsCards;
