// src/services/chatService.js

// Mock chat data
const mockChats = [
  {
    id: 1,
    userId: 2,
    userName: 'John Doe',
    userAvatar: 'JD',
    lastMessage: 'Is this your MacBook?',
    timestamp: '2024-01-17T14:30:00Z',
    unread: true,
    itemId: 1,
    itemTitle: 'MacBook Pro 14"'
  },
  {
    id: 2,
    userId: 3,
    userName: 'Jane Smith',
    userAvatar: 'JS',
    lastMessage: 'I found your student ID',
    timestamp: '2024-01-17T12:15:00Z',
    unread: false,
    itemId: 2,
    itemTitle: 'Student ID Card'
  },
  {
    id: 3,
    userId: 4,
    userName: 'Alex Johnson',
    userAvatar: 'AJ',
    lastMessage: 'Can you describe the backpack?',
    timestamp: '2024-01-16T16:45:00Z',
    unread: false,
    itemId: 4,
    itemTitle: 'Backpack with Books'
  }
];

const mockMessages = {
  1: [
    {
      id: 1,
      text: 'Hello, I think I found your MacBook Pro at the library.',
      senderId: 2,
      senderName: 'John Doe',
      timestamp: '2024-01-17T14:25:00Z',
      isOwn: false
    },
    {
      id: 2,
      text: 'Really? That\'s great news! Can you describe it?',
      senderId: 1,
      senderName: 'You',
      timestamp: '2024-01-17T14:27:00Z',
      isOwn: true
    },
    {
      id: 3,
      text: 'It has a space gray finish and an Apple logo sticker on the back.',
      senderId: 2,
      senderName: 'John Doe',
      timestamp: '2024-01-17T14:30:00Z',
      isOwn: false
    },
    {
      id: 4,
      text: 'Yes, that\'s definitely mine! Where can we meet?',
      senderId: 1,
      senderName: 'You',
      timestamp: '2024-01-17T14:32:00Z',
      isOwn: true
    }
  ],
  2: [
    {
      id: 5,
      text: 'Hi, I found a student ID card in the cafeteria.',
      senderId: 3,
      senderName: 'Jane Smith',
      timestamp: '2024-01-17T12:10:00Z',
      isOwn: false
    },
    {
      id: 6,
      text: 'That might be mine! What\'s the name on it?',
      senderId: 1,
      senderName: 'You',
      timestamp: '2024-01-17T12:12:00Z',
      isOwn: true
    },
    {
      id: 7,
      text: 'It says "Alex Johnson" and has student ID S123456.',
      senderId: 3,
      senderName: 'Jane Smith',
      timestamp: '2024-01-17T12:15:00Z',
      isOwn: false
    },
    {
      id: 8,
      text: 'That\'s not mine, but thanks for checking!',
      senderId: 1,
      senderName: 'You',
      timestamp: '2024-01-17T12:18:00Z',
      isOwn: true
    }
  ],
  3: [
    {
      id: 9,
      text: 'Hi, I found a backpack with books near the science building.',
      senderId: 4,
      senderName: 'Alex Johnson',
      timestamp: '2024-01-16T16:40:00Z',
      isOwn: false
    },
    {
      id: 10,
      text: 'Can you describe the backpack color?',
      senderId: 1,
      senderName: 'You',
      timestamp: '2024-01-16T16:42:00Z',
      isOwn: true
    },
    {
      id: 11,
      text: 'It\'s a blue backpack with a physics textbook inside.',
      senderId: 4,
      senderName: 'Alex Johnson',
      timestamp: '2024-01-16T16:45:00Z',
      isOwn: false
    }
  ]
};

class ChatService {
  // Get all chats for the current user
  async getChats() {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        success: true,
        data: mockChats
      };
    } catch (error) {
      console.error('Error fetching chats:', error);
      return {
        success: false,
        error: 'Failed to fetch chats'
      };
    }
  }

  // Get messages for a specific chat
  async getMessages(chatId) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const messages = mockMessages[chatId] || [];
      
      return {
        success: true,
        data: messages
      };
    } catch (error) {
      console.error('Error fetching messages:', error);
      return {
        success: false,
        error: 'Failed to fetch messages'
      };
    }
  }

  // Send a new message
  async sendMessage(chatId, message) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 150));
      
      if (!mockMessages[chatId]) {
        mockMessages[chatId] = [];
      }
      
      const newMessage = {
        id: mockMessages[chatId].length + 1,
        text: message,
        senderId: 1, // Current user ID
        senderName: 'You',
        timestamp: new Date().toISOString(),
        isOwn: true
      };
      
      mockMessages[chatId].push(newMessage);
      
      // Update chat's last message
      const chatIndex = mockChats.findIndex(chat => chat.id === chatId);
      if (chatIndex > -1) {
        mockChats[chatIndex].lastMessage = message;
        mockChats[chatIndex].timestamp = new Date().toISOString();
      }
      
      return {
        success: true,
        data: newMessage
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        error: 'Failed to send message'
      };
    }
  }

  // Start a new chat with a user about an item
  async startChat(itemId, recipientId, initialMessage) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newChatId = mockChats.length + 1;
      const newChat = {
        id: newChatId,
        userId: recipientId,
        userName: 'New User',
        userAvatar: 'NU',
        lastMessage: initialMessage,
        timestamp: new Date().toISOString(),
        unread: false,
        itemId: itemId,
        itemTitle: 'Unknown Item'
      };
      
      mockChats.unshift(newChat);
      mockMessages[newChatId] = [
        {
          id: 1,
          text: initialMessage,
          senderId: 1,
          senderName: 'You',
          timestamp: new Date().toISOString(),
          isOwn: true
        }
      ];
      
      return {
        success: true,
        data: newChat
      };
    } catch (error) {
      console.error('Error starting chat:', error);
      return {
        success: false,
        error: 'Failed to start chat'
      };
    }
  }

  // Mark messages as read
  async markAsRead(chatId) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const chatIndex = mockChats.findIndex(chat => chat.id === chatId);
      if (chatIndex > -1) {
        mockChats[chatIndex].unread = false;
      }
      
      return {
        success: true,
        message: 'Chat marked as read'
      };
    } catch (error) {
      console.error('Error marking chat as read:', error);
      return {
        success: false,
        error: 'Failed to mark chat as read'
      };
    }
  }

  // Delete a chat
  async deleteChat(chatId) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const chatIndex = mockChats.findIndex(chat => chat.id === chatId);
      if (chatIndex > -1) {
        mockChats.splice(chatIndex, 1);
      }
      
      delete mockMessages[chatId];
      
      return {
        success: true,
        message: 'Chat deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting chat:', error);
      return {
        success: false,
        error: 'Failed to delete chat'
      };
    }
  }

  // Block a user
  async blockUser(userId) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // In a real app, this would update user settings
      return {
        success: true,
        message: 'User blocked successfully'
      };
    } catch (error) {
      console.error('Error blocking user:', error);
      return {
        success: false,
        error: 'Failed to block user'
      };
    }
  }

  // Report inappropriate messages
  async reportMessage(chatId, messageId, reason) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return {
        success: true,
        message: 'Message reported successfully'
      };
    } catch (error) {
      console.error('Error reporting message:', error);
      return {
        success: false,
        error: 'Failed to report message'
      };
    }
  }

  // Get unread message count
  async getUnreadCount() {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const unreadCount = mockChats.filter(chat => chat.unread).length;
      
      return {
        success: true,
        data: unreadCount
      };
    } catch (error) {
      console.error('Error getting unread count:', error);
      return {
        success: false,
        error: 'Failed to get unread count'
      };
    }
  }

  // Search messages
  async searchMessages(query) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const results = [];
      
      // Search through all messages
      Object.entries(mockMessages).forEach(([chatId, messages]) => {
        const matchingMessages = messages.filter(msg => 
          msg.text.toLowerCase().includes(query.toLowerCase())
        );
        
        if (matchingMessages.length > 0) {
          const chat = mockChats.find(c => c.id === parseInt(chatId));
          results.push({
            chatId: parseInt(chatId),
            chatTitle: chat?.itemTitle || 'Unknown Item',
            messages: matchingMessages
          });
        }
      });
      
      return {
        success: true,
        data: results
      };
    } catch (error) {
      console.error('Error searching messages:', error);
      return {
        success: false,
        error: 'Failed to search messages'
      };
    }
  }
}

export const chatService = new ChatService();