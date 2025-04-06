
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MessagingStateDisplayProps {
  loading: boolean;
  hasShipments: boolean;
}

const MessagingStateDisplay = ({ loading, hasShipments }: MessagingStateDisplayProps) => {
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <p>Loading messages...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!hasShipments) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="mb-4">You don't have any shipments to message about yet.</p>
            <Button onClick={() => navigate("/create-shipment")}>
              Create a Shipment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return null;
};

export default MessagingStateDisplay;
