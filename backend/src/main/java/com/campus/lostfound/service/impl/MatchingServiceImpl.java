package com.campus.lostfound.service.impl;

import com.campus.lostfound.dto.MatchResponseDTO;
import com.campus.lostfound.model.*;
import com.campus.lostfound.model.enums.*;
import com.campus.lostfound.repository.ItemMatchRepository;
import com.campus.lostfound.repository.ItemRepository;
import com.campus.lostfound.service.MatchingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MatchingServiceImpl implements MatchingService {

    private final ItemRepository itemRepository;
    private final ItemMatchRepository itemMatchRepository;

    private static final double LOCATION_WEIGHT = 0.3;
    private static final double CATEGORY_WEIGHT = 0.25;
    private static final double DESCRIPTION_WEIGHT = 0.25;
    private static final double TIME_WEIGHT = 0.2;

    @Override
    @Transactional
    public void findMatchesForItem(Long itemId) {
        try {
            Item item = itemRepository.findById(itemId)
                    .orElseThrow(() -> new RuntimeException("Item not found with ID: " + itemId));

            if (item.getType() == ItemType.LOST) {
                findMatchesForLostItem(item);
            } else {
                findMatchesForFoundItem(item);
            }

            log.info("Matches found for item {}", itemId);
        } catch (Exception e) {
            log.error("Error finding matches for item {}: {}", itemId, e.getMessage(), e);
        }
    }

    private void findMatchesForLostItem(Item lostItem) {
        List<Item> foundItems = itemRepository.findPotentialMatchesForFoundItem(
                lostItem.getCategory(),
                lostItem.getCampusZone()
        );

        List<ItemMatch> matches = new ArrayList<>();

        for (Item foundItem : foundItems) {
            // Skip if same user
            if (lostItem.getReportedBy().getId().equals(foundItem.getReportedBy().getId())) {
                continue;
            }

            double similarityScore = calculateSimilarityScore(lostItem, foundItem);

            if (similarityScore >= 50) {
                ItemMatch match = createMatch(lostItem, foundItem, similarityScore);
                matches.add(match);
            }
        }

        if (!matches.isEmpty()) {
            itemMatchRepository.saveAll(matches);
            log.info("Created {} matches for lost item {}", matches.size(), lostItem.getId());
        }
    }

    private void findMatchesForFoundItem(Item foundItem) {
        List<Item> lostItems = itemRepository.findPotentialMatchesForLostItem(
                foundItem.getCategory(),
                foundItem.getCampusZone()
        );

        List<ItemMatch> matches = new ArrayList<>();

        for (Item lostItem : lostItems) {
            // Skip if same user
            if (foundItem.getReportedBy().getId().equals(lostItem.getReportedBy().getId())) {
                continue;
            }

            double similarityScore = calculateSimilarityScore(lostItem, foundItem);

            if (similarityScore >= 50) {
                ItemMatch match = createMatch(lostItem, foundItem, similarityScore);
                matches.add(match);
            }
        }

        if (!matches.isEmpty()) {
            itemMatchRepository.saveAll(matches);
            log.info("Created {} matches for found item {}", matches.size(), foundItem.getId());
        }
    }

    private double calculateSimilarityScore(Item lostItem, Item foundItem) {
        double score = 0.0;

        // Location similarity
        if (lostItem.getLocation() != null && foundItem.getLocation() != null) {
            if (lostItem.getLocation().equalsIgnoreCase(foundItem.getLocation())) {
                score += LOCATION_WEIGHT * 100;
            } else if (lostItem.getBuilding() != null && foundItem.getBuilding() != null &&
                    lostItem.getBuilding().equalsIgnoreCase(foundItem.getBuilding())) {
                score += LOCATION_WEIGHT * 80;
            } else if (lostItem.getCampusZone() == foundItem.getCampusZone()) {
                score += LOCATION_WEIGHT * 60;
            }
        }

        // Category similarity
        if (lostItem.getCategory() == foundItem.getCategory()) {
            score += CATEGORY_WEIGHT * 100;
        }

        // Description similarity
        score += calculateDescriptionSimilarity(lostItem, foundItem) * DESCRIPTION_WEIGHT;

        // Time similarity
        if (lostItem.getDateLostOrFound() != null && foundItem.getDateLostOrFound() != null) {
            long hoursDifference = Math.abs(ChronoUnit.HOURS.between(
                    lostItem.getDateLostOrFound(), foundItem.getDateLostOrFound()));

            if (hoursDifference <= 2) {
                score += TIME_WEIGHT * 100;
            } else if (hoursDifference <= 24) {
                score += TIME_WEIGHT * 70;
            } else if (hoursDifference <= 72) {
                score += TIME_WEIGHT * 40;
            }
        }

        // Brand/Color/Model matching
        if (lostItem.getBrand() != null && foundItem.getBrand() != null &&
                lostItem.getBrand().equalsIgnoreCase(foundItem.getBrand())) {
            score += 15;
        }

        if (lostItem.getColor() != null && foundItem.getColor() != null &&
                lostItem.getColor().equalsIgnoreCase(foundItem.getColor())) {
            score += 10;
        }

        return Math.min(score, 100);
    }

    private double calculateDescriptionSimilarity(Item item1, Item item2) {
        if (item1.getDescription() == null || item2.getDescription() == null) {
            return 0;
        }

        String desc1 = item1.getDescription().toLowerCase();
        String desc2 = item2.getDescription().toLowerCase();

        Set<String> words1 = new HashSet<>(Arrays.asList(desc1.split("\\W+")));
        Set<String> words2 = new HashSet<>(Arrays.asList(desc2.split("\\W+")));

        if (words1.isEmpty() || words2.isEmpty()) {
            return 0;
        }

        Set<String> intersection = new HashSet<>(words1);
        intersection.retainAll(words2);

        double similarity = (2.0 * intersection.size()) / (words1.size() + words2.size());
        return similarity * 100;
    }

    private ItemMatch createMatch(Item lostItem, Item foundItem, double similarityScore) {
        List<String> matchReasons = getMatchReasons(lostItem, foundItem);

        ItemMatch match = ItemMatch.builder()
                .lostItem(lostItem)
                .foundItem(foundItem)
                .similarityScore(similarityScore)
                .matchLevel(MatchLevel.fromScore(similarityScore))
                .matchReasons(String.join("; ", matchReasons))
                .matchedAt(LocalDateTime.now())
                .notified(false)
                .active(true)
                .build();

        return match;
    }

    private List<String> getMatchReasons(Item lostItem, Item foundItem) {
        List<String> reasons = new ArrayList<>();

        if (lostItem.getCategory() == foundItem.getCategory()) {
            reasons.add("Same category: " + lostItem.getCategory().name());
        }

        if (lostItem.getLocation() != null && foundItem.getLocation() != null &&
                lostItem.getLocation().equalsIgnoreCase(foundItem.getLocation())) {
            reasons.add("Same location: " + lostItem.getLocation());
        }

        if (lostItem.getBrand() != null && foundItem.getBrand() != null &&
                lostItem.getBrand().equalsIgnoreCase(foundItem.getBrand())) {
            reasons.add("Same brand: " + lostItem.getBrand());
        }

        if (lostItem.getColor() != null && foundItem.getColor() != null &&
                lostItem.getColor().equalsIgnoreCase(foundItem.getColor())) {
            reasons.add("Same color: " + lostItem.getColor());
        }

        if (lostItem.getDateLostOrFound() != null && foundItem.getDateLostOrFound() != null) {
            long hours = Math.abs(ChronoUnit.HOURS.between(
                    lostItem.getDateLostOrFound(), foundItem.getDateLostOrFound()));
            reasons.add("Reported within " + hours + " hours");
        }

        return reasons;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MatchResponseDTO> getMatchesForItem(Long itemId) {
        try {
            List<ItemMatch> matches = itemMatchRepository.findAllMatchesByItemId(itemId);

            return matches.stream()
                    .map(MatchResponseDTO::fromEntity)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error getting matches for item {}: {}", itemId, e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<MatchResponseDTO> getUserMatches(Long userId) {
        try {
            List<ItemMatch> matches = itemMatchRepository.findUserMatches(userId);

            return matches.stream()
                    .map(MatchResponseDTO::fromEntity)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error getting user matches for user {}: {}", userId, e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getMatchingStats() {
        try {
            Map<String, Object> stats = new HashMap<>();

            Long totalMatches = itemMatchRepository.count();
            Long activeMatches = itemMatchRepository.countActiveMatches();
            Long excellentMatches = itemMatchRepository.countExcellentMatches();

            double matchRate = totalMatches > 0 ? (activeMatches.doubleValue() / totalMatches.doubleValue()) * 100 : 0;

            stats.put("totalMatches", totalMatches);
            stats.put("activeMatches", activeMatches);
            stats.put("excellentMatches", excellentMatches);
            stats.put("matchRate", String.format("%.1f%%", matchRate));
            stats.put("potentialMatches", activeMatches); // For frontend compatibility

            return stats;
        } catch (Exception e) {
            log.error("Error getting matching stats: {}", e.getMessage(), e);
            return Collections.emptyMap();
        }
    }

    @Override
    @Transactional
    public void runScheduledMatching() {
        log.info("Starting scheduled matching job...");

        List<Item> lostItems = itemRepository.findByTypeAndStatus(ItemType.LOST, ItemStatus.ACTIVE);

        int totalMatchesCreated = 0;
        for (Item lostItem : lostItems) {
            try {
                findMatchesForLostItem(lostItem);
                totalMatchesCreated++;
            } catch (Exception e) {
                log.error("Error matching item {}: {}", lostItem.getId(), e.getMessage());
            }
        }

        log.info("Scheduled matching completed. Processed {} items", totalMatchesCreated);
    }

    @Override
    @Transactional
    public void triggerMatchingForAllItems() {
        log.info("Triggering matching for all items...");

        List<Item> allItems = itemRepository.findByStatus(ItemStatus.ACTIVE);

        int processed = 0;
        for (Item item : allItems) {
            try {
                findMatchesForItem(item.getId());
                processed++;
            } catch (Exception e) {
                log.error("Error processing item {}: {}", item.getId(), e.getMessage());
            }
        }

        log.info("Matching triggered for {} items", processed);
    }
}