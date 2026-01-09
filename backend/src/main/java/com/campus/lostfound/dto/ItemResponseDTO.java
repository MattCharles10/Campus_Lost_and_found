package com.campus.lostfound.dto;

import com.campus.lostfound.model.Item;
import com.campus.lostfound.model.enums.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ItemResponseDTO {
    private Long id;
    private String title;
    private String description;
    private ItemType type;
    private ItemStatus status;
    private ItemCategory category;
    private String categoryEmoji;
    private String categoryColor;
    private String location;
    private CampusZone campusZone;
    private String campusZoneDisplay;
    private String campusZoneColor;
    private String building;
    private String roomNumber;
    private String color;
    private String brand;
    private String model;
    private String serialNumber;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateLostOrFound;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateReported;

    private Long reportedById;
    private String reportedByName;
    private String reportedByEmail;
    private Long claimedById;
    private String claimedByName;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateClaimed;

    private Boolean verified;
    private Boolean flagged;
    private String flagReason;
    private Boolean hasMatches;
    private Integer matchCount;
    private List<String> imageUrls;
    private String timeAgo;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    public static ItemResponseDTO fromEntity(Item item, Integer matchCount) {
        ItemResponseDTO dto = new ItemResponseDTO();
        dto.setId(item.getId());
        dto.setTitle(item.getTitle());
        dto.setDescription(item.getDescription());
        dto.setType(item.getType());
        dto.setStatus(item.getStatus());
        dto.setCategory(item.getCategory());
        dto.setCategoryEmoji(item.getCategoryEmoji());
        dto.setCategoryColor(item.getCategoryColor());
        dto.setLocation(item.getLocation());
        dto.setCampusZone(item.getCampusZone());
        dto.setCampusZoneDisplay(item.getCampusZoneDisplay());
        dto.setCampusZoneColor(item.getCampusZoneColor());
        dto.setBuilding(item.getBuilding());
        dto.setRoomNumber(item.getRoomNumber());
        dto.setColor(item.getColor());
        dto.setBrand(item.getBrand());
        dto.setModel(item.getModel());
        dto.setSerialNumber(item.getSerialNumber());
        dto.setDateLostOrFound(item.getDateLostOrFound());
        dto.setDateReported(item.getDateReported());
        dto.setReportedById(item.getReportedBy().getId());
        dto.setReportedByName(item.getReportedByName());
        dto.setReportedByEmail(item.getReportedByEmail());

        if (item.getClaimedBy() != null) {
            dto.setClaimedById(item.getClaimedBy().getId());
            dto.setClaimedByName(item.getClaimedByName());
            dto.setDateClaimed(item.getDateClaimed());
        }

        dto.setVerified(item.getVerified());
        dto.setFlagged(item.getFlagged());
        dto.setFlagReason(item.getFlagReason());
        dto.setHasMatches(matchCount != null && matchCount > 0);
        dto.setMatchCount(matchCount);
        dto.setImageUrls(item.getImages().stream()
                .map(image -> image.getImageUrl())
                .collect(Collectors.toList()));
        dto.setTimeAgo(item.getTimeAgo());
        dto.setUpdatedAt(item.getUpdatedAt());

        return dto;
    }
}