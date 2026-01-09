package com.campus.lostfound.model;

import com.campus.lostfound.model.enums.VerificationStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_verifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private VerificationStatus status = VerificationStatus.PENDING;

    @Column(name = "verified_by")
    private Long verifiedBy;

    @Column(name = "verification_notes", columnDefinition = "TEXT")
    private String verificationNotes;

    @Column(name = "student_id_image_url")
    private String studentIdImageUrl;

    @Column(name = "additional_docs_url")
    private String additionalDocsUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    // Helper methods
    public Long getUserId() {
        return user != null ? user.getId() : null;
    }

    public String getUserName() {
        return user != null ?
                user.getFirstName() + " " + user.getLastName() :
                "Unknown";
    }

    public String getUserEmail() {
        return user != null ? user.getEmail() : null;
    }

    public String getStudentId() {
        return user != null ? user.getStudentId() : null;
    }

    public String getStatusColor() {
        return status != null ? status.getColor() : "#f59e0b";
    }

    public String getStatusDisplayName() {
        return status != null ? status.getDisplayName() : "Pending";
    }
}