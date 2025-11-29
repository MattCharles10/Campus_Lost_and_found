package com.campus.lostfound.repository;

import com.campus.lostfound.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByUserId(Long userId);
    List<Item> findByItemType(Item.ItemType itemType);
    List<Item> findByCategoryId(Long categoryId);
    List<Item> findByStatus(Item.ItemStatus status);

    @Query("SELECT i FROM Item i WHERE " +
            "LOWER(i.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(i.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(i.location) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Item> searchItems(@Param("query") String query);

    List<Item> findByUserIdAndItemType(Long userId, Item.ItemType itemType);
}