
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { useUserQualifications } from '@/hooks/useUserQualifications';

const ReferralEligibilityBanner: React.FC = () => {
  const { qualifications, loading, getReferralRequirements } = useUserQualifications();
  
  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const requirements = getReferralRequirements();

  if (requirements.isEligible) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-green-800">Referral Program Eligible</h3>
                <Badge className="bg-green-600">Qualified</Badge>
              </div>
              <p className="text-sm text-green-700">
                You can now earn commissions by referring new users to the platform!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-full">
            <AlertCircle className="h-6 w-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-orange-800">Referral Eligibility Progress</h3>
              <Badge variant="outline" className="border-orange-300 text-orange-700">
                In Progress
              </Badge>
            </div>
            <p className="text-sm text-orange-700 mb-3">
              Complete more jobs with high ratings to unlock referral earning opportunities
            </p>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Completed Jobs
                  </span>
                  <span className="font-medium">
                    {requirements.currentJobs} / {requirements.minJobs}
                  </span>
                </div>
                <Progress 
                  value={(requirements.currentJobs / requirements.minJobs) * 100} 
                  className="h-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    Average Rating
                  </span>
                  <span className="font-medium">
                    {requirements.currentRating.toFixed(1)} / {requirements.minRating}
                  </span>
                </div>
                <Progress 
                  value={(requirements.currentRating / requirements.minRating) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralEligibilityBanner;
