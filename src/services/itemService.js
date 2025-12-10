// src/services/itemService.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8082/api';

export const itemService = {
  getDashboardStats: async (dateRange) => {
    // Mock data for now
    return {
      totalItems: 156,
      lostItems: 89,
      foundItems: 67,
      resolvedCases: 42,
      activeUsers: 123,
      responseRate: '85%'
    };
  },

  getRecentItems: async (limit) => {
    // Mock data
    return [
      {
        id: 1,
        title: 'MacBook Pro 14"',
        type: 'lost',
        location: 'Library',
        timeAgo: '2 hours ago',
        category: 'Electronics',
        reportedBy: 'John Doe'
      },
      {
        id: 2,
        title: 'Student ID Card',
        type: 'found',
        location: 'Cafeteria',
        timeAgo: '4 hours ago',
        category: 'Documents',
        reportedBy: 'Jane Smith'
      }
    ];
  }
};