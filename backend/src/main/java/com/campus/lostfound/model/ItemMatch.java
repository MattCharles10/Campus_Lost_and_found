package com.campus.lostfound.model;

import com.campus.lostfound.model.enums.MatchLevel;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "item_matches",
        uniqueConstraints = @UniqueConstraint(columnNames = {"lost_item_id", "found_item_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lost_item_id", nullable = false)
    @JsonIgnore
    private Item lostItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "found_item_id", nullable = false)
    @JsonIgnore
    private Item foundItem;

    @Column(name = "similarity_score", nullable = false)
    private Double similarityScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "match_level", nullable = false)
    private MatchLevel matchLevel;

    @Column(name = "match_reasons", columnDefinition = "TEXT")
    private String matchReasons;

    @CreationTimestamp
    @Column(name = "matched_at", updatable = false)
    private LocalDateTime matchedAt;

    @Builder.Default
    @Column(name = "notified")
    private Boolean notified = false;

    @Column(name = "notification_sent_at")
    private LocalDateTime notificationSentAt;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean active = true;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Helper methods for frontend
    public Long getLostItemId() {
        return lostItem != null ? lostItem.getId() : null;
    }

    public String getLostItemTitle() {
        return lostItem != null ? lostItem.getTitle() : "Unknown";
    }

    public String getLostItemDescription() {
        return lostItem != null ? lostItem.getDescription() : "";
    }

    public String getLostItemLocation() {
        return lostItem != null ? lostItem.getLocation() : "";
    }

    public String getLostItemCategory() {
        return lostItem != null ? lostItem.getCategory().name() : "";
    }

    public Long getFoundItemId() {
        return foundItem != null ? foundItem.getId() : null;
    }

    public String getFoundItemTitle() {
        return foundItem != null ? foundItem.getTitle() : "Unknown";
    }

    public String getFoundItemDescription() {
        return foundItem != null ? foundItem.getDescription() : "";
    }

    public String getFoundItemLocation() {
        return foundItem != null ? foundItem.getLocation() : "";
    }

    public String getFoundItemCategory() {
        return foundItem != null ? foundItem.getCategory().name() : "";
    }

    public String getQualityColor() {
        return matchLevel != null ? matchLevel.getColor() : "#8b5cf6";
    }
}