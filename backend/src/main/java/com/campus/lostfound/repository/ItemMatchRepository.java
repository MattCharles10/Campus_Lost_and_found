package com.campus.lostfound.repository;

import com.campus.lostfound.model.ItemMatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemMatchRepository extends JpaRepository<ItemMatch, Long> {

    @Query("SELECT m FROM ItemMatch m WHERE m.lostItem.id = :itemId OR m.foundItem.id = :itemId")
    List<ItemMatch> findAllMatchesByItemId(@Param("itemId") Long itemId);

    @Query("SELECT m FROM ItemMatch m WHERE (m.lostItem.id = :itemId OR m.foundItem.id = :itemId) AND m.active = true")
    List<ItemMatch> findActiveMatchesByItemId(@Param("itemId") Long itemId);

    @Query("SELECT COUNT(m) FROM ItemMatch m WHERE m.active = true")
    Long countActiveMatches();

    @Query("SELECT COUNT(m) FROM ItemMatch m WHERE m.matchLevel = 'EXCELLENT' AND m.active = true")
    Long countExcellentMatches();

    @Query("SELECT m FROM ItemMatch m WHERE (m.lostItem.reportedBy.id = :userId OR m.foundItem.reportedBy.id = :userId) AND m.active = true")
    List<ItemMatch> findUserMatches(@Param("userId") Long userId);
}