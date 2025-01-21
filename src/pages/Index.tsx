import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Truck, Package, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            Ship Smarter, Not Harder
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with reliable transporters in real-time and get your shipments delivered efficiently
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/register">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Truck className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-Time Tracking</h3>
            <p className="text-gray-600">Track your shipments in real-time with our advanced GPS integration</p>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Package className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Easy Shipping</h3>
            <p className="text-gray-600">Post your shipment details and receive competitive quotes instantly</p>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Users className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Verified Transporters</h3>
            <p className="text-gray-600">Connect with our network of verified and reliable transporters</p>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Star className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
            <p className="text-gray-600">Rate and review services to maintain high quality standards</p>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Shipping?</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of businesses that trust our platform for their shipping needs
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
          <Link to="/register">Start Shipping Now</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;