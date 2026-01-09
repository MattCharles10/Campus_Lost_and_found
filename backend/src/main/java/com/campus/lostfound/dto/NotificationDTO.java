package com.campus.lostfound.dto;

import com.campus.lostfound.model.enums.NotificationType;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NotificationDTO {
    private Long id;
    private Long userId;
    private String title;
    private String message;
    private NotificationType type;
    private String typeDisplayName;
    private String typeColor;
    private Long referenceId;
    private String referenceType;
    private Boolean read;
    private Boolean archived;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime readAt;

    private String timeAgo;

    public static NotificationDTO fromEntity(com.campus.lostfound.model.Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setUserId(notification.getUserId());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType());
        dto.setTypeDisplayName(notification.getTypeDisplayName());
        dto.setTypeColor(notification.getTypeColor());
        dto.setReferenceId(notification.getReferenceId());
        dto.setReferenceType(notification.getReferenceType());
        dto.setRead(notification.getRead());
        dto.setArchived(notification.getArchived());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setReadAt(notification.getReadAt());
        dto.setTimeAgo(notification.getTimeAgo());

        return dto;
    }
}