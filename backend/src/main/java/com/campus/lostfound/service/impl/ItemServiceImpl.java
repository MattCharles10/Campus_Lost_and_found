package com.campus.lostfound.service.impl;

import com.campus.lostfound.dto.ItemRequestDTO;
import com.campus.lostfound.dto.ItemResponseDTO;
import com.campus.lostfound.dto.DashboardStatsDTO;
import com.campus.lostfound.model.*;
import com.campus.lostfound.model.enums.*;
import com.campus.lostfound.repository.ItemRepository;
import com.campus.lostfound.repository.ItemMatchRepository;
import com.campus.lostfound.service.ItemService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;
    private final ItemMatchRepository itemMatchRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public ItemResponseDTO createItem(ItemRequestDTO request, Long userId) {
        try {
            User user = entityManager.find(User.class, userId);
            if (user == null) {
                throw new RuntimeException("User not found with ID: " + userId);
            }

            Item item = Item.builder()
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .type(request.getType())
                    .category(request.getCategory())
                    .location(request.getLocation())
                    .campusZone(request.getCampusZone())
                    .building(request.getBuilding())
                    .roomNumber(request.getRoomNumber())
                    .color(request.getColor())
                    .brand(request.getBrand())
                    .model(request.getModel())
                    .serialNumber(request.getSerialNumber())
                    .dateLostOrFound(request.getDateLostOrFound())
                    .reportedBy(user)
                    .verified(false)
                    .flagged(false)
                    .status(ItemStatus.ACTIVE)
                    .build();

            Item savedItem = itemRepository.save(item);

            // Add images if provided
            if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
                Set<ItemImage> images = new HashSet<>();
                for (int i = 0; i < request.getImageUrls().size(); i++) {
                    ItemImage image = ItemImage.builder()
                            .imageUrl(request.getImageUrls().get(i))
                            .caption(request.getImageCaption())
                            .primary(i == 0) // First image is primary
                            .item(savedItem)
                            .build();
                    images.add(image);
                }
                savedItem.setImages(images);
                savedItem = itemRepository.save(savedItem);
            }

            log.info("Item created successfully: {}", savedItem.getId());
            return ItemResponseDTO.fromEntity(savedItem, 0);

        } catch (Exception e) {
            log.error("Error creating item: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create item: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ItemResponseDTO getItemById(Long id) {
        try {
            Item item = itemRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Item not found with ID: " + id));

            int matchCount = itemMatchRepository.findActiveMatchesByItemId(id).size();
            return ItemResponseDTO.fromEntity(item, matchCount);

        } catch (Exception e) {
            log.error("Error getting item by ID: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get item: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ItemResponseDTO> getAllItems(Pageable pageable) {
        try {
            Page<Item> itemsPage = itemRepository.findAll(pageable);

            List<ItemResponseDTO> dtos = itemsPage.getContent().stream()
                    .map(item -> {
                        int matchCount = itemMatchRepository.findActiveMatchesByItemId(item.getId()).size();
                        return ItemResponseDTO.fromEntity(item, matchCount);
                    })
                    .collect(Collectors.toList());

            return new PageImpl<>(dtos, pageable, itemsPage.getTotalElements());

        } catch (Exception e) {
            log.error("Error getting all items: {}", e.getMessage(), e);
            return Page.empty();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ItemResponseDTO> searchItems(String query, String type, String category,
                                             String campusZone, Pageable pageable) {
        try {
            ItemType itemType = type != null ? ItemType.valueOf(type) : null;
            ItemCategory itemCategory = category != null ? ItemCategory.valueOf(category) : null;
            CampusZone zone = campusZone != null ? CampusZone.valueOf(campusZone) : null;

            Page<Item> itemsPage = itemRepository.searchItems(
                    query != null ? query : "",
                    itemType,
                    itemCategory,
                    zone,
                    ItemStatus.ACTIVE,
                    pageable
            );

            List<ItemResponseDTO> dtos = itemsPage.getContent().stream()
                    .map(item -> {
                        int matchCount = itemMatchRepository.findActiveMatchesByItemId(item.getId()).size();
                        return ItemResponseDTO.fromEntity(item, matchCount);
                    })
                    .collect(Collectors.toList());

            return new PageImpl<>(dtos, pageable, itemsPage.getTotalElements());

        } catch (Exception e) {
            log.error("Error searching items: {}", e.getMessage(), e);
            return Page.empty();
        }
    }

    @Override
    @Transactional
    public ItemResponseDTO updateItem(Long id, ItemRequestDTO request, Long userId) {
        try {
            Item item = itemRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Item not found with ID: " + id));

            // Check permission
            if (!item.getReportedBy().getId().equals(userId)) {
                // Check if user is admin
                User user = entityManager.find(User.class, userId);
                // Add admin check logic here if needed
                throw new RuntimeException("You don't have permission to update this item");
            }

            item.setTitle(request.getTitle());
            item.setDescription(request.getDescription());
            item.setCategory(request.getCategory());
            item.setLocation(request.getLocation());
            item.setCampusZone(request.getCampusZone());
            item.setBuilding(request.getBuilding());
            item.setRoomNumber(request.getRoomNumber());
            item.setColor(request.getColor());
            item.setBrand(request.getBrand());
            item.setModel(request.getModel());
            item.setSerialNumber(request.getSerialNumber());
            item.setDateLostOrFound(request.getDateLostOrFound());

            Item updatedItem = itemRepository.save(item);

            int matchCount = itemMatchRepository.findActiveMatchesByItemId(id).size();
            return ItemResponseDTO.fromEntity(updatedItem, matchCount);

        } catch (Exception e) {
            log.error("Error updating item: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update item: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void deleteItem(Long id, Long userId) {
        try {
            Item item = itemRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Item not found with ID: " + id));

            // Check permission
            if (!item.getReportedBy().getId().equals(userId)) {
                throw new RuntimeException("You don't have permission to delete this item");
            }

            item.setStatus(ItemStatus.DELETED);
            itemRepository.save(item);

            log.info("Item {} deleted by user {}", id, userId);

        } catch (Exception e) {
            log.error("Error deleting item: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete item: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ItemResponseDTO markAsResolved(Long id, Long userId) {
        try {
            Item item = itemRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Item not found with ID: " + id));

            User user = entityManager.find(User.class, userId);
            if (user == null) {
                throw new RuntimeException("User not found");
            }

            item.setStatus(ItemStatus.RESOLVED);
            item.setClaimedBy(user);
            item.setDateClaimed(LocalDateTime.now());

            Item resolvedItem = itemRepository.save(item);

            int matchCount = itemMatchRepository.findActiveMatchesByItemId(id).size();
            return ItemResponseDTO.fromEntity(resolvedItem, matchCount);

        } catch (Exception e) {
            log.error("Error marking item as resolved: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to mark item as resolved: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ItemResponseDTO flagItem(Long id, String reason, Long userId) {
        try {
            Item item = itemRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Item not found with ID: " + id));

            item.setFlagged(true);
            item.setFlagReason(reason);

            Item flaggedItem = itemRepository.save(item);

            int matchCount = itemMatchRepository.findActiveMatchesByItemId(id).size();
            return ItemResponseDTO.fromEntity(flaggedItem, matchCount);

        } catch (Exception e) {
            log.error("Error flagging item: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to flag item: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ItemResponseDTO unflagItem(Long id, Long adminId) {
        try {
            Item item = itemRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Item not found with ID: " + id));

            item.setFlagged(false);
            item.setFlagReason(null);

            Item unflaggedItem = itemRepository.save(item);

            int matchCount = itemMatchRepository.findActiveMatchesByItemId(id).size();
            return ItemResponseDTO.fromEntity(unflaggedItem, matchCount);

        } catch (Exception e) {
            log.error("Error unflagging item: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to unflag item: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemResponseDTO> getRecentItems(int limit) {
        try {
            String query = "SELECT i FROM Item i WHERE i.status = 'ACTIVE' ORDER BY i.dateReported DESC";
            TypedQuery<Item> typedQuery = entityManager.createQuery(query, Item.class)
                    .setMaxResults(limit);

            List<Item> items = typedQuery.getResultList();

            return items.stream()
                    .map(item -> {
                        int matchCount = itemMatchRepository.findActiveMatchesByItemId(item.getId()).size();
                        return ItemResponseDTO.fromEntity(item, matchCount);
                    })
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error getting recent items: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemResponseDTO> getUserItems(Long userId) {
        try {
            List<Item> items = itemRepository.findByReportedByIdAndStatus(userId, ItemStatus.ACTIVE);

            return items.stream()
                    .map(item -> {
                        int matchCount = itemMatchRepository.findActiveMatchesByItemId(item.getId()).size();
                        return ItemResponseDTO.fromEntity(item, matchCount);
                    })
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error getting user items: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats() {
        try {
            DashboardStatsDTO stats = new DashboardStatsDTO();

            // Basic stats
            stats.setTotalItems(itemRepository.count());
            stats.setLostItems(itemRepository.countActiveLostItems());
            stats.setFoundItems(itemRepository.countActiveFoundItems());
            stats.setResolvedCases(itemRepository.countResolvedItems());

            // Active users count
            Long activeUsers = countActiveUsers();
            stats.setActiveUsers(activeUsers);

            // Response rate (simplified)
            stats.setResponseRate("85%");

            // Verification stats
            stats.setPendingVerifications(0L); // Will come from UserVerificationRepository
            stats.setFlaggedContent(itemRepository.countFlaggedItems());

            // Matching stats
            stats.setPotentialMatches(itemMatchRepository.countActiveMatches());
            stats.setSmartMatches(itemMatchRepository.countExcellentMatches());

            // Match rate calculation
            Long totalMatches = itemMatchRepository.countActiveMatches();
            Long excellentMatches = itemMatchRepository.countExcellentMatches();
            double matchRate = totalMatches > 0 ? (excellentMatches.doubleValue() / totalMatches.doubleValue()) * 100 : 0;
            stats.setMatchRate(String.format("%.1f%%", matchRate));

            // Category distribution
            List<Object[]> categoryStats = itemRepository.countItemsByCategory();
            Map<String, Long> categoryMap = new HashMap<>();
            for (Object[] stat : categoryStats) {
                String categoryName = ((ItemCategory) stat[0]).name();
                categoryMap.put(categoryName, (Long) stat[1]);
            }
            // Convert to JSON string or keep as Map depending on your DTO
            // stats.setItemsByCategory(categoryMap);

            // Location distribution
            List<Object[]> locationStats = itemRepository.countItemsByLocation();
            Map<String, Long> locationMap = new HashMap<>();
            for (Object[] stat : locationStats) {
                locationMap.put((String) stat[0], (Long) stat[1]);
            }
            // stats.setItemsByLocation(locationMap);

            return stats;

        } catch (Exception e) {
            log.error("Error getting dashboard stats: {}", e.getMessage(), e);
            return new DashboardStatsDTO();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAnalytics(String timeRange) {
        try {
            Map<String, Object> analytics = new HashMap<>();

            LocalDateTime endDate = LocalDateTime.now();
            LocalDateTime startDate;

            switch (timeRange.toLowerCase()) {
                case "week":
                    startDate = endDate.minusWeeks(1);
                    break;
                case "month":
                    startDate = endDate.minusMonths(1);
                    break;
                case "quarter":
                    startDate = endDate.minusMonths(3);
                    break;
                case "year":
                    startDate = endDate.minusYears(1);
                    break;
                default:
                    startDate = endDate.minusWeeks(1);
            }

            // Items created in time range
            String itemsQuery = "SELECT COUNT(i) FROM Item i WHERE i.dateReported BETWEEN :startDate AND :endDate";
            Long itemsCount = entityManager.createQuery(itemsQuery, Long.class)
                    .setParameter("startDate", startDate)
                    .setParameter("endDate", endDate)
                    .getSingleResult();

            // Items resolved in time range
            String resolvedQuery = "SELECT COUNT(i) FROM Item i WHERE i.status = 'RESOLVED' AND i.dateClaimed BETWEEN :startDate AND :endDate";
            Long resolvedCount = entityManager.createQuery(resolvedQuery, Long.class)
                    .setParameter("startDate", startDate)
                    .setParameter("endDate", endDate)
                    .getSingleResult();

            // Recovery rate
            double recoveryRate = itemsCount > 0 ? (resolvedCount.doubleValue() / itemsCount.doubleValue()) * 100 : 0;

            analytics.put("timeRange", timeRange);
            analytics.put("startDate", startDate);
            analytics.put("endDate", endDate);
            analytics.put("itemsCreated", itemsCount);
            analytics.put("itemsResolved", resolvedCount);
            analytics.put("recoveryRate", String.format("%.1f%%", recoveryRate));
            analytics.put("avgResponseTime", "2.4 hours"); // This would need actual calculation

            // Daily breakdown for chart
            Map<String, Long> dailyBreakdown = new HashMap<>();
            LocalDateTime current = startDate;
            while (!current.isAfter(endDate)) {
                LocalDateTime nextDay = current.plusDays(1);

                String dailyQuery = "SELECT COUNT(i) FROM Item i WHERE i.dateReported BETWEEN :dayStart AND :dayEnd";
                Long dailyCount = entityManager.createQuery(dailyQuery, Long.class)
                        .setParameter("dayStart", current)
                        .setParameter("dayEnd", nextDay)
                        .getSingleResult();

                String dateKey = current.toLocalDate().toString();
                dailyBreakdown.put(dateKey, dailyCount);
                current = nextDay;
            }

            analytics.put("dailyBreakdown", dailyBreakdown);

            return analytics;

        } catch (Exception e) {
            log.error("Error getting analytics: {}", e.getMessage(), e);
            return Collections.emptyMap();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemResponseDTO> getItemsByLocation(String location) {
        try {
            List<Item> items = itemRepository.findByLocationContainingIgnoreCaseAndStatus(location, ItemStatus.ACTIVE);

            return items.stream()
                    .map(item -> {
                        int matchCount = itemMatchRepository.findActiveMatchesByItemId(item.getId()).size();
                        return ItemResponseDTO.fromEntity(item, matchCount);
                    })
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error getting items by location: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItemResponseDTO> getItemsByCategory(String category) {
        try {
            ItemCategory itemCategory = ItemCategory.valueOf(category.toUpperCase());
            List<Item> items = itemRepository.findByCategoryAndStatus(itemCategory, ItemStatus.ACTIVE);

            return items.stream()
                    .map(item -> {
                        int matchCount = itemMatchRepository.findActiveMatchesByItemId(item.getId()).size();
                        return ItemResponseDTO.fromEntity(item, matchCount);
                    })
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error getting items by category: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    private Long countActiveUsers() {
        try {
            String query = "SELECT COUNT(u) FROM User u WHERE u.isActive = true";
            return entityManager.createQuery(query, Long.class)
                    .getSingleResult();
        } catch (Exception e) {
            log.error("Error counting active users: {}", e.getMessage());
            return 0L;
        }
    }
}