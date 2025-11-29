package com.campus.lostfound.dto;

import com.campus.lostfound.model.Item;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ItemResponse {
    private Long id;
    private String title;
    private String description;
    private Item.ItemType itemType;
    private CategoryResponse category;
    private String location;
    private LocalDate dateLostFound;
    private String imageUrls;
    private Item.ItemStatus status;
    private UserResponse user;
    private String contactPreference;
    private Boolean isPublic;
    private Double reward;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}