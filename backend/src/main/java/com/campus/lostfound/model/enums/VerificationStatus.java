package com.campus.lostfound.model.enums;

public enum VerificationStatus {
    PENDING("Pending", "#f59e0b"),
    APPROVED("Approved", "#10b981"),
    REJECTED("Rejected", "#ef4444");

    private final String displayName;
    private final String color;

    VerificationStatus(String displayName, String color) {
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