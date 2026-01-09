package com.campus.lostfound.model;

import com.campus.lostfound.model.enums.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // Fixes lazy loading serialization
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must be less than 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description must be less than 2000 characters")
    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Item type is required")
    @Enumerated(EnumType.STRING)
    private ItemType type;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ItemStatus status = ItemStatus.ACTIVE;

    @NotNull(message = "Category is required")
    @Enumerated(EnumType.STRING)
    private ItemCategory category;

    @NotBlank(message = "Location is required")
    @Size(max = 200, message = "Location must be less than 200 characters")
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "campus_zone")
    private CampusZone campusZone;

    @Size(max = 100)
    private String building;

    @Size(max = 50)
    @Column(name = "room_number")
    private String roomNumber;

    @Size(max = 50)
    private String color;

    @Size(max = 100)
    private String brand;

    @Size(max = 100)
    private String model;

    @Column(name = "serial_number")
    @Size(max = 100)
    private String serialNumber;

    @Column(name = "date_lost_or_found")
    private LocalDateTime dateLostOrFound;

    @CreationTimestamp
    @Column(name = "date_reported", updatable = false)
    private LocalDateTime dateReported;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by", nullable = false)
    @JsonIgnore
    private User reportedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claimed_by")
    @JsonIgnore
    private User claimedBy;

    @Column(name = "date_claimed")
    private LocalDateTime dateClaimed;

    @Column(name = "is_verified")
    @Builder.Default
    private Boolean verified = false;

    @Column(name = "is_flagged")
    @Builder.Default
    private Boolean flagged = false;

    @Column(name = "flag_reason", length = 500)
    private String flagReason;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnoreProperties("item") // Prevents circular reference
    private Set<ItemImage> images = new HashSet<>();

    @OneToMany(mappedBy = "lostItem", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnore
    private Set<ItemMatch> lostMatches = new HashSet<>();

    @OneToMany(mappedBy = "foundItem", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnore
    private Set<ItemMatch> foundMatches = new HashSet<>();

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnore
    private Set<ChatMessage> chatMessages = new HashSet<>();

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ============ HELPER METHODS ============

    // For DTO conversion - returns user ID instead of full user object
    public Long getReportedById() {
        return reportedBy != null ? reportedBy.getId() : null;
    }

    public String getReportedByName() {
        return reportedBy != null ?
                reportedBy.getFirstName() + " " + reportedBy.getLastName() :
                "Unknown";
    }

    public String getReportedByEmail() {
        return reportedBy != null ? reportedBy.getEmail() : null;
    }

    public Long getClaimedById() {
        return claimedBy != null ? claimedBy.getId() : null;
    }

    public String getClaimedByName() {
        return claimedBy != null ?
                claimedBy.getFirstName() + " " + claimedBy.getLastName() :
                null;
    }

    // Category helpers
    public String getCategoryEmoji() {
        return category != null ? category.getEmoji() : "📦";
    }

    public String getCategoryColor() {
        return category != null ? category.getColor() : "#94a3b8";
    }

    public String getCategoryDisplayName() {
        return category != null ? category.name() : "Other";
    }

    // Campus zone helpers
    public String getCampusZoneDisplay() {
        return campusZone != null ? campusZone.getDisplayName() : "Unknown";
    }

    public String getCampusZoneColor() {
        return campusZone != null ? campusZone.getColor() : "#94a3b8";
    }

    // Status helpers
    public String getStatusColor() {
        if (status == null) return "#94a3b8";

        switch (status) {
            case ACTIVE: return "#3b82f6"; // blue
            case RESOLVED: return "#10b981"; // green
            case ARCHIVED: return "#64748b"; // gray
            case DELETED: return "#ef4444"; // red
            default: return "#94a3b8";
        }
    }

    // Type helpers
    public String getTypeColor() {
        if (type == null) return "#94a3b8";

        return type == ItemType.LOST ? "#f97316" : "#06b6d4"; // orange for LOST, teal for FOUND
    }

    public String getTypeIcon() {
        if (type == null) return "📦";

        return type == ItemType.LOST ? "🔍" : "✅"; // magnifying glass for LOST, checkmark for FOUND
    }

    // Time helper
    public String getTimeAgo() {
        if (dateReported == null) return "Just now";

        LocalDateTime now = LocalDateTime.now();
        long minutes = java.time.Duration.between(dateReported, now).toMinutes();

        if (minutes < 1) return "Just now";
        if (minutes < 60) return minutes + " minutes ago";

        long hours = minutes / 60;
        if (hours < 24) return hours + " hours ago";

        long days = hours / 24;
        if (days < 7) return days + " days ago";

        long weeks = days / 7;
        if (weeks < 4) return weeks + " weeks ago";

        long months = days / 30;
        if (months < 12) return months + " months ago";

        return "Over a year ago";
    }

    // Convenience method for checking if item has images
    public boolean hasImages() {
        return images != null && !images.isEmpty();
    }

    // Get primary image URL if exists
    public String getPrimaryImageUrl() {
        if (images == null || images.isEmpty()) return null;

        return images.stream()
                .filter(ItemImage::getPrimary)
                .map(ItemImage::getImageUrl)
                .findFirst()
                .orElse(images.iterator().next().getImageUrl());
    }

    // Get all image URLs
    public Set<String> getImageUrls() {
        if (images == null) return new HashSet<>();

        return images.stream()
                .map(ItemImage::getImageUrl)
                .collect(java.util.stream.Collectors.toSet());
    }

    // Check if item has active matches
    public boolean hasActiveMatches() {
        if (lostMatches == null && foundMatches == null) return false;

        boolean lostHasMatches = lostMatches != null &&
                lostMatches.stream().anyMatch(ItemMatch::getActive);
        boolean foundHasMatches = foundMatches != null &&
                foundMatches.stream().anyMatch(ItemMatch::getActive);

        return lostHasMatches || foundHasMatches;
    }

    // Count active matches
    public int countActiveMatches() {
        int count = 0;

        if (lostMatches != null) {
            count += (int) lostMatches.stream()
                    .filter(ItemMatch::getActive)
                    .count();
        }

        if (foundMatches != null) {
            count += (int) foundMatches.stream()
                    .filter(ItemMatch::getActive)
                    .count();
        }

        return count;
    }

    // Check if item can be edited by user
    public boolean canBeEditedBy(Long userId) {
        if (userId == null || reportedBy == null) return false;
        return reportedBy.getId().equals(userId);
    }

    // Check if item is active and not flagged
    public boolean isSearchable() {
        return status == ItemStatus.ACTIVE && !Boolean.TRUE.equals(flagged);
    }

    @Override
    public String toString() {
        return "Item{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", type=" + type +
                ", status=" + status +
                ", category=" + category +
                ", location='" + location + '\'' +
                '}';
    }
}