
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form schema
const shipmentFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().optional(),
  pickup_location: z.string().min(3, { message: "Pickup location is required" }),
  delivery_location: z.string().min(3, { message: "Delivery location is required" }),
  weight: z.string().optional(),
  dimensions: z.string().optional(),
  budget: z.string().optional(),
  is_international: z.boolean().default(false),
  package_type: z.string().optional(),
  shipping_carrier: z.string().optional(),
  customs_value: z.string().optional(),
  customs_description: z.string().optional(),
  origin_country: z.string().optional(),
  destination_country: z.string().optional(),
  requires_documents: z.boolean().default(false),
  document_types: z.array(z.string()).optional(),
});

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

const CreateShipmentForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [packageTypes, setPackageTypes] = useState<PackageType[]>([]);
  const [carriers, setCarriers] = useState<ShippingCarrier[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const form = useForm<z.infer<typeof shipmentFormSchema>>({
    resolver: zodResolver(shipmentFormSchema),
    defaultValues: {
      title: "",
      description: "",
      pickup_location: "",
      delivery_location: "",
      weight: "",
      dimensions: "",
      budget: "",
      is_international: false,
      package_type: "",
      shipping_carrier: "",
      customs_value: "",
      customs_description: "",
      origin_country: "",
      destination_country: "",
      requires_documents: false,
      document_types: [],
    },
  });

  // Fetch package types, carriers, and document types on component mount
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        // Fetch package types
        const { data: packageTypesData, error: packageTypesError } = await supabase
          .from("package_types")
          .select("*");
        
        if (packageTypesError) throw packageTypesError;
        setPackageTypes(packageTypesData);

        // Fetch shipping carriers
        const { data: carriersData, error: carriersError } = await supabase
          .from("shipping_carriers")
          .select("*");
        
        if (carriersError) throw carriersError;
        setCarriers(carriersData);

        // Fetch document types
        const { data: documentTypesData, error: documentTypesError } = await supabase
          .from("document_types")
          .select("*");
        
        if (documentTypesError) throw documentTypesError;
        setDocumentTypes(documentTypesData);
      } catch (error) {
        console.error("Error fetching reference data:", error);
        toast({
          title: "Error",
          description: "Failed to load shipping options. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchReferenceData();
  }, [toast]);

  // Watch for changes in international shipping checkbox
  const isInternational = form.watch("is_international");
  const requiresDocuments = form.watch("requires_documents");

  const onSubmit = async (values: z.infer<typeof shipmentFormSchema>) => {
    setIsLoading(true);
    try {
      // Get the current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("You must be logged in to create a shipment");
      }

      const shipper_id = session.user.id;

      // Prepare shipment data
      const shipmentData = {
        title: values.title,
        description: values.description,
        pickup_location: values.pickup_location,
        delivery_location: values.delivery_location,
        weight: values.weight ? parseFloat(values.weight) : null,
        dimensions: values.dimensions,
        budget: values.budget ? parseFloat(values.budget) : null,
        shipper_id,
        status: "open",
        is_international: values.is_international,
        package_type: values.package_type,
        shipping_carrier: values.shipping_carrier,
        customs_value: values.customs_value ? parseFloat(values.customs_value) : null,
        customs_description: values.customs_description,
        origin_country: values.origin_country,
        destination_country: values.destination_country,
        requires_documents: values.requires_documents,
        document_types: selectedDocuments.length > 0 ? selectedDocuments : null,
      };

      // Insert data into the shipments table
      const { data, error } = await supabase
        .from("shipments")
        .insert(shipmentData)
        .select();

      if (error) throw error;

      toast({
        title: "Shipment Created",
        description: "Your shipment has been successfully created.",
      });

      // Navigate to the dashboard or shipment details page
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error creating shipment:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create shipment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentSelection = (documentId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments([...selectedDocuments, documentId]);
    } else {
      setSelectedDocuments(selectedDocuments.filter(id => id !== documentId));
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-primary">Create New Shipment</h1>
        <p className="text-gray-600">Fill out the form to create a new shipment request</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Shipment Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Shipment Information</h2>
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipment Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Furniture Delivery" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what needs to be shipped" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pickup_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Address for pickup" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="delivery_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Address for delivery" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dimensions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dimensions (L×W×H cm)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 30×20×15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* International Shipping Options */}
          <div className="space-y-4 pt-4 border-t">
            <FormField
              control={form.control}
              name="is_international"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>International Shipment</FormLabel>
                    <FormDescription>
                      Enable for cross-border shipping with specialized options
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {isInternational && (
              <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                <h2 className="text-xl font-semibold">International Shipping Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="origin_country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Origin Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Country of origin" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="destination_country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Country of destination" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="package_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select package type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {packageTypes.map((packageType) => (
                            <SelectItem key={packageType.id} value={packageType.id}>
                              {packageType.name} ({packageType.max_weight}kg, {packageType.max_length}×{packageType.max_width}×{packageType.max_height}cm)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the appropriate package type for international shipping
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shipping_carrier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Carrier</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select shipping carrier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {carriers.map((carrier) => (
                            <SelectItem key={carrier.id} value={carrier.id}>
                              {carrier.name} ({carrier.service_level}, ~{carrier.transit_time_days} days)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose a preferred international shipping carrier
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customs_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customs Value ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormDescription>
                          Declared value for customs purposes
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customs_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customs Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Description for customs" {...field} />
                        </FormControl>
                        <FormDescription>
                          Brief description of goods for customs declaration
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="requires_documents"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Requires Special Documentation</FormLabel>
                        <FormDescription>
                          Check if this shipment requires additional customs documents
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {requiresDocuments && (
                  <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                    <h3 className="text-lg font-medium">Required Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {documentTypes.map((doc) => (
                        <div key={doc.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={doc.id} 
                            onCheckedChange={(checked) => 
                              handleDocumentSelection(doc.id, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={doc.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {doc.name}
                            {doc.required_for_countries && (
                              <span className="text-xs text-gray-500 block">
                                Required for: {doc.required_for_countries.join(", ")}
                              </span>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Shipment"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default CreateShipmentForm;
