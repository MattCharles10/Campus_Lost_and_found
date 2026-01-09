package com.campus.lostfound.repository;

import com.campus.lostfound.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query("SELECT m FROM ChatMessage m WHERE " +
            "(m.sender.id = :userId1 AND m.receiver.id = :userId2) OR " +
            "(m.sender.id = :userId2 AND m.receiver.id = :userId1) " +
            "ORDER BY m.sentAt ASC")
    List<ChatMessage> findConversation(@Param("userId1") Long userId1, @Param("userId2") Long userId2);

    @Query("SELECT m FROM ChatMessage m WHERE " +
            "(m.sender.id = :userId OR m.receiver.id = :userId) AND " +
            "m.item.id = :itemId " +
            "ORDER BY m.sentAt ASC")
    List<ChatMessage> findItemConversation(@Param("userId") Long userId, @Param("itemId") Long itemId);

    @Query("SELECT DISTINCT m.sender.id FROM ChatMessage m WHERE m.receiver.id = :userId AND m.read = false")
    List<Long> findUnreadSenders(@Param("userId") Long userId);

    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.receiver.id = :userId AND m.read = false")
    Long countUnreadMessages(@Param("userId") Long userId);

    @Query("SELECT m FROM ChatMessage m WHERE " +
            "(m.sender.id = :userId OR m.receiver.id = :userId) " +
            "AND m.deleted = false " +
            "ORDER BY m.sentAt DESC")
    List<ChatMessage> findUserMessages(@Param("userId") Long userId);

    // Add this method for counting unread messages between specific users
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE " +
            "m.sender.id = :senderId AND " +
            "m.receiver.id = :receiverId AND " +
            "m.read = false")
    Long countUnreadMessagesBetweenUsers(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);

    // Add this method for compatibility
    @Query("SELECT m FROM ChatMessage m WHERE m.receiver.id = :receiverId AND m.read = :read")
    List<ChatMessage> findByReceiverIdAndRead(@Param("receiverId") Long receiverId, @Param("read") Boolean read);
}