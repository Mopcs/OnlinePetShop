package com.example.onlinepetshop.dto.cart;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class    CartItemResponse {
    private Long productId;
    private String productName;
    private String imageUrl;
    private int quantity;
    private BigDecimal pricePerUnit;
}

