
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserQualifications {
  total_completed_jobs: number;
  average_rating: number;
  total_reviews: number;
  is_referral_eligible: boolean;
  last_qualification_check: string;
}

export const useUserQualifications = (userId?: string) => {
  const { userData } = useAuth();
  const [qualifications, setQualifications] = useState<UserQualifications | null>(null);
  const [loading, setLoading] = useState(true);

  const targetUserId = userId || userData.id;

  useEffect(() => {
    if (targetUserId) {
      fetchQualifications();
    }
  }, [targetUserId]);

  const fetchQualifications = async () => {
    try {
      setLoading(true);
      
      // Calculate qualifications from reviews table
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('rating, shipment_id')
        .eq('reviewed_id', targetUserId);

      if (error) throw error;

      const totalReviews = reviews?.length || 0;
      const averageRating = totalReviews > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;
      
      // Count unique shipments as completed jobs
      const uniqueShipments = new Set(reviews?.map(r => r.shipment_id) || []);
      const totalJobs = uniqueShipments.size;

      const qualificationsData: UserQualifications = {
        total_completed_jobs: totalJobs,
        average_rating: Math.round(averageRating * 100) / 100,
        total_reviews: totalReviews,
        is_referral_eligible: totalJobs >= 10 && averageRating >= 4.5,
        last_qualification_check: new Date().toISOString()
      };

      setQualifications(qualificationsData);
    } catch (error) {
      console.error('Error fetching user qualifications:', error);
      // Set default values if error
      setQualifications({
        total_completed_jobs: 0,
        average_rating: 0,
        total_reviews: 0,
        is_referral_eligible: false,
        last_qualification_check: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const isEligibleForReferrals = () => {
    return qualifications?.is_referral_eligible || false;
  };

  const getReferralRequirements = () => {
    const requirements = {
      minJobs: 10,
      minRating: 4.5,
      currentJobs: qualifications?.total_completed_jobs || 0,
      currentRating: qualifications?.average_rating || 0
    };

    return {
      ...requirements,
      jobsNeeded: Math.max(0, requirements.minJobs - requirements.currentJobs),
      ratingNeeded: Math.max(0, requirements.minRating - requirements.currentRating),
      isEligible: requirements.currentJobs >= requirements.minJobs && 
                 requirements.currentRating >= requirements.minRating
    };
  };

  return {
    qualifications,
    loading,
    isEligibleForReferrals,
    getReferralRequirements,
    refreshQualifications: fetchQualifications
  };
};
