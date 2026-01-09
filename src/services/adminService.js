// src/services/adminService.js

// Mock data for demonstration
const mockUnverifiedUsers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@university.edu',
    studentId: 'S123456',
    registeredAt: '2024-01-15T10:30:00Z',
    status: 'pending'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@university.edu',
    studentId: 'S789012',
    registeredAt: '2024-01-16T14:45:00Z',
    status: 'pending'
  },
  {
    id: 3,
    name: 'Mike Brown',
    email: 'mike.brown@college.edu',
    studentId: 'S345678',
    registeredAt: '2024-01-17T09:15:00Z',
    status: 'pending'
  }
];

const mockFlaggedContent = [
  {
    id: 1,
    title: 'Suspicious laptop listing',
    type: 'FOUND',
    location: 'Unknown',
    description: 'Item description seems inappropriate',
    reportedBy: 'User123',
    flagReason: 'Inappropriate content',
    flaggedAt: '2024-01-16T11:20:00Z',
    status: 'pending'
  },
  {
    id: 2,
    title: 'Missing wallet with personal info',
    type: 'LOST',
    location: 'Student Center',
    description: 'Contains sensitive information',
    reportedBy: 'User456',
    flagReason: 'Sensitive personal information',
    flaggedAt: '2024-01-17T15:30:00Z',
    status: 'pending'
  }
];

const mockPlatformStats = {
  totalUsers: 156,
  verifiedUsers: 151,
  pendingVerifications: 5,
  totalItems: 234,
  resolvedItems: 156,
  activeItems: 78,
  flaggedContent: 3,
  dailyActiveUsers: 89,
  matchSuccessRate: 72,
  avgResolutionTime: '2.4 hours'
};

class AdminService {
  // Get admin dashboard statistics
  async getAdminStats() {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        data: mockPlatformStats
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      return {
        success: false,
        error: 'Failed to fetch admin statistics'
      };
    }
  }

  // Get unverified users
  async getUnverifiedUsers() {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        success: true,
        data: mockUnverifiedUsers
      };
    } catch (error) {
      console.error('Error fetching unverified users:', error);
      return {
        success: false,
        error: 'Failed to fetch unverified users'
      };
    }
  }

  // Get flagged content for moderation
  async getFlaggedContent() {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        success: true,
        data: mockFlaggedContent
      };
    } catch (error) {
      console.error('Error fetching flagged content:', error);
      return {
        success: false,
        error: 'Failed to fetch flagged content'
      };
    }
  }

  // Approve a user's campus verification
  async approveUser(userId) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Find and update user in mock data
      const userIndex = mockUnverifiedUsers.findIndex(u => u.id === userId);
      if (userIndex > -1) {
        mockUnverifiedUsers.splice(userIndex, 1);
      }
      
      return {
        success: true,
        message: 'User approved successfully'
      };
    } catch (error) {
      console.error('Error approving user:', error);
      return {
        success: false,
        error: 'Failed to approve user'
      };
    }
  }

  // Reject a user's campus verification
  async rejectUser(userId) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Find and remove user from mock data
      const userIndex = mockUnverifiedUsers.findIndex(u => u.id === userId);
      if (userIndex > -1) {
        mockUnverifiedUsers.splice(userIndex, 1);
      }
      
      return {
        success: true,
        message: 'User rejected successfully'
      };
    } catch (error) {
      console.error('Error rejecting user:', error);
      return {
        success: false,
        error: 'Failed to reject user'
      };
    }
  }

  // Approve flagged content (keep it on platform)
  async approveContent(contentId) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Find and remove content from flagged list
      const contentIndex = mockFlaggedContent.findIndex(c => c.id === contentId);
      if (contentIndex > -1) {
        mockFlaggedContent.splice(contentIndex, 1);
      }
      
      return {
        success: true,
        message: 'Content approved successfully'
      };
    } catch (error) {
      console.error('Error approving content:', error);
      return {
        success: false,
        error: 'Failed to approve content'
      };
    }
  }

  // Delete flagged content (remove from platform)
  async deleteContent(contentId) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Find and remove content from flagged list
      const contentIndex = mockFlaggedContent.findIndex(c => c.id === contentId);
      if (contentIndex > -1) {
        mockFlaggedContent.splice(contentIndex, 1);
      }
      
      return {
        success: true,
        message: 'Content deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting content:', error);
      return {
        success: false,
        error: 'Failed to delete content'
      };
    }
  }

  // Get platform analytics data
  async getAnalytics(timeRange = 'week') {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock analytics data based on time range
      const analyticsData = {
        week: {
          totalReports: 56,
          resolvedReports: 42,
          newUsers: 23,
          activeUsers: 156,
          matchRate: 78,
          topCategories: [
            { name: 'Electronics', count: 18 },
            { name: 'Documents', count: 12 },
            { name: 'Clothing', count: 10 },
            { name: 'Accessories', count: 8 },
            { name: 'Other', count: 8 }
          ],
          topLocations: [
            { name: 'Main Library', count: 15 },
            { name: 'Student Center', count: 12 },
            { name: 'Cafeteria', count: 8 },
            { name: 'Science Building', count: 6 },
            { name: 'Sports Complex', count: 4 }
          ],
          dailyStats: [
            { date: 'Mon', reports: 8, resolved: 6 },
            { date: 'Tue', reports: 10, resolved: 8 },
            { date: 'Wed', reports: 12, resolved: 9 },
            { date: 'Thu', reports: 9, resolved: 7 },
            { date: 'Fri', reports: 8, resolved: 6 },
            { date: 'Sat', reports: 5, resolved: 3 },
            { date: 'Sun', reports: 4, resolved: 3 }
          ]
        },
        month: {
          totalReports: 234,
          resolvedReports: 156,
          newUsers: 89,
          activeUsers: 423,
          matchRate: 72,
          topCategories: [
            { name: 'Electronics', count: 82 },
            { name: 'Documents', count: 56 },
            { name: 'Clothing', count: 42 },
            { name: 'Accessories', count: 32 },
            { name: 'Other', count: 22 }
          ],
          topLocations: [
            { name: 'Main Library', count: 67 },
            { name: 'Student Center', count: 56 },
            { name: 'Cafeteria', count: 42 },
            { name: 'Science Building', count: 31 },
            { name: 'Sports Complex', count: 18 }
          ]
        },
        quarter: {
          totalReports: 689,
          resolvedReports: 512,
          newUsers: 234,
          activeUsers: 956,
          matchRate: 74,
          topCategories: [
            { name: 'Electronics', count: 245 },
            { name: 'Documents', count: 167 },
            { name: 'Clothing', count: 123 },
            { name: 'Accessories', count: 89 },
            { name: 'Other', count: 65 }
          ]
        }
      };
      
      return {
        success: true,
        data: analyticsData[timeRange] || analyticsData.week
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return {
        success: false,
        error: 'Failed to fetch analytics data'
      };
    }
  }

  // Export platform data
  async exportData(format = 'csv') {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real application, this would generate a file
      const exportData = {
        format,
        data: {
          users: [...mockUnverifiedUsers],
          items: [...mockFlaggedContent],
          stats: mockPlatformStats
        },
        timestamp: new Date().toISOString()
      };
      
      return {
        success: true,
        data: exportData,
        message: `Data exported successfully in ${format.toUpperCase()} format`
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      return {
        success: false,
        error: 'Failed to export data'
      };
    }
  }

  // Get user activity logs
  async getUserActivity(userId) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockActivity = [
        {
          id: 1,
          action: 'ITEM_REPORTED',
          description: 'Reported a lost laptop',
          timestamp: '2024-01-15T14:30:00Z',
          itemId: 123
        },
        {
          id: 2,
          action: 'MESSAGE_SENT',
          description: 'Sent message about found item',
          timestamp: '2024-01-16T09:15:00Z',
          itemId: 124
        },
        {
          id: 3,
          action: 'ITEM_RESOLVED',
          description: 'Successfully recovered lost item',
          timestamp: '2024-01-17T16:45:00Z',
          itemId: 123
        }
      ];
      
      return {
        success: true,
        data: mockActivity
      };
    } catch (error) {
      console.error('Error fetching user activity:', error);
      return {
        success: false,
        error: 'Failed to fetch user activity'
      };
    }
  }

  // Update user role or permissions
  async updateUserRole(userId, newRole) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return {
        success: true,
        message: `User role updated to ${newRole}`
      };
    } catch (error) {
      console.error('Error updating user role:', error);
      return {
        success: false,
        error: 'Failed to update user role'
      };
    }
  }

  // Send system notification to users
  async sendSystemNotification(title, message, target = 'all') {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        success: true,
        message: `Notification sent to ${target} users`
      };
    } catch (error) {
      console.error('Error sending notification:', error);
      return {
        success: false,
        error: 'Failed to send notification'
      };
    }
  }
}

export const adminService = new AdminService();