package com.aitasker.controller;

import com.aitasker.dto.request.CategoryRequest;
import com.aitasker.dto.response.ApiResponse;
import com.aitasker.dto.response.CategoryResponse;
import com.aitasker.dto.response.CategoryStatsResponse;
import com.aitasker.entity.Category;
import com.aitasker.exception.AppException;
import com.aitasker.repository.CategoryRepository;
import com.aitasker.repository.JobPostRepository;
import com.aitasker.repository.ServiceRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCategoryController {

    private final CategoryRepository categoryRepo;
    private final ServiceRepository serviceRepo;
    private final JobPostRepository jobRepo;

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getAllCategories() {
        return ApiResponse.ok(categoryRepo.findAllByOrderByNameAsc()
                .stream().map(this::toResponse).toList());
    }

    @GetMapping("/stats")
    public ApiResponse<CategoryStatsResponse> getStats() {
        List<Category> all = categoryRepo.findAllByOrderByNameAsc();
        long active = all.stream().filter(Category::isActive).count();
        return ApiResponse.ok(CategoryStatsResponse.builder()
                .totalCategories(all.size())
                .activeCategories(active)
                .totalServices(serviceRepo.count())
                .totalJobs(jobRepo.count())
                .build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
        if (categoryRepo.existsByNameIgnoreCase(request.getName()))
            throw AppException.conflict("Category already exists");

        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        return ApiResponse.ok(toResponse(categoryRepo.save(category)));
    }

    @PutMapping("/{id}")
    public ApiResponse<CategoryResponse> updateCategory(@PathVariable String id,
                                                          @Valid @RequestBody CategoryRequest request) {
        Category category = categoryRepo.findById(id)
                .orElseThrow(() -> AppException.notFound("Category not found"));

        if (!category.getName().equalsIgnoreCase(request.getName())
                && categoryRepo.existsByNameIgnoreCase(request.getName()))
            throw AppException.conflict("Category already exists");

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        return ApiResponse.ok(toResponse(categoryRepo.save(category)));
    }

    @PatchMapping("/{id}/toggle")
    public ApiResponse<CategoryResponse> toggleCategory(@PathVariable String id) {
        Category category = categoryRepo.findById(id)
                .orElseThrow(() -> AppException.notFound("Category not found"));
        category.setActive(!category.isActive());
        return ApiResponse.ok(toResponse(categoryRepo.save(category)));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCategory(@PathVariable String id) {
        Category category = categoryRepo.findById(id)
                .orElseThrow(() -> AppException.notFound("Category not found"));
        categoryRepo.delete(category);
        return ApiResponse.ok("Category deleted", null);
    }

    private CategoryResponse toResponse(Category c) {
        return CategoryResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .description(c.getDescription())
                .isActive(c.isActive())
                .createdAt(c.getCreatedAt())
                .serviceCount(serviceRepo.countByCategoryIgnoreCase(c.getName()))
                .jobCount(jobRepo.countByCategoryIgnoreCase(c.getName()))
                .build();
    }
}
