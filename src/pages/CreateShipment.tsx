
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CreateShipmentForm from "@/components/CreateShipmentForm";

const CreateShipment = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/auth");
      }
    };
    
    checkUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Create Shipment</h1>
          <p className="text-gray-600 mt-2">
            Fill out the form below to create a new shipment request
          </p>
        </div>
        <CreateShipmentForm />
      </div>
    </div>
  );
};

export default CreateShipment;
