package com.campus.lostfound.service;

import com.campus.lostfound.dto.UserVerificationDTO;
import com.campus.lostfound.model.User;

import java.util.List;
import java.util.Map;

public interface AdminService {
    List<UserVerificationDTO> getPendingVerifications();
    UserVerificationDTO approveVerification(Long verificationId, Long adminId, String notes);
    UserVerificationDTO rejectVerification(Long verificationId, Long adminId, String notes);

    // Fix return type by using wildcard
    List<Map<String, Object>> getFlaggedContent();

    Map<String, Object> approveContent(Long itemId, Long adminId);
    Map<String, Object> deleteContent(Long itemId, Long adminId);
    Map<String, Object> getAdminStats();
    List<User> getAllUsers();
    Map<String, Object> updateUserStatus(Long userId, Boolean active, Long adminId);
    void exportData(String format);
}