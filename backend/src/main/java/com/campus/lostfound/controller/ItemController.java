package com.campus.lostfound.controller;

import com.campus.lostfound.dto.ItemRequestDTO;
import com.campus.lostfound.dto.ItemResponseDTO;
import com.campus.lostfound.dto.DashboardStatsDTO;
import com.campus.lostfound.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/items")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ItemController {

    private final ItemService itemService;

    @PostMapping
    public ResponseEntity<ItemResponseDTO> createItem(
            @Valid @RequestBody ItemRequestDTO request,
            @AuthenticationPrincipal Long userId) {
        ItemResponseDTO item = itemService.createItem(request, userId);
        return ResponseEntity.ok(item);
    }

    @GetMapping
    public ResponseEntity<Page<ItemResponseDTO>> getAllItems(
            @PageableDefault(size = 10) Pageable pageable) {
        Page<ItemResponseDTO> items = itemService.getAllItems(pageable);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemResponseDTO> getItemById(@PathVariable Long id) {
        ItemResponseDTO item = itemService.getItemById(id);
        return ResponseEntity.ok(item);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemResponseDTO> updateItem(
            @PathVariable Long id,
            @Valid @RequestBody ItemRequestDTO request,
            @AuthenticationPrincipal Long userId) {
        ItemResponseDTO item = itemService.updateItem(id, request, userId);
        return ResponseEntity.ok(item);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(
            @PathVariable Long id,
            @AuthenticationPrincipal Long userId) {
        itemService.deleteItem(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<ItemResponseDTO> markAsResolved(
            @PathVariable Long id,
            @AuthenticationPrincipal Long userId) {
        ItemResponseDTO item = itemService.markAsResolved(id, userId);
        return ResponseEntity.ok(item);
    }

    @PostMapping("/{id}/flag")
    public ResponseEntity<ItemResponseDTO> flagItem(
            @PathVariable Long id,
            @RequestParam String reason,
            @AuthenticationPrincipal Long userId) {
        ItemResponseDTO item = itemService.flagItem(id, reason, userId);
        return ResponseEntity.ok(item);
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        DashboardStatsDTO stats = itemService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<ItemResponseDTO>> getRecentItems(
            @RequestParam(defaultValue = "6") int limit) {
        List<ItemResponseDTO> items = itemService.getRecentItems(limit);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/my-items")
    public ResponseEntity<List<ItemResponseDTO>> getMyItems(
            @AuthenticationPrincipal Long userId) {
        List<ItemResponseDTO> items = itemService.getUserItems(userId);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ItemResponseDTO>> searchItems(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String campusZone,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<ItemResponseDTO> items = itemService.searchItems(query, type, category, campusZone, pageable);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics(
            @RequestParam(defaultValue = "week") String timeRange) {
        Map<String, Object> analytics = itemService.getAnalytics(timeRange);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/by-location/{location}")
    public ResponseEntity<List<ItemResponseDTO>> getItemsByLocation(
            @PathVariable String location) {
        List<ItemResponseDTO> items = itemService.getItemsByLocation(location);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/by-category/{category}")
    public ResponseEntity<List<ItemResponseDTO>> getItemsByCategory(
            @PathVariable String category) {
        List<ItemResponseDTO> items = itemService.getItemsByCategory(category);
        return ResponseEntity.ok(items);
    }
}