
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  Upload, 
  CheckCircle2, 
  Clock, 
  X, 
  Camera, 
  FileText, 
  User 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface VerificationSystemProps {
  userId: string;
  userType: 'shipper' | 'transporter';
  onVerificationUpdate?: (status: string) => void;
}

const VerificationSystem = ({ userId, userType, onVerificationUpdate }: VerificationSystemProps) => {
  const [verificationStatus, setVerificationStatus] = useState<
    'unverified' | 'pending' | 'verified' | 'rejected'
  >('unverified');
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<{ [key: string]: File | null }>({
    idCard: null,
    licenseOrRegistration: null,
    selfie: null,
  });
  const { toast } = useToast();

  const fetchVerificationStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('verification')
        .select('status')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error("Error fetching verification status:", error);
        return;
      }

      if (data) {
        setVerificationStatus(data.status as any);
        if (onVerificationUpdate) {
          onVerificationUpdate(data.status);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  React.useEffect(() => {
    fetchVerificationStatus();
  }, [userId]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    documentType: 'idCard' | 'licenseOrRegistration' | 'selfie'
  ) => {
    const file = event.target.files?.[0] || null;
    setDocuments((prevDocuments) => ({
      ...prevDocuments,
      [documentType]: file,
    }));
  };

  const handleSubmitVerification = async () => {
    setIsLoading(true);

    // Check if all required documents are uploaded
    const missingDocuments = Object.entries(documents)
      .filter(([_, file]) => !file)
      .map(([key, _]) => key);

    if (missingDocuments.length > 0) {
      toast({
        title: "Missing documents",
        description: `Please upload all required documents: ${missingDocuments.join(", ")}`,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Upload documents to Supabase storage
      const uploadPromises = Object.entries(documents).map(async ([docType, file]) => {
        if (!file) return null;

        const fileExt = file.name.split('.').pop();
        const filePath = `verification/${userId}/${docType}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('user_documents')
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(`Error uploading ${docType}: ${uploadError.message}`);
        }

        return { docType, filePath };
      });

      const uploadResults = await Promise.all(uploadPromises);
      const documentPaths = uploadResults.reduce((acc, result) => {
        if (result) {
          acc[result.docType] = result.filePath;
        }
        return acc;
      }, {} as Record<string, string>);

      // Create or update verification record
      const { error: verificationError } = await supabase
        .from('verification')
        .upsert({
          user_id: userId,
          status: 'pending',
          documents: documentPaths,
          submitted_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (verificationError) {
        throw new Error(`Error saving verification: ${verificationError.message}`);
      }

      setVerificationStatus('pending');
      if (onVerificationUpdate) {
        onVerificationUpdate('pending');
      }

      toast({
        title: "Verification submitted",
        description: "Your verification documents have been submitted for review",
      });
    } catch (error: any) {
      console.error("Error submitting verification:", error);
      toast({
        title: "Verification failed",
        description: error.message || "Failed to submit verification documents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderVerificationStatus = () => {
    switch (verificationStatus) {
      case 'verified':
        return (
          <div className="bg-green-50 p-4 rounded-md border border-green-200">
            <div className="flex items-center">
              <CheckCircle2 className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-green-800">Verified Account</p>
                <p className="text-sm text-green-600">
                  Your account has been successfully verified
                </p>
              </div>
            </div>
          </div>
        );
      case 'pending':
        return (
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-yellow-600 mr-3" />
              <div>
                <p className="font-medium text-yellow-800">Verification Pending</p>
                <p className="text-sm text-yellow-600">
                  Your documents are being reviewed. This typically takes 1-2 business days.
                </p>
              </div>
            </div>
          </div>
        );
      case 'rejected':
        return (
          <div className="bg-red-50 p-4 rounded-md border border-red-200">
            <div className="flex items-center">
              <X className="h-6 w-6 text-red-600 mr-3" />
              <div>
                <p className="font-medium text-red-800">Verification Rejected</p>
                <p className="text-sm text-red-600">
                  Your verification was not approved. Please re-submit with clearer documents.
                </p>
              </div>
            </div>
            {renderDocumentUpload()}
          </div>
        );
      default:
        return renderDocumentUpload();
    }
  };

  const renderDocumentUpload = () => {
    return (
      <div className="space-y-4 mt-4">
        <div>
          <Label htmlFor="idCard">ID Card or Passport</Label>
          <div className="mt-1">
            <Input
              id="idCard"
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => handleFileChange(e, 'idCard')}
              disabled={isLoading || verificationStatus === 'pending' || verificationStatus === 'verified'}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Upload a clear photo of your government-issued ID
          </p>
        </div>
        
        {userType === 'transporter' && (
          <div>
            <Label htmlFor="licenseOrRegistration">Business Registration or Transport License</Label>
            <div className="mt-1">
              <Input
                id="licenseOrRegistration"
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileChange(e, 'licenseOrRegistration')}
                disabled={isLoading || verificationStatus === 'pending' || verificationStatus === 'verified'}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              For transporters: Upload your business registration or transport license
            </p>
          </div>
        )}
        
        <div>
          <Label htmlFor="selfie">Selfie with ID</Label>
          <div className="mt-1">
            <Input
              id="selfie"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'selfie')}
              disabled={isLoading || verificationStatus === 'pending' || verificationStatus === 'verified'}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Upload a photo of yourself holding your ID for identity confirmation
          </p>
        </div>
        
        <Button
          className="w-full"
          onClick={handleSubmitVerification}
          disabled={isLoading || verificationStatus === 'pending' || verificationStatus === 'verified'}
        >
          {isLoading ? 'Submitting...' : 'Submit Verification'}
        </Button>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Account Verification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Verification helps establish trust and safety in our platform.
            {userType === 'transporter' 
              ? ' As a transporter, verification is required before accepting shipments.'
              : ' Verify your identity to access all platform features.'}
          </p>
          
          {renderVerificationStatus()}
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Why verify your account?</h4>
            <ul className="text-sm space-y-2">
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                <span>Builds trust with other users</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                <span>Improves safety and security for all participants</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                <span>Access to premium features and higher transaction limits</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                <span>Required for transporters to accept shipments</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationSystem;
