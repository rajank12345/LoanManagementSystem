import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated');
      const loginTime = localStorage.getItem('loginTime');
      let valid = false;

      if (authStatus === 'true' && loginTime) {
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);
        if (hoursDiff < 24) {
          valid = true;
        } else {
          // Session expired
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('loginTime');
        }
      } else {
        // Not authenticated or missing loginTime
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('loginTime');
      }

      setIsAuthenticated(valid);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('loginTime', new Date().toISOString());
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('loginTime');
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  };
}