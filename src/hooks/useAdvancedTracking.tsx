
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LocationUpdate {
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy?: number;
  speed?: number;
}

export const useAdvancedTracking = (shipmentId: string) => {
  const [currentLocation, setCurrentLocation] = useState<LocationUpdate | null>(null);
  const [locationHistory, setLocationHistory] = useState<LocationUpdate[]>([]);
  const [tracking, setTracking] = useState(false);
  const { toast } = useToast();

  const startTracking = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Error",
        description: "Geolocation is not supported by this browser",
        variant: "destructive"
      });
      return;
    }

    setTracking(true);
    
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const location: LocationUpdate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date().toISOString(),
          accuracy: position.coords.accuracy,
          speed: position.coords.speed || undefined
        };

        setCurrentLocation(location);
        setLocationHistory(prev => [...prev, location]);

        // Save to database
        try {
          await supabase.from('shipment_tracking').insert({
            shipment_id: shipmentId,
            latitude: location.latitude,
            longitude: location.longitude,
            status: 'in_transit',
            location: `${location.latitude}, ${location.longitude}`,
            updated_by: (await supabase.auth.getUser()).data.user?.id
          });
        } catch (error) {
          console.error('Failed to save location:', error);
        }
      },
      (error) => {
        toast({
          title: "Location Error",
          description: error.message,
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      setTracking(false);
    };
  };

  const stopTracking = () => {
    setTracking(false);
  };

  const getEstimatedArrival = (destinationLat: number, destinationLng: number) => {
    if (!currentLocation) return null;

    const distance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      destinationLat,
      destinationLng
    );

    const averageSpeed = currentLocation.speed || 50; // km/h default
    const estimatedHours = distance / averageSpeed;
    
    return new Date(Date.now() + estimatedHours * 60 * 60 * 1000);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return {
    currentLocation,
    locationHistory,
    tracking,
    startTracking,
    stopTracking,
    getEstimatedArrival
  };
};
