
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navigation from "@/components/Navigation";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateShipment from "./pages/CreateShipment";
import FindShipments from "./pages/FindShipments";
import Messaging from "./pages/Messaging";
import Profile from "./pages/Profile";
import TransporterSettings from "./pages/TransporterSettings";
import ManageShipment from "./pages/ManageShipment";
import ShipmentDetails from "./pages/ShipmentDetails";
import InternationalShipping from "./pages/InternationalShipping";
import Subscription from "./pages/Subscription";
import APIManagement from "./pages/APIManagement";
import DeveloperPortal from "./pages/DeveloperPortal";
import Marketplace from "./pages/Marketplace";
import TransporterEarnings from "./pages/TransporterEarnings";
import ReferralProgram from "./pages/ReferralProgram";
import ResetPassword from "./pages/ResetPassword";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Security from "./pages/Security";
import Accessibility from "./pages/Accessibility";
import AgentManagement from "./pages/AgentManagement";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/security" element={<Security />} />
                <Route path="/accessibility" element={<Accessibility />} />
                
                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Navigation />
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/marketplace"
                  element={
                    <ProtectedRoute>
                      <Navigation />
                      <Marketplace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-shipment"
                  element={
                    <ProtectedRoute>
                      <Navigation />
                      <CreateShipment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/find-shipments"
                  element={
                    <ProtectedRoute>
                      <Navigation />
                      <FindShipments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/earnings"
                  element={
                    <ProtectedRoute>
                      <Navigation />
                      <TransporterEarnings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/referrals"
                  element={
                    <ProtectedRoute>
                      <Navigation />
                      <ReferralProgram />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/messaging"
                  element={
                    <ProtectedRoute>
                      <Navigation />
                      <Messaging />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Navigation />
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transporter-settings"
                  element={
                    <ProtectedRoute>
                      <Navigation />
                      <TransporterSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manage-shipment/:id"
                  element={
                    <ProtectedRoute>
                      <Navigation />
                      <ManageShipment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/shipment/:id"
                  element={
                    <ProtectedRoute>
                      <Navigation />
                      <ShipmentDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/international-shipping"
                  element={
                    <ProtectedRoute>
                      <Navigation />
                      <InternationalShipping />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/subscription"
                  element={
                    <ProtectedRoute>
                      <Navigation />
                      <Subscription />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/api-management"
                  element={
                    <ProtectedRoute>
                      <Navigation />
                      <APIManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/developer-portal"
                  element={
                    <ProtectedRoute>
                      <Navigation />
                      <DeveloperPortal />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/agent-management"
                  element={
                    <ProtectedRoute>
                      <Navigation />
                      <AgentManagement />
                    </ProtectedRoute>
                  }
                />
                
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
