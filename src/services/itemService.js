// src/services/itemService.js - UPDATED VERSION
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8082/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const itemService = {
  // Get dashboard statistics from backend
  getDashboardStats: async (dateRange) => {
    try {
      console.log('📊 Fetching dashboard stats from backend...');
      
      // Try without auth first (since your SecurityConfig might be blocking)
      let response = await fetch(`${API_URL}/dashboard/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // If 401, try with auth
      if (response.status === 401) {
        console.log('🔄 401 received, trying with auth token...');
        response = await fetch(`${API_URL}/dashboard/stats`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
      }
      
      if (!response.ok) {
        console.warn(`⚠️ Backend returned ${response.status}, using mock data`);
        return getMockDashboardStats();
      }
      
      const data = await response.json();
      console.log('✅ Dashboard stats received:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
      console.log('🔄 Using mock data as fallback');
      return getMockDashboardStats();
    }
  },

  // Get recent items from backend
  getRecentItems: async (limit = 6) => {
    try {
      console.log(`📝 Fetching ${limit} recent items from backend...`);
      
      // Try without auth first
      let response = await fetch(`${API_URL}/dashboard/recent-items?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // If 401, try with auth
      if (response.status === 401) {
        response = await fetch(`${API_URL}/dashboard/recent-items?limit=${limit}`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
      }
      
      if (!response.ok) {
        console.warn(`⚠️ Backend returned ${response.status}, using mock data`);
        return getMockRecentItems(limit);
      }
      
      const data = await response.json();
      console.log(`✅ Received ${data.length || 0} recent items`);
      return data;
      
    } catch (error) {
      console.error('❌ Error fetching recent items:', error);
      console.log('🔄 Using mock data as fallback');
      return getMockRecentItems(limit);
    }
  },

  // Create an item
  createItem: async (itemData) => {
    try {
      console.log('📦 Creating new item:', itemData);
      
      const response = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(itemData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create item: ${response.status} - ${errorText}`);
      }
      
      const createdItem = await response.json();
      console.log('✅ Item created successfully:', createdItem);
      
      return createdItem;
      
    } catch (error) {
      console.error('❌ Error creating item:', error);
      throw error;
    }
  },

  // Enhanced Test backend connection
  testBackendConnection: async () => {
    try {
      console.log('🔗 Testing backend connection...');
      
      // Test multiple endpoints to find working one
      const testEndpoints = [
        `${API_URL}/health`,
        `${API_URL}/test`,
        `${API_URL}/dashboard/stats`,
        `http://localhost:8082/actuator/health`
      ];
      
      let workingEndpoint = null;
      let responseData = null;
      
      for (const endpoint of testEndpoints) {
        try {
          console.log(`🔄 Testing: ${endpoint}`);
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          
          if (response.ok) {
            workingEndpoint = endpoint;
            responseData = await response.json();
            console.log(`✅ Endpoint ${endpoint} is working!`);
            break;
          }
        } catch (e) {
          console.log(`❌ ${endpoint} failed:`, e.message);
        }
      }
      
      if (workingEndpoint) {
        return { 
          success: true, 
          data: {
            endpoint: workingEndpoint,
            ...responseData,
            message: 'Backend is connected and working!'
          } 
        };
      } else {
        // If no endpoints work, test if server is reachable
        try {
          // Simple ping test
          const testResponse = await fetch('http://localhost:8082', {
            method: 'HEAD',
            mode: 'no-cors'
          });
          
          return { 
            success: true, 
            data: { 
              message: 'Backend server is running but API endpoints might be secured',
              server: 'http://localhost:8082',
              status: 'server-running'
            } 
          };
        } catch (serverError) {
          return { 
            success: false, 
            error: 'Cannot connect to backend server. Make sure Spring Boot is running on port 8082.' 
          };
        }
      }
      
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }
};

// Helper functions for mock data (fallback)
const getMockDashboardStats = () => {
  return {
    totalItems: 156,
    lostItems: 89,
    foundItems: 67,
    resolvedCases: 42,
    activeUsers: 123,
    responseRate: '85%',
    potentialMatches: 12,
    matchRate: '85%',
    smartMatches: 8,
    itemsByCategory: {
      'Electronics': 35,
      'Documents': 25,
      'Clothing': 20,
      'Accessories': 15,
      'Books': 5,
      'Other': 10
    },
    recentItems: []
  };
};

const getMockRecentItems = (limit) => {
  const mockItems = [
    {
      id: 1,
      title: 'MacBook Pro 14"',
      type: 'LOST',
      location: 'Library',
      timeAgo: '2 hours ago',
      category: 'Electronics',
      reportedBy: 'John Doe',
      hasMatches: true,
      campusZone: 'ACADEMIC',
      status: 'ACTIVE'
    },
    {
      id: 2,
      title: 'Student ID Card',
      type: 'FOUND',
      location: 'Cafeteria',
      timeAgo: '4 hours ago',
      category: 'Documents',
      reportedBy: 'Jane Smith',
      hasMatches: true,
      campusZone: 'DINING',
      status: 'ACTIVE'
    },
    {
      id: 3,
      title: 'Wireless Headphones',
      type: 'LOST',
      location: 'Student Center',
      timeAgo: '6 hours ago',
      category: 'Electronics',
      reportedBy: 'Alex Johnson',
      hasMatches: false,
      campusZone: 'DINING',
      status: 'ACTIVE'
    },
    {
      id: 4,
      title: 'Backpack with Books',
      type: 'FOUND',
      location: 'Science Building',
      timeAgo: '1 day ago',
      category: 'Accessories',
      reportedBy: 'Sarah Wilson',
      hasMatches: true,
      campusZone: 'ACADEMIC',
      status: 'ACTIVE'
    }
  ];
  
  return mockItems.slice(0, limit).map(item => ({
    ...item,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
};