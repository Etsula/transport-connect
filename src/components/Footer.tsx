
import { Link } from "react-router-dom";
import { CompactDisclaimer } from "@/components/disclaimers/Disclaimers";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-muted/30 border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">iShip</h3>
            <p className="text-muted-foreground">
              Connecting shippers and transporters for efficient, reliable shipping solutions.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/create-shipment" className="text-muted-foreground hover:text-primary">
                  Create Shipment
                </Link>
              </li>
              <li>
                <Link to="/messaging" className="text-muted-foreground hover:text-primary">
                  Messaging
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-muted-foreground hover:text-primary">
                  Security
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-muted-foreground hover:text-primary">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link to="/gdpr-compliance" className="text-muted-foreground hover:text-primary">
                  GDPR Compliance
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">Email: support@iship.com</li>
              <li className="text-muted-foreground">Phone: (123) 456-7890</li>
              <li className="text-muted-foreground">Address: 123 Shipping Lane, Transport City</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border space-y-3">
          <CompactDisclaimer type="liability" />
          <CompactDisclaimer type="availability" />
          <CompactDisclaimer type="privacy" />
        </div>
        
        <div className="mt-6 pt-4 border-t border-border text-center text-muted-foreground text-sm">
          &copy; {currentYear} iShip. All rights reserved. iShip is a marketplace platform and does not directly provide transportation services.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
