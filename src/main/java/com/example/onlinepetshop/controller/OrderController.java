package com.example.onlinepetshop.controller;

import com.example.onlinepetshop.dto.order.CreateOrderRequest;
import com.example.onlinepetshop.dto.order.OrderResponse;
import com.example.onlinepetshop.entity.enums.OrderStatus;
import com.example.onlinepetshop.service.order.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OrderResponse> placeOrder(@RequestBody CreateOrderRequest request, Authentication auth) {
        return ResponseEntity.ok(orderService.placeOrder(auth.getName(), request));
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Long orderId, Authentication auth) {
        return ResponseEntity.ok(orderService.getOrderById(orderId, auth));
    }

    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateOrderStatus(@PathVariable Long orderId, @RequestBody OrderStatus status) {
        orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<OrderResponse>> getOrderHistory(Authentication auth) {
        return ResponseEntity.ok(orderService.getUserOrders(auth));
    }
}

