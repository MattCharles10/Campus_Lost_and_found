import React, { createContext, useState, useContext, useEffect } from 'react';

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Login attempt:', email);
      // Mock login for now
      const mockUser = { 
        id: 1, 
        email, 
        firstName: 'John', 
        lastName: 'Doe',
        studentId: 'STU12345'
      };
      localStorage.setItem('token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Register attempt:', userData);
      // Mock registration for now
      const mockUser = { 
        id: 2, 
        ...userData 
      };
      localStorage.setItem('token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const googleLogin = async (accessToken) => {
    try {
      console.log('Google login:', accessToken);
      // Mock Google login for now
      const mockUser = { 
        id: 3, 
        email: 'google@user.com', 
        firstName: 'Google', 
        lastName: 'User',
        studentId: 'GOOG123'
      };
      localStorage.setItem('token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Google login failed' };
    }
  };

  const forgotPassword = async (email) => {
    console.log('Forgot password:', email);
    return { success: true };
  };

  const resetPassword = async (token, newPassword) => {
    console.log('Reset password:', token, newPassword);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    googleLogin,
    forgotPassword,
    resetPassword,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};