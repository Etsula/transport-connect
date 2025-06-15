
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation, MapPin, Clock, CheckCircle, Circle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RouteWaypoint {
  id: string;
  sequence_order: number;
  latitude: number;
  longitude: number;
  instruction: string;
  distance_to_next: number;
  estimated_time_minutes: number;
  is_completed: boolean;
  completed_at?: string;
}

interface TurnByTurnNavigationProps {
  shipmentId: string;
}

const TurnByTurnNavigation: React.FC<TurnByTurnNavigationProps> = ({ shipmentId }) => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const [waypoints, setWaypoints] = useState<RouteWaypoint[]>([]);
  const [currentWaypoint, setCurrentWaypoint] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (shipmentId) {
      fetchRouteWaypoints();
    }
  }, [shipmentId]);

  const fetchRouteWaypoints = async () => {
    try {
      const { data, error } = await supabase
        .from('route_waypoints')
        .select('*')
        .eq('shipment_id', shipmentId)
        .eq('transporter_id', userData.id)
        .order('sequence_order');

      if (error) throw error;
      setWaypoints(data || []);
      
      // Find current waypoint (first incomplete one)
      const current = data?.findIndex(wp => !wp.is_completed) || 0;
      setCurrentWaypoint(current);
    } catch (error) {
      console.error('Error fetching waypoints:', error);
    }
  };

  const generateRoute = async () => {
    try {
      // Mock route generation - in production this would use a routing service
      const mockWaypoints = [
        {
          shipment_id: shipmentId,
          transporter_id: userData.id!,
          sequence_order: 1,
          latitude: 51.5074,
          longitude: -0.1278,
          instruction: "Head north on Main Street",
          distance_to_next: 0.5,
          estimated_time_minutes: 3
        },
        {
          shipment_id: shipmentId,
          transporter_id: userData.id!,
          sequence_order: 2,
          latitude: 51.5084,
          longitude: -0.1268,
          instruction: "Turn right onto High Street",
          distance_to_next: 1.2,
          estimated_time_minutes: 7
        },
        {
          shipment_id: shipmentId,
          transporter_id: userData.id!,
          sequence_order: 3,
          latitude: 51.5094,
          longitude: -0.1258,
          instruction: "Arrive at destination",
          distance_to_next: 0,
          estimated_time_minutes: 0
        }
      ];

      const { error } = await supabase
        .from('route_waypoints')
        .insert(mockWaypoints);

      if (error) throw error;

      toast({
        title: "Route generated",
        description: "Turn-by-turn navigation is ready"
      });

      fetchRouteWaypoints();
    } catch (error) {
      console.error('Error generating route:', error);
      toast({
        title: "Route generation failed",
        description: "Failed to generate navigation route",
        variant: "destructive"
      });
    }
  };

  const completeWaypoint = async (waypointId: string) => {
    try {
      const { error } = await supabase
        .from('route_waypoints')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', waypointId);

      if (error) throw error;

      toast({
        title: "Waypoint completed",
        description: "Moving to next navigation step"
      });

      fetchRouteWaypoints();
    } catch (error) {
      console.error('Error completing waypoint:', error);
    }
  };

  const startNavigation = () => {
    setIsNavigating(true);
    toast({
      title: "Navigation started",
      description: "Follow the turn-by-turn instructions"
    });
  };

  if (waypoints.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Turn-by-Turn Navigation
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-500 mb-4">No route generated yet</p>
          <Button onClick={generateRoute}>
            Generate Route
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Turn-by-Turn Navigation
            {isNavigating && <Badge className="bg-blue-100 text-blue-800">Active</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isNavigating ? (
            <Button onClick={startNavigation} className="w-full">
              Start Navigation
            </Button>
          ) : (
            <div className="space-y-4">
              {/* Current instruction */}
              {waypoints[currentWaypoint] && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Navigation className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Current Step</span>
                  </div>
                  <p className="text-lg font-medium">
                    {waypoints[currentWaypoint].instruction}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>Distance: {waypoints[currentWaypoint].distance_to_next} km</span>
                    <span>Time: {waypoints[currentWaypoint].estimated_time_minutes} min</span>
                  </div>
                  <Button 
                    onClick={() => completeWaypoint(waypoints[currentWaypoint].id)}
                    className="mt-3"
                    size="sm"
                  >
                    Complete Step
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Route Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {waypoints.map((waypoint, index) => (
              <div 
                key={waypoint.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  waypoint.is_completed 
                    ? 'bg-green-50 border-green-200' 
                    : index === currentWaypoint 
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50'
                }`}
              >
                {waypoint.is_completed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
                
                <div className="flex-1">
                  <p className="font-medium">{waypoint.instruction}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {waypoint.distance_to_next} km
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {waypoint.estimated_time_minutes} min
                    </span>
                  </div>
                </div>
                
                <Badge variant="outline">
                  Step {waypoint.sequence_order}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TurnByTurnNavigation;
