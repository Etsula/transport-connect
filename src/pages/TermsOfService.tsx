
import { Card } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Terms of Service</h1>
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">1. Agreement to Terms</h2>
          <p className="mb-4">
            By accessing or using the iShip application and website (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service.
          </p>

          <h2 className="text-xl font-bold mb-4 mt-6">2. Description of Service</h2>
          <p className="mb-4">
            iShip is a platform that connects shippers with transporters for the purpose of facilitating the shipment of goods. We do not directly provide shipping services, but rather serve as an intermediary between parties.
          </p>

          <h2 className="text-xl font-bold mb-4 mt-6">3. User Accounts</h2>
          <p className="mb-4">
            To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </p>

          <h2 className="text-xl font-bold mb-4 mt-6">4. User Conduct</h2>
          <p className="mb-2">Users of the Service agree not to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on the rights of others</li>
            <li>Submit false or misleading information</li>
            <li>Interfere with the proper functioning of the Service</li>
            <li>Attempt to bypass any security measures</li>
          </ul>

          <h2 className="text-xl font-bold mb-4 mt-6">5. Payment Terms</h2>
          <p className="mb-4">
            Users agree to pay all fees or charges to their accounts according to the fees, charges, and billing terms in effect at the time a fee or charge is due and payable. Payment processing services may be provided by a third-party payment processor.
          </p>

          <h2 className="text-xl font-bold mb-4 mt-6">6. Limitation of Liability</h2>
          <p className="mb-4">
            To the maximum extent permitted by law, in no event shall iShip be liable for any indirect, punitive, incidental, special, or consequential damages arising out of or in any way connected with the use of the Service.
          </p>

          <h2 className="text-xl font-bold mb-4 mt-6">7. Dispute Resolution</h2>
          <p className="mb-4">
            Any disputes arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the laws of the jurisdiction in which the company operates.
          </p>

          <h2 className="text-xl font-bold mb-4 mt-6">8. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these Terms at any time. We will provide notice of any material changes by posting the updated Terms on the Service and updating the "Last Updated" date.
          </p>

          <h2 className="text-xl font-bold mb-4 mt-6">9. Contact Information</h2>
          <p className="mb-4">
            Questions or comments about the Service or these Terms may be directed to support@iship.com.
          </p>

          <p className="mt-8 text-sm text-gray-500">Last Updated: April 10, 2025</p>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
