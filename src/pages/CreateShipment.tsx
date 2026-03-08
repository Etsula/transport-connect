
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CreateShipmentForm from "@/components/CreateShipmentForm";
import Disclaimers from "@/components/disclaimers/Disclaimers";

const CreateShipment = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/auth");
      }
    };
    
    checkUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Create Shipment</h1>
          <p className="text-muted-foreground mt-2">
            Fill out the form below to create a new shipment request
          </p>
        </div>
        <CreateShipmentForm />
        <div className="mt-8 max-w-2xl mx-auto">
          <Disclaimers type="liability" compact />
        </div>
      </div>
    </div>
  );
};

export default CreateShipment;
