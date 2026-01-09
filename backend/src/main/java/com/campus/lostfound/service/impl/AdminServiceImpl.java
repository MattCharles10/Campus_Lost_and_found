package com.campus.lostfound.service.impl;

import com.campus.lostfound.dto.UserVerificationDTO;
import com.campus.lostfound.model.*;
import com.campus.lostfound.model.enums.ItemStatus;
import com.campus.lostfound.model.enums.VerificationStatus;
import com.campus.lostfound.repository.ItemRepository;
import com.campus.lostfound.repository.UserVerificationRepository;
import com.campus.lostfound.service.AdminService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final UserVerificationRepository userVerificationRepository;
    private final ItemRepository itemRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional(readOnly = true)
    public List<UserVerificationDTO> getPendingVerifications() {
        try {
            List<UserVerification> verifications = userVerificationRepository.findByStatus(VerificationStatus.PENDING);
            List<UserVerificationDTO> result = new ArrayList<>();

            for (UserVerification verification : verifications) {
                // Get user details using EntityManager
                User user = entityManager.find(User.class, verification.getUserId());
                if (user != null) {
                    result.add(UserVerificationDTO.fromEntityWithUserDetails(verification, user));
                } else {
                    result.add(UserVerificationDTO.fromEntity(verification));
                }
            }

            log.info("Found {} pending verifications", result.size());
            return result;
        } catch (Exception e) {
            log.error("Error getting pending verifications: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional
    public UserVerificationDTO approveVerification(Long verificationId, Long adminId, String notes) {
        try {
            UserVerification verification = userVerificationRepository.findById(verificationId)
                    .orElseThrow(() -> new RuntimeException("Verification not found with ID: " + verificationId));

            verification.setStatus(VerificationStatus.APPROVED);
            verification.setVerifiedBy(adminId);
            verification.setVerificationNotes(notes);
            verification.setVerifiedAt(LocalDateTime.now());

            // Update user's verification status if needed
            User user = entityManager.find(User.class, verification.getUserId());
            if (user != null) {
                // You might want to add a verified field to your User entity
                // user.setVerified(true);
                entityManager.merge(user);
            }

            UserVerification saved = userVerificationRepository.save(verification);
            log.info("Verification {} approved by admin {}", verificationId, adminId);

            return UserVerificationDTO.fromEntity(saved);
        } catch (Exception e) {
            log.error("Error approving verification: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to approve verification: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public UserVerificationDTO rejectVerification(Long verificationId, Long adminId, String notes) {
        try {
            UserVerification verification = userVerificationRepository.findById(verificationId)
                    .orElseThrow(() -> new RuntimeException("Verification not found with ID: " + verificationId));

            verification.setStatus(VerificationStatus.REJECTED);
            verification.setVerifiedBy(adminId);
            verification.setVerificationNotes(notes);
            verification.setVerifiedAt(LocalDateTime.now());

            UserVerification saved = userVerificationRepository.save(verification);
            log.info("Verification {} rejected by admin {}", verificationId, adminId);

            return UserVerificationDTO.fromEntity(saved);
        } catch (Exception e) {
            log.error("Error rejecting verification: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to reject verification: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getFlaggedContent() {
        try {
            List<Item> flaggedItems = itemRepository.findFlaggedItems();
            List<Map<String, Object>> result = new ArrayList<>();

            for (Item item : flaggedItems) {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("id", item.getId());
                itemMap.put("title", item.getTitle());
                itemMap.put("description", item.getDescription());
                itemMap.put("type", item.getType());
                itemMap.put("category", item.getCategory());
                itemMap.put("location", item.getLocation());
                itemMap.put("flagReason", item.getFlagReason());
                itemMap.put("reportedBy", item.getReportedByName());
                itemMap.put("reportedById", item.getReportedBy().getId());
                itemMap.put("dateReported", item.getDateReported());
                itemMap.put("dateReportedFormatted", formatDateTime(item.getDateReported()));
                itemMap.put("isVerified", item.getVerified());

                result.add(itemMap);
            }

            log.info("Found {} flagged items", result.size());
            return result;
        } catch (Exception e) {
            log.error("Error getting flagged content: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional
    public Map<String, Object> approveContent(Long itemId, Long adminId) {
        try {
            Item item = itemRepository.findById(itemId)
                    .orElseThrow(() -> new RuntimeException("Item not found with ID: " + itemId));

            item.setFlagged(false);
            item.setFlagReason(null);
            item.setVerified(true);

            Item saved = itemRepository.save(item);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Content approved successfully");
            result.put("itemId", saved.getId());
            result.put("itemTitle", saved.getTitle());
            result.put("isFlagged", saved.getFlagged());
            result.put("isVerified", saved.getVerified());

            log.info("Item {} approved by admin {}", itemId, adminId);
            return result;
        } catch (Exception e) {
            log.error("Error approving content: {}", e.getMessage(), e);

            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "Failed to approve content: " + e.getMessage());
            return result;
        }
    }

    @Override
    @Transactional
    public Map<String, Object> deleteContent(Long itemId, Long adminId) {
        try {
            Item item = itemRepository.findById(itemId)
                    .orElseThrow(() -> new RuntimeException("Item not found with ID: " + itemId));

            // Instead of deleting, mark as deleted
            item.setStatus(ItemStatus.DELETED);
            item.setFlagged(false);
            item.setFlagReason("Deleted by admin ID: " + adminId);

            Item saved = itemRepository.save(item);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Content deleted successfully");
            result.put("itemId", saved.getId());
            result.put("itemTitle", saved.getTitle());
            result.put("status", saved.getStatus());

            log.info("Item {} marked as deleted by admin {}", itemId, adminId);
            return result;
        } catch (Exception e) {
            log.error("Error deleting content: {}", e.getMessage(), e);

            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "Failed to delete content: " + e.getMessage());
            return result;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAdminStats() {
        try {
            Map<String, Object> stats = new HashMap<>();

            // User verification stats
            stats.put("pendingVerifications", userVerificationRepository.countByStatus(VerificationStatus.PENDING));
            stats.put("approvedVerifications", userVerificationRepository.countByStatus(VerificationStatus.APPROVED));
            stats.put("rejectedVerifications", userVerificationRepository.countByStatus(VerificationStatus.REJECTED));

            // Content moderation stats
            stats.put("flaggedContent", itemRepository.countFlaggedItems());
            stats.put("totalItems", itemRepository.count());
            stats.put("activeLostItems", itemRepository.countActiveLostItems());
            stats.put("activeFoundItems", itemRepository.countActiveFoundItems());
            stats.put("resolvedCases", itemRepository.countResolvedItems());

            // User stats
            Long activeUsers = countActiveUsers();
            Long totalUsers = countTotalUsers();
            Long verifiedUsers = countVerifiedUsers();

            stats.put("totalUsers", totalUsers);
            stats.put("activeUsers", activeUsers);
            stats.put("verifiedUsers", verifiedUsers);

            // Platform stats
            stats.put("matchRate", calculateMatchRate());
            stats.put("recoveryRate", calculateRecoveryRate());
            stats.put("avgResponseTime", "2.4 hours"); // This would come from actual calculations

            log.info("Admin stats calculated successfully");
            return stats;
        } catch (Exception e) {
            log.error("Error getting admin stats: {}", e.getMessage(), e);

            Map<String, Object> errorStats = new HashMap<>();
            errorStats.put("error", "Failed to load stats");
            errorStats.put("message", e.getMessage());
            return errorStats;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        try {
            String query = "SELECT u FROM User u ORDER BY u.createdAt DESC";
            TypedQuery<User> typedQuery = entityManager.createQuery(query, User.class);
            List<User> users = typedQuery.getResultList();

            log.info("Found {} users", users.size());
            return users;
        } catch (Exception e) {
            log.error("Error getting all users: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional
    public Map<String, Object> updateUserStatus(Long userId, Boolean active, Long adminId) {
        try {
            User user = entityManager.find(User.class, userId);
            if (user == null) {
                throw new RuntimeException("User not found with ID: " + userId);
            }

            user.setIsActive(active);
            entityManager.merge(user);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "User status updated successfully");
            result.put("userId", user.getId());
            result.put("userName", user.getFirstName() + " " + user.getLastName());
            result.put("email", user.getEmail());
            result.put("isActive", user.getIsActive());
            result.put("updatedBy", adminId);
            result.put("updatedAt", LocalDateTime.now());

            log.info("User {} status updated to {} by admin {}", userId, active, adminId);
            return result;
        } catch (Exception e) {
            log.error("Error updating user status: {}", e.getMessage(), e);

            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "Failed to update user status: " + e.getMessage());
            return result;
        }
    }

    @Override
    public void exportData(String format) {
        try {
            switch (format.toLowerCase()) {
                case "csv":
                    exportToCSV();
                    break;
                case "json":
                    exportToJSON();
                    break;
                default:
                    throw new IllegalArgumentException("Unsupported export format: " + format);
            }
            log.info("Data exported successfully in {} format", format);
        } catch (Exception e) {
            log.error("Error exporting data: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to export data: " + e.getMessage());
        }
    }

    // ============ PRIVATE HELPER METHODS ============

    private Long countActiveUsers() {
        try {
            String query = "SELECT COUNT(u) FROM User u WHERE u.isActive = true";
            return entityManager.createQuery(query, Long.class).getSingleResult();
        } catch (Exception e) {
            log.error("Error counting active users: {}", e.getMessage());
            return 0L;
        }
    }

    private Long countTotalUsers() {
        try {
            String query = "SELECT COUNT(u) FROM User u";
            return entityManager.createQuery(query, Long.class).getSingleResult();
        } catch (Exception e) {
            log.error("Error counting total users: {}", e.getMessage());
            return 0L;
        }
    }

    private Long countVerifiedUsers() {
        try {
            String query = "SELECT COUNT(u) FROM User u WHERE u.emailVerified = true";
            return entityManager.createQuery(query, Long.class).getSingleResult();
        } catch (Exception e) {
            log.error("Error counting verified users: {}", e.getMessage());
            return 0L;
        }
    }

    private Double calculateMatchRate() {
        try {
            Long totalItems = itemRepository.count();
            Long matchedItems = itemRepository.countResolvedItems(); // Simplified

            if (totalItems == 0) return 0.0;
            return (matchedItems.doubleValue() / totalItems.doubleValue()) * 100;
        } catch (Exception e) {
            log.error("Error calculating match rate: {}", e.getMessage());
            return 0.0;
        }
    }

    private Double calculateRecoveryRate() {
        try {
            Long totalItems = itemRepository.count();
            Long resolvedItems = itemRepository.countResolvedItems();

            if (totalItems == 0) return 0.0;
            return (resolvedItems.doubleValue() / totalItems.doubleValue()) * 100;
        } catch (Exception e) {
            log.error("Error calculating recovery rate: {}", e.getMessage());
            return 0.0;
        }
    }

    private String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return dateTime.format(formatter);
    }

    private void exportToCSV() throws IOException {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String filename = "export_" + timestamp + ".csv";

        try (FileWriter writer = new FileWriter(filename)) {
            // Export users
            writer.write("Users Export\n");
            writer.write("ID,Name,Email,Student ID,Status,Verified,Created At\n");

            List<User> users = getAllUsers();
            for (User user : users) {
                writer.write(String.format("%d,%s %s,%s,%s,%s,%s,%s\n",
                        user.getId(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail(),
                        user.getStudentId() != null ? user.getStudentId() : "",
                        user.getIsActive() ? "Active" : "Inactive",
                        user.getEmailVerified() ? "Yes" : "No",
                        formatDateTime(user.getCreatedAt())
                ));
            }

            writer.write("\n\nItems Export\n");
            writer.write("ID,Title,Type,Category,Location,Status,Reported By,Date Reported,Flagged\n");

            List<Item> items = itemRepository.findAll();
            for (Item item : items) {
                writer.write(String.format("%d,%s,%s,%s,%s,%s,%s,%s,%s\n",
                        item.getId(),
                        escapeCsv(item.getTitle()),
                        item.getType(),
                        item.getCategory(),
                        escapeCsv(item.getLocation()),
                        item.getStatus(),
                        escapeCsv(item.getReportedByName()),
                        formatDateTime(item.getDateReported()),
                        item.getFlagged() ? "Yes" : "No"
                ));
            }

            log.info("Data exported to CSV file: {}", filename);
        }
    }

    private void exportToJSON() throws IOException {
        // Simplified JSON export - implement full JSON export as needed
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String filename = "export_" + timestamp + ".json";

        try (FileWriter writer = new FileWriter(filename)) {
            Map<String, Object> exportData = new HashMap<>();

            // Export summary
            exportData.put("exportDate", LocalDateTime.now().toString());
            exportData.put("stats", getAdminStats());

            // You would add more detailed data here

            // Convert to JSON (simplified)
            writer.write("{\n");
            writer.write("  \"exportDate\": \"" + LocalDateTime.now() + "\",\n");
            writer.write("  \"userCount\": " + countTotalUsers() + ",\n");
            writer.write("  \"itemCount\": " + itemRepository.count() + "\n");
            writer.write("}\n");

            log.info("Data exported to JSON file: {}", filename);
        }
    }

    private String escapeCsv(String input) {
        if (input == null) return "";
        // Escape quotes and wrap in quotes if contains comma
        if (input.contains(",") || input.contains("\"") || input.contains("\n")) {
            return "\"" + input.replace("\"", "\"\"") + "\"";
        }
        return input;
    }
}