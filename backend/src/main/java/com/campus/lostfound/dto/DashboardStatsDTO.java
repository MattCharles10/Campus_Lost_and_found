package com.campus.lostfound.dto;

import lombok.Data;

import java.util.Map;

@Data
public class DashboardStatsDTO {
    private Long totalItems;
    private Long lostItems;
    private Long foundItems;
    private Long resolvedCases;
    private Long activeUsers;
    private String responseRate;
    private Long pendingVerifications;
    private Long flaggedContent;
    private Long potentialMatches;
    private String matchRate;
    private Long smartMatches;

    private Map<String, Long> itemsByCategory;
    private Map<String, Long> itemsByLocation;
    private Map<String, Long> itemsByCampusZone;
}