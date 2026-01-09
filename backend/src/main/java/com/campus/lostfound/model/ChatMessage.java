package com.campus.lostfound.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    @JsonIgnore
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    @JsonIgnore
    private User receiver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id")
    @JsonIgnore
    private Item item;

    @NotBlank(message = "Message cannot be empty")
    @Size(max = 2000, message = "Message must be less than 2000 characters")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @CreationTimestamp
    @Column(name = "sent_at", updatable = false)
    private LocalDateTime sentAt;

    @Builder.Default
    @Column(name = "is_read")
    private Boolean read = false;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Builder.Default
    @Column(name = "is_deleted")
    private Boolean deleted = false;

    // Helper methods
    public Long getSenderId() {
        return sender != null ? sender.getId() : null;
    }

    public String getSenderName() {
        return sender != null ?
                sender.getFirstName() + " " + sender.getLastName() :
                "Unknown";
    }

    public String getSenderAvatar() {
        return sender != null ? sender.getAvatarUrl() : null;
    }

    public Long getReceiverId() {
        return receiver != null ? receiver.getId() : null;
    }

    public String getReceiverName() {
        return receiver != null ?
                receiver.getFirstName() + " " + receiver.getLastName() :
                "Unknown";
    }

    public Long getItemId() {
        return item != null ? item.getId() : null;
    }

    public String getItemTitle() {
        return item != null ? item.getTitle() : null;
    }

    public String getFormattedTime() {
        if (sentAt == null) return "";
        return sentAt.format(java.time.format.DateTimeFormatter.ofPattern("hh:mm a"));
    }
}