package com.campus.lostfound.dto;

import com.campus.lostfound.model.ItemMatch;
import com.campus.lostfound.model.enums.MatchLevel;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MatchResponseDTO {
    private Long id;
    private Double similarityScore;
    private MatchLevel matchLevel;
    private String qualityColor;
    private List<String> matchReasons;

    // Lost item details
    private Long lostItemId;
    private String lostItemTitle;
    private String lostItemDescription;
    private String lostItemLocation;
    private String lostItemCategory;
    private String lostItemCampusZone;
    private String lostItemBuilding;
    private String lostItemColor;
    private String lostItemBrand;
    private String lostItemModel;

    // Found item details
    private Long foundItemId;
    private String foundItemTitle;
    private String foundItemDescription;
    private String foundItemLocation;
    private String foundItemCategory;
    private String foundItemCampusZone;
    private String foundItemBuilding;
    private String foundItemColor;
    private String foundItemBrand;
    private String foundItemModel;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime matchedAt;

    private Boolean active;
    private Boolean notified;

    public static MatchResponseDTO fromEntity(ItemMatch match) {
        MatchResponseDTO dto = new MatchResponseDTO();
        dto.setId(match.getId());
        dto.setSimilarityScore(match.getSimilarityScore());
        dto.setMatchLevel(match.getMatchLevel());
        dto.setQualityColor(match.getQualityColor());

        if (match.getMatchReasons() != null) {
            dto.setMatchReasons(Arrays.asList(match.getMatchReasons().split("; ")));
        }

        dto.setLostItemId(match.getLostItemId());
        dto.setLostItemTitle(match.getLostItemTitle());
        dto.setLostItemDescription(match.getLostItemDescription());
        dto.setLostItemLocation(match.getLostItemLocation());
        dto.setLostItemCategory(match.getLostItemCategory());

        dto.setFoundItemId(match.getFoundItemId());
        dto.setFoundItemTitle(match.getFoundItemTitle());
        dto.setFoundItemDescription(match.getFoundItemDescription());
        dto.setFoundItemLocation(match.getFoundItemLocation());
        dto.setFoundItemCategory(match.getFoundItemCategory());

        dto.setMatchedAt(match.getMatchedAt());
        dto.setActive(match.getActive());
        dto.setNotified(match.getNotified());

        return dto;
    }
}