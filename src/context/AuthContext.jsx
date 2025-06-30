import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication
    const storedUserId = localStorage.getItem('userId');
    const storedToken = localStorage.getItem('token');
    
    if (storedUserId && storedToken) {
      setUser({ 
        id: storedUserId, 
        email: localStorage.getItem('userEmail') || 'user@example.com'
      });
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  const signIn = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('userId', userData.userId);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('userEmail', userData.email || 'user@example.com');
  };

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
  };

  const value = {
    user,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};