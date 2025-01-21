import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, Truck, Clock, MapPin } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
            <Button variant="outline">Sign Out</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Package className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-gray-600">Active Shipments</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Truck className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-gray-600">Available Transporters</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Clock className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <MapPin className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-gray-600">Completed Deliveries</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Shipments */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Shipments</h2>
          <Card className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                  <div>
                    <p className="font-medium">Shipment #{i}</p>
                    <p className="text-sm text-gray-600">From New York to Los Angeles</p>
                  </div>
                  <Button variant="outline">View Details</Button>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="bg-primary hover:bg-primary/90">
              Create New Shipment
            </Button>
            <Button variant="outline">
              Find Transporters
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;