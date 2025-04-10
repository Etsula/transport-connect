
import { Card } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Privacy Policy</h1>
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to iShip ("we," "our," or "us"). We are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website (collectively, the "Service").
          </p>
          <p className="mb-4">
            Please read this Privacy Policy carefully. By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
          </p>

          <h2 className="text-xl font-bold mb-4 mt-6">2. Information We Collect</h2>
          <p className="mb-2">We may collect several types of information from and about users of our Service, including:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Personal identifiers (name, email address, phone number)</li>
            <li>Location data (pickup and delivery locations)</li>
            <li>Communication data (messages between shippers and transporters)</li>
            <li>Transaction information (shipment details, bids)</li>
            <li>Usage data and analytics</li>
          </ul>

          <h2 className="text-xl font-bold mb-4 mt-6">3. How We Use Your Information</h2>
          <p className="mb-2">We use the information we collect to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide, maintain, and improve our Service</li>
            <li>Process shipments and facilitate connections between shippers and transporters</li>
            <li>Communicate with you about the Service</li>
            <li>Monitor and analyze usage patterns and trends</li>
            <li>Protect the security and integrity of our Service</li>
          </ul>

          <h2 className="text-xl font-bold mb-4 mt-6">4. Data Retention</h2>
          <p className="mb-4">
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
          </p>

          <h2 className="text-xl font-bold mb-4 mt-6">5. Security</h2>
          <p className="mb-4">
            We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-xl font-bold mb-4 mt-6">6. Your Rights</h2>
          <p className="mb-4">
            Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, delete, or restrict processing of your data. To exercise these rights, please contact us using the information provided below.
          </p>

          <h2 className="text-xl font-bold mb-4 mt-6">7. Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>

          <h2 className="text-xl font-bold mb-4 mt-6">8. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at support@iship.com.
          </p>

          <p className="mt-8 text-sm text-gray-500">Last Updated: April 10, 2025</p>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
