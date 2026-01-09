package com.campus.lostfound.model.enums;

import lombok.Getter;

@Getter
public enum MatchLevel {
    EXCELLENT("EXCELLENT", "#10b981", 85, 100),
    HIGH("HIGH", "#3b82f6", 70, 84),
    MEDIUM("MEDIUM", "#f59e0b", 50, 69),
    LOW("LOW", "#ef4444", 0, 49);

    private final String name;
    private final String color;
    private final int minScore;
    private final int maxScore;

    MatchLevel(String name, String color, int minScore, int maxScore) {
        this.name = name;
        this.color = color;
        this.minScore = minScore;
        this.maxScore = maxScore;
    }

    public static MatchLevel fromScore(double score) {
        if (score >= 85) return EXCELLENT;
        if (score >= 70) return HIGH;
        if (score >= 50) return MEDIUM;
        return LOW;
    }
}