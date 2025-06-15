
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Clock } from "lucide-react";

interface LastKnownLocationAlertProps {
  lastKnownLocation: {
    latitude: number;
    longitude: number;
    timestamp: string;
  } | null;
}
const LastKnownLocationAlert: React.FC<LastKnownLocationAlertProps> = ({ lastKnownLocation }) => {
  const getTimeSinceLastSeen = () => {
    if (!lastKnownLocation?.timestamp) return 'Unknown';
    const lastSeen = new Date(lastKnownLocation.timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Less than 1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  if (!lastKnownLocation) return null;
  return (
    <Alert>
      <MapPin className="h-4 w-4" />
      <AlertDescription>
        <strong>Last Known Location:</strong><br/>
        Lat: {lastKnownLocation.latitude}, Lng: {lastKnownLocation.longitude}<br />
        <span className="flex items-center mt-1">
          <Clock className="h-3 w-3 mr-1" />
          {getTimeSinceLastSeen()}
        </span>
      </AlertDescription>
    </Alert>
  );
};
export default LastKnownLocationAlert;
