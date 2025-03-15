
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, AlertTriangle, MessageSquare, Route } from "lucide-react";

interface TrackingPoint {
  location: string;
  timestamp: string;
  status: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface ShipmentTrackingProps {
  shipmentId: string;
  currentStatus: string;
  trackingPoints: TrackingPoint[];
  progress: number;
}

const ShipmentTracking = ({
  shipmentId,
  currentStatus,
  trackingPoints,
  progress,
}: ShipmentTrackingProps) => {
  const [showRouteOptions, setShowRouteOptions] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would implement sending the message to the transporter
      console.log(`Sending message for shipment ${shipmentId}: ${message}`);
      setMessage("");
    }
  };

  const handleSuggestRouteChange = () => {
    // Here you would implement the route change suggestion logic
    console.log(`Suggesting route change for shipment ${shipmentId}`);
    setShowRouteOptions(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>Shipment Tracking <span className="text-primary">#{shipmentId.slice(-6)}</span></div>
          <span className={`text-sm px-2 py-1 rounded-full ${
            currentStatus === "Delivered" 
              ? "bg-green-100 text-green-800" 
              : currentStatus === "In Transit" 
                ? "bg-blue-100 text-blue-800"
                : "bg-yellow-100 text-yellow-800"
          }`}>
            {currentStatus}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Shipment Progress</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-4 mt-6">
          {trackingPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className={`mt-1 p-2 rounded-full ${
                point.status === "Delivered" 
                  ? "bg-green-100 text-green-800" 
                  : point.status === "In Transit" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-yellow-100 text-yellow-800"
              }`}>
                <MapPin className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">{point.location}</p>
                  <p className="text-sm text-gray-500">{point.timestamp}</p>
                </div>
                <p className="text-sm text-gray-600">{point.status}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-6">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => setShowRouteOptions(!showRouteOptions)}
          >
            <Route className="mr-2 h-4 w-4" />
            {showRouteOptions ? "Cancel" : "Suggest Route Change"}
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => window.open(`/messages/${shipmentId}`, "_blank")}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Message Transporter
          </Button>
        </div>

        {showRouteOptions && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
              Suggest Alternative Route
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              Notify the transporter about traffic, road closures, or better routes.
            </p>
            <div className="flex gap-2 mt-3">
              <Input 
                placeholder="Describe the issue and suggest a new route"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSuggestRouteChange}>
                <Navigation className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Message Transporter</h4>
          <div className="flex gap-2">
            <Input 
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSendMessage}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentTracking;
