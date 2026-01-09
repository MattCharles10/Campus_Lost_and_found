package com.campus.lostfound.service;

import com.campus.lostfound.dto.MatchResponseDTO;

import java.util.List;
import java.util.Map;

public interface MatchingService {
    void findMatchesForItem(Long itemId);
    List<MatchResponseDTO> getMatchesForItem(Long itemId);
    List<MatchResponseDTO> getUserMatches(Long userId);
    Map<String, Object> getMatchingStats();
    void runScheduledMatching();
    void triggerMatchingForAllItems();
}