const API_URL = 'http://localhost:8082';

export const authService = {
  // Login with email/password - ENHANCED VERSION
  async login(email, password) {
    try {
      console.log('🔍 [authService] Login attempt for:', email);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Add this for CORS with credentials
      });
      
      console.log('🔍 [authService] Response status:', response.status);
      console.log('🔍 [authService] Response headers:', Object.fromEntries([...response.headers.entries()]));
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('🔍 [authService] Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await response.json();
      console.log('🔍 [authService] Response data:', data);
      
      if (!response.ok) {
        // Extract error message properly
        let errorMsg = 'Login failed';
        
        if (data && data.message) {
          errorMsg = data.message;
        } else if (data && data.error) {
          errorMsg = data.error;
        } else if (data && data.data) {
          errorMsg = typeof data.data === 'string' ? data.data : JSON.stringify(data.data);
        }
        
        console.error('🔍 [authService] Login failed:', errorMsg);
        throw new Error(errorMsg);
      }
      
      console.log('🔍 [authService] Login successful, token:', data.token ? 'YES' : 'NO');
      
      // Save token to localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('🔍 [authService] Saved to localStorage');
      } else {
        console.warn('🔍 [authService] No token in response!');
      }
      
      return data;
    } catch (error) {
      console.error('❌ [authService] Login error:', error.message);
      console.log('❌ [authService] Login error:', error.message);
      throw error;
    }
  },
async register(userData) {
 try {
    console.log('🔍 [authService] Register attempt:', userData);
    
    // DO NOT remove confirmPassword! Backend needs it!
    // Just send the data as-is
    console.log('🔍 [authService] Sending to backend (including confirmPassword):', userData);
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(userData), // Send userData as-is
      credentials: 'include'
    });
    console.log('🔍 [authService] Response status:', response.status);
    
    const data = await response.json();
    console.log('🔍 [authService] Response data:', data);
    
    if (!response.ok) {
      // Handle validation errors from backend - IMPROVED
      let errorMessage = 'Registration failed';
      
      if (data && data.message) {
        errorMessage = data.message;
      }
      
      // Show specific validation errors if available
      if (data && data.errors && Array.isArray(data.errors)) {
        const validationErrors = data.errors
          .map(err => `${err.field || 'field'}: ${err.defaultMessage || err.message}`)
          .join(', ');
        
        if (validationErrors) {
          errorMessage = `Validation errors: ${validationErrors}`;
        }
      } else if (data && data.data && typeof data.data === 'object') {
        // Alternative error format
        const validationErrors = Object.values(data.data).join(', ');
        errorMessage = validationErrors || errorMessage;
      }
      
      console.error('🔍 [authService] Registration failed with details:', {
        errorMessage,
        errors: data.errors,
        fullResponse: data
      });
      
      throw new Error(errorMessage);
    }
    
    console.log('🔍 [authService] Registration successful, token:', data.token ? 'YES' : 'NO');
    
    // Save token to localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('🔍 [authService] Saved to localStorage');
    }
    
    return data;
  } catch (error) {
    console.error('❌ [authService] Register error:', error.message);
    throw error;
  }
},

  // Google authentication (using your actual endpoint)
  async googleAuth(accessToken) {
    try {
      console.log('🔍 [authService] Google auth attempt');
      
      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ accessToken }),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('🔍 [authService] Google auth failed:', data.message);
        throw new Error(data.message || 'Google authentication failed');
      }
      
      // Save token to localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('❌ [authService] Google auth error:', error);
      throw error;
    }
  },

  // Google Dev authentication (for testing without real Google OAuth)
  async googleDevAuth(email, firstName, lastName) {
    try {
      console.log('🔍 [authService] Google Dev auth attempt for:', email);
      
      const response = await fetch(`${API_URL}/auth/google-dev`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, firstName, lastName }),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('🔍 [authService] Google Dev auth failed:', data.message);
        throw new Error(data.message || 'Google Dev authentication failed');
      }
      
      // Save token to localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('❌ [authService] Google Dev auth error:', error);
      throw error;
    }
  },

  // Forgot password
async forgotPassword(email) {
  try {
    console.log('🔍 [authService] Forgot password for:', email);
    
    // Add /api/ in the URL!
    const response = await fetch(`${API_URL}/api/auth/forgot-password?email=${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
      // Remove credentials: 'include' unless you need cookies
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('🔍 [authService] Forgot password failed:', data.message);
      throw new Error(data.message || 'Forgot password failed');
    }
    
    return data;
  } catch (error) {
    console.error('❌ [authService] Forgot password error:', error);
    throw error;
  }
},

// Reset password
async resetPassword(token, newPassword) {
  try {
    console.log('🔍 [authService] Reset password attempt');
  
    const response = await fetch(
      `${API_URL}/api/auth/reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`, 
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('🔍 [authService] Reset password failed:', data.message);
      throw new Error(data.message || 'Reset password failed');
    }
    
    return data;
  } catch (error) {
    console.error('❌ [authService] Reset password error:', error);
    throw error;
  }
},

// Validate
async validateResetToken(token) {
  try {
    console.log('🔍 [authService] Validate token attempt');
    
    // Add /api/ 
    const response = await fetch(`${API_URL}/api/auth/validate-reset-token?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('🔍 [authService] Token validation failed:', data.message);
      throw new Error(data.message || 'Token validation failed');
    }
    
    return data;
  } catch (error) {
    console.error('❌ [authService] Token validation error:', error);
    throw error;
  }
},

  // Logout (client-side only)
  logout() {
    console.log('🔍 [authService] Logout called');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve({ success: true, message: 'Logged out successfully' });
  },

  // Get current user from localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      console.log('🔍 [authService] No user in localStorage');
      return null;
    }
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('❌ [authService] Error parsing user from localStorage:', error);
      localStorage.removeItem('user');
      return null;
    }
  },

  // Get auth token from localStorage
  getToken() {
    const token = localStorage.getItem('token');
    console.log('🔍 [authService] getToken:', token ? 'Token exists' : 'No token');
    return token;
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const isAuth = !!token;
    console.log('🔍 [authService] isAuthenticated:', isAuth);
    return isAuth;
  }
};

export default authService;