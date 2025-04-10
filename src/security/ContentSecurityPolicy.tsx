
import { useEffect } from 'react';

/**
 * Component to add Content Security Policy headers to protect against XSS and other injection attacks
 * For a real production app, these would be set at the server level, but this provides some client-side protection
 */
const ContentSecurityPolicy = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Set meta tag for CSP
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = 
      "default-src 'self'; " +
      "script-src 'self' https://dfqzjnlnkesaqrrmdytz.supabase.co; " +
      "connect-src 'self' https://dfqzjnlnkesaqrrmdytz.supabase.co wss://*.supabase.co; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https://dfqzjnlnkesaqrrmdytz.supabase.co; " +
      "font-src 'self'; " +
      "object-src 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self'; " +
      "frame-ancestors 'none'; " +
      "block-all-mixed-content; " +
      "upgrade-insecure-requests;";
    
    document.head.appendChild(cspMeta);
    
    return () => {
      document.head.removeChild(cspMeta);
    };
  }, []);

  return <>{children}</>;
};

export default ContentSecurityPolicy;
