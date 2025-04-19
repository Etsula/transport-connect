
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl font-bold text-primary mb-6">Welcome to iShip</h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect shippers and transporters efficiently. Manage your logistics seamlessly.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/login">
              <Button className="bg-primary hover:bg-primary/90">
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
