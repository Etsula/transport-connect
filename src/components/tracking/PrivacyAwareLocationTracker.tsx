
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePrivacySettings } from '@/hooks/usePrivacySettings';
import { useConditionalTracking } from '@/hooks/useConditionalTracking';
import LiveLocationTracker from '@/components/LiveLocationTracker';
import { Shield, MapPin, AlertTriangle, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface PrivacyAwareLocationTrackerProps {
  transporterId: string;
  shipmentId?: string;
}

const PrivacyAwareLocationTracker = ({ 
  transporterId, 
  shipmentId 
}: PrivacyAwareLocationTrackerProps) => {
  const { settings, loading: settingsLoading } = usePrivacySettings();
  const { trackingStates } = useConditionalTracking(shipmentId);
  const [trackingLevel, setTrackingLevel] = useState<'minimal' | 'enhanced' | 'emergency'>('minimal');

  useEffect(() => {
    // Determine current tracking level based on privacy settings and active tracking
    const activeTracking = trackingStates.find(state => 
      state.user_id === transporterId && state.is_active
    );

    if (activeTracking) {
      setTrackingLevel(activeTracking.tracking_level);
    } else if (settings?.allow_location_tracking) {
      setTrackingLevel('minimal');
    } else {
      setTrackingLevel('minimal');
    }
  }, [trackingStates, settings, transporterId]);

  const getTrackingDescription = (level: string) => {
    switch (level) {
      case 'enhanced':
        return 'Enhanced tracking is active due to shipment issues or disputes';
      case 'emergency':
        return 'Emergency tracking is active for safety or security reasons';
      case 'minimal':
      default:
        return 'Basic location tracking during active deliveries only';
    }
  };

  const getTrackingColor = (level: string) => {
    switch (level) {
      case 'enhanced': return 'bg-orange-500';
      case 'emergency': return 'bg-red-500';
      case 'minimal':
      default: return 'bg-green-500';
    }
  };

  if (settingsLoading) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  // Check if location tracking is allowed
  if (!settings?.allow_location_tracking && trackingLevel === 'minimal') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-red-500" />
            Location Tracking Disabled
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Location tracking has been disabled in your privacy settings.
            </p>
            <p className="text-sm text-gray-500">
              You can enable it in your privacy settings to share location during deliveries.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Privacy Status Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <MapPin className="h-5 w-5 mr-2" />
              Location Tracking
            </CardTitle>
            <Badge className={getTrackingColor(trackingLevel)}>
              {trackingLevel} mode
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-gray-600 mb-3">
            {getTrackingDescription(trackingLevel)}
          </p>
          
          {trackingLevel !== 'minimal' && (
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-900 mb-1">Enhanced Tracking Active</p>
                  <p className="text-amber-800">
                    Your location is being tracked with increased frequency for shipment security.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location Tracker Component */}
      <LiveLocationTracker 
        transporterId={transporterId}
        shipmentId={shipmentId}
      />

      {/* Privacy Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">Your Privacy is Protected:</p>
              <ul className="space-y-1 text-xs">
                <li>• Location is only shared during active shipments</li>
                <li>• Data is automatically deleted after {settings?.data_retention_days || 30} days</li>
                <li>• Enhanced tracking requires valid business reasons</li>
                <li>• You can adjust tracking preferences in your privacy settings</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyAwareLocationTracker;
