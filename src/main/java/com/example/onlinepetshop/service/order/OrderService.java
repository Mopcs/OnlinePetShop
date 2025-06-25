package com.example.onlinepetshop.service.order;

import com.example.onlinepetshop.dto.order.CreateOrderRequest;
import com.example.onlinepetshop.dto.order.OrderResponse;
import com.example.onlinepetshop.entity.enums.OrderStatus;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface OrderService {
    OrderResponse placeOrder(String userEmail, CreateOrderRequest request);
    OrderResponse getOrderById(Long id, Authentication auth);
    void updateOrderStatus(Long id, OrderStatus status);
    List<OrderResponse> getUserOrders(Authentication auth);
    List<OrderResponse> getAllOrders();
    void delete(Long id);
    OrderResponse getOrderForAdmin(Long id);
}
