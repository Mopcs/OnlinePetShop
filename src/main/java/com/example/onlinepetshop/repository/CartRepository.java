package com.example.onlinepetshop.repository;

import com.example.onlinepetshop.entity.Cart;
import com.example.onlinepetshop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}

