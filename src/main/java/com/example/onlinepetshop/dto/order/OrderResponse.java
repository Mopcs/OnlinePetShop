package com.example.onlinepetshop.dto.order;

import com.example.onlinepetshop.entity.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class OrderResponse {
    private Long id;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private BigDecimal totalAmount;
    private List<OrderItemResponse> items;
    private String userEmail;
    private String phone;
    private String address;
    private String comment;

    public OrderResponse(Long id, OrderStatus status, LocalDateTime orderDate, BigDecimal totalAmount) {
        this.id = id;
        this.status = status;
        this.createdAt = orderDate;
        this.totalAmount = totalAmount;
    }

    public OrderResponse(Long id, OrderStatus status, LocalDateTime orderDate, BigDecimal totalAmount ,List<OrderItemResponse> items) {
        this.id = id;
        this.status = status;
        this.createdAt = orderDate;
        this.totalAmount = totalAmount;
        this.items = items;
    }

    public OrderResponse(Long id, OrderStatus status, LocalDateTime orderDate, BigDecimal totalAmount ,List<OrderItemResponse> items, String phone, String address, String comment) {
        this.id = id;
        this.status = status;
        this.createdAt = orderDate;
        this.totalAmount = totalAmount;
        this.items = items;
        this.phone = phone;
        this.address = address;
        this.comment = comment;
    }
}

