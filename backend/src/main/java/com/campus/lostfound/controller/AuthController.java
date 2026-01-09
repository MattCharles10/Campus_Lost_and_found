package com.campus.lostfound.controller;

import com.campus.lostfound.dto.*;
import com.campus.lostfound.service.AuthService;
import com.campus.lostfound.service.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse response = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            AuthResponse response = authService.registerUser(registerRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/google")
    public ResponseEntity<?> authenticateWithGoogle(@RequestBody GoogleAuthRequest googleAuthRequest) {
        try {
            AuthResponse response = authService.authenticateWithGoogle(googleAuthRequest.getAccessToken());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Google authentication failed: " + e.getMessage()));
        }
    }

    // Forgot Password - Accepts both query param and JSON body
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestParam(required = false) String email,
            @RequestBody(required = false) ForgotPasswordRequest forgotPasswordRequest) {
        try {
            String userEmail = email != null ? email :
                    (forgotPasswordRequest != null ? forgotPasswordRequest.getEmail() : null);

            if (userEmail == null || userEmail.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Email is required"));
            }

            passwordResetService.createPasswordResetToken(userEmail);

            return ResponseEntity.ok(ApiResponse.success("Password reset instructions sent to your email. Check console for token."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to process password reset: " + e.getMessage()));
        }
    }

    // Reset Password - Accepts both query param and JSON body
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestParam(required = false) String token,
            @RequestParam(required = false) String newPassword,
            @RequestBody(required = false) ResetPasswordRequest resetPasswordRequest) {
        try {
            String resetToken = token != null ? token :
                    (resetPasswordRequest != null ? resetPasswordRequest.getToken() : null);

            String password = newPassword != null ? newPassword :
                    (resetPasswordRequest != null ? resetPasswordRequest.getNewPassword() : null);

            if (resetToken == null || resetToken.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Reset token is required"));
            }

            if (password == null || password.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("New password is required"));
            }

            passwordResetService.resetPassword(resetToken, password);
            return ResponseEntity.ok(ApiResponse.success("Password has been reset successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to reset password: " + e.getMessage()));
        }
    }

    // Validate reset token
    @GetMapping("/validate-reset-token")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        try {
            boolean isValid = passwordResetService.validatePasswordResetToken(token);
            if (isValid) {
                return ResponseEntity.ok(ApiResponse.success("Token is valid"));
            } else {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Invalid or expired token"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Token validation failed: " + e.getMessage()));
        }
    }

    // Development endpoint for testing Google auth without real OAuth
    @PostMapping("/google-dev")
    public ResponseEntity<?> authenticateWithGoogleDev(@RequestBody GoogleDevRequest googleDevRequest) {
        try {
            AuthResponse response = authService.authenticateWithGoogleDev(
                    googleDevRequest.getEmail(),
                    googleDevRequest.getFirstName(),
                    googleDevRequest.getLastName()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Google dev authentication failed: " + e.getMessage()));
        }
    }
}