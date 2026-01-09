package com.campus.lostfound.controller;

import com.campus.lostfound.service.ConsoleNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow frontend access
public class NotificationController {

    private final ConsoleNotificationService notificationService;

    // Get notification logs
    @GetMapping("/logs")
    public ResponseEntity<Map<String, Object>> getNotificationLogs() {
        String logs = notificationService.getAllNotifications();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "logs", logs,
                "timestamp", java.time.LocalDateTime.now().toString()
        ));
    }

    // Clear notification logs
    @DeleteMapping("/logs")
    public ResponseEntity<Map<String, Serializable>> clearNotificationLogs() {
        notificationService.clearNotificationLogs();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Notification logs cleared",
                "timestamp", java.time.LocalDateTime.now().toString()
        ));
    }

    // Test specific notification type
    @PostMapping("/test")
    public ResponseEntity<Map<String, Object>> testNotification(
            @RequestBody Map<String, Object> request) {

        try {
            String type = (String) request.get("type");
            String email = (String) request.getOrDefault("email", "test@example.com");

            switch (type) {
                case "item_created":
                    String itemTitle = (String) request.getOrDefault("itemTitle", "Test Item");
                    String itemType = (String) request.getOrDefault("itemType", "LOST");
                    notificationService.sendItemCreatedNotification(email, itemTitle, itemType);
                    break;

                case "match_found":
                    String matchTitle = (String) request.getOrDefault("itemTitle", "MacBook Pro");
                    int matchCount = (int) request.getOrDefault("matchCount", 3);
                    int bestScore = (int) request.getOrDefault("bestScore", 92);
                    notificationService.sendMatchNotification(email, matchTitle, matchCount, bestScore);
                    break;

                case "item_resolved":
                    String resolvedTitle = (String) request.getOrDefault("itemTitle", "Test Item");
                    String status = (String) request.getOrDefault("status", "RESOLVED");
                    notificationService.sendItemResolvedNotification(email, resolvedTitle, status);
                    break;

                case "welcome":
                    String userName = (String) request.getOrDefault("userName", "John Doe");
                    notificationService.sendWelcomeNotification(email, userName);
                    break;

                case "dashboard_stats":
                    Map<String, Object> stats = (Map<String, Object>) request.getOrDefault("stats", Map.of(
                            "totalItems", 156,
                            "lostItems", 89,
                            "foundItems", 67,
                            "resolvedCases", 42,
                            "activeUsers", 123,
                            "responseRate", "85%",
                            "potentialMatches", 12,
                            "matchRate", "78%"
                    ));
                    notificationService.sendDashboardStatsNotification(email, stats);
                    break;

                case "smart_matching":
                    String smartItemTitle = (String) request.getOrDefault("itemTitle", "MacBook Pro");
                    notificationService.sendSmartMatchingStarted(email, smartItemTitle);
                    break;

                case "hotspot":
                    String location = (String) request.getOrDefault("location", "Main Library");
                    int itemCount = (int) request.getOrDefault("itemCount", 15);
                    notificationService.sendHotspotNotification(location, itemCount);
                    break;

                case "daily_report":
                    int totalItems = (int) request.getOrDefault("totalItems", 156);
                    int newItems = (int) request.getOrDefault("newItemsToday", 23);
                    int matches = (int) request.getOrDefault("matchesFound", 8);
                    notificationService.sendPeriodicReport(totalItems, newItems, matches);
                    break;

                default:
                    return ResponseEntity.badRequest().body(Map.of(
                            "success", false,
                            "error", "Unknown notification type: " + type,
                            "availableTypes", "item_created, match_found, item_resolved, welcome, dashboard_stats, smart_matching, hotspot, daily_report"
                    ));
            }

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Notification sent to console",
                    "type", type,
                    "email", email,
                    "timestamp", java.time.LocalDateTime.now().toString()
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }

    // Get available notification types
    @GetMapping("/types")
    public ResponseEntity<Map<String, Object>> getNotificationTypes() {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "types", new String[]{
                        "item_created",
                        "match_found",
                        "item_resolved",
                        "welcome",
                        "dashboard_stats",
                        "smart_matching",
                        "hotspot",
                        "daily_report"
                },
                "description", "These notifications appear in the backend console and are logged to files"
        ));
    }
}