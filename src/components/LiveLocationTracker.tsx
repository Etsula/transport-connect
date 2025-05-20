
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CircleSlash, MapPin, Info } from "lucide-react";

interface LiveLocationTrackerProps {
  transporterId: string;
  shipmentId?: string;
}

const LiveLocationTracker = ({ transporterId, shipmentId }: LiveLocationTrackerProps) => {
  const [isTracking, setIsTracking] = useState(false);
  const [locationUpdates, setLocationUpdates] = useState<{
    lat: number;
    lng: number;
    timestamp: string;
  } | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if location tracking is already enabled for this transporter
    const checkTrackingStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('transporter_locations')
          .select('is_tracking')
          .eq('transporter_id', transporterId)
          .single();
        
        if (!error && data) {
          setIsTracking(data.is_tracking || false);
        }
      } catch (error) {
        console.error("Error checking tracking status:", error);
      }
    };
    
    checkTrackingStatus();
    
    // Setup channel to listen for location updates
    if (shipmentId) {
      const channel = supabase
        .channel('transporter-location')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'transporter_locations',
            filter: `shipment_id=eq.${shipmentId}`
          },
          (payload: any) => {
            setLocationUpdates({
              lat: payload.new.latitude,
              lng: payload.new.longitude,
              timestamp: new Date().toLocaleTimeString()
            });
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [transporterId, shipmentId]);

  const startTracking = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location tracking",
        variant: "destructive",
      });
      return;
    }

    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Update the transporter's location in the database
          const { error } = await supabase.from('transporter_locations').upsert([
            {
              transporter_id: transporterId,
              latitude,
              longitude,
              timestamp: new Date().toISOString(),
              is_tracking: true,
              shipment_id: shipmentId,
              accuracy: position.coords.accuracy
            }
          ], { onConflict: 'transporter_id' });
          
          if (error) throw error;
          
          setIsTracking(true);
          setLocationUpdates({
            lat: latitude,
            lng: longitude,
            timestamp: new Date().toLocaleTimeString()
          });
        } catch (error: any) {
          console.error("Error updating location:", error);
          toast({
            title: "Error updating location",
            description: error.message || "An error occurred while updating your location",
            variant: "destructive",
          });
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        toast({
          title: "Location error",
          description: error.message || "An error occurred while getting your location",
          variant: "destructive",
        });
        stopTracking();
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000
      }
    );
    
    setWatchId(id);
  };

  const stopTracking = async () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    
    try {
      await supabase.from('transporter_locations').update({
        is_tracking: false
      }).eq('transporter_id', transporterId);
      
      setIsTracking(false);
      toast({
        title: "Tracking disabled",
        description: "Your location is no longer being tracked",
      });
    } catch (error) {
      console.error("Error updating tracking status:", error);
    }
  };

  const toggleTracking = () => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Live Location Tracking</span>
          <Switch
            checked={isTracking}
            onCheckedChange={toggleTracking}
            aria-label="Toggle location tracking"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isTracking ? (
            <div className="bg-green-50 p-3 rounded-md border border-green-200">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="font-medium text-green-800">Location tracking active</p>
                  {locationUpdates && (
                    <p className="text-sm text-green-700">
                      Last update: {locationUpdates.timestamp}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <div className="flex items-center">
                <CircleSlash className="h-5 w-5 text-gray-500 mr-2" />
                <p className="text-gray-600">Location tracking is disabled</p>
              </div>
            </div>
          )}
          
          <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
            <div className="flex">
              <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">How tracking works:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Your location is only shared while you're on duty</li>
                  <li>Only shippers with active shipments can see your location</li>
                  <li>Turn off tracking when you're not transporting goods</li>
                  <li>Battery consumption may increase while tracking is active</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={stopTracking}
              disabled={!isTracking}
            >
              Stop Tracking
            </Button>
            
            <Button
              variant={isTracking ? "outline" : "default"}
              size="sm"
              onClick={startTracking}
              disabled={isTracking}
            >
              {isTracking ? "Tracking Active" : "Start Tracking"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveLocationTracker;
