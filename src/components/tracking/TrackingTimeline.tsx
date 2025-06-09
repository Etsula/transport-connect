
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, User } from 'lucide-react';
import { useShipmentTracking } from '@/hooks/useShipmentTracking';
import { formatDistanceToNow } from 'date-fns';

interface TrackingTimelineProps {
  shipmentId: string;
}

const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ shipmentId }) => {
  const { trackingHistory, loading } = useShipmentTracking(shipmentId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tracking History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Tracking History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {trackingHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No tracking updates yet
          </div>
        ) : (
          <div className="space-y-4">
            {trackingHistory.map((update, index) => (
              <div key={update.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-primary' : 'bg-muted'
                  }`} />
                  {index < trackingHistory.length - 1 && (
                    <div className="w-0.5 h-8 bg-muted mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={index === 0 ? 'default' : 'secondary'}>
                      {update.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  {update.location && (
                    <p className="text-sm font-medium">{update.location}</p>
                  )}
                  {update.notes && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {update.notes}
                    </p>
                  )}
                  {update.latitude && update.longitude && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Coordinates: {update.latitude.toFixed(6)}, {update.longitude.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrackingTimeline;
