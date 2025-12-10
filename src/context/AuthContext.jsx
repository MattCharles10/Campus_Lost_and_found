import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Instead of verifyToken endpoint, just check if we have valid token/user in localStorage
      const token = authService.getToken();
      const storedUser = authService.getCurrentUser();
      
      if (token && storedUser) {
        // For now, trust the localStorage (in production, you'd verify with backend)
        setUser(storedUser);
      } else {
        // Clear any invalid data
        authService.logout();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.login(email, password);
      
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      const errorMsg = error.message || 'Login failed. Please check your credentials.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.register(userData);
      
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      const errorMsg = error.message || 'Registration failed. Please try again.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (accessToken) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.googleAuth(accessToken);
      
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      const errorMsg = error.message || 'Google login failed. Please try again.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Google Dev login for testing (without real Google OAuth)
  const googleDevLogin = async (email, firstName, lastName) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.googleDevAuth(email, firstName, lastName);
      
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      const errorMsg = error.message || 'Google Dev login failed. Please try again.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.forgotPassword(email);
      return { success: true, message: response.message };
    } catch (error) {
      const errorMsg = error.message || 'Failed to send reset instructions. Please try again.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.resetPassword(token, newPassword);
      return { success: true, message: response.message };
    } catch (error) {
      const errorMsg = error.message || 'Password reset failed. Please try again.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const validateResetToken = async (token) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.validateResetToken(token);
      return { success: true, data: response };
    } catch (error) {
      const errorMsg = error.message || 'Token validation failed. Please request a new reset link.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
    setLoading(false);
  };

  const clearError = () => {
    setError(null);
  };

  // Update user in state (when you get updated user data from backend)
  const updateUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const refreshUserData = async () => {
    try {
      // If you add a /me endpoint, you can fetch fresh user data here
      // const response = await authService.getCurrentUserFromAPI();
      // updateUser(response.user);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    googleLogin,
    googleDevLogin,
    forgotPassword,
    resetPassword,
    validateResetToken,
    logout,
    clearError,
    updateUser,
    refreshUserData,
    // ADDED THIS LINE:
    isAuthenticated: !!user && !!authService.getToken(),
    // Add this function to check if user should be redirected from public pages
    shouldRedirectToDashboard: () => {
      return !!user && !!authService.getToken();
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};