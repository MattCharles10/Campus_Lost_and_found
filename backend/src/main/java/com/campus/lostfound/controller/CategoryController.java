package com.campus.lostfound.controller;

import com.campus.lostfound.dto.CategoryResponse;
import com.campus.lostfound.model.Category;
import com.campus.lostfound.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        List<Category> categories = categoryRepository.findByIsActiveTrue();
        List<CategoryResponse> response = categories.stream()
                .map(category -> new CategoryResponse(
                        category.getId(),
                        category.getName(),
                        category.getDescription(),
                        category.getIcon(),
                        category.getColor()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}