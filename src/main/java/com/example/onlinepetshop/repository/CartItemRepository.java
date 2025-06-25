package com.example.onlinepetshop.repository;

import com.example.onlinepetshop.entity.Cart;
import com.example.onlinepetshop.entity.CartItem;
import com.example.onlinepetshop.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
    void deleteByProduct(Product product);
}

