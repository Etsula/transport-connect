
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, User } from "lucide-react";
import { useDeliveryConfirmation } from "@/hooks/useDeliveryConfirmation";

interface DeliveryConfirmationStatusProps {
  shipmentId: string;
}

const DeliveryConfirmationStatus: React.FC<DeliveryConfirmationStatusProps> = ({ 
  shipmentId 
}) => {
  const [confirmation, setConfirmation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { getDeliveryConfirmation } = useDeliveryConfirmation();

  useEffect(() => {
    const fetchConfirmation = async () => {
      setLoading(true);
      const { data } = await getDeliveryConfirmation(shipmentId);
      setConfirmation(data);
      setLoading(false);
    };

    fetchConfirmation();
  }, [shipmentId, getDeliveryConfirmation]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-center">
            <Clock className="h-5 w-5 animate-spin mr-2" />
            <span>Loading delivery status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!confirmation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-orange-500" />
            Delivery Pending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">This shipment has not been delivered yet.</p>
          <Badge variant="secondary" className="mt-2">
            Awaiting Delivery
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
          Delivery Confirmed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Status:</span>
            <Badge className="bg-green-500">
              {confirmation.status || 'Confirmed'}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Confirmed At:</span>
            <span className="text-sm">
              {new Date(confirmation.confirmed_at).toLocaleString()}
            </span>
          </div>
          
          {confirmation.profiles && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Confirmed By:</span>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {confirmation.profiles.company_name || 'Unknown User'}
                </span>
              </div>
            </div>
          )}
          
          {confirmation.device_info && (
            <div className="text-xs text-gray-400 mt-2 p-2 bg-gray-50 rounded">
              Device: {confirmation.device_info.substring(0, 50)}...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryConfirmationStatus;
