
import { Card } from "@/components/ui/card";
import { Shield, Lock, AlertTriangle, Server } from "lucide-react";

const Security = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Security Measures</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 flex flex-col items-center text-center">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-bold mb-2">Data Protection</h2>
            <p>
              All data is encrypted in transit using TLS/SSL and at rest using AES-256 encryption. 
              We implement strict access controls to ensure your information is protected.
            </p>
          </Card>
          
          <Card className="p-6 flex flex-col items-center text-center">
            <Lock className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-bold mb-2">Authentication Security</h2>
            <p>
              We use industry-standard authentication protocols and offer two-factor authentication options.
              Passwords are never stored in plain text and are hashed using bcrypt.
            </p>
          </Card>
          
          <Card className="p-6 flex flex-col items-center text-center">
            <AlertTriangle className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-bold mb-2">Fraud Prevention</h2>
            <p>
              Our systems continuously monitor for suspicious activity and implement 
              protection against common attack vectors such as SQL injection, XSS, and CSRF.
            </p>
          </Card>
          
          <Card className="p-6 flex flex-col items-center text-center">
            <Server className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-bold mb-2">Infrastructure Security</h2>
            <p>
              Our application is hosted on secure cloud infrastructure with regular security audits,
              penetration testing, and compliance with industry standards.
            </p>
          </Card>
        </div>
        
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Security Practices</h2>
          <p className="mb-4">
            At iShip, we take security seriously. Here are some of the measures we implement to protect your data:
          </p>
          
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              <span className="font-semibold">Input Validation:</span> All user inputs are validated and sanitized to prevent injection attacks.
            </li>
            <li className="mb-2">
              <span className="font-semibold">Rate Limiting:</span> We implement rate limiting to prevent brute force attacks on our authentication systems.
            </li>
            <li className="mb-2">
              <span className="font-semibold">Regular Audits:</span> We conduct regular security audits and code reviews to identify and address potential vulnerabilities.
            </li>
            <li className="mb-2">
              <span className="font-semibold">Third-Party Testing:</span> We engage with third-party security experts to perform penetration testing.
            </li>
            <li className="mb-2">
              <span className="font-semibold">Data Minimization:</span> We only collect and retain the information necessary to provide our services.
            </li>
          </ul>
          
          <h2 className="text-xl font-bold mb-4 mt-6">Reporting Security Issues</h2>
          <p className="mb-4">
            If you discover a security vulnerability in our Service, please report it to security@iship.com. 
            We appreciate your help in keeping iShip secure and will acknowledge and address all reported issues promptly.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Security;
