package com.example.onlinepetshop.service.category;

import com.example.onlinepetshop.dto.category.CategoryResponse;
import com.example.onlinepetshop.dto.category.CreateCategoryRequest;
import com.example.onlinepetshop.entity.Category;
import com.example.onlinepetshop.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    @Override
    public CategoryResponse createCategory(CreateCategoryRequest request, String email) {
        Category category = new Category();
        category.setName(request.getName());

        Category savedCategory = categoryRepository.save(category);

        return new CategoryResponse(savedCategory.getId(), savedCategory.getName());
    }

    @Override
    public void deleteCategory(Long categoryId, String email) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new NoSuchElementException("Категория не найдена");
        }

        categoryRepository.deleteById(categoryId);
    }
}
