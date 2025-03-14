
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Package, Truck, FileText } from "lucide-react";
import { Link } from "react-router-dom";

// Define types to match our database tables
type PackageType = {
  id: string;
  name: string;
  max_weight: number;
  max_length: number;
  max_width: number;
  max_height: number;
  description: string;
};

type ShippingCarrier = {
  id: string;
  name: string;
  service_level: string;
  transit_time_days: number;
  supports_international: boolean;
  tracking_available: boolean;
  description: string;
};

type DocumentType = {
  id: string;
  name: string;
  required_for_countries: string[] | null;
  description: string;
};

const InternationalShipping = () => {
  const { toast } = useToast();
  const [packageTypes, setPackageTypes] = useState<PackageType[]>([]);
  const [carriers, setCarriers] = useState<ShippingCarrier[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch package types using type assertion as a workaround for type limitations
        const { data: packageTypesData, error: packageTypesError } = await supabase
          .from('package_types')
          .select('*') as { data: PackageType[] | null, error: any };
        
        if (packageTypesError) throw packageTypesError;
        if (packageTypesData) setPackageTypes(packageTypesData);

        // Fetch shipping carriers
        const { data: carriersData, error: carriersError } = await supabase
          .from('shipping_carriers')
          .select('*') as { data: ShippingCarrier[] | null, error: any };
        
        if (carriersError) throw carriersError;
        if (carriersData) setCarriers(carriersData);

        // Fetch document types
        const { data: documentTypesData, error: documentTypesError } = await supabase
          .from('document_types')
          .select('*') as { data: DocumentType[] | null, error: any };
        
        if (documentTypesError) throw documentTypesError;
        if (documentTypesData) setDocumentTypes(documentTypesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load international shipping options.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">International Shipping</h1>
            <p className="text-gray-600 mt-2">
              Everything you need to know about shipping packages internationally
            </p>
          </div>

          <Card className="mb-8 p-6">
            <div className="flex items-start gap-4">
              <Globe className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-xl font-semibold">Why Ship with iShip Internationally?</h2>
                <p className="mt-2 text-gray-700">
                  Our international shipping options allow you to send packages to over 200 countries worldwide. 
                  With competitive rates, reliable tracking, and simplified customs processes, we make international
                  shipping accessible for individuals and small businesses.
                </p>
                <Link to="/create-shipment">
                  <Button className="mt-4">Create International Shipment</Button>
                </Link>
              </div>
            </div>
          </Card>

          <Tabs defaultValue="package-types" className="mb-8">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="package-types" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>Package Types</span>
              </TabsTrigger>
              <TabsTrigger value="carriers" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Carriers</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Required Documents</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="package-types">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">International Package Types</h2>
                {loading ? (
                  <p>Loading package options...</p>
                ) : (
                  <div className="space-y-6">
                    {packageTypes.map((packageType) => (
                      <div key={packageType.id} className="border-b pb-4 last:border-0 last:pb-0">
                        <h3 className="font-medium text-lg">{packageType.name}</h3>
                        <p className="text-gray-600 mt-1">{packageType.description}</p>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Max Weight:</span> {packageType.max_weight} kg
                          </div>
                          <div>
                            <span className="font-medium">Max Dimensions:</span> {packageType.max_length}×{packageType.max_width}×{packageType.max_height} cm
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="carriers">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">International Shipping Carriers</h2>
                {loading ? (
                  <p>Loading carrier options...</p>
                ) : (
                  <div className="space-y-6">
                    {carriers.map((carrier) => (
                      <div key={carrier.id} className="border-b pb-4 last:border-0 last:pb-0">
                        <h3 className="font-medium text-lg">{carrier.name}</h3>
                        <p className="text-gray-600 mt-1">{carrier.description}</p>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Service Level:</span> {carrier.service_level}
                          </div>
                          <div>
                            <span className="font-medium">Transit Time:</span> ~{carrier.transit_time_days} days
                          </div>
                          <div>
                            <span className="font-medium">Tracking:</span> {carrier.tracking_available ? "Available" : "Not available"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Required Documents for International Shipping</h2>
                {loading ? (
                  <p>Loading document information...</p>
                ) : (
                  <div className="space-y-6">
                    {documentTypes.map((document) => (
                      <div key={document.id} className="border-b pb-4 last:border-0 last:pb-0">
                        <h3 className="font-medium text-lg">{document.name}</h3>
                        <p className="text-gray-600 mt-1">{document.description}</p>
                        {document.required_for_countries && (
                          <div className="mt-2">
                            <span className="font-medium text-sm">Required for:</span> 
                            <span className="text-sm ml-1">
                              {document.required_for_countries.join(", ") || "All countries"}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <div className="bg-blue-50 p-4 rounded-lg mt-6">
                      <h3 className="font-medium">Important Note</h3>
                      <p className="text-sm mt-1">
                        Different countries have different documentation requirements for imports. 
                        Always check the specific requirements for your destination country before shipping.
                        Our system will guide you through the necessary documents during shipment creation.
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="text-center">
            <Link to="/create-shipment">
              <Button size="lg">Create International Shipment Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternationalShipping;
