package com.campus.lostfound.dto;

import com.campus.lostfound.model.Item;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ItemRequest {
    @NotBlank
    private String title;

    private String description;

    @NotNull
    private Item.ItemType itemType;

    private Long categoryId;

    private String location;

    private LocalDate dateLostFound;

    private String imageUrls;

    private String contactPreference;

    private Boolean isPublic = true;

    private Double reward;
}