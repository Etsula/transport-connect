
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Package, Truck, CheckCircle, AlertCircle } from 'lucide-react';

interface ShipmentStatusManagerProps {
  shipment: any;
  onStatusUpdate: () => void;
}

const ShipmentStatusManager: React.FC<ShipmentStatusManagerProps> = ({
  shipment,
  onStatusUpdate
}) => {
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const statusOptions = [
    { value: 'open', label: 'Open', icon: Package, color: 'bg-blue-500' },
    { value: 'assigned', label: 'Assigned', icon: Truck, color: 'bg-yellow-500' },
    { value: 'in_transit', label: 'In Transit', icon: Truck, color: 'bg-orange-500' },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'bg-green-500' },
    { value: 'cancelled', label: 'Cancelled', icon: AlertCircle, color: 'bg-red-500' }
  ];

  const getCurrentStatusInfo = () => {
    return statusOptions.find(s => s.value === shipment.status) || statusOptions[0];
  };

  const updateStatus = async () => {
    if (!newStatus) {
      toast({
        title: "Error",
        description: "Please select a status",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Update shipment status
      const { error: shipmentError } = await supabase
        .from('shipments')
        .update({ status: newStatus })
        .eq('id', shipment.id);

      if (shipmentError) throw shipmentError;

      // Add tracking entry
      const { error: trackingError } = await supabase
        .from('shipment_tracking')
        .insert({
          shipment_id: shipment.id,
          status: newStatus,
          notes: notes || undefined,
          updated_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (trackingError) throw trackingError;

      // Create notification
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: shipment.shipper_id,
          title: 'Shipment Status Updated',
          message: `Your shipment "${shipment.title}" status has been updated to ${newStatus}`,
          type: 'info',
          shipment_id: shipment.id
        });

      if (notificationError) console.warn('Failed to create notification:', notificationError);

      toast({
        title: "Status Updated",
        description: `Shipment status changed to ${newStatus}`
      });

      setNewStatus('');
      setNotes('');
      onStatusUpdate();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = getCurrentStatusInfo();
  const StatusIcon = currentStatus.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <StatusIcon className="h-5 w-5 mr-2" />
            Shipment Status
          </span>
          <Badge className={currentStatus.color}>
            {currentStatus.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Update Status</label>
          <Select value={newStatus} onValueChange={setNewStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select new status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  <div className="flex items-center">
                    <status.icon className="h-4 w-4 mr-2" />
                    {status.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes about this status update..."
            rows={3}
          />
        </div>

        <Button 
          onClick={updateStatus} 
          disabled={loading || !newStatus}
          className="w-full"
        >
          {loading ? "Updating..." : "Update Status"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ShipmentStatusManager;
