package com.campus.lostfound.controller;

import com.campus.lostfound.dto.MatchResponseDTO;
import com.campus.lostfound.service.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/matches")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class MatchingController {

    private final MatchingService matchingService;

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<MatchResponseDTO>> getMatchesForItem(@PathVariable Long itemId) {
        List<MatchResponseDTO> matches = matchingService.getMatchesForItem(itemId);
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/my-matches")
    public ResponseEntity<List<MatchResponseDTO>> getMyMatches(
            @AuthenticationPrincipal Long userId) {
        List<MatchResponseDTO> matches = matchingService.getUserMatches(userId);
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getMatchingStats() {
        Map<String, Object> stats = matchingService.getMatchingStats();
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/trigger/{itemId}")
    public ResponseEntity<Void> triggerMatchingForItem(@PathVariable Long itemId) {
        matchingService.findMatchesForItem(itemId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/trigger-all")
    public ResponseEntity<Void> triggerMatchingForAll() {
        matchingService.triggerMatchingForAllItems();
        return ResponseEntity.ok().build();
    }
}