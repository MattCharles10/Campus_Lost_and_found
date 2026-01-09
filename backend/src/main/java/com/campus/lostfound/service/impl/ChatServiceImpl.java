package com.campus.lostfound.service.impl;

import com.campus.lostfound.dto.ChatMessageDTO;
import com.campus.lostfound.model.ChatMessage;
import com.campus.lostfound.model.Item;
import com.campus.lostfound.model.User;
import com.campus.lostfound.repository.ChatMessageRepository;
import com.campus.lostfound.repository.ItemRepository;
import com.campus.lostfound.service.ChatService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final ItemRepository itemRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public ChatMessageDTO sendMessage(Long senderId, Long receiverId, Long itemId, String message) {
        try {
            // Get sender using EntityManager (no repository changes)
            User sender = entityManager.find(User.class, senderId);
            if (sender == null) {
                throw new RuntimeException("Sender not found with ID: " + senderId);
            }

            // Get receiver using EntityManager
            User receiver = entityManager.find(User.class, receiverId);
            if (receiver == null) {
                throw new RuntimeException("Receiver not found with ID: " + receiverId);
            }

            ChatMessage chatMessage = ChatMessage.builder()
                    .sender(sender)
                    .receiver(receiver)
                    .message(message)
                    .sentAt(LocalDateTime.now())
                    .read(false)
                    .deleted(false)
                    .build();

            if (itemId != null) {
                Item item = itemRepository.findById(itemId)
                        .orElseThrow(() -> new RuntimeException("Item not found with ID: " + itemId));
                chatMessage.setItem(item);
            }

            ChatMessage saved = chatMessageRepository.save(chatMessage);
            log.info("Message sent from user {} to user {}", senderId, receiverId);

            // Convert to DTO
            ChatMessageDTO dto = convertToDTO(saved);
            dto.setIsOwn(true);

            return dto;
        } catch (Exception e) {
            log.error("Error sending message: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to send message: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageDTO> getConversation(Long user1Id, Long user2Id, Long itemId) {
        try {
            List<ChatMessage> messages;

            if (itemId != null) {
                messages = chatMessageRepository.findItemConversation(user1Id, itemId);
            } else {
                messages = chatMessageRepository.findConversation(user1Id, user2Id);
            }

            return messages.stream()
                    .filter(msg -> !msg.getDeleted())
                    .map(msg -> {
                        ChatMessageDTO dto = convertToDTO(msg);
                        dto.setIsOwn(msg.getSender().getId().equals(user1Id));
                        return dto;
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error getting conversation: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getUserChats(Long userId) {
        try {
            // Get all messages involving this user
            String queryStr = "SELECT m FROM ChatMessage m WHERE " +
                    "(m.sender.id = :userId OR m.receiver.id = :userId) " +
                    "AND m.deleted = false " +
                    "ORDER BY m.sentAt DESC";

            List<ChatMessage> userMessages = entityManager.createQuery(queryStr, ChatMessage.class)
                    .setParameter("userId", userId)
                    .getResultList();

            Map<Long, Map<String, Object>> chatMap = new HashMap<>();

            for (ChatMessage message : userMessages) {
                // Determine the other user in the conversation
                Long otherUserId = message.getSender().getId().equals(userId) ?
                        message.getReceiver().getId() : message.getSender().getId();

                if (!chatMap.containsKey(otherUserId)) {
                    // Get other user details
                    User otherUser = entityManager.find(User.class, otherUserId);
                    if (otherUser == null) continue;

                    // Check for unread messages
                    Long unreadCount = chatMessageRepository.countUnreadMessagesBetweenUsers(userId, otherUserId);

                    Map<String, Object> chatInfo = new HashMap<>();
                    chatInfo.put("userId", otherUser.getId());
                    chatInfo.put("userName", otherUser.getFirstName() + " " + otherUser.getLastName());
                    chatInfo.put("userEmail", otherUser.getEmail());
                    chatInfo.put("avatar", otherUser.getAvatarUrl());
                    chatInfo.put("lastMessage", message.getMessage());
                    chatInfo.put("lastMessageTime", message.getSentAt());
                    chatInfo.put("unreadCount", unreadCount);
                    chatInfo.put("hasUnread", unreadCount > 0);

                    if (message.getItem() != null) {
                        chatInfo.put("itemId", message.getItem().getId());
                        chatInfo.put("itemTitle", message.getItem().getTitle());
                    }

                    chatMap.put(otherUserId, chatInfo);
                }
            }

            return new ArrayList<>(chatMap.values());
        } catch (Exception e) {
            log.error("Error getting user chats: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Long getUnreadCount(Long userId) {
        try {
            String query = "SELECT COUNT(m) FROM ChatMessage m WHERE m.receiver.id = :userId AND m.read = false";
            return entityManager.createQuery(query, Long.class)
                    .setParameter("userId", userId)
                    .getSingleResult();
        } catch (Exception e) {
            log.error("Error getting unread count: {}", e.getMessage(), e);
            return 0L;
        }
    }

    @Override
    @Transactional
    public void markAsRead(Long messageId, Long userId) {
        try {
            ChatMessage message = chatMessageRepository.findById(messageId)
                    .orElseThrow(() -> new RuntimeException("Message not found with ID: " + messageId));

            // Check if this user is the receiver
            if (message.getReceiver().getId().equals(userId)) {
                message.setRead(true);
                message.setReadAt(LocalDateTime.now());
                chatMessageRepository.save(message);
                log.info("Message {} marked as read by user {}", messageId, userId);
            } else {
                log.warn("User {} tried to mark message {} as read but is not the receiver", userId, messageId);
            }
        } catch (Exception e) {
            log.error("Error marking message as read: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to mark message as read: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        try {
            // Update all unread messages for this user
            String query = "UPDATE ChatMessage m SET m.read = true, m.readAt = :now " +
                    "WHERE m.receiver.id = :userId AND m.read = false";

            int updatedCount = entityManager.createQuery(query)
                    .setParameter("now", LocalDateTime.now())
                    .setParameter("userId", userId)
                    .executeUpdate();

            log.info("Marked {} messages as read for user {}", updatedCount, userId);
        } catch (Exception e) {
            log.error("Error marking all messages as read: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to mark all messages as read: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void deleteMessage(Long messageId, Long userId) {
        try {
            ChatMessage message = chatMessageRepository.findById(messageId)
                    .orElseThrow(() -> new RuntimeException("Message not found with ID: " + messageId));

            // Check if this user is the sender
            if (message.getSender().getId().equals(userId)) {
                message.setDeleted(true);
                chatMessageRepository.save(message);
                log.info("Message {} deleted by sender {}", messageId, userId);
            } else {
                log.warn("User {} tried to delete message {} but is not the sender", userId, messageId);
                throw new RuntimeException("You can only delete messages you sent");
            }
        } catch (Exception e) {
            log.error("Error deleting message: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete message: " + e.getMessage());
        }
    }

    private ChatMessageDTO convertToDTO(ChatMessage message) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setId(message.getId());
        dto.setSenderId(message.getSenderId());
        dto.setSenderName(message.getSenderName());
        dto.setSenderAvatar(message.getSenderAvatar());
        dto.setReceiverId(message.getReceiverId());
        dto.setReceiverName(message.getReceiverName());
        dto.setItemId(message.getItemId());
        dto.setItemTitle(message.getItemTitle());
        dto.setMessage(message.getMessage());
        dto.setSentAt(message.getSentAt());
        dto.setFormattedTime(message.getFormattedTime());
        dto.setRead(message.getRead());
        dto.setIsOwn(false); // This will be set to true in calling methods if needed

        return dto;
    }

    // Helper method to check for unread messages between two users
    private Long getUnreadCountBetweenUsers(Long userId, Long otherUserId) {
        try {
            String query = "SELECT COUNT(m) FROM ChatMessage m WHERE " +
                    "m.sender.id = :otherUserId AND " +
                    "m.receiver.id = :userId AND " +
                    "m.read = false";

            return entityManager.createQuery(query, Long.class)
                    .setParameter("userId", userId)
                    .setParameter("otherUserId", otherUserId)
                    .getSingleResult();
        } catch (Exception e) {
            log.error("Error getting unread count between users: {}", e.getMessage(), e);
            return 0L;
        }
    }
}