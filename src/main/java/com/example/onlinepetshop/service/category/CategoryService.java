package com.example.onlinepetshop.service.category;

import com.example.onlinepetshop.dto.category.CategoryResponse;
import com.example.onlinepetshop.dto.category.CreateCategoryRequest;
import com.example.onlinepetshop.entity.Category;

import java.util.List;

public interface CategoryService {
    List<Category> getAll();

    CategoryResponse createCategory(CreateCategoryRequest request, String email);

    void deleteCategory(Long categoryId, String email);
}