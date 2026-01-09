package com.campus.lostfound.service;

import com.campus.lostfound.dto.ItemRequestDTO;
import com.campus.lostfound.dto.ItemResponseDTO;
import com.campus.lostfound.dto.DashboardStatsDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface ItemService {
    ItemResponseDTO createItem(ItemRequestDTO request, Long userId);
    ItemResponseDTO getItemById(Long id);
    Page<ItemResponseDTO> getAllItems(Pageable pageable);
    Page<ItemResponseDTO> searchItems(String query, String type, String category, String campusZone, Pageable pageable);
    ItemResponseDTO updateItem(Long id, ItemRequestDTO request, Long userId);
    void deleteItem(Long id, Long userId);
    ItemResponseDTO markAsResolved(Long id, Long userId);
    ItemResponseDTO flagItem(Long id, String reason, Long userId);
    ItemResponseDTO unflagItem(Long id, Long adminId);
    List<ItemResponseDTO> getRecentItems(int limit);
    List<ItemResponseDTO> getUserItems(Long userId);
    DashboardStatsDTO getDashboardStats();
    Map<String, Object> getAnalytics(String timeRange);
    List<ItemResponseDTO> getItemsByLocation(String location);
    List<ItemResponseDTO> getItemsByCategory(String category);
}