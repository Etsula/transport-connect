
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useConditionalTracking } from '@/hooks/useConditionalTracking';
import { AlertTriangle, MapPin, Shield, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface EnhancedTrackingControlProps {
  targetUserId: string;
  shipmentId?: string;
  userRole?: 'shipper' | 'transporter' | 'admin';
}

const EnhancedTrackingControl = ({ 
  targetUserId, 
  shipmentId, 
  userRole = 'shipper' 
}: EnhancedTrackingControlProps) => {
  const { trackingStates, activateEnhancedTracking, deactivateTracking, loading } = useConditionalTracking(shipmentId);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [trackingLevel, setTrackingLevel] = useState<'enhanced' | 'emergency'>('enhanced');

  const activeTracking = trackingStates.find(state => 
    state.user_id === targetUserId && state.is_active
  );

  const trackingReasons = [
    { value: 'overdue', label: 'Shipment Overdue', icon: Clock },
    { value: 'dispute', label: 'Payment Dispute', icon: AlertTriangle },
    { value: 'safety_concern', label: 'Safety Concern', icon: Shield },
    { value: 'failed_delivery', label: 'Failed Delivery', icon: MapPin }
  ];

  const handleActivateTracking = async () => {
    if (!selectedReason) return;
    
    await activateEnhancedTracking(
      targetUserId,
      selectedReason,
      shipmentId,
      trackingLevel
    );
    setSelectedReason('');
  };

  const getTrackingLevelColor = (level: string) => {
    switch (level) {
      case 'enhanced': return 'bg-orange-500';
      case 'emergency': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getReasonIcon = (reason: string) => {
    const reasonData = trackingReasons.find(r => r.value === reason);
    const Icon = reasonData?.icon || AlertTriangle;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Enhanced Tracking Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Current Tracking Status */}
        {activeTracking ? (
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getReasonIcon(activeTracking.trigger_reason || '')}
                <span className="font-medium text-orange-900">
                  Enhanced Tracking Active
                </span>
              </div>
              <Badge className={getTrackingLevelColor(activeTracking.tracking_level)}>
                {activeTracking.tracking_level}
              </Badge>
            </div>
            <p className="text-sm text-orange-800 mb-3">
              Reason: {trackingReasons.find(r => r.value === activeTracking.trigger_reason)?.label}
            </p>
            <p className="text-xs text-orange-700 mb-3">
              Activated: {new Date(activeTracking.activated_at).toLocaleString()}
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => deactivateTracking(activeTracking.id)}
              className="w-full"
            >
              Deactivate Tracking
            </Button>
          </div>
        ) : (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-900">
                Standard Privacy Mode
              </span>
            </div>
            <p className="text-sm text-green-800">
              Only basic location tracking during active deliveries
            </p>
          </div>
        )}

        <Separator />

        {/* Activate Enhanced Tracking */}
        {!activeTracking && (
          <div className="space-y-4">
            <h4 className="font-medium">Activate Enhanced Tracking</h4>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tracking Level</label>
              <Select value={trackingLevel} onValueChange={(value: 'enhanced' | 'emergency') => setTrackingLevel(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enhanced">Enhanced</SelectItem>
                  {userRole === 'admin' && (
                    <SelectItem value="emergency">Emergency</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reason</label>
              <Select value={selectedReason} onValueChange={setSelectedReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason..." />
                </SelectTrigger>
                <SelectContent>
                  {trackingReasons.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      <div className="flex items-center space-x-2">
                        <reason.icon className="h-4 w-4" />
                        <span>{reason.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleActivateTracking}
              disabled={!selectedReason || loading}
              className="w-full"
            >
              {loading ? 'Activating...' : 'Activate Enhanced Tracking'}
            </Button>

            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <p className="text-xs text-yellow-800">
                <strong>Note:</strong> Enhanced tracking requires user consent and valid business reasons. 
                All tracking activation is logged and auditable.
              </p>
            </div>
          </div>
        )}

        {/* Tracking History */}
        {trackingStates.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">Tracking History</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {trackingStates.slice(0, 3).map((state) => (
                  <div key={state.id} className="text-xs p-2 bg-gray-50 rounded">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {trackingReasons.find(r => r.value === state.trigger_reason)?.label}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {state.tracking_level}
                      </Badge>
                    </div>
                    <div className="text-gray-500 mt-1">
                      {new Date(state.activated_at).toLocaleDateString()}
                      {state.deactivated_at && (
                        <span> - {new Date(state.deactivated_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedTrackingControl;
