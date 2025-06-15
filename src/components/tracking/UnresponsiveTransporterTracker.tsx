
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useConditionalTracking } from '@/hooks/useConditionalTracking';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, MapPin, Phone, Clock, Search } from 'lucide-react';

interface TransporterInfo {
  id: string;
  company_name: string;
  phone: string;
  last_seen?: string;
  current_shipments: any[];
  referred_by?: string;
}

interface UnresponsiveTransporterTrackerProps {
  transporterId?: string;
  shipmentId?: string;
}

const UnresponsiveTransporterTracker = ({ 
  transporterId, 
  shipmentId 
}: UnresponsiveTransporterTrackerProps) => {
  const { activateEnhancedTracking, trackingStates } = useConditionalTracking();
  const [transporterInfo, setTransporterInfo] = useState<TransporterInfo | null>(null);
  const [lastKnownLocation, setLastKnownLocation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [trackingActivated, setTrackingActivated] = useState(false);

  useEffect(() => {
    if (transporterId) {
      fetchTransporterInfo();
      fetchLastKnownLocation();
    }
  }, [transporterId]);

  const fetchTransporterInfo = async () => {
    if (!transporterId) return;

    try {
      setLoading(true);
      
      // Get transporter profile and referral info
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, company_name, phone')
        .eq('id', transporterId)
        .single();

      if (profileError) throw profileError;

      // Get who referred this transporter
      const { data: referralData } = await supabase
        .from('referrals')
        .select('referrer_id, profiles!referrer_id(company_name)')
        .eq('referred_user_id', transporterId)
        .limit(1);

      // Get active shipments
      const { data: shipments } = await supabase
        .from('shipments')
        .select('id, title, status, created_at')
        .eq('assigned_transporter_id', transporterId)
        .in('status', ['assigned', 'in_transit', 'picked_up']);

      setTransporterInfo({
        ...profile,
        current_shipments: shipments || [],
        referred_by: referralData?.[0]?.profiles?.company_name
      });

    } catch (error) {
      console.error('Error fetching transporter info:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLastKnownLocation = async () => {
    if (!transporterId) return;

    try {
      const { data: location } = await supabase
        .from('transporter_locations')
        .select('latitude, longitude, timestamp, shipment_id')
        .eq('transporter_id', transporterId)
        .order('timestamp', { ascending: false })
        .limit(1);

      if (location && location[0]) {
        setLastKnownLocation(location[0]);
      }
    } catch (error) {
      console.error('Error fetching last known location:', error);
    }
  };

  const activateEmergencyTracking = async () => {
    if (!transporterId) return;

    const success = await activateEnhancedTracking(
      transporterId,
      'failed_delivery',
      shipmentId,
      'emergency'
    );

    if (success) {
      setTrackingActivated(true);
    }
  };

  const getTimeSinceLastSeen = () => {
    if (!lastKnownLocation?.timestamp) return 'Unknown';
    
    const lastSeen = new Date(lastKnownLocation.timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Less than 1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
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
          <AlertTriangle className="h-5 w-5 mr-2" />
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
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  {transporterInfo.phone || 'Not provided'}
                </p>
              </div>
            </div>

            {transporterInfo.referred_by && (
              <div>
                <p className="text-sm font-medium text-gray-700">Referred By</p>
                <p className="text-blue-600">{transporterInfo.referred_by}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-700">Active Shipments</p>
              <p className="text-lg">{transporterInfo.current_shipments.length}</p>
            </div>
          </div>
        )}

        {lastKnownLocation && (
          <Alert>
            <MapPin className="h-4 w-4" />
            <AlertDescription>
              <strong>Last Known Location:</strong><br />
              Lat: {lastKnownLocation.latitude}, Lng: {lastKnownLocation.longitude}<br />
              <span className="flex items-center mt-1">
                <Clock className="h-3 w-3 mr-1" />
                {getTimeSinceLastSeen()}
              </span>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <h4 className="font-medium">Tracking Actions</h4>
          
          {!trackingActivated ? (
            <Button 
              onClick={activateEmergencyTracking}
              variant="destructive"
              className="w-full"
            >
              <Search className="h-4 w-4 mr-2" />
              Activate Emergency Tracking
            </Button>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Emergency tracking has been activated. The transporter will be monitored
                and you'll receive updates on their location and activity.
              </AlertDescription>
            </Alert>
          )}

          <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
            <p className="font-medium mb-1">Emergency Tracking Includes:</p>
            <ul className="space-y-1">
              <li>• Real-time location monitoring</li>
              <li>• Contact attempt logging</li>
              <li>• Automatic alerts for movement</li>
              <li>• Admin notification for intervention</li>
            </ul>
          </div>
        </div>

        {transporterInfo?.current_shipments && transporterInfo.current_shipments.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Current Shipments</h4>
            <div className="space-y-2">
              {transporterInfo.current_shipments.map((shipment) => (
                <div key={shipment.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">{shipment.title}</span>
                  <Badge variant="outline">{shipment.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnresponsiveTransporterTracker;
