package com.campus.lostfound.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TestController {

    @GetMapping("/health")
    public String health() {
        return "✅ Backend is running on port 8082";
    }

    @GetMapping("/db")
    public String testDb() {
        return "✅ Database connection successful";
    }

    @GetMapping("/public")
    public String publicEndpoint() {
        return "✅ Public endpoint accessible without authentication";
    }

    @GetMapping("/secure")
    public String secureEndpoint() {
        return "✅ Secure endpoint - requires authentication";
    }
}