import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthGuard = ({ children, requireAuth = false }) => {
  const [isAuthorized, setIsAuthorized] = useState(true); // For demo purposes, always authorized
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, you would check authentication status here
    // For now, we'll just allow access to all routes
    if (requireAuth && !isAuthorized) {
      navigate('/login');
    }
  }, [requireAuth, isAuthorized, navigate]);

  // For demo purposes, always render children
  // In a real app, you would conditionally render based on auth status
  return children;
};

export default AuthGuard;