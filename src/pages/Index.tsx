
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import NavigationMap from "@/components/NavigationMap";
import Footer from "@/components/Footer";
import { MapPin, Truck, Globe, Navigation, Shield, DollarSign } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-primary mb-6">Welcome to iShip</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Connect shippers and transporters efficiently. Manage your logistics seamlessly with real-time GPS tracking and traffic monitoring.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/login">
              <Button>Log In</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline">Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Map Showcase Section */}
      <div className="container mx-auto px-4 py-8 mb-16">
        <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border">
          <div className="p-6 bg-primary/5">
            <h2 className="text-2xl font-bold text-primary mb-2">Live Navigation Demo</h2>
            <p className="text-muted-foreground mb-4">Our platform provides real-time GPS navigation and traffic monitoring for all shipments.</p>
          </div>
          <div className="h-[500px] w-full">
            <NavigationMap />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 bg-card">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-muted/50 p-6 rounded-lg border border-border">
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-Time Tracking</h3>
            <p className="text-muted-foreground">Track your shipments in real-time with accurate GPS navigation and live updates.</p>
          </div>
          <div className="bg-muted/50 p-6 rounded-lg border border-border">
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Navigation className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Traffic Monitoring</h3>
            <p className="text-muted-foreground">Get traffic updates along delivery routes to optimize transportation and avoid delays.</p>
          </div>
          <div className="bg-muted/50 p-6 rounded-lg border border-border">
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">International Support</h3>
            <p className="text-muted-foreground">Manage both local and international shipments with specialized customs documentation.</p>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose iShip?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Secure Escrow Payments</h3>
            <p className="text-muted-foreground text-sm">All payments are held securely in escrow and released only upon confirmed delivery.</p>
          </div>
          <div className="text-center">
            <Truck className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Verified Transporters</h3>
            <p className="text-muted-foreground text-sm">All transporters undergo verification. View ratings and reviews before choosing.</p>
          </div>
          <div className="text-center">
            <DollarSign className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Competitive Bidding</h3>
            <p className="text-muted-foreground text-sm">Get the best rates through our open bidding system. Transporters compete for your shipment.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
