package com.example.onlinepetshop.repository;

import com.example.onlinepetshop.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    void deleteByOrderId(Long orderId);

    boolean existsByOrderId(Long id);
}
