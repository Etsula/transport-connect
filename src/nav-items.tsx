
import { HomeIcon, Package, MessageSquare, User, Truck, Settings, Shield, Globe, LifeBuoy } from "lucide-react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateShipment from "./pages/CreateShipment";
import FindShipments from "./pages/FindShipments";
import ShipmentDetails from "./pages/ShipmentDetails";
import ManageShipment from "./pages/ManageShipment";
import Messaging from "./pages/Messaging";
import InternationalShipping from "./pages/InternationalShipping";
import TransporterSettings from "./pages/TransporterSettings";
import AgentManagement from "./pages/AgentManagement";
import Security from "./pages/Security";
import Accessibility from "./pages/Accessibility";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Authentication",
    to: "/auth",
    icon: <User className="h-4 w-4" />,
    page: <Auth />,
  },
  {
    title: "Login",
    to: "/login",
    icon: <User className="h-4 w-4" />,
    page: <Login />,
  },
  {
    title: "Register",
    to: "/register",
    icon: <User className="h-4 w-4" />,
    page: <Register />,
  },
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Dashboard />,
  },
  {
    title: "Profile",
    to: "/profile",
    icon: <User className="h-4 w-4" />,
    page: <Profile />,
  },
  {
    title: "Create Shipment",
    to: "/create-shipment",
    icon: <Package className="h-4 w-4" />,
    page: <CreateShipment />,
  },
  {
    title: "Find Shipments",
    to: "/find-shipments",
    icon: <Package className="h-4 w-4" />,
    page: <FindShipments />,
  },
  {
    title: "Shipment Details",
    to: "/shipment/:id",
    icon: <Package className="h-4 w-4" />,
    page: <ShipmentDetails />,
  },
  {
    title: "Manage Shipment",
    to: "/manage-shipment/:id",
    icon: <Package className="h-4 w-4" />,
    page: <ManageShipment />,
  },
  {
    title: "Messages",
    to: "/messages/:id?",
    icon: <MessageSquare className="h-4 w-4" />,
    page: <Messaging />,
  },
  {
    title: "Messaging",
    to: "/messaging",
    icon: <MessageSquare className="h-4 w-4" />,
    page: <Messaging />,
  },
  {
    title: "International Shipping",
    to: "/international-shipping",
    icon: <Globe className="h-4 w-4" />,
    page: <InternationalShipping />,
  },
  {
    title: "Transporter Settings",
    to: "/transporter-settings",
    icon: <Truck className="h-4 w-4" />,
    page: <TransporterSettings />,
  },
  {
    title: "Agent Management",
    to: "/agent-management",
    icon: <Settings className="h-4 w-4" />,
    page: <AgentManagement />,
  },
  {
    title: "Security",
    to: "/security",
    icon: <Shield className="h-4 w-4" />,
    page: <Security />,
  },
  {
    title: "Accessibility",
    to: "/accessibility",
    icon: <LifeBuoy className="h-4 w-4" />,
    page: <Accessibility />,
  },
  {
    title: "Privacy Policy",
    to: "/privacy-policy",
    icon: <Shield className="h-4 w-4" />,
    page: <PrivacyPolicy />,
  },
  {
    title: "Terms of Service",
    to: "/terms-of-service",
    icon: <Shield className="h-4 w-4" />,
    page: <TermsOfService />,
  },
  {
    title: "Reset Password",
    to: "/reset-password",
    icon: <User className="h-4 w-4" />,
    page: <ResetPassword />,
  },
];
