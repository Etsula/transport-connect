
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  userType: string;
  id: string | null;
  email?: string;
  profile?: {
    company_name?: string;
    phone?: string;
  };
}

export const useAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData>({
    userType: "shipper",
    id: null
  });
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await fetchUserProfile(session.user.id);
          setAuthenticated(true);
        } else if (event === 'SIGNED_OUT') {
          setUserData({ userType: "shipper", id: null });
          setAuthenticated(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("user_type, company_name, phone")
        .eq("id", userId)
        .single();
        
      if (error) throw error;
      
      const { data: { user } } = await supabase.auth.getUser();
      
      setUserData({
        userType: profileData.user_type,
        id: userId,
        email: user?.email,
        profile: {
          company_name: profileData.company_name,
          phone: profileData.phone
        }
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Sign out failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const requireAuth = () => {
    if (!authenticated) {
      navigate("/auth");
      return false;
    }
    return true;
  };

  return {
    userData,
    loading,
    authenticated,
    signOut,
    requireAuth,
    refreshProfile: () => userData.id && fetchUserProfile(userData.id)
  };
};
