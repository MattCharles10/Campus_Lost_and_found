package com.campus.lostfound.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class ConsoleEmailService {

    @Value("${app.base-url:http://localhost:8082}")
    private String baseUrl;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final String LOG_DIR = "email-logs";

    public ConsoleEmailService() {
        // Create log directory
        try {
            Files.createDirectories(Paths.get(LOG_DIR));
            System.out.println("📁 Email log directory: " + LOG_DIR);
        } catch (IOException e) {
            System.err.println("⚠️ Could not create log directory: " + e.getMessage());
        }
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
        String timestamp = LocalDateTime.now().format(FORMATTER);
        String resetLink = baseUrl + "/reset-password?token=" + token;

        // Console output with colors
        System.out.println("\n" + "=".repeat(80));
        System.out.println("📧 PASSWORD RESET EMAIL (Console Simulation)");
        System.out.println("=".repeat(80));
        System.out.println("To: " + toEmail);
        System.out.println("Time: " + timestamp);
        System.out.println("\n🔐 YOUR PASSWORD RESET TOKEN:");
        System.out.println("Token: " + token);
        System.out.println("\n🔗 Direct reset link:");
        System.out.println(resetLink);
        System.out.println("\n⏰ Token expires in 24 hours");
        System.out.println("=".repeat(80));

        // Save to log file
        saveToLogFile(toEmail, token, timestamp);

        // Save token for easy access
        saveTokenToFile(toEmail, token, timestamp);
    }

    private void saveToLogFile(String email, String token, String timestamp) {
        try {
            String filename = String.format("%s/reset_%s_%s.txt",
                    LOG_DIR,
                    email.replace("@", "_at_"),
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")));

            String content = String.format(
                    "Password Reset Request\n" +
                            "======================\n" +
                            "Email: %s\n" +
                            "Time: %s\n" +
                            "Token: %s\n" +
                            "Link: %s/reset-password?token=%s\n" +
                            "Expires: 24 hours from generation\n",
                    email, timestamp, token, baseUrl, token
            );

            try (FileWriter writer = new FileWriter(filename)) {
                writer.write(content);
                System.out.println("💾 Saved to: " + filename);
            }

        } catch (IOException e) {
            System.err.println("⚠️ Failed to save log: " + e.getMessage());
        }
    }

    private void saveTokenToFile(String email, String token, String timestamp) {
        try {
            String entry = String.format("%s | %s | %s\n", timestamp, email, token);

            try (FileWriter writer = new FileWriter(LOG_DIR + "/all_tokens.txt", true)) {
                writer.write(entry);
            }

        } catch (IOException e) {
            System.err.println("⚠️ Failed to save token: " + e.getMessage());
        }
    }

    public String getAllTokens() {
        try {
            return Files.readString(Paths.get(LOG_DIR + "/all_tokens.txt"));
        } catch (IOException e) {
            return "No tokens generated yet.";
        }
    }
}