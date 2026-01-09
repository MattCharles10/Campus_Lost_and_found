package com.campus.lostfound.model.enums;

public enum ItemCategory {
    ELECTRONICS("📱", "#8b5cf6"),
    DOCUMENTS("📄", "#3b82f6"),
    CLOTHING("👕", "#06b6d4"),
    ACCESSORIES("👜", "#10b981"),
    BOOKS("📚", "#f97316"),
    WALLET("👛", "#ec4899"),
    KEYS("🔑", "#eab308"),
    JEWELRY("💍", "#d946ef"),
    OTHER("📦", "#94a3b8");

    private final String emoji;
    private final String color;

    ItemCategory(String emoji, String color) {
        this.emoji = emoji;
        this.color = color;
    }

    public String getEmoji() {
        return emoji;
    }

    public String getColor() {
        return color;
    }
}