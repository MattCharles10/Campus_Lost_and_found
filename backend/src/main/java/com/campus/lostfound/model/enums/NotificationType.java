package com.campus.lostfound.model.enums;

public enum NotificationType {

    NEW_MATCH("🎯 New Match Found", "#8b5cf6"),
    MESSAGE("💬 New Message", "#3b82f6"),
    ITEM_UPDATED("📝 Item Updated", "#06b6d4"),
    ITEM_RESOLVED("✅ Item Resolved", "#10b981"),
    VERIFICATION("👤 Verification", "#f97316"),
    SYSTEM("⚙️ System", "#94a3b8"),
    ADMIN_ALERT("🚨 Admin Alert", "#ef4444");

    private final String displayName;
    private final String color;

    NotificationType(String displayName, String color) {
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