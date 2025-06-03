
import { HomeIcon, Package, Users, MessageSquare, Settings, DollarSign, Share2, MapPin, Key, BookOpen, BarChart3 } from "lucide-react";

export const navItems = [
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: <HomeIcon className="h-4 w-4" />,
  },
  {
    title: "Marketplace",
    to: "/marketplace", 
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    title: "Create Shipment",
    to: "/create-shipment",
    icon: <Package className="h-4 w-4" />,
  },
  {
    title: "Find Shipments",
    to: "/find-shipments",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Earnings",
    to: "/earnings",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    title: "Referrals",
    to: "/referrals",
    icon: <Share2 className="h-4 w-4" />,
  },
  {
    title: "Messages",
    to: "/messaging",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    title: "International Shipping",
    to: "/international-shipping",
    icon: <Package className="h-4 w-4" />,
  },
  {
    title: "API Management",
    to: "/api-management",
    icon: <Key className="h-4 w-4" />,
  },
  {
    title: "Developer Portal",
    to: "/developer-portal",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    title: "Subscription",
    to: "/subscription",
    icon: <BarChart3 className="h-4 w-4" />,
  },
];
