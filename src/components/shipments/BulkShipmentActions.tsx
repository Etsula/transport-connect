
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Package, Download, Trash2, Edit } from 'lucide-react';

interface BulkShipmentActionsProps {
  shipments: any[];
  onShipmentsUpdate: () => void;
}

const BulkShipmentActions: React.FC<BulkShipmentActionsProps> = ({
  shipments,
  onShipmentsUpdate
}) => {
  const [selectedShipments, setSelectedShipments] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedShipments(shipments.map(s => s.id));
    } else {
      setSelectedShipments([]);
    }
  };

  const handleSelectShipment = (shipmentId: string, checked: boolean) => {
    if (checked) {
      setSelectedShipments(prev => [...prev, shipmentId]);
    } else {
      setSelectedShipments(prev => prev.filter(id => id !== shipmentId));
    }
  };

  const executeBulkAction = async () => {
    if (!bulkAction || selectedShipments.length === 0) {
      toast({
        title: "Error",
        description: "Please select shipments and an action",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      switch (bulkAction) {
        case 'export':
          await exportShipments();
          break;
        case 'status_update':
          await bulkStatusUpdate();
          break;
        case 'archive':
          await archiveShipments();
          break;
        default:
          throw new Error('Unknown action');
      }

      toast({
        title: "Bulk Action Completed",
        description: `Successfully processed ${selectedShipments.length} shipments`
      });

      setSelectedShipments([]);
      setBulkAction('');
      onShipmentsUpdate();
    } catch (error: any) {
      toast({
        title: "Bulk Action Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportShipments = async () => {
    const selectedShipmentData = shipments.filter(s => selectedShipments.includes(s.id));
    const csvContent = convertToCSV(selectedShipmentData);
    downloadCSV(csvContent, 'shipments-export.csv');
  };

  const bulkStatusUpdate = async () => {
    const { error } = await supabase
      .from('shipments')
      .update({ status: 'cancelled' })
      .in('id', selectedShipments);

    if (error) throw error;
  };

  const archiveShipments = async () => {
    // In a real implementation, you might have an 'archived' field
    const { error } = await supabase
      .from('shipments')
      .update({ status: 'archived' })
      .in('id', selectedShipments);

    if (error) throw error;
  };

  const convertToCSV = (data: any[]) => {
    const headers = ['ID', 'Title', 'Status', 'Pickup', 'Delivery', 'Created'];
    const rows = data.map(s => [
      s.id,
      s.title,
      s.status,
      s.pickup_location,
      s.delivery_location,
      new Date(s.created_at).toLocaleDateString()
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="h-5 w-5 mr-2" />
          Bulk Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={selectedShipments.length === shipments.length}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm font-medium">Select All ({selectedShipments.length} selected)</span>
        </div>

        <div className="max-h-48 overflow-y-auto space-y-2">
          {shipments.map((shipment) => (
            <div key={shipment.id} className="flex items-center space-x-2 p-2 border rounded">
              <Checkbox
                checked={selectedShipments.includes(shipment.id)}
                onCheckedChange={(checked) => handleSelectShipment(shipment.id, checked as boolean)}
              />
              <div className="flex-1">
                <p className="font-medium text-sm">{shipment.title}</p>
                <p className="text-xs text-gray-500">{shipment.pickup_location} → {shipment.delivery_location}</p>
              </div>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded">{shipment.status}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Select value={bulkAction} onValueChange={setBulkAction}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="export">
                <div className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Export to CSV
                </div>
              </SelectItem>
              <SelectItem value="status_update">
                <div className="flex items-center">
                  <Edit className="h-4 w-4 mr-2" />
                  Update Status
                </div>
              </SelectItem>
              <SelectItem value="archive">
                <div className="flex items-center">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Archive
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={executeBulkAction}
            disabled={loading || selectedShipments.length === 0 || !bulkAction}
          >
            {loading ? "Processing..." : "Execute"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkShipmentActions;
