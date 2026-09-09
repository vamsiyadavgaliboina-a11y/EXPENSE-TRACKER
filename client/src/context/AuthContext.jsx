import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth from localStorage
  useEffect(() => {
    const storedUser = authService.getStoredUser();
    const token = authService.getToken();
    if (storedUser && token) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const register = useCallback(async (name, email, password, confirmPassword) => {
    setLoading(true);
    try {
      const response = await authService.register({
        name,
        email,
        password,
        confirmPassword,
      });
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password, twoFactorToken) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password, twoFactorToken });
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      if (error.response?.data?.code === 'TWO_FACTOR_REQUIRED') {
        toast('Enter the code from your authenticator app to continue');
        return 'requiresTwoFactor';
      }
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  }, []);

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
