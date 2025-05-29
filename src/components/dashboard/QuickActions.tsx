
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  userType: string;
}

const QuickActions = ({ userType }: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {userType === "shipper" && (
        <Link to="/create-shipment">
          <Button className="w-full bg-primary hover:bg-primary/90">
            Create New Shipment
          </Button>
        </Link>
      )}
      {userType === "transporter" && (
        <Link to="/find-shipments">
          <Button className="w-full bg-primary hover:bg-primary/90">
            Find Available Shipments
          </Button>
        </Link>
      )}
      <Link to="/international-shipping">
        <Button variant="outline" className="w-full">
          International Shipping Options
        </Button>
      </Link>
      <Link to="/messaging">
        <Button variant="outline" className="w-full">
          Message Center
        </Button>
      </Link>
      <Link to="/subscription">
        <Button variant="outline" className="w-full">
          Subscription & API Management
        </Button>
      </Link>
    </div>
  );
};

export default QuickActions;
