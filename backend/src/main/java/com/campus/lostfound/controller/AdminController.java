package com.campus.lostfound.controller;

import com.campus.lostfound.dto.UserVerificationDTO;
import com.campus.lostfound.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/verifications/pending")
    public ResponseEntity<List<UserVerificationDTO>> getPendingVerifications() {
        List<UserVerificationDTO> verifications = adminService.getPendingVerifications();
        return ResponseEntity.ok(verifications);
    }

    @PostMapping("/verifications/{verificationId}/approve")
    public ResponseEntity<UserVerificationDTO> approveVerification(
            @PathVariable Long verificationId,
            @RequestParam(required = false) String notes,
            @AuthenticationPrincipal Long adminId) {
        UserVerificationDTO verification = adminService.approveVerification(verificationId, adminId, notes);
        return ResponseEntity.ok(verification);
    }

    @PostMapping("/verifications/{verificationId}/reject")
    public ResponseEntity<UserVerificationDTO> rejectVerification(
            @PathVariable Long verificationId,
            @RequestParam(required = false) String notes,
            @AuthenticationPrincipal Long adminId) {
        UserVerificationDTO verification = adminService.rejectVerification(verificationId, adminId, notes);
        return ResponseEntity.ok(verification);
    }

    @GetMapping("/content/flagged")
    public ResponseEntity<List<Map<String, Object>>> getFlaggedContent() {
        List<Map<String, Object>> flaggedContent = adminService.getFlaggedContent();
        return ResponseEntity.ok(flaggedContent);
    }

    @PostMapping("/content/{itemId}/approve")
    public ResponseEntity<Map<String, Object>> approveContent(
            @PathVariable Long itemId,
            @AuthenticationPrincipal Long adminId) {
        Map<String, Object> result = adminService.approveContent(itemId, adminId);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/content/{itemId}")
    public ResponseEntity<Map<String, Object>> deleteContent(
            @PathVariable Long itemId,
            @AuthenticationPrincipal Long adminId) {
        Map<String, Object> result = adminService.deleteContent(itemId, adminId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> stats = adminService.getAdminStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<Map<String, Object>> users = adminService.getAllUsers().stream()
                .map(user -> {
                    Map<String, Object> userMap = new java.util.HashMap<>();
                    userMap.put("id", user.getId());
                    userMap.put("name", user.getFirstName() + " " + user.getLastName());
                    userMap.put("email", user.getEmail());
                    userMap.put("studentId", user.getStudentId());
                    userMap.put("emailVerified", user.getEmailVerified());
                    userMap.put("isActive", user.getIsActive());
                    userMap.put("lastLogin", user.getLastLogin());
                    userMap.put("createdAt", user.getCreatedAt());
                    return userMap;
                })
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{userId}/status")
    public ResponseEntity<Map<String, Object>> updateUserStatus(
            @PathVariable Long userId,
            @RequestParam Boolean active,
            @AuthenticationPrincipal Long adminId) {
        Map<String, Object> result = adminService.updateUserStatus(userId, active, adminId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/export")
    public ResponseEntity<Void> exportData(
            @RequestParam(defaultValue = "csv") String format) {
        adminService.exportData(format);
        return ResponseEntity.ok().build();
    }
}