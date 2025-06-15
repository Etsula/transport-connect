
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Search } from "lucide-react";

interface EmergencyTrackingActionsProps {
  trackingActivated: boolean;
  onActivate: () => void;
}
const EmergencyTrackingActions: React.FC<EmergencyTrackingActionsProps> = ({
  trackingActivated,
  onActivate,
}) => {
  return (
    <div className="space-y-3">
      <h4 className="font-medium">Tracking Actions</h4>
      {!trackingActivated ? (
        <Button
          onClick={onActivate}
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
  );
};
export default EmergencyTrackingActions;
