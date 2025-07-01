
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Clock } from 'lucide-react';
import { useAdvancedTracking } from '@/hooks/useAdvancedTracking';

interface LiveTrackingMapProps {
  shipmentId: string;
  pickupLocation: string;
  deliveryLocation: string;
}

const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  shipmentId,
  pickupLocation,
  deliveryLocation
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { currentLocation, tracking, startTracking, stopTracking } = useAdvancedTracking(shipmentId);

  useEffect(() => {
    // Initialize map here - using a placeholder for now
    // In production, you'd integrate with Google Maps, Mapbox, or similar
    if (mapRef.current && currentLocation) {
      // Update map with current location
      console.log('Updating map with location:', currentLocation);
    }
  }, [currentLocation]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Live Tracking
          </span>
          <Button
            onClick={tracking ? stopTracking : startTracking}
            variant={tracking ? "destructive" : "default"}
            size="sm"
          >
            {tracking ? "Stop Tracking" : "Start Tracking"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={mapRef}
          className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4"
        >
          {currentLocation ? (
            <div className="text-center">
              <Navigation className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="font-medium">Live Location</p>
              <p className="text-sm text-gray-600">
                {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
              </p>
              <p className="text-xs text-gray-500">
                Updated: {new Date(currentLocation.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2" />
              <p>Start tracking to see live location</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="font-medium">Pickup:</span>
            <span className="ml-2 text-gray-600">{pickupLocation}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
            <span className="font-medium">Delivery:</span>
            <span className="ml-2 text-gray-600">{deliveryLocation}</span>
          </div>

          {currentLocation && (
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-blue-500" />
              <span className="font-medium">Speed:</span>
              <span className="ml-2 text-gray-600">
                {currentLocation.speed ? `${Math.round(currentLocation.speed * 3.6)} km/h` : 'Unknown'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveTrackingMap;
