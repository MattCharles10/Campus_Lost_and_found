package com.campus.lostfound.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;

@Service
@Slf4j
public class ConsoleNotificationService {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final String NOTIFICATION_LOG_DIR = "dashboard-notifications";

    public ConsoleNotificationService() {
        // Create log directory
        try {
            Files.createDirectories(Paths.get(NOTIFICATION_LOG_DIR));
            System.out.println("📁 Dashboard notification log directory: " + NOTIFICATION_LOG_DIR);
        } catch (IOException e) {
            System.err.println("⚠️ Could not create notification log directory: " + e.getMessage());
        }
    }

    public void sendItemCreatedNotification(String toEmail, String itemTitle, String itemType) {
        String timestamp = LocalDateTime.now().format(FORMATTER);
        String logMessage = String.format("Item created: %s (%s) by %s", itemTitle, itemType, toEmail);

        // Console output with colors
        System.out.println("\n" + "=".repeat(80));
        System.out.println("📧 DASHBOARD NOTIFICATION: ITEM CREATED");
        System.out.println("=".repeat(80));
        System.out.println("To: " + toEmail);
        System.out.println("Time: " + timestamp);
        System.out.println("\n✅ ITEM REPORTED SUCCESSFULLY:");
        System.out.println("Title: " + itemTitle);
        System.out.println("Type: " + itemType);
        System.out.println("\n🔍 The system will now search for potential matches.");
        System.out.println("You will be notified if any matches are found.");
        System.out.println("=".repeat(80));

        // Log to file
        logToFile("ITEM_CREATED", toEmail, logMessage, timestamp);
        log.info("Item created notification sent to: {}", toEmail);
    }

    public void sendMatchNotification(String toEmail, String itemTitle, int matchCount, int bestScore) {
        String timestamp = LocalDateTime.now().format(FORMATTER);
        String logMessage = String.format("Matches found: %d matches for %s (Best: %d%%) to %s",
                matchCount, itemTitle, bestScore, toEmail);

        System.out.println("\n" + "=".repeat(80));
        System.out.println("🎯 DASHBOARD NOTIFICATION: MATCHES FOUND");
        System.out.println("=".repeat(80));
        System.out.println("To: " + toEmail);
        System.out.println("Time: " + timestamp);
        System.out.println("\n🎉 POTENTIAL MATCHES FOUND!");
        System.out.println("Item: " + itemTitle);
        System.out.println("\n📊 MATCH RESULTS:");
        System.out.println("• Total matches found: " + matchCount);
        System.out.println("• Best match score: " + bestScore + "%");
        System.out.println("\n🔍 Check your dashboard to view the matches.");
        System.out.println("=".repeat(80));

        // Log to file
        logToFile("MATCH_FOUND", toEmail, logMessage, timestamp);
        log.info("Match notification sent to {}: {} matches found for {}", toEmail, matchCount, itemTitle);
    }

    public void sendItemResolvedNotification(String toEmail, String itemTitle, String status) {
        String timestamp = LocalDateTime.now().format(FORMATTER);
        String logMessage = String.format("Item status updated: %s -> %s for %s", itemTitle, status, toEmail);

        System.out.println("\n" + "=".repeat(80));
        System.out.println("✅ DASHBOARD NOTIFICATION: ITEM STATUS UPDATE");
        System.out.println("=".repeat(80));
        System.out.println("To: " + toEmail);
        System.out.println("Time: " + timestamp);
        System.out.println("\n📝 ITEM STATUS UPDATED:");
        System.out.println("Item: " + itemTitle);
        System.out.println("New Status: " + status);
        System.out.println("\nThank you for using Campus Lost & Found System!");
        System.out.println("=".repeat(80));

        // Log to file
        logToFile("ITEM_RESOLVED", toEmail, logMessage, timestamp);
        log.info("Item status update sent to {}: {} -> {}", toEmail, itemTitle, status);
    }

    public void sendWelcomeNotification(String toEmail, String userName) {
        String timestamp = LocalDateTime.now().format(FORMATTER);
        String logMessage = String.format("Welcome: %s registered with email %s", userName, toEmail);

        System.out.println("\n" + "=".repeat(80));
        System.out.println("👋 DASHBOARD NOTIFICATION: WELCOME");
        System.out.println("=".repeat(80));
        System.out.println("To: " + toEmail);
        System.out.println("Time: " + timestamp);
        System.out.println("\n🎉 Welcome " + userName + "!");
        System.out.println("\nYou have successfully registered with Campus Lost & Found System.");
        System.out.println("\nYou can now:");
        System.out.println("• Report lost items");
        System.out.println("• Report found items");
        System.out.println("• View smart matches");
        System.out.println("• Track your items");
        System.out.println("\nHappy finding!");
        System.out.println("=".repeat(80));

        // Log to file
        logToFile("WELCOME", toEmail, logMessage, timestamp);
        log.info("Welcome notification sent to: {}", toEmail);
    }

    public void sendDashboardStatsNotification(String toEmail, Map<String, Object> stats) {
        String timestamp = LocalDateTime.now().format(FORMATTER);
        String logMessage = String.format("Dashboard stats sent to: %s", toEmail);

        System.out.println("\n" + "=".repeat(80));
        System.out.println("📊 DASHBOARD NOTIFICATION: STATS SUMMARY");
        System.out.println("=".repeat(80));
        System.out.println("To: " + toEmail);
        System.out.println("Time: " + timestamp);
        System.out.println("\n📈 SYSTEM STATISTICS:");
        System.out.println("• Total Items: " + stats.getOrDefault("totalItems", "N/A"));
        System.out.println("• Lost Items: " + stats.getOrDefault("lostItems", "N/A"));
        System.out.println("• Found Items: " + stats.getOrDefault("foundItems", "N/A"));
        System.out.println("• Resolved Cases: " + stats.getOrDefault("resolvedCases", "N/A"));
        System.out.println("• Active Users: " + stats.getOrDefault("activeUsers", "N/A"));
        System.out.println("• Response Rate: " + stats.getOrDefault("responseRate", "N/A"));
        System.out.println("• Potential Matches: " + stats.getOrDefault("potentialMatches", "N/A"));
        System.out.println("• Match Rate: " + stats.getOrDefault("matchRate", "N/A"));
        System.out.println("\nGenerated at: " + timestamp);
        System.out.println("=".repeat(80));

        // Log to file
        logToFile("DASHBOARD_STATS", toEmail, logMessage, timestamp);
        log.info("Dashboard stats sent to: {}", toEmail);
    }

    public void sendSmartMatchingStarted(String toEmail, String itemTitle) {
        String timestamp = LocalDateTime.now().format(FORMATTER);
        String logMessage = String.format("Smart matching started for: %s by %s", itemTitle, toEmail);

        System.out.println("\n" + "=".repeat(80));
        System.out.println("🤖 DASHBOARD NOTIFICATION: SMART MATCHING STARTED");
        System.out.println("=".repeat(80));
        System.out.println("To: " + toEmail);
        System.out.println("Time: " + timestamp);
        System.out.println("\n⚡ SMART MATCHING INITIATED");
        System.out.println("Item: " + itemTitle);
        System.out.println("\n🔍 Our AI is now scanning the database");
        System.out.println("to find potential matches for your item.");
        System.out.println("\n⏳ This may take a few moments...");
        System.out.println("=".repeat(80));

        // Log to file
        logToFile("SMART_MATCHING_STARTED", toEmail, logMessage, timestamp);
        log.info("Smart matching started for {} by {}", itemTitle, toEmail);
    }

    public void sendHotspotNotification(String location, int itemCount) {
        String timestamp = LocalDateTime.now().format(FORMATTER);
        String logMessage = String.format("Hotspot detected: %s has %d items", location, itemCount);

        System.out.println("\n" + "=".repeat(80));
        System.out.println("📍 DASHBOARD NOTIFICATION: HOTSPOT DETECTED");
        System.out.println("=".repeat(80));
        System.out.println("Time: " + timestamp);
        System.out.println("\n🔥 HOTSPOT DETECTED!");
        System.out.println("Location: " + location);
        System.out.println("Items Reported: " + itemCount);
        System.out.println("\n⚠️ This location has a high number of lost/found items.");
        System.out.println("Consider checking this area frequently.");
        System.out.println("=".repeat(80));

        // Log to file
        logToFile("HOTSPOT", "SYSTEM", logMessage, timestamp);
        log.info("Hotspot detected: {} has {} items", location, itemCount);
    }

    public void sendPeriodicReport(int totalItems, int newItemsToday, int matchesFound) {
        String timestamp = LocalDateTime.now().format(FORMATTER);
        String logMessage = String.format("Periodic report: Total=%d, New=%d, Matches=%d",
                totalItems, newItemsToday, matchesFound);

        System.out.println("\n" + "=".repeat(80));
        System.out.println("📋 DASHBOARD NOTIFICATION: DAILY REPORT");
        System.out.println("=".repeat(80));
        System.out.println("Time: " + timestamp);
        System.out.println("\n📊 DAILY SYSTEM REPORT");
        System.out.println("• Total Items in System: " + totalItems);
        System.out.println("• New Items Today: " + newItemsToday);
        System.out.println("• Matches Found Today: " + matchesFound);
        System.out.println("\n📈 System is running smoothly!");
        System.out.println("=".repeat(80));

        // Log to file
        logToFile("DAILY_REPORT", "ADMIN", logMessage, timestamp);
        log.info("Daily report: Total={}, New={}, Matches={}", totalItems, newItemsToday, matchesFound);
    }

    private void logToFile(String type, String recipient, String message, String timestamp) {
        try {
            String filename = String.format("%s/%s_%s.txt",
                    NOTIFICATION_LOG_DIR,
                    type.toLowerCase(),
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));

            String logEntry = String.format("[%s] %s -> %s: %s\n",
                    timestamp, type, recipient, message);

            try (FileWriter writer = new FileWriter(filename, true)) {
                writer.write(logEntry);
            }

        } catch (IOException e) {
            System.err.println("⚠️ Failed to log notification: " + e.getMessage());
        }
    }

    public String getAllNotifications() {
        try {
            StringBuilder allNotifications = new StringBuilder();
            Files.list(Paths.get(NOTIFICATION_LOG_DIR))
                    .filter(Files::isRegularFile)
                    .forEach(path -> {
                        try {
                            allNotifications.append("=== ").append(path.getFileName()).append(" ===\n");
                            allNotifications.append(Files.readString(path));
                            allNotifications.append("\n");
                        } catch (IOException e) {
                            allNotifications.append("Error reading: ").append(path.getFileName()).append("\n");
                        }
                    });
            return allNotifications.toString();
        } catch (IOException e) {
            return "No notifications logged yet.";
        }
    }

    public void clearNotificationLogs() {
        try {
            Files.list(Paths.get(NOTIFICATION_LOG_DIR))
                    .forEach(path -> {
                        try {
                            Files.delete(path);
                            System.out.println("🗑️ Deleted: " + path.getFileName());
                        } catch (IOException e) {
                            System.err.println("Failed to delete: " + path.getFileName());
                        }
                    });
            System.out.println("✅ All notification logs cleared.");
        } catch (IOException e) {
            System.err.println("No logs to clear or error: " + e.getMessage());
        }
    }
}