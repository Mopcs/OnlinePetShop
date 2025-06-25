package com.example.onlinepetshop.repository;

import com.example.onlinepetshop.entity.Product;
import com.example.onlinepetshop.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    void deleteByProduct(Product product);
}