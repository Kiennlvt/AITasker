package com.aitasker.controller;

import com.aitasker.dto.response.ApiResponse;
import com.aitasker.dto.response.CategoryResponse;
import com.aitasker.entity.Category;
import com.aitasker.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepo;

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getActiveCategories() {
        return ApiResponse.ok(categoryRepo.findByIsActiveTrueOrderByNameAsc()
                .stream().map(this::toResponse).toList());
    }

    private CategoryResponse toResponse(Category c) {
        return CategoryResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .description(c.getDescription())
                .isActive(c.isActive())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
