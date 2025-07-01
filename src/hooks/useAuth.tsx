
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  id: string;
  email: string;
  userType: string;
  profile?: {
    company_name?: string;
    phone?: string;
    is_verified?: boolean;
  };
}

interface AuthContextType {
  authenticated: boolean;
  userData: UserData;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a default implementation for when used outside provider
    const [userData, setUserData] = useState<UserData>({
      id: '',
      email: '',
      userType: 'shipper'
    });
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const login = async (email: string, password: string): Promise<boolean> => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        if (data.user) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          setUserData({
            id: data.user.id,
            email: data.user.email || '',
            userType: profile?.user_type || 'shipper',
            profile: profile || undefined
          });
          setAuthenticated(true);
          return true;
        }
        return false;
      } catch (error: any) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      } finally {
        setLoading(false);
      }
    };

    const logout = async () => {
      await supabase.auth.signOut();
      setAuthenticated(false);
      setUserData({ id: '', email: '', userType: 'shipper' });
    };

    const refreshProfile = async () => {
      if (!userData.id) return;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData.id)
        .single();

      if (profile) {
        setUserData(prev => ({
          ...prev,
          userType: profile.user_type || 'shipper',
          profile: profile
        }));
      }
    };

    useEffect(() => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setUserData({
            id: session.user.id,
            email: session.user.email || '',
            userType: profile?.user_type || 'shipper',
            profile: profile || undefined
          });
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          setUserData({ id: '', email: '', userType: 'shipper' });
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    }, []);

    return {
      authenticated,
      userData,
      loading,
      login,
      logout,
      refreshProfile
    };
  }
  return context;
};
