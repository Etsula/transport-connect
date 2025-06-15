
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InsuranceManagementProps {
  shipmentId: string;
  shipmentValue: number;
}

const InsuranceManagement: React.FC<InsuranceManagementProps> = ({ 
  shipmentId, 
  shipmentValue 
}) => {
  const [insurance, setInsurance] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // For now, set default state since table doesn't exist in types
    setInsurance(null);
  }, [shipmentId]);

  const purchaseInsurance = async () => {
    try {
      setLoading(true);
      const coverageAmount = shipmentValue * 1.2; // 120% of shipment value
      const premiumAmount = coverageAmount * 0.03; // 3% premium

      // Mock insurance purchase - in production this would use the shipment_insurance table
      const mockInsurance = {
        id: `mock-${Date.now()}`,
        shipment_id: shipmentId,
        insurance_provider: 'iShip Insurance',
        policy_number: `POL-${Date.now()}`,
        coverage_amount: coverageAmount,
        premium_amount: premiumAmount,
        coverage_start: new Date().toISOString(),
        coverage_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      };

      setInsurance(mockInsurance);

      toast({
        title: "Insurance purchased",
        description: "Your shipment is now covered by insurance"
      });
    } catch (error: any) {
      toast({
        title: "Purchase failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!insurance) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Shipment Insurance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">No Insurance Coverage</span>
            </div>
            <p className="text-sm text-yellow-700">
              Your shipment is not currently insured. Consider purchasing coverage for protection.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Shipment Value:</span>
              <span className="font-medium">${shipmentValue}</span>
            </div>
            <div className="flex justify-between">
              <span>Coverage Amount:</span>
              <span className="font-medium">${(shipmentValue * 1.2).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Premium (3%):</span>
              <span className="font-medium">${(shipmentValue * 1.2 * 0.03).toFixed(2)}</span>
            </div>
          </div>

          <Button onClick={purchaseInsurance} disabled={loading} className="w-full">
            {loading ? "Processing..." : "Purchase Insurance"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Insurance Coverage
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Policy Number</p>
            <p className="font-medium">{insurance.policy_number}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Provider</p>
            <p className="font-medium">{insurance.insurance_provider}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Coverage Amount</p>
            <p className="font-medium flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {insurance.coverage_amount}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Premium Paid</p>
            <p className="font-medium flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {insurance.premium_amount}
            </p>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-800">Coverage Active</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Your shipment is protected against loss, damage, and delays
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsuranceManagement;
