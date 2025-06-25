package com.example.onlinepetshop.controller.admin;

import com.example.onlinepetshop.dto.category.CategoryResponse;
import com.example.onlinepetshop.dto.category.CreateCategoryRequest;
import com.example.onlinepetshop.service.category.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> createCategory(
            @RequestBody CreateCategoryRequest request,
            Authentication authentication) {

        CategoryResponse createdCategory = categoryService.createCategory(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    @DeleteMapping("/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Long categoryId,
            Authentication authentication) {

        categoryService.deleteCategory(categoryId, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
