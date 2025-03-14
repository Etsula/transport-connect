
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Truck, Package, Users, Star, Globe, BarChart, FileCheck } from "lucide-react";
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
            Connect with reliable transporters globally and get competitive rates for both local and international shipping
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

      {/* Why Choose Us Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 flex items-start space-x-4 hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 p-3 rounded-full">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Global Shipping Network</h3>
                <p className="text-gray-600">Unlike local solutions like Pickup Mtaani, we connect you with a worldwide network of verified transporters for both local and international shipping needs.</p>
              </div>
            </Card>
            <Card className="p-6 flex items-start space-x-4 hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 p-3 rounded-full">
                <BarChart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Competitive Bidding</h3>
                <p className="text-gray-600">Our real-time bidding system ensures you get the best possible rates from multiple carriers, often saving up to 40% compared to fixed-price services.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features for Everyone</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Truck className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Advanced Tracking</h3>
            <p className="text-gray-600">Track your shipments in real-time with our advanced GPS integration, providing even more detail than local services</p>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Package className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Small Package Specialists</h3>
            <p className="text-gray-600">Our platform specializes in affordable small package shipping internationally, with optimized rates for lightweight items</p>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Users className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Verified Transporters</h3>
            <p className="text-gray-600">Connect with our network of verified and reliable transporters with transparent review systems</p>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <FileCheck className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Documentation Assistance</h3>
            <p className="text-gray-600">We handle all the complex paperwork for international shipping, making customs clearance hassle-free</p>
          </Card>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How We Compare</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b text-left">Features</th>
                  <th className="px-6 py-3 border-b text-center">Our Platform</th>
                  <th className="px-6 py-3 border-b text-center">Local Services</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-6 py-4 border-b">International Shipping</td>
                  <td className="px-6 py-4 border-b text-center">✅</td>
                  <td className="px-6 py-4 border-b text-center">❌</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b">Competitive Bidding</td>
                  <td className="px-6 py-4 border-b text-center">✅</td>
                  <td className="px-6 py-4 border-b text-center">❌</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b">Real-time Tracking</td>
                  <td className="px-6 py-4 border-b text-center">✅</td>
                  <td className="px-6 py-4 border-b text-center">✅</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b">Documentation Support</td>
                  <td className="px-6 py-4 border-b text-center">✅</td>
                  <td className="px-6 py-4 border-b text-center">Limited</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 border-b">Price Transparency</td>
                  <td className="px-6 py-4 border-b text-center">✅</td>
                  <td className="px-6 py-4 border-b text-center">Limited</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Ship Smarter Than Ever?</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of businesses that trust our platform for both local and international shipping needs
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
          <Link to="/register">Start Shipping Now</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
