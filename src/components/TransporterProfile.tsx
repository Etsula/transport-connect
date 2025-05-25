
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Star, Shield, AlertTriangle, Phone, MessageSquare, MapPin, Truck, Clock, Award } from "lucide-react";
import LiveLocationTracker from "@/components/LiveLocationTracker";
import { useToast } from "@/hooks/use-toast";

interface TransporterProfileProps {
  transporterId: string;
  onContactRequest?: () => void;
}

interface TransporterData {
  id: string;
  company_name: string;
  created_at: string;
  phone: string;
  verification_status: string;
  rating_average: number;
  completed_shipments: number;
  successful_deliveries: number;
  vehicle_types: string[];
  specialties: string[];
  recent_locations: string[];
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_id: string;
  shipment_id: string;
  reviewer_profile?: {
    company_name: string | null;
  };
}

const TransporterProfile = ({ transporterId, onContactRequest }: TransporterProfileProps) => {
  const [transporter, setTransporter] = useState<TransporterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransporterData = async () => {
      try {
        // Fetch basic profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, company_name, created_at, phone")
          .eq("id", transporterId)
          .single();
          
        if (profileError) throw profileError;
        
        // Fetch verification status
        const { data: verificationData, error: verificationError } = await supabase
          .from("verification")
          .select("status")
          .eq("user_id", transporterId)
          .single();
          
        const verificationStatus = verificationError ? "unverified" : verificationData?.status || "unverified";
        
        // Fetch completed shipments
        const { count: completedShipments } = await supabase
          .from("shipments")
          .select("id", { count: 'exact' })
          .eq("assigned_transporter_id", transporterId)
          .eq("status", "completed");
          
        // Fetch successful deliveries (on-time)
        const { count: successfulDeliveries } = await supabase
          .from("shipments")
          .select("id", { count: 'exact' })
          .eq("assigned_transporter_id", transporterId)
          .eq("status", "completed")
          .eq("delivered_on_time", true);

        // Fetch reviews and calculate average rating
        const { data: reviewsData } = await supabase
          .from("reviews")
          .select("rating")
          .eq("reviewed_id", transporterId);

        let ratingAverage = 0;
        if (reviewsData && reviewsData.length > 0) {
          const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
          ratingAverage = totalRating / reviewsData.length;
        }
          
        // Combine the data
        setTransporter({
          id: profileData.id,
          company_name: profileData.company_name || "Unnamed Transporter",
          created_at: profileData.created_at,
          phone: profileData.phone || "",
          verification_status: verificationStatus,
          rating_average: ratingAverage,
          completed_shipments: completedShipments || 0,
          successful_deliveries: successfulDeliveries || 0,
          vehicle_types: ["Truck", "Van", "Motorcycle"], // This would come from a vehicles table
          specialties: ["Fragile Items", "Express Delivery", "International"], // This would come from a specialties table
          recent_locations: ["Nairobi", "Mombasa", "Kisumu"] // This would come from tracking history
        });
        
        // Fetch reviews with reviewer information
        const { data: reviewsWithProfiles } = await supabase
          .from("reviews")
          .select(`
            id, 
            rating, 
            comment, 
            created_at,
            reviewer_id,
            shipment_id
          `)
          .eq("reviewed_id", transporterId)
          .order("created_at", { ascending: false })
          .limit(5);
          
        if (reviewsWithProfiles) {
          // Fetch reviewer profiles separately
          const reviewerIds = reviewsWithProfiles.map(review => review.reviewer_id);
          const { data: reviewerProfiles } = await supabase
            .from("profiles")
            .select("id, company_name")
            .in("id", reviewerIds);

          // Combine reviews with profiles
          const enhancedReviews: Review[] = reviewsWithProfiles.map(review => ({
            ...review,
            reviewer_profile: reviewerProfiles?.find(profile => profile.id === review.reviewer_id) || null
          }));

          setReviews(enhancedReviews);
        }
      } catch (error) {
        console.error("Error fetching transporter data:", error);
        toast({
          title: "Error",
          description: "Failed to load transporter information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransporterData();
  }, [transporterId, toast]);

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ));
  };

  const renderVerificationBadge = () => {
    if (!transporter) return null;
    
    switch (transporter.verification_status) {
      case "verified":
        return (
          <Badge className="bg-green-500">
            <Shield className="h-3 w-3 mr-1" /> Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500">
            <Clock className="h-3 w-3 mr-1" /> Verification Pending
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500">
            <AlertTriangle className="h-3 w-3 mr-1" /> Unverified
          </Badge>
        );
    }
  };

  const handleRequestContact = () => {
    setShowContactInfo(true);
    if (onContactRequest) {
      onContactRequest();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-md mb-4"></div>
            <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-6"></div>
            <div className="h-20 bg-gray-200 rounded-md"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!transporter) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p>Transporter information not available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            {transporter.company_name}
          </CardTitle>
          {renderVerificationBadge()}
        </div>
        <div className="flex items-center gap-1 mt-2">
          {renderStars(transporter.rating_average)}
          <span className="text-sm ml-2">
            ({transporter.rating_average.toFixed(1)}/5.0)
          </span>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-500">Completed Shipments</p>
                <p className="text-xl font-bold">{transporter.completed_shipments}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-500">On-time Rate</p>
                <p className="text-xl font-bold">
                  {transporter.completed_shipments > 0 
                    ? Math.round((transporter.successful_deliveries / transporter.completed_shipments) * 100)
                    : 0}%
                </p>
              </div>
              
              <div className="col-span-2 bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-500 mb-1">Vehicle Types</p>
                <div className="flex flex-wrap gap-2">
                  {transporter.vehicle_types.map((vehicle, idx) => (
                    <Badge key={idx} variant="outline" className="bg-white">
                      {vehicle}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="col-span-2 bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-500 mb-1">Specialties</p>
                <div className="flex flex-wrap gap-2">
                  {transporter.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="outline" className="bg-white">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="col-span-2 bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-500 mb-1">Recent Locations</p>
                <div className="flex flex-wrap gap-2">
                  {transporter.recent_locations.map((location, idx) => (
                    <div key={idx} className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                      <span className="text-sm">{location}</span>
                      {idx < transporter.recent_locations.length - 1 && (
                        <span className="mx-1 text-gray-300">•</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              {showContactInfo ? (
                <div className="border rounded-md p-4">
                  <p className="font-medium mb-2">Contact Information</p>
                  <div className="flex items-center mb-2">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <a href={`tel:${transporter.phone}`} className="text-primary">
                      {transporter.phone || "No phone number available"}
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.open(`https://wa.me/${transporter.phone?.replace(/\D/g, '')}`, '_blank')}
                      disabled={!transporter.phone}
                    >
                      WhatsApp
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1" 
                      onClick={() => window.open(`sms:${transporter.phone}`, '_blank')}
                      disabled={!transporter.phone}
                    >
                      Text Message
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  className="w-full"
                  onClick={handleRequestContact}
                  disabled={transporter.verification_status !== "verified"}
                >
                  {transporter.verification_status !== "verified" ? (
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Unverified Transporter
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Request Contact Information
                    </div>
                  )}
                </Button>
              )}
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              <div className="flex items-center">
                <Award className="h-3 w-3 mr-1 text-primary" />
                <span>Member since {new Date(transporter.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-4 mt-4">
            {reviews.length > 0 ? (
              <>
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-3 last:border-0">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <p className="font-medium">{review.reviewer_profile?.company_name || "Anonymous"}</p>
                      </div>
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-sm">{review.comment || "No comment provided."}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No reviews yet</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="location" className="space-y-4 mt-4">
            <LiveLocationTracker transporterId={transporterId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TransporterProfile;
