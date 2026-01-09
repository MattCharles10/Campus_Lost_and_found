package com.campus.lostfound.dto;

import com.campus.lostfound.model.enums.VerificationStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserVerificationDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String studentId;
    private VerificationStatus status;
    private String statusDisplayName;
    private String statusColor;
    private Long verifiedBy;
    private String verificationNotes;
    private String studentIdImageUrl;
    private String additionalDocsUrl;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime verifiedAt;

    // For admin response with user details
    private String userFirstName;
    private String userLastName;
    private String userPhoneNumber;
    private String userAvatarUrl;

    public static UserVerificationDTO fromEntity(com.campus.lostfound.model.UserVerification verification) {
        UserVerificationDTO dto = new UserVerificationDTO();
        dto.setId(verification.getId());
        dto.setUserId(verification.getUserId());
        dto.setUserName(verification.getUserName());
        dto.setUserEmail(verification.getUserEmail());
        dto.setStudentId(verification.getStudentId());
        dto.setStatus(verification.getStatus());
        dto.setStatusDisplayName(verification.getStatusDisplayName());
        dto.setStatusColor(verification.getStatusColor());
        dto.setVerifiedBy(verification.getVerifiedBy());
        dto.setVerificationNotes(verification.getVerificationNotes());
        dto.setStudentIdImageUrl(verification.getStudentIdImageUrl());
        dto.setAdditionalDocsUrl(verification.getAdditionalDocsUrl());
        dto.setCreatedAt(verification.getCreatedAt());
        dto.setUpdatedAt(verification.getUpdatedAt());
        dto.setVerifiedAt(verification.getVerifiedAt());

        return dto;
    }

    public static UserVerificationDTO fromEntityWithUserDetails(
            com.campus.lostfound.model.UserVerification verification,
            com.campus.lostfound.model.User user) {
        UserVerificationDTO dto = fromEntity(verification);
        dto.setUserFirstName(user.getFirstName());
        dto.setUserLastName(user.getLastName());
        dto.setUserPhoneNumber(user.getPhoneNumber());
        dto.setUserAvatarUrl(user.getAvatarUrl());
        return dto;
    }
}