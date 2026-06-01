
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster as ToasterComponent } from "@/components/ui/toaster";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import PaymentCenter from "./pages/PaymentCenter";
import UserManagement from "./pages/UserManagement";
import CreateShipment from "./pages/CreateShipment";
import FindShipments from "./pages/FindShipments";
import ShipmentDetails from "./pages/ShipmentDetails";
import ManageShipment from "./pages/ManageShipment";
import Messaging from "./pages/Messaging";
import Profile from "./pages/Profile";
import ReferralProgram from "./pages/ReferralProgram";
import InternationalShipping from "./pages/InternationalShipping";
import TransporterEarnings from "./pages/TransporterEarnings";
import TransporterSettings from "./pages/TransporterSettings";
import AgentManagement from "./pages/AgentManagement";
import Marketplace from "./pages/Marketplace";
import APIManagement from "./pages/APIManagement";
import Subscription from "./pages/Subscription";
import DeveloperPortal from "./pages/DeveloperPortal";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Accessibility from "./pages/Accessibility";
import Security from "./pages/Security";
import GDPRCompliance from "./pages/GDPRCompliance";
import NavigationHub from "./pages/NavigationHub";
import TravelerPortal from "./pages/TravelerPortal";
import PerformanceDashboard from "./pages/PerformanceDashboard";
import CapacityBoard from "./pages/CapacityBoard";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ToasterComponent />
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Navigation />
              <main className="pt-16">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/create-shipment" element={<CreateShipment />} />
                  <Route path="/find-shipments" element={<FindShipments />} />
                  <Route path="/shipment/:id" element={<ShipmentDetails />} />
                  <Route path="/manage-shipment/:id" element={<ManageShipment />} />
                  <Route path="/messaging" element={<Messaging />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/referral-program" element={<ReferralProgram />} />
                  <Route path="/international-shipping" element={<InternationalShipping />} />
                  <Route path="/transporter-earnings" element={<TransporterEarnings />} />
                  <Route path="/transporter-settings" element={<TransporterSettings />} />
                  <Route path="/agent-management" element={<AgentManagement />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/api-management" element={<APIManagement />} />
                  <Route path="/subscription" element={<Subscription />} />
                  <Route path="/developer-portal" element={<DeveloperPortal />} />
                  <Route path="/gdpr-compliance" element={<GDPRCompliance />} />
                  <Route path="/navigation-hub" element={<NavigationHub />} />
                  <Route path="/traveler-portal" element={<TravelerPortal />} />
                  <Route path="/performance-dashboard" element={<PerformanceDashboard />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/accessibility" element={<Accessibility />} />
                  <Route path="/security" element={<Security />} />
                  <Route path="/payment-center" element={<PaymentCenter />} />
                  <Route path="/user-management" element={<UserManagement />} />
                  <Route path="/capacity-board" element={<CapacityBoard />} />
                </Routes>
              </main>
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
