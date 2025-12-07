package com.campus.lostfound.controller;

import com.campus.lostfound.dto.ApiResponse;
import com.campus.lostfound.dto.ItemRequest;
import com.campus.lostfound.dto.ItemResponse;
import com.campus.lostfound.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ItemController {

    @Autowired
    private ItemService itemService;

    @PostMapping
    public ResponseEntity<?> createItem(@Valid @RequestBody ItemRequest itemRequest, Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            ItemResponse response = itemService.createItem(itemRequest, userEmail);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create item: " + e.getMessage()));
        }
    }

    @GetMapping("/my-items")
    public ResponseEntity<?> getUserItems(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<ItemResponse> items = itemService.getUserItems(userEmail);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get user items: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllItems() {
        try {
            List<ItemResponse> items = itemService.getAllItems();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get items: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchItems(@RequestParam String query) {
        try {
            List<ItemResponse> items = itemService.searchItems(query);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Search failed: " + e.getMessage()));
        }
    }
}