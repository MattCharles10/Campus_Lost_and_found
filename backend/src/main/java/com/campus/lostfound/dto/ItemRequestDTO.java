package com.campus.lostfound.dto;

import com.campus.lostfound.model.enums.ItemCategory;
import com.campus.lostfound.model.enums.ItemType;
import com.campus.lostfound.model.enums.CampusZone;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ItemRequestDTO {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must be less than 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description must be less than 2000 characters")
    private String description;

    @NotNull(message = "Item type is required")
    private ItemType type;

    @NotNull(message = "Category is required")
    private ItemCategory category;

    @NotBlank(message = "Location is required")
    @Size(max = 200, message = "Location must be less than 200 characters")
    private String location;

    private CampusZone campusZone;

    @Size(max = 100)
    private String building;

    @Size(max = 50)
    private String roomNumber;

    @Size(max = 50)
    private String color;

    @Size(max = 100)
    private String brand;

    @Size(max = 100)
    private String model;

    @Size(max = 100)
    private String serialNumber;

    private LocalDateTime dateLostOrFound;

    private List<String> imageUrls;

    @Size(max = 200)
    private String imageCaption;
}