import { HomeIcon, UserIcon, ShieldIcon, FileTextIcon, GlobeIcon, MessageSquareIcon, PackageIcon, TruckIcon, DollarSignIcon } from "lucide-react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CreateShipment from "./pages/CreateShipment";
import FindShipments from "./pages/FindShipments";
import ShipmentDetails from "./pages/ShipmentDetails";
import ManageShipment from "./pages/ManageShipment";
import Messaging from "./pages/Messaging";
import InternationalShipping from "./pages/InternationalShipping";
import TransporterSettings from "./pages/TransporterSettings";
import AgentManagement from "./pages/AgentManagement";
import Security from "./pages/Security";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Accessibility from "./pages/Accessibility";
import ResetPassword from "./pages/ResetPassword";
import Subscription from "./pages/Subscription";
import APIManagement from "./pages/APIManagement";
import DeveloperPortal from "./pages/DeveloperPortal";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Dashboard />,
  },
  {
    title: "Auth",
    to: "/auth",
    icon: <UserIcon className="h-4 w-4" />,
    page: <Auth />,
  },
  {
    title: "Login",
    to: "/login",
    icon: <UserIcon className="h-4 w-4" />,
    page: <Login />,
  },
  {
    title: "Register",
    to: "/register",
    icon: <UserIcon className="h-4 w-4" />,
    page: <Register />,
  },
  {
    title: "Profile",
    to: "/profile",
    icon: <UserIcon className="h-4 w-4" />,
    page: <Profile />,
  },
  {
    title: "Create Shipment",
    to: "/create-shipment",
    icon: <PackageIcon className="h-4 w-4" />,
    page: <CreateShipment />,
  },
  {
    title: "Find Shipments",
    to: "/find-shipments",
    icon: <TruckIcon className="h-4 w-4" />,
    page: <FindShipments />,
  },
  {
    title: "Shipment Details",
    to: "/shipment/:id",
    icon: <PackageIcon className="h-4 w-4" />,
    page: <ShipmentDetails />,
  },
  {
    title: "Manage Shipment",
    to: "/manage/:id",
    icon: <PackageIcon className="h-4 w-4" />,
    page: <ManageShipment />,
  },
  {
    title: "Messaging",
    to: "/messaging",
    icon: <MessageSquareIcon className="h-4 w-4" />,
    page: <Messaging />,
  },
  {
    title: "Messages",
    to: "/messages/:id",
    icon: <MessageSquareIcon className="h-4 w-4" />,
    page: <Messaging />,
  },
  {
    title: "International Shipping",
    to: "/international-shipping",
    icon: <GlobeIcon className="h-4 w-4" />,
    page: <InternationalShipping />,
  },
  {
    title: "Transporter Settings",
    to: "/transporter-settings",
    icon: <TruckIcon className="h-4 w-4" />,
    page: <TransporterSettings />,
  },
  {
    title: "Agent Management",
    to: "/agent-management",
    icon: <UserIcon className="h-4 w-4" />,
    page: <AgentManagement />,
  },
  {
    title: "Security",
    to: "/security",
    icon: <ShieldIcon className="h-4 w-4" />,
    page: <Security />,
  },
  {
    title: "Privacy Policy",
    to: "/privacy",
    icon: <FileTextIcon className="h-4 w-4" />,
    page: <PrivacyPolicy />,
  },
  {
    title: "Terms of Service",
    to: "/terms",
    icon: <FileTextIcon className="h-4 w-4" />,
    page: <TermsOfService />,
  },
  {
    title: "Accessibility",
    to: "/accessibility",
    icon: <FileTextIcon className="h-4 w-4" />,
    page: <Accessibility />,
  },
  {
    title: "Reset Password",
    to: "/reset-password",
    icon: <UserIcon className="h-4 w-4" />,
    page: <ResetPassword />,
  },
  {
    title: "Subscription & API",
    to: "/subscription",
    icon: <DollarSignIcon className="h-4 w-4" />,
    page: <Subscription />,
  },
  {
    title: "API Management",
    to: "/api-management",
    icon: <DollarSignIcon className="h-4 w-4" />,
    page: <APIManagement />,
  },
  {
    title: "Developer Portal",
    to: "/developer-portal", 
    icon: <FileTextIcon className="h-4 w-4" />,
    page: <DeveloperPortal />,
  },
];
