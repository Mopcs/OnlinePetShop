package com.example.onlinepetshop.repository;

import com.example.onlinepetshop.entity.User;
import com.example.onlinepetshop.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Optional<Wishlist> findByUser(User user);
    List<Wishlist> findAllByItemsProductId(Long productId);
}
