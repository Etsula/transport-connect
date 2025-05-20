
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import CreateShipment from "@/pages/CreateShipment";
import InternationalShipping from "@/pages/InternationalShipping";
import Messaging from "@/pages/Messaging";
import ShipmentDetails from "@/pages/ShipmentDetails";
import ManageShipment from "@/pages/ManageShipment";
import FindShipments from "@/pages/FindShipments";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AgentManagement from "@/pages/AgentManagement";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import Security from "@/pages/Security";
import Accessibility from "@/pages/Accessibility";
import ContentSecurityPolicy from "@/security/ContentSecurityPolicy";

function App() {
  return (
    <ContentSecurityPolicy>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-shipment"
                element={
                  <ProtectedRoute>
                    <CreateShipment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/international-shipping"
                element={
                  <ProtectedRoute>
                    <InternationalShipping />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messaging"
                element={
                  <ProtectedRoute>
                    <Messaging />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages/:shipmentId"
                element={
                  <ProtectedRoute>
                    <Messaging />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shipment/:id"
                element={
                  <ProtectedRoute>
                    <ShipmentDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-shipment/:id"
                element={
                  <ProtectedRoute>
                    <ManageShipment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/find-shipments"
                element={
                  <ProtectedRoute>
                    <FindShipments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agent-management"
                element={
                  <ProtectedRoute>
                    <AgentManagement />
                  </ProtectedRoute>
                }
              />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/security" element={<Security />} />
              <Route path="/accessibility" element={<Accessibility />} />
            </Routes>
          </div>
          <Footer />
        </div>
        <Toaster />
      </Router>
    </ContentSecurityPolicy>
  );
}

export default App;
