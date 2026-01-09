package com.campus.lostfound.repository;

import com.campus.lostfound.model.Item;
import com.campus.lostfound.model.enums.ItemStatus;
import com.campus.lostfound.model.enums.ItemType;
import com.campus.lostfound.model.enums.ItemCategory;
import com.campus.lostfound.model.enums.CampusZone;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    Page<Item> findByTypeAndStatus(ItemType type, ItemStatus status, Pageable pageable);

    List<Item> findByCategoryAndStatus(ItemCategory category, ItemStatus status);

    List<Item> findByLocationContainingIgnoreCaseAndStatus(String location, ItemStatus status);

    List<Item> findByCampusZoneAndStatus(CampusZone campusZone, ItemStatus status);

    List<Item> findByReportedByIdAndStatus(Long userId, ItemStatus status);

    Page<Item> findByStatus(ItemStatus status, Pageable pageable);

    @Query("SELECT i FROM Item i WHERE i.reportedBy.id = :userId ORDER BY i.dateReported DESC")
    List<Item> findRecentByUser(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT COUNT(i) FROM Item i WHERE i.type = 'LOST' AND i.status = 'ACTIVE'")
    Long countActiveLostItems();

    @Query("SELECT COUNT(i) FROM Item i WHERE i.type = 'FOUND' AND i.status = 'ACTIVE'")
    Long countActiveFoundItems();

    @Query("SELECT COUNT(i) FROM Item i WHERE i.status = 'RESOLVED'")
    Long countResolvedItems();

    @Query("SELECT i.category, COUNT(i) FROM Item i WHERE i.status = 'ACTIVE' GROUP BY i.category")
    List<Object[]> countItemsByCategory();

    @Query("SELECT i.location, COUNT(i) FROM Item i WHERE i.status = 'ACTIVE' GROUP BY i.location")
    List<Object[]> countItemsByLocation();

    @Query("SELECT i.campusZone, COUNT(i) FROM Item i WHERE i.status = 'ACTIVE' GROUP BY i.campusZone")
    List<Object[]> countItemsByCampusZone();

    @Query("SELECT i FROM Item i WHERE i.flagged = true AND i.status = 'ACTIVE'")
    List<Item> findFlaggedItems();

    @Query("SELECT i FROM Item i WHERE i.dateReported >= :startDate ORDER BY i.dateReported DESC")
    List<Item> findRecentItems(@Param("startDate") LocalDateTime startDate, Pageable pageable);

    @Query("SELECT i FROM Item i WHERE " +
            "(:type IS NULL OR i.type = :type) AND " +
            "(:category IS NULL OR i.category = :category) AND " +
            "(:campusZone IS NULL OR i.campusZone = :campusZone) AND " +
            "(:status IS NULL OR i.status = :status) AND " +
            "(LOWER(i.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(i.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(i.location) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Item> searchItems(
            @Param("query") String query,
            @Param("type") ItemType type,
            @Param("category") ItemCategory category,
            @Param("campusZone") CampusZone campusZone,
            @Param("status") ItemStatus status,
            Pageable pageable);

    @Query("SELECT i FROM Item i WHERE i.type = 'FOUND' AND i.status = 'ACTIVE' AND " +
            "(i.category = :category OR :category IS NULL) AND " +
            "(i.campusZone = :campusZone OR :campusZone IS NULL)")
    List<Item> findPotentialMatchesForLostItem(
            @Param("category") ItemCategory category,
            @Param("campusZone") CampusZone campusZone);

    @Query("SELECT i FROM Item i WHERE i.type = 'LOST' AND i.status = 'ACTIVE' AND " +
            "(i.category = :category OR :category IS NULL) AND " +
            "(i.campusZone = :campusZone OR :campusZone IS NULL)")
    List<Item> findPotentialMatchesForFoundItem(
            @Param("category") ItemCategory category,
            @Param("campusZone") CampusZone campusZone);

    @Query("SELECT COUNT(i) FROM Item i WHERE i.flagged = true")
    Long countFlaggedItems();

    @Query("SELECT i FROM Item i WHERE i.type = :type AND i.status = :status")
    List<Item> findByTypeAndStatus(@Param("type") ItemType type, @Param("status") ItemStatus status);

    @Query("SELECT i FROM Item i WHERE i.status = :status")
    List<Item> findByStatus(@Param("status") ItemStatus status);
}