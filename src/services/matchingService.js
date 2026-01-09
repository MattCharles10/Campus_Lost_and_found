// src/services/matchingService.js

class MatchingService {
  // Get matching statistics
  async getMatchingStats() {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        success: true,
        data: {
          potentialMatches: 12,
          matchRate: '85%',
          smartMatches: 8,
          averageSimilarity: 78,
          matchesToday: 3
        }
      };
    } catch (error) {
      console.error('Error fetching matching stats:', error);
      return {
        success: false,
        error: 'Failed to fetch matching statistics'
      };
    }
  }

  // Get campus zones for location-based search
  async getCampusZones() {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const zones = [
        'Main Library',
        'Student Center',
        'Science Building',
        'Cafeteria',
        'Sports Complex',
        'Dormitory Area',
        'Parking Lots',
        'Academic Buildings',
        'Administration Building',
        'Recreation Center'
      ];
      
      return {
        success: true,
        data: zones
      };
    } catch (error) {
      console.error('Error fetching campus zones:', error);
      return {
        success: false,
        error: 'Failed to fetch campus zones'
      };
    }
  }

  // Get smart matches for an item
  async getSmartMatches(itemId, itemType) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock smart matches data
      const mockMatches = [
        {
          similarityScore: 92,
          matchLevel: "EXCELLENT",
          qualityColor: "#10b981",
          matchReasons: [
            "Same category: Electronics",
            "Same location: Library area",
            "Same brand: Apple",
            "Same color: Space Gray",
            "Reported within 2 hours difference"
          ],
          lostItem: {
            id: itemId,
            title: "MacBook Pro 14-inch",
            type: itemType === "LOST" ? "LOST" : "FOUND",
            category: "ELECTRONICS",
            location: "Main Library",
            campusZone: "ACADEMIC",
            building: "Main Library",
            color: "Space Gray",
            brand: "Apple",
            model: "M3 Pro",
            status: "ACTIVE",
            createdAt: new Date().toISOString(),
            description: "Lost my MacBook in the library yesterday. It has a sticker on the back."
          },
          foundItem: {
            id: itemId === 1 ? 2 : 1,
            title: "Found MacBook laptop in library",
            type: itemType === "LOST" ? "FOUND" : "LOST",
            category: "ELECTRONICS",
            location: "Library computer lab",
            campusZone: "ACADEMIC",
            building: "Main Library",
            color: "Space Gray",
            brand: "Apple",
            status: "ACTIVE",
            createdAt: new Date().toISOString(),
            description: "Found a MacBook near the computers. Has a space gray finish."
          }
        },
        {
          similarityScore: 78,
          matchLevel: "HIGH",
          qualityColor: "#3b82f6",
          matchReasons: [
            "Same category: Electronics",
            "Similar description keywords",
            "Same brand: Apple",
            "Reported within 3 days"
          ],
          lostItem: {
            id: itemId,
            title: "MacBook Pro 14-inch",
            type: itemType === "LOST" ? "LOST" : "FOUND",
            category: "ELECTRONICS",
            location: "Main Library",
            campusZone: "ACADEMIC",
            status: "ACTIVE",
            createdAt: new Date().toISOString(),
            description: "Lost my MacBook in the library yesterday."
          },
          foundItem: {
            id: 3,
            title: "Found MacBook Air in cafeteria",
            type: itemType === "LOST" ? "FOUND" : "LOST",
            category: "ELECTRONICS",
            location: "Cafeteria",
            campusZone: "DINING",
            building: "Student Center",
            color: "Silver",
            brand: "Apple",
            status: "ACTIVE",
            createdAt: new Date().toISOString(),
            description: "Found a MacBook Air in the cafeteria near the food court."
          }
        }
      ];
      
      return {
        success: true,
        data: mockMatches
      };
    } catch (error) {
      console.error('Error fetching smart matches:', error);
      return {
        success: false,
        error: 'Failed to fetch smart matches'
      };
    }
  }

  // Get location-based suggestions
  async getLocationSuggestions(location, radius = '500m') {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        success: true,
        data: {
          location: location,
          radius: radius,
          suggestions: [
            { id: 1, title: 'Lost Wallet', distance: '150m', type: 'LOST' },
            { id: 2, title: 'Found Keys', distance: '250m', type: 'FOUND' },
            { id: 3, title: 'Lost Phone', distance: '400m', type: 'LOST' }
          ]
        }
      };
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      return {
        success: false,
        error: 'Failed to fetch location suggestions'
      };
    }
  }
}

export const matchingService = new MatchingService();