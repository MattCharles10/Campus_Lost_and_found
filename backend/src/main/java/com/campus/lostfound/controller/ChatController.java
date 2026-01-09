package com.campus.lostfound.controller;

import com.campus.lostfound.dto.ChatMessageDTO;
import com.campus.lostfound.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<ChatMessageDTO> sendMessage(
            @RequestParam Long receiverId,
            @RequestParam(required = false) Long itemId,
            @RequestParam String message,
            @AuthenticationPrincipal Long userId) {
        ChatMessageDTO chatMessage = chatService.sendMessage(userId, receiverId, itemId, message);
        return ResponseEntity.ok(chatMessage);
    }

    @GetMapping("/conversation/{userId}")
    public ResponseEntity<List<ChatMessageDTO>> getConversation(
            @PathVariable Long userId,
            @RequestParam(required = false) Long itemId,
            @AuthenticationPrincipal Long currentUserId) {
        List<ChatMessageDTO> messages = chatService.getConversation(currentUserId, userId, itemId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/my-chats")
    public ResponseEntity<List<Map<String, Object>>> getMyChats(
            @AuthenticationPrincipal Long userId) {
        List<Map<String, Object>> chats = chatService.getUserChats(userId);
        return ResponseEntity.ok(chats);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(
            @AuthenticationPrincipal Long userId) {
        Long count = chatService.getUnreadCount(userId);
        return ResponseEntity.ok(count);
    }

    @PostMapping("/mark-read/{messageId}")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long messageId,
            @AuthenticationPrincipal Long userId) {
        chatService.markAsRead(messageId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/mark-all-read")
    public ResponseEntity<Void> markAllAsRead(
            @AuthenticationPrincipal Long userId) {
        chatService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable Long messageId,
            @AuthenticationPrincipal Long userId) {
        chatService.deleteMessage(messageId, userId);
        return ResponseEntity.noContent().build();
    }
}