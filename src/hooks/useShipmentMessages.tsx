
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
          return;
        }
        
        setUserData({
          userType: profileData.user_type,
          id: userId
        });

        // Fetch shipments based on user type
        let query = supabase
          .from("shipments")
          .select(`
            id, 
            title, 
            pickup_location, 
            delivery_location, 
            created_at, 
            status, 
            is_international, 
            shipper_id,
            profiles(company_name)
          `)
          .order("created_at", { ascending: false });
          
        // Filter based on user type
        if (profileData.user_type === "shipper") {
          query = query.eq("shipper_id", userId);
        } else {
          // For transporters, we need to check what column actually exists
          // Assuming there's a column for transporters - adjust this based on your schema
          query = query.eq("shipper_id", userId); // Change this to the correct filter
        }
          
        const { data, error } = await query;
          
        if (error) {
          console.error("Error fetching shipments:", error);
          return;
        }
        
        // Type assertion after we've validated the data exists
        const typedData = data as ShipmentData[];
        setShipments(typedData || []);
        
        // Initialize the selected shipment
        if (shipmentId && typedData.length > 0) {
          const shipment = typedData.find(s => s.id === shipmentId);
          if (shipment) {
            setSelectedShipment(shipment);
          } else {
            navigate("/messaging");
          }
        } else if (typedData.length > 0) {
          setSelectedShipment(typedData[0]);
        }
      } catch (error) {
        console.error("Messaging data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate, shipmentId]);

  return {
    loading,
    shipments,
    selectedShipment,
    userData,
    setSelectedShipment
  };
};
