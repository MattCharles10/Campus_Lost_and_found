package com.campus.lostfound.service;

import com.campus.lostfound.model.User;
import com.campus.lostfound.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ConsoleEmailService emailService; // Console-based email

    @Value("${app.base-url:http://localhost:8082}")
    private String baseUrl;

    @Transactional
    public String createPasswordResetToken(String email) {
        System.out.println("\n🚀 Starting password reset for: " + email);

        // Find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    System.err.println("❌ User not found: " + email);
                    return new RuntimeException("No account found with this email");
                });

        System.out.println("✅ User found: " + user.getEmail());

        // Generate unique token
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusHours(24);

        // Set token and expiry on user
        user.setResetPasswordToken(token);
        user.setResetPasswordExpires(expiryDate);

        // Save user
        userRepository.save(user);
        System.out.println("✅ Token saved to user record");

        // Send "email" (console simulation)
        emailService.sendPasswordResetEmail(user.getEmail(), token);

        return token;
    }

    @Transactional(readOnly = true)
    public boolean validatePasswordResetToken(String token) {
        System.out.println("🔍 Validating token: " + (token != null && token.length() > 10 ?
                token.substring(0, 10) + "..." : token));

        Optional<User> userOpt = userRepository.findByResetPasswordToken(token);

        if (userOpt.isEmpty()) {
            System.err.println("❌ Token not found in database");
            return false;
        }

        User user = userOpt.get();
        boolean isExpired = user.getResetPasswordExpires() == null ||
                user.getResetPasswordExpires().isBefore(LocalDateTime.now());
        boolean isValid = !isExpired;

        System.out.println("📊 Token Status:");
        System.out.println("  User: " + user.getEmail());
        System.out.println("  Expires: " + user.getResetPasswordExpires());
        System.out.println("  Expired: " + isExpired);
        System.out.println("  Valid: " + isValid);

        return isValid;
    }

    @Transactional
    public String resetPassword(String token, String newPassword) {
        System.out.println("\n🔄 Processing password reset...");

        User user = userRepository.findByResetPasswordToken(token)
                .orElseThrow(() -> {
                    System.err.println("❌ Invalid token");
                    return new RuntimeException("Invalid or expired reset link");
                });

        // Check if token is expired
        if (user.getResetPasswordExpires() == null ||
                user.getResetPasswordExpires().isBefore(LocalDateTime.now())) {
            System.err.println("❌ Token expired at: " + user.getResetPasswordExpires());
            throw new RuntimeException("Reset link has expired. Please request a new one.");
        }

        System.out.println("✅ Valid token for user: " + user.getEmail());

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));

        // Clear reset token fields
        user.setResetPasswordToken(null);
        user.setResetPasswordExpires(null);

        // Save user
        userRepository.save(user);

        System.out.println("✅ Password updated successfully");
        System.out.println("✅ Reset token cleared");

        return user.getEmail();
    }
    public String getEmailFromToken(String token) {
        User user = userRepository.findByResetPasswordToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (user.getResetPasswordExpires() == null ||
                user.getResetPasswordExpires().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        return user.getEmail();
    }

    @Transactional
    public void cleanupExpiredTokens() {
        System.out.println("🧹 Cleaning up expired password reset tokens...");

        Iterable<User> users = userRepository.findAll();
        int cleaned = 0;

        for (User user : users) {
            if (user.getResetPasswordToken() != null &&
                    user.getResetPasswordExpires() != null &&
                    user.getResetPasswordExpires().isBefore(LocalDateTime.now())) {

                user.setResetPasswordToken(null);
                user.setResetPasswordExpires(null);
                userRepository.save(user);
                cleaned++;
            }
        }

        System.out.println("✅ Cleaned " + cleaned + " expired tokens");
    }
}