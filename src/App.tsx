
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import CreateShipment from "@/pages/CreateShipment";
import InternationalShipping from "@/pages/InternationalShipping";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navigation from "@/components/Navigation";

function App() {
  return (
    <Router>
      <Navigation />
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
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
