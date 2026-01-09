package com.campus.lostfound.service;

import com.campus.lostfound.dto.ChatMessageDTO;

import java.util.List;
import java.util.Map;

public interface ChatService {
    ChatMessageDTO sendMessage(Long senderId, Long receiverId, Long itemId, String message);
    List<ChatMessageDTO> getConversation(Long user1Id, Long user2Id, Long itemId);

    // Fix return type using Map with specific value types
    List<Map<String, Object>> getUserChats(Long userId);

    Long getUnreadCount(Long userId);
    void markAsRead(Long messageId, Long userId);
    void markAllAsRead(Long userId);
    void deleteMessage(Long messageId, Long userId);
}