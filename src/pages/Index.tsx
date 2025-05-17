
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import NavigationMap from "@/components/NavigationMap";
import { MapPin, Truck, Globe, Navigation } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-primary mb-6">Welcome to iShip</h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect shippers and transporters efficiently. Manage your logistics seamlessly with real-time GPS tracking and traffic monitoring.
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

      {/* Map Showcase Section */}
      <div className="container mx-auto px-4 py-8 mb-16">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-primary/5">
            <h2 className="text-2xl font-bold text-primary mb-2">Live Navigation Demo</h2>
            <p className="text-gray-600 mb-4">Our platform provides real-time GPS navigation and traffic monitoring for all shipments.</p>
          </div>
          <div className="h-[500px] w-full">
            <NavigationMap />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-Time Tracking</h3>
            <p className="text-gray-600">Track your shipments in real-time with accurate GPS navigation and live updates.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Navigation className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Traffic Monitoring</h3>
            <p className="text-gray-600">Get traffic updates along delivery routes to optimize transportation and avoid delays.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">International Support</h3>
            <p className="text-gray-600">Manage both local and international shipments with specialized customs documentation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
