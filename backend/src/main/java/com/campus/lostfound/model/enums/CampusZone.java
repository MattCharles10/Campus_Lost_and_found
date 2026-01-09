package com.campus.lostfound.model.enums;

public enum CampusZone {
    ACADEMIC("Academic Zone", "#8b5cf6"),
    DINING("Dining Zone", "#3b82f6"),
    RESIDENTIAL("Residential Zone", "#06b6d4"),
    ADMINISTRATIVE("Administrative Zone", "#10b981"),
    SPORTS("Sports Zone", "#f97316"),
    PARKING("Parking Zone", "#ec4899"),
    OTHER("Other Zone", "#94a3b8");

    private final String displayName;
    private final String color;

    CampusZone(String displayName, String color) {
        this.displayName = displayName;
        this.color = color;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getColor() {
        return color;
    }
}