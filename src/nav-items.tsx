
import { HomeIcon, Users, Package, MessageSquare, Settings, Star, Globe, FileText, Shield, DollarSign, BarChart3, Navigation, Plane, MapPin } from "lucide-react";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    variant: "default" as const,
  },
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
    variant: "ghost" as const,
  },
  {
    title: "Create Shipment",
    to: "/create-shipment",
    icon: <Package className="h-4 w-4" />,
    variant: "ghost" as const,
  },
  {
    title: "Find Shipments",
    to: "/find-shipments",
    icon: <Package className="h-4 w-4" />,
    variant: "ghost" as const,
  },
  {
    title: "Marketplace",
    to: "/marketplace",
    icon: <Globe className="h-4 w-4" />,
    variant: "ghost" as const,
  },
  {
    title: "Messaging",
    to: "/messaging",
    icon: <MessageSquare className="h-4 w-4" />,
    variant: "ghost" as const,
  },
  {
    title: "Navigation Hub",
    to: "/navigation-hub",
    icon: <Navigation className="h-4 w-4" />,
    variant: "ghost" as const,
  },
  {
    title: "Traveler Portal",
    to: "/traveler-portal",
    icon: <Plane className="h-4 w-4" />,
    variant: "ghost" as const,
  },
  {
    title: "Performance",
    to: "/performance-dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
    variant: "ghost" as const,
  },
  {
    title: "Referral Program",
    to: "/referral-program",
    icon: <Users className="h-4 w-4" />,
    variant: "ghost" as const,
  },
  {
    title: "International",
    to: "/international-shipping",
    icon: <Globe className="h-4 w-4" />,
    variant: "ghost" as const,
  },
  {
    title: "Earnings",
    to: "/transporter-earnings",
    icon: <DollarSign className="h-4 w-4" />,
    variant: "ghost" as const,
  },
  {
    title: "GDPR Compliance",
    to: "/gdpr-compliance",
    icon: <Shield className="h-4 w-4" />,
    variant: "ghost" as const,
  },
  {
    title: "Agent Management",
    to: "/agent-management",
    icon: <Users className="h-4 w-4" />,
    variant: "ghost" as const,
  },
  {
    title: "API Management",
    to: "/api-management",
    icon: <FileText className="h-4 w-4" />,
    variant: "ghost" as const,
  },
  {
    title: "Subscription",
    to: "/subscription",
    icon: <Star className="h-4 w-4" />,
    variant: "ghost" as const,
  },
  {
    title: "Developer Portal",
    to: "/developer-portal",
    icon: <FileText className="h-4 w-4" />,
    variant: "ghost" as const,
  },
  {
    title: "Profile",
    to: "/profile",
    icon: <Settings className="h-4 w-4" />,
    variant: "ghost" as const,
  },
];
