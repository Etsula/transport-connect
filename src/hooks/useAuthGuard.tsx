
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useAuthGuard = (requiredUserType?: string) => {
  const { authenticated, userData, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      if (!authenticated) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access this page",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      if (requiredUserType && userData.userType !== requiredUserType) {
        toast({
          title: "Access Denied",
          description: `This page requires ${requiredUserType} access`,
          variant: "destructive"
        });
        navigate('/dashboard');
        return;
      }
    }
  }, [authenticated, userData, loading, requiredUserType, navigate, toast]);

  return { authenticated: authenticated && (!requiredUserType || userData.userType === requiredUserType), loading };
};
