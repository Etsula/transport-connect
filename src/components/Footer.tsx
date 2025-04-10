
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">iShip</h3>
            <p className="text-gray-600">
              Connecting shippers and transporters for efficient, reliable shipping solutions.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/create-shipment" className="text-gray-600 hover:text-primary">
                  Create Shipment
                </Link>
              </li>
              <li>
                <Link to="/messaging" className="text-gray-600 hover:text-primary">
                  Messaging
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-gray-600 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-600 hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-gray-600 hover:text-primary">
                  Security
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-gray-600 hover:text-primary">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">Email: support@iship.com</li>
              <li className="text-gray-600">Phone: (123) 456-7890</li>
              <li className="text-gray-600">Address: 123 Shipping Lane, Transport City</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          &copy; {currentYear} iShip. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
