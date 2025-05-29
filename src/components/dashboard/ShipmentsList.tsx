
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingCard } from '@/components/ui/loading';

interface ShipmentsListProps {
  shipments: any[];
  loading: boolean;
  userType: string;
}

const ShipmentsList = ({ shipments, loading, userType }: ShipmentsListProps) => {
  const navigate = useNavigate();

  if (loading) {
    return <LoadingCard title="Loading shipments..." />;
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {shipments.length === 0 ? (
          <p className="text-center py-4">No shipments found</p>
        ) : (
          shipments.map((shipment) => (
            <div key={shipment.id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
              <div>
                <p className="font-medium">{shipment.title}</p>
                <p className="text-sm text-gray-600">
                  From {shipment.pickup_location} to {shipment.delivery_location}
                  {shipment.is_international && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      International
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/messages/${shipment.id}`)}
                  size="sm"
                >
                  Message
                </Button>
                {userType === "shipper" ? (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/manage-shipment/${shipment.id}`)}
                    size="sm"
                  >
                    Manage
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/shipment/${shipment.id}`)}
                    size="sm"
                  >
                    View Details
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default ShipmentsList;
