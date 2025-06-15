
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useConditionalTracking } from '@/hooks/useConditionalTracking';
import { useUnresponsiveTransporterInfo } from '@/hooks/useUnresponsiveTransporterInfo';
import TransporterReferralInfo from './TransporterReferralInfo';
import CurrentShipmentsList from './CurrentShipmentsList';
import LastKnownLocationAlert from './LastKnownLocationAlert';
import EmergencyTrackingActions from './EmergencyTrackingActions';

interface UnresponsiveTransporterTrackerProps {
  transporterId?: string;
  shipmentId?: string;
}

const UnresponsiveTransporterTracker = ({
  transporterId,
  shipmentId,
}: UnresponsiveTransporterTrackerProps) => {
  const { activateEnhancedTracking } = useConditionalTracking();
  const {
    transporterInfo,
    lastKnownLocation,
    loading,
    fetchTransporterInfo,
    fetchLastKnownLocation,
  } = useUnresponsiveTransporterInfo(transporterId);

  const [trackingActivated, setTrackingActivated] = useState(false);

  useEffect(() => {
    fetchTransporterInfo();
    fetchLastKnownLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transporterId]);

  const activateEmergencyTracking = async () => {
    if (!transporterId) return;
    const success = await activateEnhancedTracking(
      transporterId,
      'failed_delivery',
      shipmentId,
      'emergency'
    );
    if (success) setTrackingActivated(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center text-orange-800">
          <span className="mr-2">⚠️</span>
          Unresponsive Transporter Tracking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {transporterInfo && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Company</p>
                <p className="text-lg">{transporterInfo.company_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Phone</p>
                <p className="flex items-center">{transporterInfo.phone || 'Not provided'}</p>
              </div>
            </div>
            <TransporterReferralInfo referredBy={transporterInfo.referred_by} />
            <div>
              <p className="text-sm font-medium text-gray-700">Active Shipments</p>
              <p className="text-lg">{transporterInfo.current_shipments.length}</p>
            </div>
          </div>
        )}

        <LastKnownLocationAlert lastKnownLocation={lastKnownLocation} />

        <EmergencyTrackingActions
          trackingActivated={trackingActivated}
          onActivate={activateEmergencyTracking}
        />

        <CurrentShipmentsList shipments={transporterInfo?.current_shipments || []} />
      </CardContent>
    </Card>
  );
};

export default UnresponsiveTransporterTracker;
