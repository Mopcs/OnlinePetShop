package com.example.onlinepetshop.service.product;

import com.example.onlinepetshop.dto.product.ProductRequest;
import com.example.onlinepetshop.entity.Product;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface ProductService {
    List<Product> getAll();
    List<Product> getByCategory(Long categoryId);
    Product getById(Long id);
    Product update(@PathVariable Long id, @RequestBody ProductRequest updatedProduct);

    Product create(@RequestBody ProductRequest product);

    void delete(@PathVariable Long id);

    List<Product> searchByName(String name);
}

