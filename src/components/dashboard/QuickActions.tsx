
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  userType: string;
}

const QuickActions = ({ userType }: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Link to="/marketplace">
        <Button className="w-full bg-primary hover:bg-primary/90">
          Browse Marketplace
        </Button>
      </Link>
      
      {userType === "shipper" && (
        <Link to="/create-shipment">
          <Button className="w-full bg-primary hover:bg-primary/90">
            Post New Shipment
          </Button>
        </Link>
      )}
      
      {userType === "transporter" && (
        <>
          <Link to="/find-shipments">
            <Button className="w-full bg-primary hover:bg-primary/90">
              Find Available Jobs
            </Button>
          </Link>
          <Link to="/earnings">
            <Button variant="outline" className="w-full">
              View Earnings
            </Button>
          </Link>
        </>
      )}
      
      <Link to="/referrals">
        <Button variant="outline" className="w-full">
          Referral Program
        </Button>
      </Link>
      
      <Link to="/international-shipping">
        <Button variant="outline" className="w-full">
          International Options
        </Button>
      </Link>
      
      <Link to="/subscription">
        <Button variant="outline" className="w-full">
          API & Subscription
        </Button>
      </Link>
      
      <Link to="/developer-portal">
        <Button variant="outline" className="w-full">
          Developer Tools
        </Button>
      </Link>
    </div>
  );
};

export default QuickActions;
