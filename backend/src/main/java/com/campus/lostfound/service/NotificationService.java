package com.campus.lostfound.service;

import com.campus.lostfound.model.Notification;

import java.util.List;

public interface NotificationService {
    Notification createNotification(Long userId, String title, String message, String type, Long referenceId);
    List<Notification> getUserNotifications(Long userId);
    List<Notification> getUnreadNotifications(Long userId);
    Long getUnreadCount(Long userId);
    void markAsRead(Long notificationId, Long userId);
    void markAllAsRead(Long userId);
    void deleteNotification(Long notificationId, Long userId);
    void sendMatchNotification(Long matchId);
    void sendMessageNotification(Long senderId, Long receiverId, String message);
}