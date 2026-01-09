package com.campus.lostfound.repository;

import com.campus.lostfound.model.UserVerification;
import com.campus.lostfound.model.enums.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserVerificationRepository extends JpaRepository<UserVerification, Long> {

    Optional<UserVerification> findByUserId(Long userId);

    List<UserVerification> findByStatus(VerificationStatus status);

    Long countByStatus(VerificationStatus status);

    boolean existsByUserIdAndStatus(Long userId, VerificationStatus status);
}