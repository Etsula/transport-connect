
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ShipmentData {
  id: string;
  title: string;
  pickup_location: string;
  delivery_location: string;
  created_at: string;
  status: string;
  is_international: boolean;
  shipper_id: string;
  profiles: {
    company_name: string | null;
  } | null;
}

interface UserData {
  userType: string;
  id: string | null;
}

export const useShipmentMessages = (shipmentId?: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState<ShipmentData[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentData | null>(null);
  const [userData, setUserData] = useState<UserData>({
    userType: "shipper",
    id: null
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          navigate("/auth");
          return;
        }
        
        const userId = sessionData.session.user.id;
        
        // Fetch user profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", userId)
          .single();
          
        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          toast({
            title: "Error",
            description: "Could not fetch your profile data",
            variant: "destructive",
          });
          return;
        }
        
        setUserData({
          userType: profileData.user_type,
          id: userId
        });

        // Use a more direct approach to avoid type issues
        const selectClause = "id, title, pickup_location, delivery_location, created_at, status, is_international, shipper_id, profiles:shipper_id(company_name)";
        
        // Start with a basic query and build from there
        let queryBuilder = supabase.from("shipments").select(selectClause);
        
        // Apply ordering - separate this to simplify the typing
        queryBuilder = queryBuilder.order("created_at", { ascending: false });
        
        // Apply filters based on user type
        if (profileData.user_type === "shipper") {
          queryBuilder = queryBuilder.eq("shipper_id", userId);
        } else if (profileData.user_type === "transporter") {
          // For transporters, fetch accepted shipments
          queryBuilder = queryBuilder.eq("assigned_transporter_id", userId);
        }
        
        // Execute the query
        const { data, error } = await queryBuilder;
        
        if (error) {
          console.error("Error fetching shipments:", error);
          toast({
            title: "Error",
            description: "Could not fetch your shipments",
            variant: "destructive",
          });
          return;
        }
        
        if (Array.isArray(data)) {
          // Use a more forceful type assertion to bypass the deep instantiation
          const typedData = data as any as ShipmentData[];
          setShipments(typedData);
          
          // Initialize the selected shipment
          if (shipmentId && typedData.length > 0) {
            const shipment = typedData.find(s => s.id === shipmentId);
            if (shipment) {
              setSelectedShipment(shipment);
            } else if (typedData.length > 0) {
              setSelectedShipment(typedData[0]);
            }
          } else if (typedData.length > 0) {
            setSelectedShipment(typedData[0]);
          }
        } else {
          setShipments([]);
        }
      } catch (error) {
        console.error("Messaging data fetch error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate, shipmentId, toast]);

  return {
    loading,
    shipments,
    selectedShipment,
    userData,
    setSelectedShipment
  };
};
